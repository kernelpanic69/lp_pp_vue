import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
import { brewlersProblem } from "./brewler";
import { Constraint, ConsType, LpModel, randomRGB, Variable } from "./Model";

Vue.use(Vuex);

const hostname = "http://127.0.0.1:9080/";

type SolverNames = "glpk";
const solverPaths = {
  "glpk": "run-glpk"
}

let solutionId = 0;

export interface Solution {
  id: number;
  err: string;
  color: string;
  errMessage: string;
  solver: string;
  started: Date;
  finished: Date;
  took: number;
  iterations: number;
  ips: number;
  objective: number;
  variables: { [name: string]: number }
}

export const actions = {
  SOLVERS: {
    RUN_SOLVER: "solvers/runSolver",
    SET_MODEL: "solvers/setModel",
  },
};

export const mutations = {
  NEW_MODEL: "newModel",
  UPDATE_NAME: "updateName",
  UPDATE_DESCRIPTION: "updateDescription",
  SET_OBJECTIVE: "setObjective",

  ADD_VARIABLE: "addVariable",
  DROP_VARIABLE: "dropVariable",
  SET_OPT_TYPE: "setOptType",
  SET_VAR_NAME: "setVarName",
  SET_VAR_DESCRIPTION: "setVarDescription",
  SET_VAR_INT: "setVarInt",

  ADD_CONSTRAINT: "addConstraint",
  DROP_CONSTRAINT: "dropConstraint",
  SET_CON_NAME: "setConName",
  SET_CON_DESCRIPTION: "setConDescription",
  SET_CON_TYPE: "setConType",
  SET_CON_VALUE: "setConValue",
  SET_CON_COEF: "setConCoef",
  SET_CON_COLOR: "setConColor",

  SOLVERS: {
    SET_MESSAGE: "solvers/setMessage",
    CLEAR_MESSAGE: "solvers/clearMessage",
    SET_RUNNING: "solvers/setRunning",
    SET_COLOR: "solvers/setColor"
  },
};

export default new Vuex.Store<LpModel>({
  state: brewlersProblem,
  mutations: {
    updateName(state: LpModel, newName: string) {
      state.name = newName;
    },

    updateDescription(state: LpModel, newDesc: string) {
      if (newDesc.length <= 1024) state.description = newDesc;
    },

    setOptType(state: LpModel, newType: "min" | "max") {
      state.type = newType;
    },

    setObjective(state: LpModel, data: { conId: number }) {
      if (state.constraints[data.conId]) {
        state.objectiveId = data.conId;
      }
    },

    addVariable(state: LpModel, v: Partial<Variable>) {
      const variable = new Variable(v);
      state.variables = { ...state.variables, [variable.id]: variable };

      for (const con of Object.values(state.constraints)) {
        con.coefs = { ...con.coefs, [variable.id]: 0.0 };
      }
    },

    addConstraint(state: LpModel, c: Partial<Constraint>) {
      const con = new Constraint(c);

      if (!Object.keys(state.constraints).length) {
        state.objectiveId = con.id;
      }

      for (const v of Object.values(state.variables)) {
        con.coefs[v.id] = 0.0;
      }

      state.constraints = { ...state.constraints, [con.id]: con };
    },

    dropVariable(state: LpModel, data: { id: number }) {
      const { [data.id]: _, ...newVars } = state.variables;
      state.variables = newVars;

      for (const [_, con] of Object.entries(state.constraints)) {
        const { [data.id]: __, ...newCoefs } = con.coefs;
        con.coefs = newCoefs;
      }
    },

    dropConstraint(state: LpModel, data: { id: number }) {
      const { [data.id]: _, ...newCons } = state.constraints;
      state.constraints = newCons;

      if (state.objectiveId === data.id) {
        const cons = Object.values(state.constraints);

        if (cons.length > 0) {
          state.objectiveId = cons[0].id;
        }
      }
    },

    setVarName(state: LpModel, data: { id: number; name: string }) {
      state.variables[data.id].name = data.name;
    },

    setVarDescription(
      state: LpModel,
      data: { id: number; description: string }
    ) {
      state.variables[data.id].description = data.description;
    },

    setVarInt(state: LpModel, data: { id: number; integer: boolean }) {
      state.variables[data.id].isInteger = data.integer;
    },

    setConName(state: LpModel, data: { id: number; name: string }) {
      state.constraints[data.id].name = data.name;
    },

    setConDesc(state: LpModel, data: { id: number; description: string }) {
      state.constraints[data.id].description = data.description;
    },

    setConType(state: LpModel, data: { id: number; type: ConsType }) {
      state.constraints[data.id].type = data.type;
    },

    setConValue(state: LpModel, data: { id: number; value: number }) {
      state.constraints[data.id].value = data.value;
    },

    setConCoef(
      state: LpModel,
      data: { conId: number; varId: number; coef: number }
    ) {
      state.constraints[data.conId].coefs = {
        ...state.constraints[data.conId].coefs,
        [data.varId]: data.coef,
      };
    },

    setConColor(state: LpModel, data: { id: number; color: string }) {
      state.constraints[data.id].color = data.color;
    },

    newModel(state) {
      Object.assign(state, new LpModel());
    }
  },
  getters: {
    variablesList(state: LpModel): Variable[] {
      return Object.values(state.variables);
    },

    constraintList(state: LpModel): Constraint[] {
      return Object.values(state.constraints);
    },

    objective(state: LpModel): Constraint {
      return state.constraints[state.objectiveId];
    },
    numVariables(state: LpModel): number {
      return Object.keys(state.variables).length;
    },
    numConstraints(state: LpModel): number {
      return Object.keys(state.constraints).length;
    },
  },
  plugins: [
    // new VuexPersist<LpModel>({
    //   storage: window.localStorage
    // }).plugin
  ],
  modules: {
    solvers: {
      namespaced: true,
      state: {
        running: false,
        message: "",
        messageType: "success",
        solutions: {},
      },
      mutations: {
        setRunning(state, isRunning: boolean) {
          state.running = isRunning;
        },
        setMessage(
          state,
          alert: { message: string; type: "sucess" | "error" | "warning" }
        ) {
          state.message = alert.message;
          state.messageType = alert.type;
        },
        clearMessage(state) {
          state.message = "";
          state.messageType = "success";
        },

        addSolution(state, solver) {
          state.solutions = { ...state.solutions, [solver.id]: solver };
        },

        setColor(state, data: { id: number, color: string }) {
          state.solutions[data.id].color = data.color;
        }
      },
      actions: {
        async runSolver({ rootState, state, dispatch, commit }, params: { name: SolverNames }) {
          async function execute() {
            return axios.get(hostname + solverPaths[params.name], {
              transformResponse: (data, headers) => {
                if (data.error) {
                  return data;
                }

                const d = JSON.parse(data);

                const res: Solution = {
                  id: solutionId++,
                  color: randomRGB(),
                  err: d.err,
                  errMessage: d.errMessage,
                  solver: params.name,
                  variables: d.variables,
                  objective: d.objective,
                  took: d.stats.took,
                  iterations: d.stats.iterations,
                  ips: d.stats.iterations / d.stats.took * 1000,
                  started: new Date(d.stats.started),
                  finished: new Date(d.stats.finished)
                }

                return res;
              }
            });
          }

          await dispatch("setModel");
          const res = await execute();

          commit("addSolution", res.data);

          console.log(state);
        },
        async setModel({ rootState, rootGetters, commit }) {
          return await axios.post(
            hostname + "set-model",
            {},
            {
              transformRequest: [
                (_, __) => {
                  const state = rootState;
                  const getters = rootGetters;
                  const data: any = {
                    name: state.name,
                    type: state.type,
                    objName: getters.objective.name,
                    variables: [],
                    objective: [],
                    ints: [],
                    consNames: [],
                    consVals: [],
                    consTypes: [],
                    constraints: [],
                  };

                  for (let i = 0; i < getters.variablesList.length; i++) {
                    const v: Variable = getters.variablesList[i];

                    data.variables.push(v.name);
                    data.objective.push(getters.objective.coefs[v.id]);
                    if (v.isInteger) {
                      data.ints.push(i);
                    }
                  }

                  for (
                    let i_1 = 0;
                    i_1 < getters.constraintList.length;
                    i_1++
                  ) {
                    const con: Constraint = getters.constraintList[i_1];

                    if (con.id === state.objectiveId) {
                      continue;
                    }

                    data.consNames.push(con.name);
                    data.consTypes.push(con.type);
                    data.consVals.push(con.value);

                    const row: number[] = [];

                    for (let j = 0; j < getters.variablesList.length; j++) {
                      row.push(con.coefs[getters.variablesList[j].id]);
                    }

                    data.constraints.push(row);
                  }

                  return JSON.stringify(data);
                },
              ],
            }
          );
        },
      },
    },
  },
});

import { Constraint, LpModel, Variable } from "./Model";

const x1 = new Variable({
  name: "x_1",
  isInteger: true,
});

const x2 = new Variable({
  name: "x_2",
  isInteger: true,
});

const z = new Constraint({
  name: "Z",
  coefs: { [x1.id]: 3.0, [x2.id]: 2.0 },
});

const c1 = new Constraint({
  name: "c1",
  coefs: { [x1.id]: 2.0, [x2.id]: 5.0 },
  type: "lt",
  value: 12,
});

const c2 = new Constraint({
  name: "c2",
  coefs: { [x1.id]: 5.0, [x2.id]: 2.0 },
  type: "lt",
  value: 14.0,
});

export const simpleProblem: LpModel = {
  readonly: false,
  name: "Простая задача",
  description: "",
  type: "max",
  objectiveId: z.id,
  variables: { [x1.id]: x1, [x2.id]: x2 },
  constraints: {
    [z.id]: z,
    [c1.id]: c1,
    [c2.id]: c2,
  },
};

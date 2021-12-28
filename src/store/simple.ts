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
  coefs: { [x1.id]: 2, [x2.id]: 4 },
});

const c1 = new Constraint({
  name: "c1",
  coefs: { [x1.id]: 1, [x2.id]: 2 },
  type: "gt",
  value: 5,
});

const c2 = new Constraint({
  name: "c2",
  coefs: { [x1.id]: 1, [x2.id]: 1 },
  type: "gt",
  value: 4,
});

export const unbnd: LpModel = new LpModel({
  readonly: false,
  name: "Проста задача",
  description: "Приклад задачі з нескінченною областю допустимих значень",
  type: "max",
  objectiveId: z.id,
  variables: { [x1.id]: x1, [x2.id]: x2 },
  constraints: {
    [z.id]: z,
    [c1.id]: c1,
    [c2.id]: c2,
  },
});


const z1 = new Constraint({
  name: "Z",
  coefs: { [x1.id]: 3, [x2.id]: 2 },
});

const c3 = new Constraint({
  name: "c1",
  coefs: { [x1.id]: 2, [x2.id]: 1 },
  type: "lt",
  value: 2,
});

const c4 = new Constraint({
  name: "c2",
  coefs: { [x1.id]: 3, [x2.id]: 4 },
  type: "gt",
  value: 12,
});

export const unfeas: LpModel = new LpModel({
  readonly: false,
  name: "Проста задача",
  description: "Приклад задачі без допустимих рішень",
  type: "max",
  objectiveId: z1.id,
  variables: { [x1.id]: x1, [x2.id]: x2 },
  constraints: {
    [z1.id]: z1,
    [c3.id]: c3,
    [c4.id]: c4,
  },
});
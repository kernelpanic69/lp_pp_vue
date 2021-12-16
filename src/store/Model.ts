let varId = 0;
let consId = 0;

export function randomRGB() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export class Variable {
  readonly id: number = varId++;
  name = "newVariable";
  description = "";
  isInteger = true;

  public constructor(init?: Partial<Variable>) {
    Object.assign(this, init);
  }
}

export type ConsType = "lt" | "gt" | "eq" | "fr" | "db";

export class Constraint {
  readonly id: number = consId++;
  name = "newConstraint";
  description = "";
  type: ConsType = "eq";
  value = 0.0;
  coefs: { [varId: number]: number } = {};
  color = randomRGB();

  public constructor(init?: Partial<Constraint>) {
    Object.assign(this, init);
  }
}

type OptType = "min" | "max";

export class LpModel {
  readonly = false;
  name = "";
  description = "";
  objectiveId = -1;
  type: OptType = "max";
  variables: { [varId: number]: Variable } = {};
  constraints: { [conId: number]: Constraint } = {};

  public constructor(init?: Partial<LpModel>) {
    Object.assign(this, init);
  }
}

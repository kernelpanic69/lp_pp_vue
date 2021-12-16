import { Constraint, LpModel, Variable } from "./Model";

const ale = new Variable({
  name: "Ale",
  description: "Barrel of ale",
  isInteger: true,
});

const beer = new Variable({
  name: "Beer",
  description: "A barrel of beer",
  isInteger: true,
});

const profit = new Constraint({
  name: "Profit",
  description: "Value of each barrel",
  coefs: { [ale.id]: 13.0, [beer.id]: 23.0 },
  type: "eq",
  value: 0.0,
});

const corn = new Constraint({
  name: "Corn",
  description: "Limit on corn in pounds",
  coefs: { [ale.id]: 5.0, [beer.id]: 15.0 },
  type: "lt",
  value: 480.0,
});

const hops = new Constraint({
  name: "Hops",
  description: "Limit on hops in pounds",
  coefs: { [ale.id]: 4.0, [beer.id]: 4.0 },
  type: "lt",
  value: 160.0,
});

const malt = new Constraint({
  name: "Malt",
  description: "Limit on malt in liters",
  coefs: { [ale.id]: 35.0, [beer.id]: 20.0 },
  type: "lt",
  value: 1190.0,
});

export const brewlersProblem: LpModel = {
  readonly: false,
  name: "Brewlers problem",
  description: "Test on beer and ale",
  type: "max",
  objectiveId: profit.id,
  variables: { [ale.id]: ale, [beer.id]: beer },
  constraints: {
    [corn.id]: corn,
    [hops.id]: hops,
    [malt.id]: malt,
    [profit.id]: profit,
  },
};

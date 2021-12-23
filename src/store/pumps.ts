import { Constraint, LpModel, Variable } from "./Model";

const water = new Variable({
    name: "Водяний насос",
    description: "Одиниця водяного насосу",
    isInteger: true
});

const fuel = new Variable({
    name: "Паливний насос",
    description: "Одиниця паливного насосу",
    isInteger: true
});

const profit = new Constraint({
    name: "Прибуток",
    description: "Прибуток від продажу насосів",
    coefs: {
        [water.id]: 200,
        [fuel.id]: 165
    }
});

const body = new Constraint({
    name: "Корпус",
    description: "Кількість корпусів",
    coefs: {
        [water.id]: 1,
        [fuel.id]: 1
    },
    type: "lt",
    value: 75
});

const flange = new Constraint({
    name: "Фланець",
    description: "Кількість фланців",
    coefs: {
        [water.id]: 2,
        [fuel.id]: 1
    },
    type: "lt",
    value: 128
});

const cuff = new Constraint({
    name: "Манжета",
    description: "Кількість манжет",
    coefs: {
        [water.id]: 3,
        [fuel.id]: 2
    },
    type: "lt",
    value: 200
});

const gear = new Constraint({
    name: "Шестерня",
    description: "Кількість шестерен",
    coefs: {
        [water.id]: 2,
        [fuel.id]: 3
    },
    type: "lt",
    value: 184
});

export const pumps = new LpModel({
    name: "Збут насосів",
    description: `Ремонтний завод «Хоперський» випускає насоси двох типів: паливні та
    водяні. У комплектацію цих виробів входять чотири основні види деталей:
    корпус, платик, манжета, шестерня. Для виготовлення паливного насоса потрібно
    один корпус, чотири платики, чотири манжети та одна шестерня, для виготовлення
    водяного насоса - 1, 2, 4 та 3 комплектуючих деталей, відповідно.
    13Від реалізації одного паливного насоса завод має прибуток 165 грн.,
    а від одного водяного - 200 грн.
    На складі заводу є наступний запас комплектуючих:
    корпусів – 6 шт;
    платиків - 8 шт;
    манжет - 12 шт;
    шестерень - 9 шт.`,
    objectiveId: profit.id,
    constraints: {
        [profit.id]: profit,
        [body.id]: body,
        [flange.id]: flange,
        [cuff.id]: cuff,
        [gear.id]: gear
    },
    variables: {
        [water.id]: water,
        [fuel.id]: fuel
    },
    type: "max"
});
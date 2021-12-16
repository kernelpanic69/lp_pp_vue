import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import ChartView from "../views/ChartView.vue";
import ConstraintsView from "../views/ConstraintsView.vue";
import Home from "../views/Home.vue";
import SolversView from "../views/SolversView.vue";
import VariablesView from "../views/VariablesView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/variables",
    name: "Variables",
    component: VariablesView,
  },
  {
    path: "/constraints",
    name: "Constraints",
    component: ConstraintsView,
  },
  {
    path: "/chart",
    name: "Chart",
    component: ChartView,
  },
  {
    path: "/solvers",
    name: "Solvers",
    component: SolversView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;

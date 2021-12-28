<template>
  <div class="chart-container">
    <ChartJs
      v-if="!plotMessage"
      type="scatter"
      :data="chartData"
      :options="options"
      ref="chart"
    >
    </ChartJs>

    <v-alert v-else type="warning" dismissible class="mt-8">
      {{ plotMessage }}
    </v-alert>

    <v-btn icon class="reset-button" @click="resetZoom">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import ChartJs from "@/components/ChartJs.vue";
import { Solution } from "@/store";
import { Constraint } from "@/store/Model";
import { ChartData, ChartDataset } from "chart.js";
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "ChartsView",
  components: {
    ChartJs,
  },
})
export default class ModelChart extends Vue {
  get plotMessage() {
    if (this.$store.getters.numVariables < 2) {
      return this.$t("charts.errNotEnoughVariables");
    }

    if (this.$store.getters.numVariables > 2) {
      return this.$t("charts.errTooMuchVariables");
    }

    if (!this.$store.getters.numConstraints) {
      return this.$t("charts.errNoConstraints");
    }

    return "";
  }

  get options() {
    return {
      scales: {
        x: {
          title: {
            display: true,
            text: this.$store.getters.variablesList[0].name,
          },
        },
        y: {
          title: {
            display: true,
            text: this.$store.getters.variablesList[1].name,
          },
        },
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            modifierKey: "shift",
          },
          zoom: {
            drag: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "xy",
            limits: {
              x: { min: "original", max: 100 },
              y: { min: "original", max: 100 },
            },
          },
        },
      },
    };
  }

  resetZoom() {
    const chart = this.$refs.chart;

    if (chart) {
      (chart as ChartJs).resetZoom();
    }
  }

  get chartData(): any {
    const data: ChartDataset[] = [];

    for (const con of this.$store.getters.constraintList as Constraint[]) {
      if (con.id === this.$store.getters.objective.id) {
        continue;
      }

      const x = Object.values(con.coefs)[0];
      const y = Object.values(con.coefs)[1];

      let dir = "";

      if (con.type === "gt") {
        dir = "end";
      } else if (con.type === "lt") {
        dir = "origin";
      }

      data.push({
        label: con.name,
        borderColor: con.color,
        showLine: true,
        borderDash: con.type == "eq" ? [5, 12] : [],

        fill: {
          target: dir,
        },
        data: [
          { x: 0, y: con.value / y },
          { x: con.value / x, y: 0 },
        ],
      });
    }

    for (const solution of Object.values(
      this.$store.state.solvers.solutions
    ) as Solution[]) {
      if (solution.err) continue;

      const x = Object.values(solution.variables)[0];
      const y = Object.values(solution.variables)[1];

      data.push({
        label: solution.solver,
        data: [{ x, y }],
        pointBackgroundColor: "red",
        pointRadius: 5,
        order: -1,
      });
    }

    const cData = { labels: ["x", "y"], datasets: data };
    return cData;
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
}

.reset-button {
  position: absolute;
  right: 3rem;
  bottom: 4rem;
}
</style>
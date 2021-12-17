<template>
  <ChartJs
    v-if="!plotMessage"
    type="scatter"
    :data="chartData"
    :options="{ showLine: true }"
  >
  </ChartJs>

  <v-alert v-else type="warning" dismissible class="mt-8">
    {{ plotMessage }}
  </v-alert>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Constraint } from "@/store/Model";
import ChartJs from "@/components/ChartJs.vue";

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

  get chartData(): any {
    const data = [];

    for (const con of this.$store.getters.constraintList as Constraint[]) {
      if (con.id === this.$store.getters.objective.id) {
        continue;
      }

      const x = Object.values(con.coefs)[0];
      const y = Object.values(con.coefs)[1];

      data.push({
        label: con.name,
        borderColor: con.color,
        fill: true,
        data: [
          { x: 0, y: con.value / y },
          { x: con.value / x, y: 0 },
        ],
      });
    }
    const cData = { labels: ["x", "y"], datasets: data };
    return cData;
  }
}
</script>

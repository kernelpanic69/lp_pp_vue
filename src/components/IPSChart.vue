<template>
  <ChartJs type="bar" :data="chartData" :options="{ showLine: true }">
  </ChartJs>
</template>

<script lang="ts">
import ChartJs from "@/components/ChartJs.vue";
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "ChartsView",
  components: {
    ChartJs,
  },
})
export default class ExecutionChart extends Vue {
  get chartData(): any {
    const sols = Object.values(this.$store.state.solvers.solutions);
    const labels = sols.map((it: any) => it.solver);

    return {
      labels,
      datasets: [
        {
          label: this.$t("charts.ipsLabel"),
          data: sols.map((it: any) => it.ips),
          backgroundColor: sols.map((it: any) => it.color),
        },
      ],
    };
  }
}
</script>

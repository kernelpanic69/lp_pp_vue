<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";

@Component({
  name: "ChartsView",
})
export default class ChartJs extends Vue {
  @Prop() data!: ChartData;
  @Prop() type!: "bar" | "scatter";
  @Prop() options!: ChartOptions;

  mounted(): void {
    Chart.register(...registerables);

    new Chart(this.$refs.canvas as HTMLCanvasElement, {
      type: this.type,
      data: this.data,
      options: this.options,
    }).render();
  }
}
</script>

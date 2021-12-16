<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ $t("charts.sectionTitle") }}
      </v-card-title>

      <v-card-text>
        <v-tabs v-model="tab">
          <v-tab>Model</v-tab>
          <v-tab>Execution time</v-tab>
          <v-tab>Iterations</v-tab>
          <v-tab>IPS</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <ModelChart> </ModelChart>
          </v-tab-item>

          <v-tab-item>
            <ExecutionChart> </ExecutionChart>
          </v-tab-item>
          <v-tab-item>
            <IterChart> </IterChart>
          </v-tab-item>
          <v-tab-item>
            <IPSChart> </IPSChart>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ModelChart from "@/components/ModelChart.vue";
import ExecutionChart from "@/components/ExecutionChart.vue";
import IterChart from "@/components/IterChart.vue";
import IPSChart from "@/components/IPSChart.vue";

@Component({
  name: "ChartsView",
  components: {
    ModelChart,
    ExecutionChart,
    IterChart,
    IPSChart
  },
})
export default class ChartView extends Vue {
  tab = null;
}
</script>

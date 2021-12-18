<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ $t("charts.sectionTitle") }}
      </v-card-title>

      <v-card-text>
        <v-tabs v-model="tab" fixed-tabs>
          <v-tab>{{ $t("charts.modelLabel") }}</v-tab>
          <v-tab>{{ $t("charts.executionLabel") }}</v-tab>
          <v-tab>{{ $t("charts.iterationLabel") }}</v-tab>
          <v-tab>{{ $t("charts.ipsLabel") }}</v-tab>
          <v-tab>{{ $t("charts.memLabel") }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="mt-8">
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

          <v-tab-item>
            <MemoryChart></MemoryChart>
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
import MemoryChart from "@/components/MemoryChart.vue";

@Component({
  name: "ChartsView",
  components: {
    ModelChart,
    ExecutionChart,
    IterChart,
    IPSChart,
    MemoryChart,
  },
})
export default class ChartView extends Vue {
  tab = null;
}
</script>

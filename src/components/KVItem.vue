<template>
  <v-banner>
    <v-row>
      <v-col cols="3" class="text--secondary">
        {{ label }}
      </v-col>
      <v-col cols="auto" class="data-value">{{ value }}</v-col>
    </v-row>
  </v-banner>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class KVItem extends Vue {
  @Prop() label!: string;
  @Prop() value!: string;
}
</script>
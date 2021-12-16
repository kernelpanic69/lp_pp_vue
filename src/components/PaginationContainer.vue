<template>
  <v-expansion-panels focusable>
    <component
      :is="component"
      v-for="(it, index) in currentPage()"
      :data="it"
      :key="it.id || index"
    ></component>
    <v-pagination v-if="numPages > 1" v-model="page" :length="numPages">
    </v-pagination>
  </v-expansion-panels>
</template>

<script lang="ts">
import "reflect-metadata";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class PaginationContainer extends Vue {
  page = 1;

  @Prop() title!: string;
  @Prop() component!: Vue;
  @Prop() items!: ArrayLike<any>;
  @Prop({ default: 10 }) itemsPerPage!: number;

  currentPage(): any[] {
    const res = [];

    for (let i = 0; i < this.itemsPerPage; i++) {
      const itemIndex = i + this.itemsPerPage * (this.page - 1);

      if (itemIndex >= this.totalItems) {
        break;
      }

      res.push(this.items[itemIndex]);
    }

    return res;
  }

  get totalItems(): number {
    return this.items ? this.items.length : 0;
  }

  get numPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
</script>

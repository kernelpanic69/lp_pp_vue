<template>
  <v-container>
    <v-card>
      <v-card-title>{{ name }}</v-card-title>
      <v-form v-model="valid">
        <v-container>
          <v-text-field
            v-model="name"
            :rules="nameRules"
            :counter="maxNameLen"
            :label="$t('model.nameLabel')"
            outlined
          >
          </v-text-field>

          <v-textarea
            v-model="description"
            :rules="descRules"
            :counter="maxDescriptionLen"
            :label="$t('model.descriptionLabel')"
            outlined
          ></v-textarea>

          <v-select
            v-model="optType"
            :label="$t('model.opTypeLabel')"
            :items="optTypes"
            outlined
          >
          </v-select>
        </v-container>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { mutations } from "@/store";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  name: "Home",
})
export default class Home extends Vue {
  valid = false;

  maxNameLen = 32;
  maxDescriptionLen = 1024;

  nameRules = [
    (n: string) => !!n || "Model name is required",
    (n: string) => n.length <= this.maxNameLen || "Model name is too long",
  ];

  descRules = [
    (d: string) =>
      d.length <= this.maxDescriptionLen || "Model description is too long.",
  ];

  optTypes = [
    {
      text: this.$t("model.opTypeMin"),
      value: "min",
    },
    {
      text: this.$t("model.opTypeMax"),
      value: "max",
    },
  ];

  get name(): string {
    return this.$store.state.name;
  }

  set name(newName: string) {
    if (newName && newName.length <= this.maxNameLen) {
      this.$store.commit(mutations.UPDATE_NAME, newName);
    }
  }

  get description(): string {
    return this.$store.state.description;
  }

  set description(newDesc: string) {
    if (newDesc.length <= this.maxDescriptionLen) {
      this.$store.commit(mutations.UPDATE_DESCRIPTION, newDesc);
    }
  }

  get optType(): string {
    return this.$store.state.type;
  }

  set optType(newType: string) {
    this.$store.commit(mutations.SET_OPT_TYPE, newType);
  }
}
</script>

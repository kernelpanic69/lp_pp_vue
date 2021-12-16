<template>
  <v-expansion-panel>
    <v-expansion-panel-header disable-icon-rotate>
      {{ variable.name }}
      <template v-slot:actions>
        <v-dialog v-model="deleteConfirmShow">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="error">mdi-trash-can</v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-card-title>{{
              $t("variables.deleteConfirmTitle")
            }}</v-card-title>

            <v-card-text>
              {{ $t("variables.deleteConfirmText") }}
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" @click="deleteConfirmShow = false">{{
                $t("commonUi.cancel")
              }}</v-btn>
              <v-btn color="error" @click="deleteVar">
                <v-icon>mdi-trash-can</v-icon>
                {{ $t("commonUi.delete") }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-btn icon>
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-form v-model="valid" class="mt-6">
        <v-text-field
          :label="$t('variables.itemNameLabel')"
          :rules="nameRules"
          v-model="name"
          :counter="maxNameLen"
          outlined
        ></v-text-field>

        <v-textarea
          :label="$t('variables.itemDescLabel')"
          :rules="descRules"
          v-model="description"
          :counter="maxDescLen"
          outlined
        ></v-textarea>

        <v-switch v-model="integer" :label="$t('variables.itemIntLabel')">
        </v-switch>
      </v-form>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import { mutations } from "@/store";
import { Variable } from "@/store/Model";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({ name: "VariableItem" })
export default class VariableItem extends Vue {
  @Prop() data!: Variable;

  valid = false;
  maxNameLen = 32;
  maxDescLen = 512;

  deleteConfirmShow = false;

  nameRules = [
    (name: string) => !!name || "Name is required",
    (name: string) => name.length <= this.maxNameLen || "Name is too long",
  ];

  descRules = [
    (desc: string) =>
      desc.length <= this.maxDescLen || "Description is too long",
  ];

  deleteVar() {
    this.$store.commit(mutations.DROP_VARIABLE, { id: this.variable.id });
  }

  get variable(): Variable {
    return this.data;
  }

  get name(): string {
    return this.$store.state.variables[this.variable.id].name;
  }

  set name(newName: string) {
    if (newName && newName.length <= this.maxNameLen) {
      this.$store.commit(mutations.SET_VAR_NAME, {
        id: this.variable.id,
        name: newName,
      });
    }
  }

  get description(): string {
    return this.$store.state.variables[this.variable.id].description;
  }

  set description(newDesc: string) {
    if (newDesc && newDesc.length <= this.maxDescLen) {
      this.$store.commit(mutations.SET_VAR_DESCRIPTION, {
        id: this.variable.id,
        description: newDesc,
      });
    }
  }

  get integer(): boolean {
    return this.$store.state.variables[this.variable.id].isInteger;
  }

  set integer(integer: boolean) {
    this.$store.commit(mutations.SET_VAR_INT, {
      id: this.variable.id,
      integer,
    });
  }
}
</script>

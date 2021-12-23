<template>
  <v-container>
    <v-card>
      <v-card-title>{{ $t("model.sectionTitle") }}</v-card-title>
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

          <h5 class="text-h5 mb-4 mt-4">{{ $t("model.mathReprTitle") }}</h5>

          <v-sheet
            elevation="4"
            class="pa-8"
            v-html="renderMath"
            v-if="canRenderMath"
          >
          </v-sheet>

          <v-alert v-else type="warning">{{
            $t("model.mathReprModelTooBig")
          }}</v-alert>
        </v-container>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { mutations } from "@/store";
import Vue from "vue";
import Component from "vue-class-component";
import katex from "katex";
import { Constraint, LpModel, Variable } from "@/store/Model";

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

  get canRenderMath() {
    const numVars = this.$store.getters.numVariables as number;
    const numCons = this.$store.getters.numConstraints as number;

    return numVars <= 50 && numCons <= 50;
  }

  get renderMath() {
    let str = "";
    const m = this.$store.state as LpModel;
    const varList = this.$store.getters.variablesList as Variable[];
    const consList = this.$store.getters.constraintList as Constraint[];
    const numVars = this.$store.getters.numVariables as number;
    const numCons = this.$store.getters.numConstraints as number;
    const obj = this.$store.getters.objective as Constraint;

    if (m.type == "min") {
      str += this.$t("model.opTypeMin");
    } else {
      str += this.$t("model.opTypeMax");
    }

    str += ":\\\\";

    for (let i = 0; i < numVars; i++) {
      const v = varList[i];

      str += obj.coefs[v.id] + "x_" + "{" + i + "}";

      if (i != numVars - 1) {
        str += "+";
      }
    }

    str += "\\\\";

    str += this.$t("model.mathReprSubjTo") + ":\\\\";

    for (let i = 0; i < numCons; i++) {
      const con = consList[i];

      if (con.id == obj.id) {
        continue;
      }

      for (let j = 0; j < numVars; j++) {
        const v = varList[j];
        str += con.coefs[v.id] + "x_" + "{" + j + "}";

        if (j != numVars - 1) {
          str += "+";
        }
      }

      if (con.type === "lt") {
        str += "\\leq";
      } else if (con.type == "gt") {
        str += "\\geq";
      } else {
        str += "=";
      }

      str += con.value;

      str += "\\\\";
    }
    str += "\\\\";

    str += this.$t("model.mathReprAlso");

    str += ":\\\\";

    for (let i = 0; i < numVars; i++) {
      str += "x_" + "{" + i + "}" + ">0";

      if (i !== numVars - 1) {
        str += ",";
      }
    }

    return katex.renderToString(str, {
      output: "html",
      throwOnError: false,
      strict: false,
    });
  }
}
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ $t("variables.sectionTitle") }}
      </v-card-title>

      <v-card-text>
        <v-row align="baseline" class="mb-5">
          <v-col
            ><v-text-field
              counter="32"
              :rules="nameRules"
              :label="$t('variables.add')"
              single-line
              v-model="varToAdd"
            ></v-text-field>
          </v-col>

          <v-col cols="auto">
            <v-btn color="success" @click="addVar">
              {{ $t("variables.add") }}
            </v-btn>
          </v-col>
        </v-row>

        <PaginationContainer
          :component="varItem"
          :items="variables"
        ></PaginationContainer>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Variable } from "@/store/Model";
import Vue from "vue";
import Component from "vue-class-component";
import VariableItem from "@/components/VariableItem.vue";
import PaginationContainer from "@/components/PaginationContainer.vue";
import { mutations } from "@/store";

@Component({
  components: {
    PaginationContainer,
  },
})
export default class VariablesView extends Vue {
  varItem = VariableItem;
  varToAdd = "newVariable";

  nameRules = [
    (n: string) => !!n || "variable name cannot be empty",
    (n: string) => n.length <= 32 || "Variable name is too long",
  ];

  addVar() {
    this.$store.commit(mutations.ADD_VARIABLE, { name: this.varToAdd });
    this.varToAdd = "newVariable";
  }

  get variables(): Variable[] {
    return this.$store.getters.variablesList;
  }
}
</script>

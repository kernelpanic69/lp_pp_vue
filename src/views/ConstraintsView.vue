<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ $t("constraints.sectionTitle") }}
      </v-card-title>
      <v-card-text>
        <v-row class="mb-5" align="baseline">
          <v-col>
            <v-text-field
              counter="32"
              :rules="nameRules"
              :label="$t('constraints.add')"
              v-model="conToAdd"
              single-line
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-btn color="success" @click="addCon">
              {{ $t("constraints.add") }}
            </v-btn>
          </v-col>
        </v-row>

        <PaginationContainer :items="constraints" :component="consItem">
        </PaginationContainer>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Constraint } from "@/store/Model";
import Vue from "vue";
import Component from "vue-class-component";
import PaginationContainer from "@/components/PaginationContainer.vue";
import ConstraintItem from "@/components/ConstraintItem.vue";
import { mutations } from "@/store";

@Component({
  components: {
    PaginationContainer,
  },
})
export default class ConstraintsView extends Vue {
  consItem = ConstraintItem;
  conToAdd = "newConstraint";
  maxNameLen = 32;

  nameRules = [
    (n: string) => !!n || "Name cannot be empty",
    (n: string) => n.length <= this.maxNameLen || "Name is too long",
  ];

  addCon() {
    if (this.conToAdd && this.conToAdd.length < this.maxNameLen) {
      this.$store.commit(mutations.ADD_CONSTRAINT, { name: this.conToAdd });
    }
  }

  get constraints(): Constraint[] {
    return Object.values(this.$store.state.constraints);
  }
}
</script>

<template>
  <v-container>
    <v-card :loading="isLoading">
      <v-card-title>
        {{ $t("solvers.sectionTitle") }}
      </v-card-title>

      <v-card-text>
        <v-row align="baseline">
          <v-col>
            <v-select
              :label="$t('solvers.selectLabel')"
              v-model="chosenSolver"
              :items="solverOptions"
            ></v-select>
          </v-col>
          <v-col cols="auto">
            <v-btn color="success" @click="runSolver">
              {{ $t("solvers.run") }}</v-btn
            >
          </v-col>
        </v-row>

        <v-alert dismissible v-model="hasMessage" :type="solvers.messageType">
          {{ solvers.message }}
        </v-alert>

        <PaginationContainer :component="solutionItem" :items="solutions">
        </PaginationContainer>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { actions, mutations, Solution } from "@/store";
import Vue from "vue";
import PaginationContainer from "@/components/PaginationContainer.vue";
import SolutionItem from "@/components/SolutionItem.vue";
import Component from "vue-class-component";

@Component({ name: "SolversView", components: { PaginationContainer } })
export default class SolversView extends Vue {
  solutionItem = SolutionItem;

  solverOptions = [
    {
      text: this.$t("solvers.glpkSimplex"),
      value: "simplex",
    },
    {
      text: this.$t("solvers.glpk"),
      value: "glpk",
    },
    {
      text: this.$t("solvers.lpppBnB"),
      value: "bnb",
    },
    {
      text: this.$t("solvers.lpppHomory"),
      value: "homory",
    },
  ];

  chosenSolver = "simplex";

  runSolver() {
    if (!this.$store.getters.numVariables) {
      this.$store.commit(mutations.SOLVERS.SET_MESSAGE, {
        message: this.$t("solvers.errNoVars"),
        type: "error",
      });
      return;
    }

    if (!this.$store.getters.numConstraints) {
      this.$store.commit(mutations.SOLVERS.SET_MESSAGE, {
        message: this.$t("solvers.errNoCons"),
        type: "error",
      });
      return;
    }

    this.$store
      .dispatch(actions.SOLVERS.RUN_SOLVER, {
        name: this.chosenSolver,
      })
      .then(() => {
        this.$store.commit(mutations.SOLVERS.SET_MESSAGE, {
          message: this.$t("solvers.success"),
          type: "success",
        });
      })
      .catch((err) => {
        this.$store.commit(mutations.SOLVERS.SET_MESSAGE, {
          message: this.getResponseError(err),
          type: "error",
        });
      });
  }

  getResponseError(err: any) {
    console.log(JSON.stringify(err));
    if (err.response) {
      if (err.response.data) {
        return err.response.data.error;
      } else {
        return err.response.statusText;
      }
    } else {
      return err.message;
    }
  }

  get isLoading(): boolean {
    return this.solvers.running;
  }

  get solvers(): any {
    return this.$store.state.solvers;
  }

  get solutions(): Solution[] {
    return Object.values(this.solvers.solutions);
  }

  get hasMessage(): boolean {
    return !!this.solvers.message;
  }

  set hasMessage(_) {
    this.$store.commit(mutations.SOLVERS.CLEAR_MESSAGE);
  }
}
</script>

<template>
  <v-expansion-panel>
    <v-expansion-panel-header disable-icon-rotate>
      {{ sol.solver }} - <em>{{ $d(new Date(sol.finished), "precise") }}</em>
      <template v-slot:actions>
        <v-btn icon @click="deleteSln">
          <v-icon color="error">mdi-trash-can</v-icon>
        </v-btn>
        <v-icon v-if="!sol.err" color="success">mdi-check-circle</v-icon>
        <v-icon v-else color="error">mdi-alert</v-icon>
      </template>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-alert v-if="sol.err" type="error"></v-alert>
      <v-container v-else fluid>
        <h5 class="text-h5 mb-4 mt-4">{{ $t("solvers.slnTitle") }}</h5>

        <KVItem :label="$t('solvers.slnObjective')" :value="sol.objective">
        </KVItem>

        <h5 class="text-h5 mb-4 mt-4">{{ $t("solvers.statsTitle") }}</h5>

        <KVItem
          :label="$t('solvers.slnStarted')"
          :value="$d(sol.started, 'precise')"
        >
        </KVItem>
        <KVItem
          :label="$t('solvers.slnFinished')"
          :value="$d(sol.finished, 'precise')"
        >
        </KVItem>
        <KVItem :label="$t('solvers.slnTook')" :value="sol.took"> </KVItem>
        <KVItem :label="$t('solvers.slnIterations')" :value="sol.iterations">
        </KVItem>
        <KVItem :label="$t('solvers.slnIps')" :value="sol.ips"> </KVItem>

        <h5 class="text-h5 mb-4 mt-4">{{ $t("solvers.slnDisplay") }}</h5>

        <v-dialog width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" v-bind="attrs"
              >{{ $t("solvers.chartColor") }}
              <span
                :style="`
                  margin-left:10px;
                  display:block;
                  background-color:${sol.color};
                  width:15px;
                  height:15px;
                  border-radius:50%;`"
              ></span>
            </v-btn>
          </template>

          <v-row justify="center">
            <v-card>
              <v-card-title>
                {{ $t("constraints.colorDlgTitle") }}
              </v-card-title>
              <v-card-text>
                <v-color-picker v-model="color"></v-color-picker>
              </v-card-text>
            </v-card>
          </v-row>
        </v-dialog>

        <h5 class="text-h5 mb-4 mt-4">{{ $t("solvers.slnVars") }}</h5>

        <v-card>
          <v-card-title>
            <v-row>
              <v-col>
                <v-text-field
                  single-line
                  hide-details
                  :label="$t('constraints.coefSearch')"
                  append-icon="mdi-magnify"
                  v-model="varSearch"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :search="varSearch"
              :headers="[
                {
                  text: $t('solvers.slnVarLabel'),
                  value: 'variable',
                },
                { text: $t('solvers.slnValLabel'), value: 'value' },
              ]"
              :items="
                Object.entries(sol.variables).map((v) => ({
                  variable: v[0],
                  value: v[1],
                }))
              "
            >
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import { mutations, Solution } from "@/store";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import KVItem from "@/components/KVItem.vue";

@Component({
  components: {
    KVItem,
  },
})
export default class SolutionItem extends Vue {
  @Prop() data: any;

  varSearch = "";

  get color(): string {
    return this.sol.color;
  }

  set color(newCol: string) {
    this.$store.commit(mutations.SOLVERS.SET_COLOR, {
      id: this.sol.id,
      color: newCol,
    });
  }

  deleteSln() {
    this.$store.commit(mutations.SOLVERS.DROP_SOLUTION, { id: this.sol.id });
  }

  get sol(): Solution {
    return this.data;
  }
}
</script>

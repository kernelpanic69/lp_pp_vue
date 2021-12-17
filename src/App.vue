<template>
  <v-app>
    <v-app-bar app color="primary" dense clipped-left>
      <v-app-bar-nav-icon
        class="d-sm-none"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" text>{{ $t("menu.file") }}</v-btn>
        </template>

        <v-list>
          <v-list-item link @click.stop="newConfirmShow = true">
            {{ $t("menu.fileNew") }}
          </v-list-item>

          <v-list-item link @click.stop="benchLoadShow = true">
            {{ $t("menu.fileBench") }}
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      app
      :permanent="$vuetify.breakpoint.smAndUp"
      v-model="drawer"
      clipped
      :mini-variant="mini"
    >
      <v-list nav>
        <v-list-item
          v-for="navItem in nav"
          :key="navItem.title"
          :to="navItem.route"
        >
          <v-list-item-icon>
            <v-icon>{{ navItem.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              {{ navItem.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-dialog v-model="newConfirmShow">
      <v-card>
        <v-card-title>{{ $t("menu.newConfirmTitle") }}</v-card-title>

        <v-card-text>
          {{ $t("menu.newConfirmText") }}
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="newConfirmShow = false">{{
            $t("commonUi.cancel")
          }}</v-btn>
          <v-btn color="error" @click="loadNew">
            <v-icon>mdi-trash-can</v-icon>
            {{ $t("commonUi.confirm") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="benchLoadShow">
      <v-card>
        <v-card-title>{{ $t("menu.benchDlgTitle") }}</v-card-title>
        <v-card-subtitle>
          {{ $t("menu.benchDlgSubtitle") }}
          <span class="info--text">{{ $t("menu.benchDlgNote") }}</span>
        </v-card-subtitle>

        <v-card-text>
          <v-alert text type="warning" dismissible>
            {{ $t("menu.benchDlgAlert") }}
          </v-alert>

          <v-row>
            <v-col>
              <v-combobox
                v-model="chosenBenchmark"
                :items="benchItems"
              ></v-combobox>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" @click="benchLoadShow = false">
            {{ $t("commonUi.cancel") }}
          </v-btn>

          <v-btn color="success" @click="loadBenchmark">
            {{ $t("commonUi.confirm") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { actions, mutations } from "./store";
import { LpModel } from "./store/Model";

import benchmarks from "./benchmarks.json";

@Component({})
export default class App extends Vue {
  name = "App";

  nav = [
    {
      title: "Model",
      route: "/",
      icon: "mdi-feature-search",
    },
    {
      title: this.$t("variables.sectionTitle"),
      route: "/variables",
      icon: "mdi-variable-box",
    },
    {
      title: this.$t("constraints.sectionTitle"),
      route: "/constraints",
      icon: "mdi-matrix",
    },
    {
      title: this.$t("charts.sectionTitle"),
      route: "/chart",
      icon: "mdi-chart-bar",
    },
    {
      title: this.$t("solvers.sectionTitle"),
      route: "/solvers",
      icon: "mdi-desktop-classic",
    },
  ];

  newConfirmShow = false;
  benchLoadShow = false;

  benchItems = benchmarks;

  chosenBenchmark = "afiro";

  loadBenchmark() {
    this.benchLoadShow = false;
    
    this.$store.dispatch(actions.REQUEST_FILE, {
      fileName: this.chosenBenchmark,
    });
  }

  loadNew() {
    this.$store.commit(mutations.LOAD, new LpModel());
  }

  drawer = false;

  get mini(): boolean {
    return this.$vuetify.breakpoint.smAndDown && this.drawer;
  }
}
</script>

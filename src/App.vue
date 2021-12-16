<template>
  <v-app>
    <v-app-bar app color="primary" dense clipped-left>
      <v-app-bar-nav-icon
        class="d-sm-none"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-menu v-for="m in menu" :key="m.title">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" text>{{ m.title }}</v-btn>
        </template>

        <v-list>
          <v-list-item v-for="item in m.items" :key="item.title">
            {{ item.title }}
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

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mutations } from "./store";

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

  menu = [
    {
      title: "File",
      items: [
        {
          title: this.$t("menu.fileNew"),
          action: () => {
            this.$store.commit(mutations.NEW_MODEL);
          },
        },
      ],
    },
  ];
  drawer = false;

  get mini(): boolean {
    return this.$vuetify.breakpoint.smAndDown && this.drawer;
  }
}
</script>

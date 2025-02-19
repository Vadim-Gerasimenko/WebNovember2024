<template>
  <v-layout>
    <v-app-bar scroll-behavior="hide"
               :elevation="2"
               class="position-fixed"
    >
      <v-toolbar :image="useAppStore().toolbarImage" class="bg-teal-lighten-2">
        <v-app-bar-title>
          <v-btn @click="goToHome" variant="plain">
            <v-icon>mdi-movie</v-icon>
            <span class="ms-1">Фильмотека</span>
          </v-btn>
        </v-app-bar-title>

        <v-btn @click="goToFavoriteMovies"  variant="plain" icon class="me-7">
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </v-toolbar>
    </v-app-bar>

    <v-main class="bg-teal-lighten-5">
      <RouterView/>
    </v-main>
  </v-layout>
</template>

<script>
import {useAppStore} from "@/stores/app.js";

export default {
  methods: {
    useAppStore,

    goToHome() {
      this.$router.push({name: "home"});
    },

    goToFavoriteMovies() {
      this.$router.push({name: "favoriteMovies"});
    }
  }
}
</script>

<style scoped>
</style>

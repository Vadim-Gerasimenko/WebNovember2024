<script>
import MoviePreview from "@/components/MoviePreview.vue";
import {useAppStore} from "@/stores/app.js";

export default {
  name: "FavoriteMovies",
  components: {MoviePreview},

  data() {
    return {
    }
  },

  methods: {
    useAppStore
  }
}
</script>

<template>
  <v-container fluid>
    <h1 class="text-h4 text-teal ms-8 my-3">Избранное</h1>

      <div class="v-row ms-5 me-5 mb-5">

        <div v-for="movie in useAppStore().favoriteMovies"
             :key="movie.id"
             class="v-col-6 v-col-sm-4 v-col-md-3 v-col-lg-2 v-col-xxl-1"
        >
          <movie-preview :movie="movie"></movie-preview>
        </div>
      </div>

      <template v-slot:empty>
        <template v-if="favoriteMoviesPage === 0">
          <v-alert type="warning">Фильмы не найдены.</v-alert>
        </template>
      </template>

      <template v-slot:error="{ props }" class="v-row">
        <v-alert type="error">
          <div class="d-flex justify-space-between align-center">
            Что-то пошло не так...
            <v-btn
              color="white"
              size="small"
              variant="outlined"
              v-bind="props"
            >
              Повторить попытку
            </v-btn>
          </div>
        </v-alert>
      </template>
  </v-container>
</template>

<style scoped>

</style>

<script>
import MoviePreview from "@/components/MoviePreview.vue";
import {useAppStore} from "@/stores/app.js";

export default {
  name: "Home",
  components: {MoviePreview},

  data() {
    return {
      movies: useAppStore().popularMovies,
      moviesIds: useAppStore().popularMoviesIds
    }
  },

  beforeCreate() {
    useAppStore().toolbarImage = "";
  },

  methods: {
    useAppStore,
    loadPopularMovies(result) {
      console.log("pop-load")
      useAppStore().service.getPopularMovies(useAppStore().popularMoviesPage)
        .then(response => {
          useAppStore().popularMoviesPage = useAppStore().loadMoviesPage(
            useAppStore().popularMoviesPage,
            this.movies,
            this.moviesIds,
            response,
            result
          );
        })
        .catch(() => result.done("error"));
    }
  }
}
</script>

<template>
  <v-container fluid>
    <h1 class="text-h4 text-teal ms-8 my-3">Популярное</h1>

    <v-infinite-scroll @load="loadPopularMovies">
      <div class="v-row ms-5 me-5 mb-5">

        <div v-for="movie in movies"
             :key="movie.id"
             class="v-col-6 v-col-sm-4 v-col-md-3 v-col-lg-2 v-col-xxl-1"
        >
          <movie-preview :movie="movie"></movie-preview>
        </div>
      </div>

      <template v-slot:empty>
        <template v-if="useAppStore().popularMoviesPage === 0">
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
    </v-infinite-scroll>
  </v-container>
</template>

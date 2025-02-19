<script xmlns="http://www.w3.org/1999/html">
import {useAppStore} from "@/stores/app.js";
import MoviePreview from "@/components/MoviePreview.vue";

export default {
  name: "MovieDetails",
  components: {MoviePreview},

  data() {
    return {
      imagesBaseUrl: useAppStore().imagesBaseUrl,
      details: {
        genres: [],
        overview: "",
        release_date: ""
      },
      releaseYear: "",
      isFavorite: useAppStore().isFavorite(this.$route.params.id),
      countries: [],
      similarMovies: [],
      similarMoviesIds: [],
      similarMoviesPage: 1,
      isSimilarMoviesInvalid: false,
      recommendedMovies: [],
      recommendedMoviesIds: [],
      recommendedMoviesPage: 1,
      isRecommendedMoviesInvalid: false
    }
  },

  created() {
    this.getMoviesDetails();
  },

  /*
  beforeUpdate() {
    useAppStore().toolbarImage = this.getBackdropPath();
    this.getMoviesDetails();
  },
   */

  methods: {
    getReleaseYear() {
      const separatorIndex = this.details.release_date.indexOf("-");

      if (separatorIndex < 0) {
        return null;
      }

      this.releaseYear = this.details.release_date.slice(0, separatorIndex);

      return this.releaseYear;
    },

    getMoviesDetails() {
      return useAppStore().service.getMovieDetails(this.$route.params.id)
        .then(res => {
          this.details = res;
          this.details.genre_ids = this.details.genres.map(genre => genre.id);
          this.countries = useAppStore().service.getCountriesNamesByIsoCodes(res.origin_country);
          this.isFavorite = useAppStore().isFavorite(this.details.id);
        });
    },

    getBackdropPath() {
      return this.imagesBaseUrl + 'original' + this.details.backdrop_path;
    },

    loadSimilarMovies(result) {
      console.log("sim-load")
      useAppStore().service.getSimilarMovies(this.$route.params.id, this.similarMoviesPage)
        .then(response => {
          this.similarMoviesPage = useAppStore().loadMoviesPage(
            this.similarMoviesPage,
            this.similarMovies,
            this.similarMoviesIds,
            response,
            result
          );
        })
        .catch(() => result.done("error"));
    },

    loadRecommendedMovies(result) {
      console.log("recload")
      useAppStore().service.getRecommendedMovies(this.$route.params.id, this.recommendedMoviesPage)
        .then(response => {
          this.recommendedMoviesPage = useAppStore().loadMoviesPage(
            this.recommendedMoviesPage,
            this.recommendedMovies,
            this.recommendedMoviesIds,
            response,
            result
          );
        })
        .catch(() => result.done("error"));
    },

    onChangeFavorite() {
      if (this.isFavorite) {
        useAppStore().addToFavoriteMovies(this.details);
      } else {
        useAppStore().removeFromFavoriteMovies(this.details.id);
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="v-container">
      <div class="v-row justify-center">
        <div class="v-col-11 v-col-sm-7 opacity rounded-xl mt-8 pa-5">
          <div>
            <div class="v-row">
              <span class="v-col text-h4">{{ details.title }}</span>

              <v-checkbox v-model="isFavorite"
                          @change="onChangeFavorite"
                          true-icon="mdi-heart"
                          false-icon="mdi-heart"
                          color="teal"
                          base-color="teal"
                          class="me-3 mt-1"
              >
              </v-checkbox>
            </div>

            <div v-if="getReleaseYear() !== null">
              <span class="font-weight-medium me-1">Год:</span>
              <span>{{ releaseYear }}</span>
            </div>

            <div v-if="details.genres.length > 0">
              <span v-if="details.genres.length === 1" class="font-weight-medium me-1">
                Жанр:
              </span>
              <span v-else class="font-weight-medium me-1">
                Жанры:
              </span>

              <span v-for="(genre, index) in details.genres">
                <span>{{ genre.name }}</span>
                <span v-if="index < details.genres.length - 1">, </span>
              </span>
            </div>

            <div v-if="countries.length > 0">
              <span v-if="countries.length === 1" class="font-weight-medium me-1">
                Страна:
              </span>
              <span v-else class="font-weight-medium me-1">
                Страны:
              </span>

              <span v-for="(country, index) in countries">
                <span>{{ country }}</span>
                <span v-if="index < countries.length - 1">, </span>
              </span>
            </div>

            <div v-if="details.budget > 0">
              <span class="font-weight-medium me-1">Бюджет:</span>
              <span class="me-1">{{ details.budget }}</span>
              <span class="font-weight-medium">$</span>
            </div>

            <div v-if="details.overview.trim().length !== 0">
              <span class="font-weight-medium me-1">Описание:</span>
              <span class="me-1">{{ details.overview }}</span>
            </div>
          </div>

          <v-img
            :src="getBackdropPath()"
            class="v-col rounded-xl position-relative"
          />
        </div>

        <div class="d-none d-sm-block d-xl-none v-col-4 rounded-xl ms-3 align-content-center">
          <h1 class="text-button text-teal-darken-2 text-center">Главный постер</h1>

          <v-img :src="imagesBaseUrl + 'w780' + details.poster_path" class="rounded-xl"/>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-7">
    <h1 class="text-h5 text-teal-darken-2 ms-8 mb-4">Похожие фильмы</h1>

    <div class="v-row">
      <v-infinite-scroll @load="loadSimilarMovies" direction="horizontal" arrows>
        <movie-preview v-for="movie in similarMovies"
                       :key="movie.id"
                       :movie="movie"
                       class="v-col-5 v-col-sm-4 v-col-md-3 v-col-lg-2 v-col-xl-1"
        />

        <template v-slot:empty>
          <template v-if="recommendedMoviesPage === 0">
            <v-alert type="warning">Похожие фильмы не найдены.</v-alert>
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
    </div>
  </div>

  <div class="mt-2 mb-4">
    <h1 class="text-h5 text-teal-darken-2 ms-8 mb-4">Рекомендации</h1>

    <div class="v-row">
      <v-infinite-scroll @load="loadRecommendedMovies" direction="horizontal">
        <movie-preview v-for="movie in recommendedMovies"
                       :key="movie.id"
                       :movie="movie"
                       class="v-col-5 v-col-sm-4 v-col-md-3 v-col-lg-2 v-col-xl-1"
        />

        <template v-slot:empty>
          <template v-if="recommendedMoviesPage === 0">
            <v-alert type="warning">Рекомендации к данному фильму отсутствуют.</v-alert>
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
    </div>
  </div>
</template>

<style>
.opacity {
  background: rgba(255, 255, 255, 0.65);
}
</style>

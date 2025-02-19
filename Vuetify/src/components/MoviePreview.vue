<script>
import {useAppStore} from "@/stores/app.js";

export default {
  props: {
    movie: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      imagesBaseUrl: useAppStore().imagesBaseUrl,
      genres: useAppStore().service.getGenresByIds(this.movie.genre_ids || []),
      voteHalfAverage: this.getVoteHalfAverage()
    }
  },

  methods: {
    getVoteHalfAverage() {
      return this.movie.vote_average / 2;
    },

    goToMovieDetails() {
      this.$router.push({
        name: "movieDetails",
        params: {
          id: this.movie.id
        }
      });
    }
  }
}
</script>

<template>
  <div>
    <v-hover v-slot="{ isHovering, props }">
      <v-card @click="goToMovieDetails"
              class="mx-auto rounded-xl"
              elevation="2"
              max-width="344"
              v-bind="props"
      >
        <v-img :src="imagesBaseUrl + 'w780' + movie.poster_path"></v-img>

        <v-overlay
          :model-value="!!isHovering"
          scrim="#036358"
          contained
          class="align-center justify-center"
        >
          <div>
            <v-btn-toggle icon variant="plain" class="text-teal-accent-3">
              <v-icon>mdi-heart</v-icon>
            </v-btn-toggle>
          </div>

          <div class="align-center justify-center">
            <div class="text-center">
              <div class="text-teal-accent-3">
              <span v-for="(genre, index) in genres" :key="genre.id">
                <span v-if="index <= 1">
                  <span>{{ genre.name }}</span>
                  <span v-if="genres.length > 1 && index === 0">, </span>
                </span>
              </span>
              </div>

              <div>
                <v-rating :model-value="voteHalfAverage"
                          half-increments
                          readonly
                          color="teal"
                          active-color="teal-accent-3"
                          density="compact"
                >
                </v-rating>

                <div class="text-center">
                  <span v-if="voteHalfAverage > 0"
                        class="text-teal-accent-2"
                  >
                    {{ movie.vote_average }}
                  </span>
                  <span v-else
                        class="text-teal-lighten-1"
                  >
                    нет оценок
                  </span>
                </div>
              </div>
            </div>
          </div>
        </v-overlay>
      </v-card>
    </v-hover>

    <div class="text-center mt-1">
      <span @click="goToMovieDetails" class="text-teal cursor-pointer">
        {{ movie.title }}
      </span>
    </div>
  </div>
</template>

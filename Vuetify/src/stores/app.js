// Utilities
import {defineStore} from 'pinia'
import {TmdbService} from "@/js/tmdbService.js";

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      imagesBaseUrl: "https://image.tmdb.org/t/p/",
      toolbarImage: "",
      favoriteMovies: [],
      popularMovies: [],
      popularMoviesIds: [],
      popularMoviesPage: 1,
      service: new TmdbService()
    }
  },

  actions: {
    addUniqueMovies(movies, moviesIds, newMovies) {
      const uniqueMovies = newMovies
        .filter(movie => !moviesIds.includes(movie.id));

      movies.push(...uniqueMovies);
      moviesIds.push(...uniqueMovies.map(movie => movie.id));
    },

    loadMoviesPage(currentPage, movies, moviesIds, response, result) {
      if (response.total_pages === 0) {
        result.done("empty");
        return 0;
      }

      if (currentPage > response.total_pages) {
        result.done("empty");
        return currentPage;
      }

      this.addUniqueMovies(movies, moviesIds, response.results);

      result.done("ok");
      ++currentPage;

      return currentPage;
    },

    isFavorite(id) {
      console.log(id);
      console.log(this.getFavoriteMovieIndex(id) >= 0);
      return this.getFavoriteMovieIndex(id) >= 0;
    },

    getFavoriteMovieIndex(id) {
      return this.favoriteMovies.map(movie => movie.id).indexOf(id);
    },

    addToFavoriteMovies(movie) {
      if (this.isFavorite(movie.id)) {
        return;
      }

      this.favoriteMovies.push(movie);
      console.log("add");
      console.log(movie);
    },

    removeFromFavoriteMovies(id) {
      console.log("rem");
      console.log(id);

      const index = this.getFavoriteMovieIndex(id);
      console.log(index);

      if (index < 0) {
        return;
      }

      this.favoriteMovies.splice(index, 1);
      console.log(this.favoriteMovies)
    }
  }
});

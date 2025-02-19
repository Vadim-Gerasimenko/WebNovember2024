import axios from "axios";

export class TmdbService {
  constructor() {
    this.bearerToken = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNDA5NjI2NjNmYzk2MzQ1Mzg5NGIwYWY1MzdlNWU3NSIsIm5iZiI6MTczODY4MTI4NC43OTUsInN1YiI6IjY3YTIyYmM0NzE2YmZkNzRlY2UyZDM2NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mjhuc2JWQ59HIk8jdux9tl8J2Gv8NE8uBMxQrrnEiYo";

    this.baseUrl = "https://api.themoviedb.org/3";
    this.language = "ru-RU";
    this.dataType = 'application/json';

    this.genres = [];
    this.countries = [];

    this.currentFilteredMoviesPageNumber = 1;

    this.getGenresList();
    this.getCountriesList();
  };

  getPopularMovies(pageNumber) {
    const options = {
      method: "GET",
      url: this.baseUrl + "/movie/popular",
      params: {
        language: this.language,
        page: pageNumber
      },
      headers: {
        accept: this.dataType,
        Authorization: this.bearerToken
      }
    };

    return axios
      .request(options)
      .then(res => {
        console.log(res.data);
        return res.data;
      })
      .catch(() => alert("Не удалось получить информацию о популярных фильмах"));
  }

  getGenresByIds(ids) {
    return this.genres.filter(genre => ids.includes(genre.id));
  }

  getCountriesNamesByIsoCodes(isoCodes) {
    return this.countries
      .filter(country => isoCodes.includes(country.iso_3166_1))
      .map(country => country.native_name);
  }

  getGenresList() {
    const options = {
      method: "GET",
      url: this.baseUrl + "/genre/movie/list",
      params: {
        language: this.language
      },
      headers: {
        accept: this.dataType,
        Authorization: this.bearerToken
      }
    };

    axios.request(options)
      .then(res => this.genres = res.data.genres)
      .catch(() => alert("Не удалось получить информацию о жанрах"));
  }

  getCountriesList() {
    const options = {
      method: "GET",
      url: this.baseUrl + "/configuration/countries",
      params: {
        language: this.language
      },
      headers: {
        accept: this.dataType,
        Authorization: this.bearerToken
      }
    };

    axios
      .request(options)
      .then(res => this.countries = res.data)
      .catch(() => alert("Не удалось получить информацию о странах"));
  }

  getMoviesByTitle(term) {
    const options = {
      method: "GET",
      url: this.baseUrl + "/search/movie",
      params: {
        include_adult: "true",
        language: this.language,
        page: this.currentFilteredMoviesPageNumber
      },
      headers: {
        accept: this.dataType,
        Authorization: this.bearerToken
      }
    };

    return axios
      .request(options)
      .then(res => {
        ++this.currentFilteredMoviesPageNumber;
        return res.data;
      });
  }

  getMovieDetails(movieId) {
    const options = {
      method: "GET",
      url: `${this.baseUrl}/movie/${movieId}`,
      params: {
        language: this.language
      },
      headers: {
        accept: this.dataType,
        Authorization: this.bearerToken
      }
    };

    return axios
      .request(options)
      .then(res => {
        return res.data;
      })
      .catch(() => alert(`Не удалось получить информацию о фильме с id = ${movieId}`));
  }

  getSimilarMovies(movieId, page) {
    const options = {
      method: "GET",
      url: `${this.baseUrl}/movie/${movieId}/similar`,
      params: {
        language: this.language,
        page: page
      },
      headers: {
        accept: this.dataType,
        Authorization: this.bearerToken
      }
    };

    return axios
      .request(options)
      .then(res => {
        return res.data;
      })
      .catch(() => alert(`Не удалось получить похожие фильмы с фильмом с id = ${movieId}`));
  }

  getRecommendedMovies(movieId, page) {
    const options = {
      method: "GET",
      url: `${this.baseUrl}/movie/${movieId}/recommendations`,
      params: {
        language: this.language,
        page: page
      },
      headers: {
        accept: this.dataType,
        Authorization: this.bearerToken
      }
    };

    return axios
      .request(options)
      .then(res => {
        return res.data;
      })
      .catch(() => alert(`Не удалось получить рекомендованные фильмы к фильму с id = ${movieId}`));
  }
}

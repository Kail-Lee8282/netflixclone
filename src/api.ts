const API_KEY = "a8c4d6705a52ffada4a68f2ae28a2f1c";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMedia {
  media_type: string;
}

export interface IMovie extends IMedia {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  runtime: number;
  release_date: string;
  vote_average: number;
  genres: IGenre[];
  production_companies: IProduction[];
}

interface IGenre {
  id: number;
  name: string;
}

interface IProduction {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimun: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface IActor {
  adult: boolean;
  gender: number | null;
  id: number;
  name: string;
  profile_path: string;
  character: string;
}

export interface ICreditsResult {
  id: number;
  cast: IActor[];
  crew: IActor[];
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}

export function getMovie(id: string) {
  return fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getLatest() {
  return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getPopular() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getTopRated() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getUpcomming() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getCredits(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}/credits?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}

export function getSimilarMovies(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}/similar?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}

export interface ITvShow extends IMovie {
  genre_ids: number[];
  name: string;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
}

export interface IGetTvShowsResult {
  page: number;
  results: ITvShow[];
  total_pages: number;
  total_results: number;
}

export function getLatestTv() {
  return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getAiringTodayTvShow() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getPopularTvShows() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getTopRatedTvShows() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getOnTheAirTvShows() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getTvShowInfo(tvShowId: string) {
  return fetch(`${BASE_PATH}/tv/${tvShowId}?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getTvShowCredits(tvShowId: string) {
  return fetch(`${BASE_PATH}/tv/${tvShowId}/credits?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}

interface IEpisode {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  still_path: string;
  air_date: string;
  episode_number: number;
}

export interface IGetTvShowSeasons {
  id: number;
  name: string;
  episodes: IEpisode[];
}

export function getTvShowEpisodes(tvShowId: string, seasonNumber: string) {
  return fetch(
    `${BASE_PATH}/tv/${tvShowId}/season/${seasonNumber}?api_key=${API_KEY}`
  ).then((res) => res.json());
}

interface ISearchMedia extends ITvShow {}

export interface ISearchResult {
  page: number;
  results: ISearchMedia[];
  total_result: number;
  total_pages: number;
}

export function getMultiSearch(keyword: string) {
  console.log(`1_${keyword}`);
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}`
  ).then((res) => res.json());
}

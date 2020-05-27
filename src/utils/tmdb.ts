import axios from "axios";
import { Film, CastAndCrew, Search } from "../types/film";
import Config from "../config/config";

const baseURL = "https://api.themoviedb.org/3";

export async function fetchFilmTMDB(filmID: number) {
  const URL = `${baseURL}/movie/${filmID}?api_key=${Config.tmdb_api_key}`;
  const response = await axios.get<Film>(URL);
  const film = response.data;
  return film;
}

export async function fetchFilmCastAndCrewTMDB(filmID: number) {
  const URL = `${baseURL}/movie/${filmID}/credits?api_key=${Config.tmdb_api_key}`;
  const response = await axios.get<CastAndCrew>(URL);
  const castAndCrew = response.data;
  return castAndCrew;
}

export async function searchFilmsTMDB(query: string) {
  const URL = `${baseURL}/search/movie?api_key=${Config.tmdb_api_key}&query=${query}&include_adult=true`;
  const response = await axios.get<Search>(URL);
  const search = response.data;
  return search;
}

import type { Movie, MovieResponse } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
export const BACKDROP_BASE_URL = import.meta.env.VITE_TMDB_BACKDROP_BASE_URL;

export const fetchMovies = async (endpoint: string): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=fr-FR`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des données');
  const data: MovieResponse = await response.json();
  return data.results;
};
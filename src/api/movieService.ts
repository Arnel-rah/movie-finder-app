import type { Movie, MovieResponse } from "../types/movie";

const API_KEY = '465990ebeb6469eea956020b02afedc7';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const fetchMovies = async (endpoint: string): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=fr-FR`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des données');
  const data: MovieResponse = await response.json();
  return data.results;
};
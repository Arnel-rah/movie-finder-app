import { useState, useEffect } from 'react';
import type { Movie } from '../types/movie';
import { fetchMovies } from '../api/movieService';

export const useMovies = (endpoint: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies(endpoint)
      .then(setMovies)
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { movies, loading };
};
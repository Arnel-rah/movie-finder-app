import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

export const useGenres = () => {
  const [genres, setGenres] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch(GENRE_URL)
      .then(res => res.json())
      .then(data => {
        const genreMap: Record<number, string> = {};
        data.genres.forEach((g: { id: number, name: string }) => {
          genreMap[g.id] = g.name;
        });
        setGenres(genreMap);
      })
      .catch(err => console.error("Erreur genres:", err));
  }, []);

  return genres;
};
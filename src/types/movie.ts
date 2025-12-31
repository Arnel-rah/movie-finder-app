export interface Movie {
  genre_ids: any;
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

export interface MovieResponse {
  results: Movie[];
}
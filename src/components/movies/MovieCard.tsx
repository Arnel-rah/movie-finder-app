import { Star } from 'lucide-react';
import type { Movie } from '../../types/movie';

const POSTER_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500";

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  18: "Drama", 14: "Fantasy", 27: "Horror", 9648: "Mystery", 878: "Sci-Fi", 53: "Thriller"
};

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const mainGenre = movie.genre_ids && movie.genre_ids.length > 0 
    ? GENRE_MAP[movie.genre_ids[0]] 
    : "Movie";

  return (
    <div className="shrink-0 w-40 md:w-52 group cursor-pointer relative">
      <div className="relative aspect-2/3 overflow-hidden rounded-2xl shadow-2xl">
        <img 
          src={`${POSTER_URL}${movie.poster_path}`} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent opacity-100" />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 flex flex-col gap-1">
          <h3 className="text-white font-bold text-sm md:text-base leading-tight truncate">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-300 font-medium">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="text-white font-bold">
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>
            </div>
            <span className="opacity-50">|</span>
            <span className="truncate">{mainGenre} • Movie</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
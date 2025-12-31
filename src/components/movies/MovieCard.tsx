import { Star } from 'lucide-react';
import type { Movie } from '../../types/movie';

const POSTER_URL = "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="shrink-0 w-45 md:w-55 group cursor-pointer relative">
      <div className="relative aspect-2/3 overflow-hidden rounded-2xl shadow-2xl">
        <img 
          src={`${POSTER_URL}${movie.poster_path}`} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1">
          {/* Titre */}
          <h3 className="text-white font-bold text-sm md:text-base leading-tight truncate">
            {movie.title}
          </h3>
          
          {/* Note et Métadonnées */}
          <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-300 font-medium">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-white font-bold">
                {movie.vote_average ? movie.vote_average.toFixed(1) : "4.5"}
              </span>
            </div>
            <span className="opacity-50">|</span>
            <span className="truncate">Action • Movie</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
import { Star } from "lucide-react";
import type { Movie } from "../../types/movie";

const IMAGE_BASE =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500";

const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  14: "Fantasy",
  27: "Horror",
  9648: "Mystery",
  878: "Sci-Fi",
  53: "Thriller",
};

interface TopMovieCardProps {
  movie: Movie;
  index: number;
}

const TopMovieCard = ({ movie, index }: TopMovieCardProps) => {
  const displayGenres =
    movie.genre_ids && movie.genre_ids.length > 0
      ? movie.genre_ids
          .slice(0, 2)
          .map((id: number) => GENRE_MAP[id] || "Movie")
          .join(" • ")
      : "Movie";

  return (
    <div className="shrink-0 flex items-center gap-4 w-72 md:w-80 group cursor-pointer">
      <span className="text-5xl md:text-7xl font-black text-white transition-colors italic min-w-15 text-center">
        {index + 1}
      </span>

      <div className="w-24 h-32 md:w-32 md:h-40 overflow-hidden rounded-2xl shadow-xl shrink-0">
        <img
          src={`${IMAGE_BASE}${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col gap-1 overflow-hidden">
        <span className="text-[10px] uppercase font-bold text-gray-400 border border-gray-700 w-fit px-2 py-0.5 rounded-md mb-1">
          PG-13
        </span>

        <h3 className="text-white font-bold text-sm md:text-base truncate leading-tight">
          {movie.title}
        </h3>

        <p className="text-[10px] text-gray-500 truncate font-medium">
          {displayGenres}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-white text-xs font-bold">
              {movie.vote_average ? movie.vote_average.toFixed(1) : "4.0"}
            </span>
          </div>
          <span className="text-gray-600 text-[10px]">| Movie</span>
        </div>
      </div>
    </div>
  );
};

export default TopMovieCard;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Bookmark } from "lucide-react";
import type { Movie } from "../../types/movie";
import { BACKDROP_BASE_URL } from "../../api/movieService";

interface HeroBannerProps {
  movies: Movie[];
  loading: boolean;
}

const GENRE_MAP: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const HeroBanner = ({ movies, loading }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayLimit = 5;

  useEffect(() => {
    if (movies.length > 0) {
      const limit = Math.min(movies.length, displayLimit);
      setCurrentIndex(Math.floor(Math.random() * limit));
    }
  }, [movies.length]);

  useEffect(() => {
    if (movies.length === 0 || loading) return;
    const interval = setInterval(() => {
      const limit = Math.min(movies.length, displayLimit);
      setCurrentIndex((prev) => (prev >= limit - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [movies.length, loading]);

  if (loading || movies.length === 0) {
    return (
      <div className="h-[75vh] md:h-[85vh] w-full bg-[#0a0a0a] animate-pulse" />
    );
  }

  const currentMovie = movies[currentIndex];
  const actualLimit = Math.min(movies.length, displayLimit);

  return (
    <div className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden bg-[#0a0a0a] text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-0"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${BACKDROP_BASE_URL}${currentMovie.backdrop_path}')`,
            }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 md:px-16 lg:px-24">
        <motion.div
          key={`content-${currentMovie.id}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold mb-4 inline-block border border-white/10 uppercase tracking-wider text-white">
            Movie
          </span>

          <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight drop-shadow-lg">
            {currentMovie.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-300 text-[11px] md:text-sm mb-4 font-medium opacity-90">
            <span>2h40m</span>
            <span>•</span>
            <span>{currentMovie.release_date?.split("-")[0]}</span>
            <span>•</span>
            <span className="text-[#00925d]">
              {currentMovie.genre_ids
                ?.slice(0, 2)
                .map((id: number) => GENRE_MAP[id])
                .join(" • ")}
            </span>
          </div>

          <p className="text-white text-[13px] md:text-base max-w-2xl line-clamp-2 mb-8 leading-snug opacity-80">
            {currentMovie.overview}
          </p>

          <div className="flex items-center gap-3">
            <button className="flex-1 md:flex-none bg-[#00925d] text-white h-12 px-6 rounded-xl flex items-center justify-center gap-2 font-bold transition-transform active:scale-95 shadow-lg shadow-[#00925d]/20">
              <Play size={18} fill="currentColor" />
              <span>Watch Trailer</span>
            </button>

            <button className="flex-1 md:flex-none border border-white/40 backdrop-blur-md text-white h-12 px-6 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95">
              <Bookmark size={18} />
              <span>Add Watchlist</span>
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 w-full flex justify-center gap-2 z-20">
        {Array.from({ length: actualLimit }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;

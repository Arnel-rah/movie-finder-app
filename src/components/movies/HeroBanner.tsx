import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Bookmark, X, AlertCircle } from "lucide-react";
import YouTube from "react-youtube";
import type { Movie } from "../../types/movie";
import { BACKDROP_BASE_URL, getMovieVideos } from "../../api/movieService";

interface HeroBannerProps {
  movies: Movie[];
  loading: boolean;
}

const GENRE_MAP: { [key: number]: string } = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

const HeroBanner = ({ movies, loading }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerVideoId, setTrailerVideoId] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const displayLimit = 5;

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (movies.length > 0) {
      const limit = Math.min(movies.length, displayLimit);
      setCurrentIndex(Math.floor(Math.random() * limit));
    }
  }, [movies.length]);

  useEffect(() => {
    if (movies.length === 0 || loading || showTrailer) return;

    const interval = setInterval(() => {
      const limit = Math.min(movies.length, displayLimit);
      setCurrentIndex((prev) => (prev >= limit - 1 ? 0 : prev + 1));
    }, 8000);

    return () => clearInterval(interval);
  }, [movies.length, loading, showTrailer]);

  useEffect(() => {
    const fetchVideo = async () => {
      if (currentMovie?.id) {
        try {
          const video = await getMovieVideos(currentMovie.id);
          setTrailerVideoId(video ? video.key : null);
        } catch (error) {
          setTrailerVideoId(null);
        }
      }
    };
    fetchVideo();
  }, [currentMovie]);

  const handleOpenTrailer = () => {
    if (trailerVideoId) {
      setActiveVideoId(trailerVideoId);
      setShowTrailer(true);
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
    setActiveVideoId(null);
  };

  if (loading || movies.length === 0) {
    return <div className="h-[75vh] md:h-[85vh] w-full bg-[#0a0a0a] animate-pulse" />;
  }

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
            style={{ backgroundImage: `url('${BACKDROP_BASE_URL}${currentMovie.backdrop_path}')` }}
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
            <span>{currentMovie.release_date?.split("-")[0]}</span>
            <span>•</span>
            <span className="text-[#00925d]">
              {currentMovie.genre_ids?.slice(0, 2).map((id: number) => GENRE_MAP[id]).join(" • ")}
            </span>
          </div>

          <p className="text-white text-[13px] md:text-base max-w-2xl line-clamp-2 mb-8 leading-snug opacity-80">
            {currentMovie.overview}
          </p>

          <div className="flex items-center gap-3">
            <motion.button 
              layout
              onClick={handleOpenTrailer}
              disabled={!trailerVideoId}
              className={`flex-1 md:flex-none h-12 px-6 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95 shadow-lg ${
                trailerVideoId 
                ? "bg-[#00925d] cursor-pointer hover:bg-[#007a4e] text-white" 
                : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
              }`}
            >
              {trailerVideoId ? <Play size={18} fill="currentColor" /> : <AlertCircle size={18} />}
              <span>{trailerVideoId ? "Watch Trailer" : "No Trailer Available"}</span>
            </motion.button>

            <button className="flex-1 md:flex-none border border-white/40 backdrop-blur-md text-white h-12 px-6 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95 cursor-pointer hover:bg-white/10">
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
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              index === currentIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"
            }`}
          />
        ))}
      </div>

      <AnimatePresence>
        {showTrailer && activeVideoId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={handleCloseTrailer}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white cursor-pointer transition-colors"
              >
                <X size={24} />
              </button>
              <YouTube
                videoId={activeVideoId}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
                }}
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroBanner;
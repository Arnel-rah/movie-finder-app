import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Bookmark, BookmarkCheck, X, AlertCircle } from "lucide-react";
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
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  
  const displayLimit = Math.min(movies.length, 10);
  const currentMovie = movies[currentIndex];

  useEffect(() => {
    const saved = localStorage.getItem("movie_watchlist");
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= displayLimit - 1 ? 0 : prev + 1));
  }, [displayLimit]);

  useEffect(() => {
    if (movies.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * displayLimit));
    }
  }, [movies.length, displayLimit]);

  useEffect(() => {
    if (movies.length <= 1 || loading || showTrailer) return;
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [movies.length, loading, showTrailer, nextSlide]);

  useEffect(() => {
    const fetchVideo = async () => {
      if (currentMovie?.id) {
        try {
          const video = await getMovieVideos(currentMovie.id);
          setTrailerVideoId(video ? video.key : null);
        } catch {
          setTrailerVideoId(null);
        }
      }
    };
    fetchVideo();
  }, [currentMovie?.id]);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    let updatedWatchlist;
    const isInside = watchlist.some((m) => m.id === currentMovie.id);

    if (isInside) {
      updatedWatchlist = watchlist.filter((m) => m.id !== currentMovie.id);
    } else {
      updatedWatchlist = [...watchlist, currentMovie];
    }

    setWatchlist(updatedWatchlist);
    localStorage.setItem("movie_watchlist", JSON.stringify(updatedWatchlist));
  };

  const isInWatchlist = watchlist.some((m) => m.id === currentMovie?.id);

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

  return (
    <div className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden bg-[#0a0a0a] text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 10, ease: "linear" }}
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${BACKDROP_BASE_URL}${currentMovie.backdrop_path}')` }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 md:px-16 lg:px-24">
        <motion.div
          key={`content-${currentMovie.id}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="bg-[#00925d]/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold mb-4 inline-block border border-[#00925d]/30 uppercase tracking-widest text-[#00ff9d]">
            Trending Now
          </span>

          <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight drop-shadow-2xl">
            {currentMovie.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-300 text-[11px] md:text-sm mb-4 font-medium">
            <span>{currentMovie.release_date?.split("-")[0]}</span>
            <span>•</span>
            <span className="text-[#00925d] font-bold">
              {currentMovie.genre_ids?.slice(0, 2).map((id: number) => GENRE_MAP[id]).join(" • ")}
            </span>
          </div>

          <p className="text-white/70 text-[13px] md:text-base max-w-2xl line-clamp-2 mb-8 leading-relaxed">
            {currentMovie.overview}
          </p>

          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenTrailer}
              disabled={!trailerVideoId}
              className={`flex-1 md:flex-none h-12 px-8 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-[#00925d]/20 ${
                trailerVideoId 
                ? "bg-[#00925d] cursor-pointer text-white" 
                : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
              }`}
            >
              {trailerVideoId ? <Play size={18} fill="currentColor" /> : <AlertCircle size={18} />}
              <span>{trailerVideoId ? "Watch Trailer" : "No Trailer"}</span>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleWatchlist}
              className={`flex-1 md:flex-none h-12 px-8 rounded-xl flex items-center justify-center gap-2 font-bold transition-all cursor-pointer border backdrop-blur-md ${
                isInWatchlist 
                ? "bg-[#00925d]/20 border-[#00925d] text-[#00ff9d]" 
                : "border-white/20 text-white hover:bg-white/10"
              }`}
            >
              {isInWatchlist ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              <span>{isInWatchlist ? "In Watchlist" : "Watchlist"}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 w-full flex justify-center gap-3 z-20">
        {Array.from({ length: displayLimit }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full cursor-pointer ${
              index === currentIndex ? "w-10 h-1.5 bg-[#00925d]" : "w-2.5 h-1.5 bg-white/20 hover:bg-white/40"
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
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button 
                onClick={handleCloseTrailer}
                className="absolute top-5 right-5 z-10 p-2.5 bg-black/60 hover:bg-red-500 rounded-full text-white cursor-pointer transition-all hover:rotate-90"
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
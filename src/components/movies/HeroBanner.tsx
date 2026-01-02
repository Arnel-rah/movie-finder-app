import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Bookmark } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { BACKDROP_BASE_URL } from '../../api/movieService';

interface HeroBannerProps {
  movies: Movie[];
  loading: boolean;
}

const GENRE_MAP: { [key: number]: string } = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

const HeroBanner = ({ movies, loading }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (movies.length > 0) {
      const maxRange = Math.min(movies.length, 10);
      const startRandom = Math.floor(Math.random() * maxRange);
      setCurrentIndex(startRandom);
    }
  }, [movies.length]); 

  useEffect(() => {
    if (movies.length === 0 || loading) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= Math.min(movies.length, 10) - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [movies, loading]);

  if (loading || movies.length === 0) {
    return <div className="h-[80vh] w-full bg-[#0a0a0a] animate-pulse" />;
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden bg-[#0a0a0a] text-white">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentMovie.id}
          initial={{ x: "10%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-10%", opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="w-full h-full bg-cover bg-top md:bg-center"
            style={{ backgroundImage: `url('${BACKDROP_BASE_URL}${currentMovie.backdrop_path}')` }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 max-w-5xl pt-20">
        <motion.div
          key={`text-${currentMovie.id}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="bg-[#00925d]/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold mb-4 inline-block border border-[#00925d]/30 uppercase tracking-[0.2em] text-[#00ff9d]">
            Trending Now
          </span>
          
          <h1 className="text-3xl md:text-2xl font-black mb-4 leading-tight tracking-tight max-w-3xl drop-shadow-2xl">
            {currentMovie.title}
          </h1>

          <div className="flex items-center gap-3 text-gray-300 text-xs md:text-sm mb-6 font-medium">
             <span className="bg-white/10 px-2 py-0.5 rounded text-white">{currentMovie.release_date?.split('-')[0]}</span>
             <span>•</span>
             <span className="text-yellow-500 font-bold">★ {currentMovie.vote_average?.toFixed(1)}</span>
             <span>•</span>
             <span className="text-gray-300 italic">
                {currentMovie.genre_ids
                  ?.slice(0, 2)
                  .map((id: number) => GENRE_MAP[id])
                  .join(' · ')}
             </span>
          </div>
          
          <p className="text-white text-sm md:text-base max-w-2xl line-clamp-3 mb-8 leading-relaxed opacity-80">
            {currentMovie.overview}
          </p>

          <div className="flex items-center gap-4">
            <button className="bg-[#00925d] text-white px-8 h-12 rounded-xl flex items-center gap-2 hover:bg-[#007a4e] transition-all font-bold cursor-pointer shadow-lg shadow-[#00925d]/20">
              <Play size={18} fill="currentColor" />
              <span>Watch Now</span>
            </button>
            
            <button className="bg-white/5 cursor-pointer border border-white/10 text-white px-8 h-12 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all backdrop-blur-md">
              <Bookmark size={18} />
              <span className="font-bold">Watchlist</span>
            </button>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-8 left-6 md:left-20 flex items-center gap-2.5 z-20">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full cursor-pointer ${
              index === currentIndex 
              ? "w-8 h-1.5 bg-[#00925d]" 
              : "w-2 h-1.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
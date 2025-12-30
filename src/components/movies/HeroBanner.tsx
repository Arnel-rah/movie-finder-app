import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Bookmark } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { BACKDROP_BASE_URL } from '../../api/movieService';

interface HeroBannerProps {
  movies: Movie[];
  loading: boolean;
}

const HeroBanner = ({ movies, loading }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Sélection d'un film aléatoire UNIQUEMENT au premier chargement des films
  useEffect(() => {
    if (movies.length > 0) {
      const maxRange = Math.min(movies.length, 10);
      const startRandom = Math.floor(Math.random() * maxRange);
      setCurrentIndex(startRandom);
    }
  }, [movies.length]); // Dépend uniquement de la taille du tableau initial

  // 2. Auto-play corrigé (Changement automatique toutes les 6s)
  useEffect(() => {
    if (movies.length === 0 || loading) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= Math.min(movies.length, 10) - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval); // Nettoyage important
  }, [movies, loading]);

  if (loading || movies.length === 0) {
    return <div className="h-[85vh] w-full bg-[#0a0a0a] animate-pulse" />;
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden bg-[#0a0a0a] text-white">
      
      {/* Animation de l'image de fond */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentMovie.id}
          initial={{ x: "20%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-20%", opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="w-full h-full bg-cover bg-top md:bg-center"
            style={{ backgroundImage: `url('${BACKDROP_BASE_URL}${currentMovie.backdrop_path}')` }}
          >
            {/* Gradients pour le style cinématographique */}
            <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Contenu Texte */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-20 max-w-4xl">
        <motion.div
          key={`text-${currentMovie.id}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-bold mb-6 inline-block border border-white/10 uppercase tracking-widest">
            Movie
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            {currentMovie.title}
          </h1>

          <div className="flex items-center gap-3 text-gray-400 text-xs md:text-sm mb-6 font-medium">
             <span>{currentMovie.release_date?.split('-')[0]}</span>
             <span>•</span>
             <span>2h 40m</span>
             <span>•</span>
             <span className="text-gray-300">Fantasy · Actions</span>
          </div>
          
          <p className="text-gray-300 text-sm md:text-base max-w-2xl line-clamp-3 mb-10 leading-relaxed opacity-80 italic">
            {currentMovie.overview}
          </p>

          <div className="flex items-center gap-4">
            <button className="btn btn-success bg-[#00925d] border-none text-white px-8 h-12 rounded-xl flex items-center gap-2 hover:bg-[#007a4e] transition-all hover:scale-105">
              <Play size={18} fill="currentColor" />
              <span className="font-bold">Watch Trailer</span>
            </button>
            
            <button className="btn btn-ghost bg-white/5 border border-white/10 text-white px-8 h-12 rounded-xl flex items-center gap-2 hover:bg-white/10 backdrop-blur-md transition-all">
              <Bookmark size={18} />
              <span className="font-bold">Add Watchlist</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Pagination (Points en bas à droite) */}
      <div className="absolute bottom-10 right-8 md:right-16 flex items-center gap-3 z-20">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentIndex 
              ? "w-3 h-3 bg-white scale-125 shadow-[0_0_12px_rgba(255,255,255,0.8)]" 
              : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
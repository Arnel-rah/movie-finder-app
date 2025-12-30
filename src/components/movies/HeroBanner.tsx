import { useState, useEffect } from 'react';
import { Play, Plus } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { BACKDROP_BASE_URL } from '../../api/movieService';

interface HeroBannerProps {
  movies: Movie[]; // On reçoit maintenant un tableau de films
  loading: boolean;
}

const HeroBanner = ({ movies, loading }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (movies.length === 0 || loading) return;

    // Timer pour changer de film toutes les 5 secondes
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === movies.slice(0, 5).length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval); // Nettoyage du timer
  }, [movies, loading]);

  if (loading || movies.length === 0) {
    return <div className="w-full h-[85vh] bg-black animate-pulse" />;
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden bg-black text-white">
      {/* Image de fond avec transition fluide */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url('${BACKDROP_BASE_URL}${currentMovie.backdrop_path}')`,
          opacity: 1
        }}
        key={currentMovie.id} // Aide React à identifier le changement pour l'animation
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* Contenu Texte */}
      <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-20 max-w-4xl z-10">
        <span className="text-success font-bold text-sm tracking-widest mb-2 uppercase animate-bounce">
          Featured
        </span>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight animate-fade-in">
          {currentMovie.title}
        </h1>
        
        <p className="text-gray-300 text-sm md:text-base max-w-2xl line-clamp-3 mb-8 leading-relaxed">
          {currentMovie.overview}
        </p>

        <div className="flex items-center gap-4">
          <button className="btn btn-success bg-[#00925d] border-none text-white px-8 rounded-xl flex items-center gap-2 transition-transform hover:scale-105">
            <Play size={20} fill="currentColor" />
            Watch Now
          </button>
          
          <button className="btn btn-ghost bg-white/10 border-white/20 text-white px-8 rounded-xl flex items-center gap-2 backdrop-blur-sm transition-transform hover:scale-105">
            <Plus size={20} />
            Add Playlist
          </button>
        </div>
      </div>

      {/* Indicateurs de pagination dynamiques */}
      <div className="absolute bottom-10 right-12 flex gap-3 z-20">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentIndex 
              ? "w-8 h-2 bg-success" 
              : "w-2 h-2 bg-gray-500 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
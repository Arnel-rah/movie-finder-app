import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMovies } from '../../hooks/useMovies';
import TopMovieCard from './TopMovieCard';

const TopRankingRow = () => {
  const { movies, loading } = useMovies('movie/popular');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      // Affiche la flèche gauche uniquement si on a défilé de plus de 10px
      setShowLeftArrow(scrollRef.current.scrollLeft > 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      // Défilement d'une largeur d'écran à chaque clic
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="py-8 px-6 md:px-12 lg:px-20 relative group">
      {/* Titre identique au style de MovieRow */}
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white tracking-wide">
        Popular of the week
      </h2>

      <div className="relative">
        {/* FLÈCHE GAUCHE */}
        {showLeftArrow && (
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-40 bg-black/60 hover:bg-black/90 p-2 rounded-full border border-white/10 cursor-pointer text-white transition-all backdrop-blur-md shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* CONTENEUR DE DÉFILEMENT */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.slice(0, 10).map((movie, index) => (
            <TopMovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>

        {/* FLÈCHE DROITE  */}
        <button 
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-40 bg-black/60 hover:bg-black/90 p-2 rounded-full border border-white/10 text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md shadow-lg cursor-pointer"
        >
          <ChevronRight size={24} />
        </button>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default TopRankingRow;
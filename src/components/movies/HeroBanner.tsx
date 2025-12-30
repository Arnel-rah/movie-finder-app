import { Play, Plus } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { BACKDROP_BASE_URL } from '../../api/movieService';

interface HeroBannerProps {
  movie: Movie | null;
  loading: boolean;
}

const HeroBanner = ({ movie, loading }: HeroBannerProps) => {
  // Affichage d'un squelette ou d'un écran noir pendant le chargement
  if (loading || !movie) {
    return <div className="w-full h-[85vh] bg-black animate-pulse" />;
  }

  return (
    <div className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden bg-black">
      {/* Image de fond dynamique */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url('${BACKDROP_BASE_URL}${movie.backdrop_path}')`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* Contenu Texte dynamique */}
      <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-20 max-w-4xl">
        <span className="text-success font-bold text-sm tracking-widest mb-2 uppercase">Featured</span>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
          {movie.title}
        </h1>
        
        <p className="text-gray-300 text-sm md:text-base max-w-2xl line-clamp-3 mb-8 leading-relaxed">
          {movie.overview}
        </p>

        <div className="flex items-center gap-4">
          <button className="btn btn-success bg-[#00925d] border-none text-white px-8 rounded-xl flex items-center gap-2">
            <Play size={20} fill="currentColor" />
            Watch Now
          </button>
          
          <button className="btn btn-ghost bg-white/10 border-white/20 text-white px-8 rounded-xl flex items-center gap-2 backdrop-blur-sm">
            <Plus size={20} />
            Add Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
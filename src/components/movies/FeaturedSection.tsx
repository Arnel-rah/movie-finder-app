import { Play, Bookmark, Star, ChevronRight } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genres: string[];
}

const FeaturedSection = ({ movies }: { movies: Movie[] }) => {
  // On prend le premier film pour l'affichage principal (Hero)
  const mainMovie = movies[0];
  // On prend les suivants pour le mini-carrousel à droite
  const carouselMovies = movies.slice(1, 4);

  if (!mainMovie) return null;

  return (
    <section className="relative w-full min-h-150 bg-[#0f0f0f] overflow-hidden py-12">
      {/* Background avec Clip-Path dynamique */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-700"
          style={{ 
            backgroundImage: `url(https://image.tmdb.org/t/p/original${mainMovie.backdrop_path})`,
            clipPath: "polygon(0 0, 65% 0, 45% 100%, 0% 100%)" 
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Infos du film (Data API) */}
        <div className="flex flex-col animate-in fade-in slide-in-from-left-8 duration-700">
          <h2 className="text-2xl font-black text-white mb-1">Featured in SaintStream</h2>
          <p className="text-gray-400 text-sm mb-8">Best featured for you today</p>

          <span className="text-[10px] text-[#00925d] font-bold uppercase tracking-[0.2em] mb-4">#1 in Popularity</span>
          
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight uppercase">
            {mainMovie.title}
          </h1>

          <div className="flex items-center gap-4 text-[11px] text-gray-400 mb-6 font-medium">
            <div className="flex items-center gap-1 text-[#00925d]">
              <Star size={14} fill="currentColor" />
              <span className="text-white font-bold">{mainMovie.vote_average.toFixed(1)}</span>
            </div>
            <span>{mainMovie.release_date.split('-')[0]}</span>
            {mainMovie.genres?.slice(0, 2).map(genre => (
              <span key={genre} className="bg-white/5 px-2 py-1 rounded border border-white/10 uppercase text-[9px]">
                {genre}
              </span>
            ))}
          </div>

          <p className="text-gray-400 text-xs leading-relaxed mb-8 max-w-md line-clamp-4">
            {mainMovie.overview}
          </p>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-[#00925d] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#007a4d] transition-all cursor-pointer shadow-lg shadow-[#00925d]/20">
              <Play size={18} fill="currentColor" />
              Play Now
            </button>
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all cursor-pointer">
              <Bookmark size={18} />
              Add Watchlist
            </button>
          </div>
        </div>

        {/* Carrousel Droite (Data API) */}
        <div className="relative flex items-center gap-6 h-100">
          {carouselMovies.map((movie, index) => (
            <div 
              key={movie.id}
              className={`relative shrink-0 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 cursor-pointer
                ${index === 0 
                  ? "z-20 w-64 h-95 border-2 border-[#00925d] shadow-[0_0_40px_rgba(0,146,93,0.3)]" 
                  : "z-10 w-48 h-80 opacity-40 hover:opacity-100"
                }`}
            >
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                <h4 className="text-white font-bold text-[11px] truncate">{movie.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                   <Star size={10} className="text-[#00925d]" fill="currentColor" />
                   <span className="text-[10px] text-white font-bold">{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
          
          <button className="absolute -right-4 z-30 bg-white/10 backdrop-blur-xl p-4 rounded-full border border-white/20 hover:bg-[#00925d] transition-all cursor-pointer group">
            <ChevronRight size={24} className="text-white group-hover:scale-110" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedSection;
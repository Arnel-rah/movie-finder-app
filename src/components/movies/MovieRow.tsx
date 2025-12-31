import { useMovies } from '../../hooks/useMovies';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  endpoint: string;
}

const MovieRow = ({ title, endpoint }: MovieRowProps) => {
  const { movies, loading } = useMovies(endpoint);

  if (loading) {
    return (
      <div className="py-8 px-6 md:px-12 lg:px-20">
        <div className="h-8 w-48 bg-white/10 animate-pulse rounded-lg mb-6" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="min-w-40 md:min-w-50 aspect-2/3 bg-white/5 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6 md:px-12 lg:px-20">
      {/* Titre de la section */}
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white tracking-wide">
        {title}
      </h2>

      <div 
        className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
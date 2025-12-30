import { IMAGE_BASE_URL } from '../../api/movieService';
import { useMovies } from '../../hooks/useMovies';

const MovieRow = ({ title, endpoint }: { title: string, endpoint: string }) => {
  const { movies, loading } = useMovies(endpoint);

  if (loading) return <span className="loading loading-dots loading-lg"></span>;

  return (
    <div className="py-8 px-12">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-50 hover:scale-105 transition-transform cursor-pointer">
            <img 
              src={`${IMAGE_BASE_URL}${movie.poster_path}`} 
              alt={movie.title}
              className="rounded-xl shadow-lg"
            />
            <p className="mt-2 text-sm font-semibold truncate text-white">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRow
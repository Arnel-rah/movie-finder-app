import { useMovies } from '../../hooks/useMovies';
import TopMovieCard from './TopMovieCard';

const TopRankingRow = () => {
  const { movies, loading } = useMovies('movie/popular'); 
  console.log("Mes films populaires :", movies);

  if (loading) return <div className="px-20 py-10 text-white">Chargement du Top 10...</div>;

  if (!movies || movies.length === 0) {
    return <div className="px-20 py-10 text-red-500">Aucun film populaire trouvé.</div>;
  }

  return (
    <div className="py-12 px-6 md:px-12 lg:px-20">
      <h2 className="text-xl md:text-2xl font-bold mb-8 text-white">Popular of the week</h2>
      <div 
        className="flex gap-8 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.slice(0, 10).map((movie, index) => (
          <TopMovieCard key={movie.id} movie={movie} index={index} />
        ))}
      </div>
    </div>
  );
};

export default TopRankingRow;
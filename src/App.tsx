import { useMovies } from "./hooks/useMovies";
import Navbar from "./components/layout/Navbar";
import HeroBanner from "./components/movies/HeroBanner";
import MovieRow from "./components/movies/MovieRow";

function App() {
  // Récupère les films Tendance de la semaine (très varié)
  const { movies: trendingMovies, loading: heroLoading } = useMovies("/trending/movie/week");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main>
        <HeroBanner 
          movies={trendingMovies} 
          loading={heroLoading} 
        />
        
        <MovieRow title="Just Release" endpoint="/movie/now_playing" />
        <MovieRow title="Popular" endpoint="/movie/popular" />
      </main>
    </div>
  );
}

export default App;
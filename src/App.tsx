import { useMovies } from "./hooks/useMovies";
import Navbar from "./components/layout/Navbar";
import HeroBanner from "./components/movies/HeroBanner";
import MovieRow from "./components/movies/MovieRow";

function App() {
  const { movies: trendingMovies, loading: heroLoading } = useMovies("/trending/movie/week");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main>
        {/* On passe le tableau entier movies au lieu d'un seul film */}
        <HeroBanner 
          movies={trendingMovies} 
          loading={heroLoading} 
        />
        
        <MovieRow title="Just Release" endpoint="/movie/now_playing" />
        <MovieRow title="Popular of the week" endpoint="/movie/popular" />
      </main>
    </div>
  );
}

export default App;
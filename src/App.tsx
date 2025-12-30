import { useMovies } from "./hooks/useMovies";
import Navbar from "./components/layout/Navbar";
import HeroBanner from "./components/movies/HeroBanner";
import MovieRow from "./components/movies/MovieRow";

function App() {
  // On récupère les films tendance pour le Hero
  const { movies: trendingMovies, loading: heroLoading } = useMovies("/trending/movie/week");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className="pb-20">
        {/* On passe le premier film de la liste au HeroBanner */}
        <HeroBanner 
          movie={trendingMovies[0] || null} 
          loading={heroLoading} 
        />
        
        <MovieRow title="Just Release" endpoint="/movie/now_playing" />
        <MovieRow title="Popular of the week" endpoint="/movie/popular" />
      </main>
    </div>
  );
}

export default App;
import Navbar from "./components/layout/Navbar";
import HeroBanner from "./components/movies/HeroBanner";
import BrandLogos from "./components/brands/BrandLogos"; // Importation
import MovieRow from "./components/movies/MovieRow";
import { useMovies } from "./hooks/useMovies";

function App() {
  const { movies: trendingMovies, loading: heroLoading } = useMovies(
    "/trending/movie/week"
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main>
        <HeroBanner movies={trendingMovies} loading={heroLoading} />
        <BrandLogos />
        <div className="flex flex-col gap-8 pb-20">
          <MovieRow title="Just Release" endpoint="/movie/now_playing" />
          <MovieRow title="Popular" endpoint="/movie/popular" />
        </div>
      </main>
    </div>
  );
}

export default App;

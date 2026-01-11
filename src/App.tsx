import Navbar from "./components/layout/Navbar";
import HeroBanner from "./components/movies/HeroBanner";
import BrandLogos from "./components/brands/BrandLogos";
import MovieRow from "./components/movies/MovieRow";
import { useMovies } from "./hooks/useMovies";
import TopRankingRow from "./components/movies/TopRankingRow";
import MovieBot from "./components/MovieBot";

function App() {
    console.log("Teste de CI")
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
          <TopRankingRow />
        </div>
      </main>
      <MovieBot/>
    </div>
  );
}

export default App;

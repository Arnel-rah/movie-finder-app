import Navbar from "./components/layout/Navbar";
import HeroBanner from "./components/movies/HeroBanner";
import MovieRow from "./components/movies/MovieRow";

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className="pb-20"> {/* Padding bottom pour ne pas coller au bas de page */}
        <HeroBanner />
        
        {/* Section: Just Released (Films à l'affiche) */}
        <MovieRow 
          title="Just Release" 
          endpoint="/movie/now_playing" 
        />

        {/* Section: Popular of the week */}
        <MovieRow 
          title="Popular of the week" 
          endpoint="/movie/popular" 
        />

        {/* Section: Top Rated */}
        <MovieRow 
          title="Top Rated" 
          endpoint="/movie/top_rated" 
        />
      </main>
    </div>
  );
}

export default App;
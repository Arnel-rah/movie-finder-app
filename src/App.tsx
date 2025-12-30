import Navbar from "./components/layout/Navbar";
import HeroBanner from "./components/movies/HeroBanner";

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main>
        <HeroBanner />
      </main>
    </div>
  );
}

export default App;
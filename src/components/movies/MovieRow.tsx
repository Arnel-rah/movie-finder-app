import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMovies } from "../../hooks/useMovies";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  endpoint: string;
}

const MovieRow = ({ title, endpoint }: MovieRowProps) => {
  const { movies, loading } = useMovies(endpoint);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading)
    return (
      <div className="h-64 flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="py-8 px-6 md:px-12 lg:px-20 relative group">
      {/* Titre */}
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white tracking-wide">
        {title}
      </h2>

      <div className="relative">
        {/* GAUCHE */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 p-2 rounded-full border border-white/10 text-white transition-all backdrop-blur-md z-40"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/*  DROITE */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/90 p-2 rounded-full border border-white/10 text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md shadow-lg"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default MovieRow;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Play, Film } from "lucide-react";
import { BACKDROP_BASE_URL } from "../api/movieService";
import type { Movie } from "../types/movie";
import { supabase } from "../api/supabaseClient";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionAndWatchlist = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentId = session?.user?.id ?? null;
      setUserId(currentId);

      const key = currentId ? `watchlist_${currentId}` : "watchlist_guest";
      const saved = localStorage.getItem(key);
      if (saved) {
        setWatchlist(JSON.parse(saved));
      } else {
        setWatchlist([]);
      }
    };

    fetchSessionAndWatchlist();
  }, []);

  const removeFromWatchlist = (id: number) => {
    const key = userId ? `watchlist_${userId}` : "watchlist_guest";
    const updated = watchlist.filter((movie) => movie.id !== id);
    setWatchlist(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-6 md:px-16 pb-20">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Ma Watchlist</h1>
        <p className="text-gray-400">
          {userId 
            ? `Connecté : ${watchlist.length} films enregistrés` 
            : `Mode invité : ${watchlist.length} films (locaux)`}
        </p>
      </header>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
          <Film size={64} className="mb-4 opacity-20" />
          <p className="text-xl">Votre liste est vide pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {watchlist.map((movie) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative bg-[#141414] rounded-2xl overflow-hidden border border-white/5 hover:border-[#00925d]/50 transition-all shadow-xl"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={`${BACKDROP_BASE_URL}${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="p-3 bg-[#00925d] rounded-full hover:scale-110 transition-transform cursor-pointer">
                      <Play size={20} fill="white" />
                    </button>
                    <button 
                      onClick={() => removeFromWatchlist(movie.id)}
                      className="p-3 bg-red-500/80 rounded-full hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg truncate mb-1">{movie.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{movie.release_date?.split("-")[0]}</span>
                    <span className="text-[#00925d] font-semibold">{movie.vote_average.toFixed(1)} ★</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
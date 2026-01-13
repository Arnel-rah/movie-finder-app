const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";
export const POSTER_URL = "https://image.tmdb.org/t/p/w500";

export const fetchMovies = async (endpoint: string) => {
  try {
    if (!BASE_URL || !API_KEY) return [];
    const baseUrlClean = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const endpointClean = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${baseUrlClean}/${endpointClean}?api_key=${API_KEY}&language=en-US`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Erreur API ${response.status} sur ${url}`);
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Erreur fetch:", error);
    return [];
  }
};

export const getMovieVideos = async (movieId: number) => {
  try {
    if (!BASE_URL || !API_KEY) return null;
    const baseUrlClean = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const url = `${baseUrlClean}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    
    const trailer = data.results?.find(
      (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
    );

    return trailer || null;
  } catch (error) {
    console.error("Erreur videos fetch:", error);
    return null;
  }
};
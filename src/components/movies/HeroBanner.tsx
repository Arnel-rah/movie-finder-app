import { Play, Plus } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden bg-black">
      {/* 1. Image de fond avec Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{ 
          backgroundImage: `url('https://images.alphacoders.com/669/669171.jpg')`, // Remplace par ton image
        }}
      >
        {/* Dégradé progressif : du transparent en haut vers le noir profond en bas */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* 2. Contenu Texte */}
      <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-20 max-w-4xl">
        <span className="text-success font-bold text-sm tracking-widest mb-2 uppercase">Sci-Fi</span>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
          Star Wars: The <span className="text-white/90">Force Awakens</span>
        </h1>
        
        <p className="text-gray-300 text-sm md:text-base max-w-2xl line-clamp-3 mb-8 leading-relaxed">
          The third installment of the Star Wars sequel trilogy, it follows the Resistance's search 
          for Luke Skywalker and their fight against the First Order. As the galaxy faces a new threat, 
          heroes must rise to protect the light.
        </p>

        {/* 3. Boutons d'action */}
        <div className="flex items-center gap-4">
          <button className="btn btn-success bg-[#00925d] border-none text-white px-8 rounded-xl flex items-center gap-2 hover:scale-105 transition-all">
            <Play size={20} fill="currentColor" />
            Watch Now
          </button>
          
          <button className="btn btn-ghost bg-white/10 border-white/20 text-white px-8 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all backdrop-blur-sm">
            <Plus size={20} />
            Add Playlist
          </button>
        </div>
      </div>

      {/* Indicateurs de pagination (les petits points en bas à droite) */}
      <div className="absolute bottom-10 right-12 flex gap-2">
        <div className="w-8 h-1.5 bg-success rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default HeroBanner;
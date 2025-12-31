import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const brands = [
  { name: 'Disney', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
  { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { name: 'HBO Max', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/HBO_Max_Logo.svg' },
  { name: 'Pixar', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Pixar_Logo.svg' },
  { name: 'Marvel', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg' },
  { name: 'Star Wars', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Star_Wars_Logo.svg' },
  { name: 'Nat Geo', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/National_Geographic_logo.svg/1280px-National_Geographic_logo.svg.png' },
];

const BrandLogos = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="px-6 md:px-12 lg:px-20 py-8">
      <div className="relative group">
        
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 flex items-center z-50">
            <button 
              onClick={() => scroll('left')}
              className="-translate-x-1/2 bg-[#1a1a1a] p-2 md:p-3 rounded-full border border-white/20 text-white shadow-xl hover:bg-[#2a2a2a] transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
        )}

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="shrink-0 w-36 h-20 md:w-48 md:h-28 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-6 cursor-pointer hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="w-full h-full object-contain brightness-200" 
              />
            </motion.div>
          ))}
        </div>

        <div className="absolute right-0 top-0 bottom-0 flex items-center z-50">
          <button 
            onClick={() => scroll('right')}
            className="translate-x-1/2 bg-[#1a1a1a] p-2 md:p-3 rounded-full border border-white/20 text-white shadow-xl hover:bg-[#2a2a2a] transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default BrandLogos;
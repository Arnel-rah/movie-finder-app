import { Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar fixed top-0 z-50 bg-transparent px-6 py-4 flex items-center justify-between w-full">
      {/* 1. LOGO (Image) */}
      <div className="flex-none">
        <img 
          src="/path-to-your-logo/logo.png" 
          alt="SaintStream Logo" 
          className="h-8 md:h-10 object-contain cursor-pointer" 
        />
      </div>

      {/* 2. LIENS CENTRÉS */}
      <div className="hidden lg:flex flex-1 justify-center">
        <ul className="flex items-center gap-8 text-sm font-semibold text-gray-300">
          <li className="text-white border-b-2 border-transparent hover:border-white cursor-pointer transition-all">Home</li>
          <li className="hover:text-white cursor-pointer transition-all">Discover</li>
          <li className="hover:text-white cursor-pointer transition-all">Movie Release</li>
          <li className="hover:text-white cursor-pointer transition-all">Forum</li>
          <li className="hover:text-white cursor-pointer transition-all">About</li>
        </ul>
      </div>

      {/* 3. RECHERCHE & AUTH */}
      <div className="flex items-center gap-6">
        <button className="text-white hover:scale-110 transition-transform">
          <Search size={22} strokeWidth={2.5} />
        </button>
        
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost border-white/40 text-white hover:bg-white/10 px-6 rounded-xl normal-case">
            Sign up
          </button>
          <button className="btn btn-success bg-[#00925d] border-none text-white px-8 rounded-xl normal-case">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
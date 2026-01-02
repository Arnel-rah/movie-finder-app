import { useState, useEffect, useRef } from "react";
import { Search, Bell, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { supabase } from "../../api/supabaseClient";
import logo from "../../assets/logo.png";
import LoginModal from "../auth/LoginModal";
import SignUpModal from "../auth/SignUpModal";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour le menu
  const menuRef = useRef<HTMLDivElement>(null); // Pour détecter le clic extérieur

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Fermer le menu si on clique ailleurs
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar fixed top-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between w-full border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer">
          <img src={logo} alt="Logo" className="h-10 object-contain" />
          <span className="text-white text-xl font-bold tracking-tight">SaintStream</span>
        </div>
        <div className="hidden lg:flex gap-8 text-gray-400 font-medium text-sm">
          {["Home", "Discover", "Movie Release", "Forum", "About"].map((item) => (
            <button key={item} className="hover:text-white transition-colors cursor-pointer">{item}</button>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <button className="text-white hover:text-[#00925d] transition cursor-pointer">
            <Search size={20} />
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-[#00925d] transition cursor-pointer">
                <Bell size={20} />
              </button>
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex items-center gap-2 p-1 pr-3 rounded-full transition-all border ${
                    isMenuOpen ? "bg-white/10 border-white/20" : "bg-white/5 border-transparent hover:bg-white/10"
                  } cursor-pointer`}
                >
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.user_metadata?.display_name || 'Felix'}`} 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full border border-[#00925d]"
                  />
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-[#161616] border border-white/10 rounded-2xl shadow-2xl p-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Compte</p>
                        <p className="text-sm text-white font-bold truncate">
                          {user.user_metadata?.display_name || user.email}
                        </p>
                      </div>
                      
                      <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition cursor-pointer">
                        <User size={16} className="text-[#00925d]" />
                        Profil
                      </button>
                      
                      <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition cursor-pointer">
                        <Settings size={16} />
                        Settings
                      </button>

                      <div className="h-px bg-white/5 my-1" />

                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition cursor-pointer font-bold"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSignUpOpen(true)}
                className="text-white text-sm font-medium px-5 py-2 hover:text-[#00925d] transition cursor-pointer"
              >
                Sign up
              </button>
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="bg-[#00925d] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#007a4d] transition shadow-lg shadow-[#00925d]/20 cursor-pointer text-sm"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onSwitchToSignUp={() => { setIsLoginOpen(false); setIsSignUpOpen(true); }}
      />
      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={() => setIsSignUpOpen(false)} 
        onSwitchToLogin={() => { setIsSignUpOpen(false); setIsLoginOpen(true); }}
      />
    </>
  );
};

export default Navbar;
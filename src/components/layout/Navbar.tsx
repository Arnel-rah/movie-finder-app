import { useState, useEffect } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { supabase } from "../../api/supabaseClient";
import logo from "../../assets/logo.png";
import LoginModal from "../auth/LoginModal";
import SignUpModal from "../auth/SignUpModal";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <nav className="navbar fixed top-0 z-50 bg-transparent px-6 py-4 flex items-center justify-between w-full">
        <div className="flex items-center gap-2 cursor-pointer">
          <img src={logo} alt="Logo" className="h-10 md:h-12 object-contain" />
          <span className="text-white text-xl font-bold">SaintStream</span>
        </div>
        <div className="hidden lg:flex gap-8 text-gray-300 font-medium">
          <button className="text-white cursor-pointer">Home</button>
          <button className="hover:text-white transition cursor-pointer">Discover</button>
          <button className="hover:text-white transition cursor-pointer">Movie Release</button>
          <button className="hover:text-white transition cursor-pointer">Forum</button>
          <button className="hover:text-white transition cursor-pointer">About</button>
        </div>
        <div className="flex items-center gap-5">
          <button className="text-white hover:scale-110 transition cursor-pointer">
            <Search size={22} />
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-[#00925d] transition cursor-pointer">
                <Bell size={22} />
              </button>
              <div className="group relative flex items-center gap-2 cursor-pointer">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="Profile" 
                  className="h-10 w-10 rounded-full border-2 border-[#00925d]"
                />
                <ChevronDown size={16} className="text-gray-400" />
                <div className="absolute right-0 top-12 hidden group-hover:block bg-[#1a1a1a] border border-white/10 rounded-xl p-2 min-w-37.5">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/5 rounded-lg transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSignUpOpen(true)}
                className="text-white px-5 py-2 rounded-xl border border-white/20 hover:bg-white/5 transition"
              >
                Sign up
              </button>
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="bg-[#00925d] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#007a4d] transition"
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
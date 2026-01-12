import { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "../../api/supabaseClient";
import logo from "../../assets/logo.png";
import LoginModal from "../auth/LoginModal";
import SignUpModal from "../auth/SignUpModal";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = ["Home", "Discover", "Movie Release", "Forum", "About"];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

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
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-lg px-4 md:px-8 py-4 flex items-center justify-between w-full border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer shrink-0">
          <img src={logo} alt="Logo" className="h-8 md:h-10 object-contain" />
          <span className="text-white text-lg md:text-xl font-bold tracking-tight">
            SaintStream
          </span>
        </div>{" "}
        <div className="hidden lg:flex gap-8 text-gray-400 font-medium text-sm">
          {navItems.map((item) => (
            <button
              key={item}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 md:gap-5">
          <button className="text-white hover:text-[#00925d] transition cursor-pointer p-2">
            <Search size={20} />
          </button>

          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <button className="hidden sm:block text-white hover:text-[#00925d] transition cursor-pointer p-2">
                <Bell size={20} />
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex items-center gap-2 p-1 pr-2 md:pr-3 rounded-full transition-all border ${
                    isMenuOpen
                      ? "bg-white/10 border-white/20"
                      : "bg-white/5 border-transparent hover:bg-white/10"
                  } cursor-pointer`}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                      user.user_metadata?.display_name || "Felix"
                    }`}
                    alt="Profile"
                    className="h-7 w-7 md:h-8 md:w-8 rounded-full border border-[#00925d]"
                  />
                  <ChevronDown
                    size={14}
                    className={`hidden md:block text-gray-400 transition-transform duration-300 ${
                      isMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 animate-in fade-in zoom-in-95 duration-200 hidden lg:block">
                    <div className="bg-[#161616] border border-white/10 rounded-2xl shadow-2xl p-2">
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                          Compte
                        </p>
                        <p className="text-sm text-white font-bold truncate">
                          {user.user_metadata?.display_name || user.email}
                        </p>
                      </div>
                      <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition cursor-pointer">
                        <User size={16} className="text-[#00925d]" /> Profil
                      </button>
                      <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition cursor-pointer">
                        <Settings size={16} /> Settings
                      </button>
                      <div className="h-px bg-white/5 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition cursor-pointer font-bold"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setIsSignUpOpen(true)}
                className="text-white text-sm font-medium px-4 py-2 hover:text-[#00925d] transition cursor-pointer"
              >
                Sign up
              </button>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-[#00925d] text-white px-5 py-2 rounded-xl font-bold hover:bg-[#007a4d] transition shadow-lg shadow-[#00925d]/20 cursor-pointer text-sm"
              >
                Login
              </button>
            </div>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-49 lg:hidden animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-70 bg-[#0f0f0f] border-l border-white/5 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <button
                  key={item}
                  className="text-left text-lg font-semibold text-gray-300 hover:text-[#00925d] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-white/5">
              {!user ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setIsLoginOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-[#00925d] text-white py-3 rounded-xl font-bold"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsSignUpOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-white/5 text-white py-3 rounded-xl font-bold border border-white/10"
                  >
                    Sign up
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full py-3 text-red-500 font-bold"
                >
                  <LogOut size={20} /> Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignUp={() => {
          setIsLoginOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
};

export default Navbar;

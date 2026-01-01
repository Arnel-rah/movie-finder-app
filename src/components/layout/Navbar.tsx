import { useState } from "react";
import { Search } from "lucide-react";
import logo from "../../assets/logo.png";
import LoginModal from "../auth/LoginModal";
import SignUpModal from "../auth/SignUpModal";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <>
      <nav className="navbar fixed top-0 z-50 bg-transparent px-6 py-4 flex items-center justify-between w-full">
        <div className="flex items-center gap-2 group cursor-pointer">
          <img
            src={logo}
            alt="SaintStream Logo"
            className="h-15 md:h-20 object-contain"
          />
          <span className="text-white text-xl md:text-2xl tracking-tight font-sans">
            Saint<span>Stream</span>
          </span>
        </div>

        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center gap-8 text-[16px] font-semibold text-gray-300">
            <li className="text-white border-b-2 border-transparent cursor-pointer transition-all">
              Home
            </li>
            <li className="hover:text-white cursor-pointer transition-all">
              Discover
            </li>
            <li className="hover:text-white cursor-pointer transition-all">
              Movie Release
            </li>
            <li className="hover:text-white cursor-pointer transition-all">
              Forum
            </li>
            <li className="hover:text-white cursor-pointer transition-all">
              About
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-white transition-transform cursor-pointer">
            <Search size={22} strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSignUpOpen(true)}
              className="btn border-white text-white bg-transparent px-6 rounded-xl normal-case"
            >
              Sign up
            </button>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="btn bg-[#00925d] border-none text-white px-8 rounded-xl normal-case"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

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
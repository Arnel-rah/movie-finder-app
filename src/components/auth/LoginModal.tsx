import { useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import {  Eye, EyeOff } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onSwitchToSignUp }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSwitchToSignUp: () => void 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const isFormValid = email.trim() !== '' && password.length >= 6;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      onClose();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-4xl border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl font-sans">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="bg-[#00925d]/20 text-[#00925d] p-1 rounded-lg text-base font-black">SS</span> SaintStream
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Welcome back to the stream</p>
          </div>
          <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10 transition-all cursor-pointer">
            Close
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[11px]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-white">Email</label>
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="w-full rounded-xl border border-white/20 bg-transparent p-3 text-sm text-white outline-none focus:border-[#00925d]/50 transition-all" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-white">Password</label>
              <button type="button" className="text-[10px] text-[#00925d] hover:underline">Forgot?</button>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full rounded-xl border border-white/20 bg-transparent p-3 text-sm text-white outline-none focus:border-[#00925d]/50 transition-all" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full rounded-xl py-3 font-bold transition-all mt-2 text-sm
              ${isFormValid 
                ? "bg-[#00925d] text-white cursor-pointer hover:bg-[#007a4d]" 
                : "bg-white/10 text-gray-500 cursor-not-allowed opacity-50"
              }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Don't have an account?{" "}
          <button onClick={onSwitchToSignUp} className="text-white font-bold hover:underline cursor-pointer">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
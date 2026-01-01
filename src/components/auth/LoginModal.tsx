import { useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import { X, Eye, EyeOff } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
    else onClose();
    
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0f0f0f] p-8 shadow-2xl">
        {/* Header du formulaire */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00925d]">SS</span> SaintStream
            </h2>
            <p className="text-sm text-gray-400 mt-1">Login to your account</p>
          </div>
          <button onClick={onClose} className="rounded-xl bg-white/5 p-2 text-gray-400 hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-[#00925d]/50 focus:bg-white/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-[#00925d]/50 focus:bg-white/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="text-xs text-gray-400 hover:text-white transition-colors block text-center w-full">
            Forgot Password
          </button>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white p-3 font-bold text-black transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? "Connecting..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Don't have an account? <span className="text-white cursor-pointer font-bold">Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
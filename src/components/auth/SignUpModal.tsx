import { useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import { X, Eye, EyeOff } from 'lucide-react';

const SignUpModal = ({ isOpen, onClose, onSwitchToLogin }: { 
  isOpen: boolean, 
  onClose: () => void,
  onSwitchToLogin: () => void 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: username }
      }
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Success! Check your email for verification (or login if email confirmation is disabled).");
      onClose();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-4xl border border-white/10 bg-[#0f0f0f] p-8 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00925d]">SS</span> SaintStream
            </h2>
            <p className="text-sm text-gray-400 mt-1">Register to enjoy the features</p>
          </div>
          <button onClick={onClose} className="rounded-xl bg-white/5 p-2 text-gray-400 hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-[#00925d]/50"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-[#00925d]/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-[#00925d]/50"
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

          <div className="flex items-start gap-2 pt-2">
            <input type="checkbox" className="mt-1 accent-[#00925d]" required id="terms" />
            <label htmlFor="terms" className="text-xs text-gray-400">
              I agree to our <span className="text-white underline">Privacy Policy</span> and <span className="text-white underline">Terms & Conditions</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-bold text-black transition-all hover:bg-gray-200 disabled:opacity-50 mt-4"
          >
            {loading ? "Creating account..." : "Continue"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="text-white font-bold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpModal;
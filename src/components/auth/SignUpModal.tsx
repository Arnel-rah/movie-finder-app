import { useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import {  Eye, EyeOff, Check } from 'lucide-react';

const SignUpModal = ({ isOpen, onClose, onSwitchToLogin }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSwitchToLogin: () => void 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isFormValid = email && password && confirmPassword && username && isChecked;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please check again.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: username },
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Registration successful! Check your email.");
      onClose();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-4xl border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl font-sans">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="bg-[#00925d]/20 text-[#00925d] p-1 rounded-lg text-base font-black">SS</span> SaintStream
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Register to enjoy the features</p>
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

        <form onSubmit={handleSignUp} className="space-y-3">
          {/* Inputs */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-white">Username</label>
            <input type="text" placeholder="Username" className="w-full rounded-xl border border-white/20 bg-transparent p-3 text-sm text-white outline-none focus:border-[#00925d]/50" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-white">Email</label>
            <input type="email" placeholder="Email" className="w-full rounded-xl border border-white/20 bg-transparent p-3 text-sm text-white outline-none focus:border-[#00925d]/50" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-white">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full rounded-xl border border-white/20 bg-transparent p-3 text-sm text-white outline-none focus:border-[#00925d]/50" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-white">Confirm Password</label>
            <input type={showPassword ? "text" : "password"} placeholder="Confirm password" className="w-full rounded-xl border border-white/20 bg-transparent p-3 text-sm text-white outline-none focus:border-[#00925d]/50" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-3 pt-1">
            <div 
              onClick={() => setIsChecked(!isChecked)}
              className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 transition-all ${
                isChecked ? "border-[#00925d] bg-[#00925d]" : "border-white/20 bg-transparent"
              }`}
            >
              {isChecked && <Check size={12} className="text-white stroke-[4px]" />}
            </div>
            <label className="text-[11px] text-gray-400 select-none cursor-pointer" onClick={() => setIsChecked(!isChecked)}>
              I agree to our <span className="text-white font-bold">Privacy Policy</span> and <span className="text-white font-bold">Terms & Conditions</span>
            </label>
          </div>

          {/* Bouton Dynamique */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full rounded-xl py-3 font-bold transition-all mt-2 text-sm
              ${isFormValid 
                ? "bg-[#00925d] text-white cursor-pointer hover:bg-[#007a4d]" 
                : "bg-white/10 text-gray-500 cursor-not-allowed opacity-50"
              }`}
          >
            {loading ? "Creating account..." : "Continue"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="text-white font-bold hover:underline cursor-pointer">Login</button>
        </p>
      </div>
    </div>
  );
};

export default SignUpModal;
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Mail, Lock, Feather, KeyRound } from 'lucide-react';
import { signUpUser, signInUser } from '../lib/firebase';

interface AuthViewProps {
  onAuthSuccess: (userProfile: any) => void;
}

export default function AuthView({ onAuthSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please ink all required fields.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const profile = await signInUser(email, password);
        onAuthSuccess(profile);
      } else {
        const { profile } = await signUpUser(email, password);
        onAuthSuccess(profile);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while blending your pigments.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-md mx-auto relative select-none">
      
      <div className="w-full bg-white border border-[#CBD5E1] shadow-lg rounded-3xl p-6 sm:p-8 relative">
        
        {/* Soft Grid paper texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none rounded-3xl" />

        {/* Visual Brand Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="w-16 h-16 bg-[#8daa91]/10 rounded-full flex items-center justify-center mx-auto border border-[#8daa91]/20 relative rotate-[3deg] shadow-inner">
            <Feather className="w-8 h-8 text-[#8daa91] animate-pulse" />
          </div>
          <h2 className="text-2xl font-serif font-black text-[#2D3748] mt-4 tracking-tight">
            {isLogin ? 'Open Your Journal' : 'Create New Sketchbook'}
          </h2>
          <p className="text-xs text-[#64748B] font-serif italic mt-1">
            {isLogin ? 'Welcome back, enter your circle.' : 'Embark on a 28-day cozy drawing ritual.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-serif italic relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#64748B] tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="painter@sketch.com"
                className="w-full pl-9 pr-3 py-2 text-xs font-serif bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8daa91] focus:border-[#8daa91] text-[#2D3748]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#64748B] tracking-wider mb-1">
              Secret Passkey
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs font-serif bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8daa91] focus:border-[#8daa91] text-[#2D3748]"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-2xs font-serif text-[#64748B]">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded-md border-[#CBD5E1] text-[#8daa91] focus:ring-[#8daa91]"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => {
                alert('Reset passkey requested! A warm pigeon with reset guides will land in your mailbox shortly.');
              }}
              className="hover:text-[#8daa91] underline transition-colors cursor-pointer"
            >
              Forgot passphrase?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#8daa91] hover:bg-[#7ba180] disabled:bg-[#CBD5E1] text-white font-serif font-bold text-xs shadow-[2px_2px_0_rgba(141,170,145,0.2)] hover:shadow-none translate-y-[-1px] active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            {loading ? (
              <span>Polishing the nib...</span>
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Open Notebook</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Begin Adventure</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#CBD5E1]/60 text-center relative z-10">
          <p className="text-2xs font-serif text-[#64748B]">
            {isLogin ? "New to the studio?" : "Already hold a passphrase?"}
            <button
              onClick={() => {
                setError('');
                setIsLogin(!isLogin);
              }}
              className="ml-1 text-[#8daa91] font-bold hover:underline transition-colors cursor-pointer"
            >
              {isLogin ? 'Enroll as InkLinker' : 'Return to front desk'}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-[10px] text-[#94A3B8] font-mono tracking-widest uppercase">
        <span>Handcrafted Studio — InkLink v1.2</span>
      </div>
    </div>
  );
}

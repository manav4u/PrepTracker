import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Hexagon, Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface AuthProps {
  onSession: (session: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onSession }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) onSession(data.session);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          onSession(data.session);
        } else {
          setError('Verification email sent! Please check your inbox.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E11D48] opacity-[0.05] blur-[150px] rounded-full pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600 opacity-[0.05] blur-[150px] rounded-full pointer-events-none -z-10 -translate-x-1/4 translate-y-1/4"></div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-[#E11D48] mb-6 shadow-2xl">
            <Hexagon size={40} strokeWidth={2.5} className="fill-[#E11D48]/10" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tighter mb-2">PrepTracker <span className="text-slate-500">Cloud</span></h1>
          <p className="text-slate-500 text-sm uppercase tracking-[0.3em] font-mono">Sync Your Progress Anywhere</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          {/* Tabs */}
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isLogin ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${!isLogin ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#E11D48] transition-colors" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-[#E11D48] focus:bg-white/[0.08] outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#E11D48] transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-[#E11D48] focus:bg-white/[0.08] outline-none transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest ml-2">Security Key</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#E11D48] transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-[#E11D48] focus:bg-white/[0.08] outline-none transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400 leading-relaxed font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#E11D48] hover:bg-[#be123c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(225,29,72,0.3)] hover:shadow-[0_0_40px_rgba(225,29,72,0.5)] active:scale-95 group"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : (
                <>
                  {isLogin ? 'Access Account' : 'Initialize Profile'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Background noise texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        </div>

        <p className="mt-12 text-center text-[10px] text-slate-600 uppercase tracking-[0.3em] font-mono">
            &copy; 2024 PREPTRACKER INFRASTRUCTURE
        </p>
      </div>
    </div>
  );
};

export default Auth;

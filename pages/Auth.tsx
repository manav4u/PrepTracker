import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Hexagon, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface AuthProps {
  onSession: (session: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onSession }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
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

          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm leading-relaxed">Sign in to access your dashboard, track progress, and sync your study data across devices.</p>
          </div>

          <div className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400 leading-relaxed font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-5 bg-white hover:bg-slate-200 text-black font-bold uppercase tracking-[0.1em] rounded-2xl transition-all flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin text-black" />
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform opacity-50" />
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-slate-600 uppercase tracking-widest font-mono pt-4">
              Secure authentication powered by Google Cloud
            </p>
          </div>

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

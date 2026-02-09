import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Hexagon, ArrowRight, Loader2, AlertCircle, ShieldCheck, Zap } from 'lucide-react';

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
          redirectTo: window.location.origin + window.location.pathname,
          queryParams: {
            access_type: 'offline',
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
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">

      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E11D48] opacity-[0.03] blur-[150px] rounded-full translate-x-1/4 -translate-y-1/4 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600 opacity-[0.03] blur-[150px] rounded-full -translate-x-1/4 translate-y-1/4 animate-[pulse_4s_ease-in-out_infinite]"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700 slide-in-from-bottom-8">

        {/* Header Section */}
        <div className="text-center mb-12">
            <div className="relative inline-block mb-8 group cursor-default">
                <div className="absolute inset-0 bg-[#E11D48] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="w-24 h-24 bg-[#0a0a0a] border border-white/10 rounded-3xl flex items-center justify-center text-[#E11D48] relative z-10 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                    <Hexagon size={48} strokeWidth={1.5} className="fill-[#E11D48]/5 group-hover:fill-[#E11D48]/10 transition-colors" />
                    <div className="absolute inset-0 border border-white/5 rounded-3xl"></div>
                </div>

                {/* Orbital Decor */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#E11D48] rounded-full blur-[2px] animate-ping"></div>
            </div>

            <h1 className="text-5xl font-display font-bold tracking-tighter mb-3 text-white">
                PrepTracker <span className="text-[#E11D48]">Pro</span>
            </h1>
            <div className="flex items-center justify-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">
                <span className="flex items-center gap-1"><ShieldCheck size={10} /> Secure</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span className="flex items-center gap-1"><Zap size={10} /> Fast</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span>Cloud Sync</span>
            </div>
        </div>

        {/* Auth Card */}
        <div className="backdrop-blur-xl bg-[#0a0a0a]/80 border border-white/10 p-1 rounded-[2.5rem] shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[2.5rem] pointer-events-none"></div>

            <div className="bg-[#050505] rounded-[2.2rem] p-8 relative overflow-hidden">

                <div className="text-center mb-10">
                    <h2 className="text-lg font-bold text-white mb-2">Identify Yourself</h2>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">
                        Authenticate with your Google account to synchronize your academic matrix.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-red-400 leading-relaxed font-bold uppercase tracking-wide">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="group relative w-full py-5 bg-white hover:bg-slate-200 disabled:opacity-70 disabled:cursor-not-allowed text-black font-bold uppercase tracking-[0.1em] rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] active:scale-[0.98] overflow-hidden"
                >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent z-10"></div>

                    {loading ? (
                        <Loader2 size={24} className="animate-spin text-black relative z-20" />
                    ) : (
                        <>
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center relative z-20">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                            </div>
                            <span className="relative z-20">Continue with Google</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform opacity-50 relative z-20" />
                        </>
                    )}
                </button>

                <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                     <p className="text-[9px] font-mono uppercase tracking-widest text-white">Powered by Google Cloud Identity</p>
                </div>
            </div>
        </div>

        <p className="mt-12 text-center text-[9px] text-slate-600 uppercase tracking-[0.3em] font-mono">
            PrepTracker Infrastructure &copy; 2024
        </p>
      </div>
    </div>
  );
};

export default Auth;

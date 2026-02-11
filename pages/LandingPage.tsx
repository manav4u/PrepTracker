
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Hexagon,
  Zap,
  ShieldCheck,
  BarChart3,
  BookOpen,
  CheckSquare,
  Sparkles,
  ChevronRight,
  Database,
  Layers,
  Cpu,
  Terminal,
  Activity,
  Code2,
  Globe,
  Lock,
  Search,
  Timer
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState(0);
  const topics = [
      "Fourier Series & Transforms",
      "Quantum Mechanics: Schrödinger",
      "Kirchhoff's Voltage Law",
      "Pointer Arithmetic in C",
      "Projection of Solids"
  ];

  useEffect(() => {
      const interval = setInterval(() => {
          setActiveTopic(prev => (prev + 1) % topics.length);
      }, 2000);
      return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#E11D48] selection:text-white overflow-x-hidden font-sans">

      {/* Dynamic Background Ambience */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#E11D48] opacity-[0.04] blur-[150px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600 opacity-[0.04] blur-[150px] rounded-full pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3 animate-pulse delay-1000"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030303]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#030303]/60">
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center text-[#E11D48] bg-white/5 rounded-xl border border-white/5 group-hover:border-[#E11D48]/30 transition-all duration-500">
                <Hexagon size={24} strokeWidth={2.5} className="fill-[#E11D48]/10 group-hover:fill-[#E11D48] transition-all duration-500" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">PrepTracker</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors tracking-wide">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors tracking-wide">Methodology</a>
            <Link
              to="/onboarding"
              className="px-6 py-3 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left Content */}
            <div className="relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#E11D48]/30 bg-[#E11D48]/5 text-[#E11D48] text-[10px] font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
                    </span>
                    System Online • 2024 Pattern
                </div>

                <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                    Master Your <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">Engineering</span> <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] to-purple-500">Journey.</span>
                </h1>

                <p className="max-w-xl text-slate-400 text-lg md:text-xl leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 font-light">
                    The elite operating system for SPPU engineering students.
                    Calculated syllabus tracking, vault-grade resources, and AI-assisted learning—engineered for zero latency.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <Link
                    to="/onboarding"
                    className="group px-10 py-5 bg-[#E11D48] text-white rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-[#be123c] transition-all shadow-[0_0_40px_-10px_#E11D48] hover:shadow-[0_0_60px_-10px_#E11D48] flex items-center gap-4 text-xs"
                    >
                        Initialize System <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <div className="flex items-center gap-4 text-slate-500 text-xs font-mono uppercase tracking-wider">
                        <ShieldCheck size={16} /> Local-First Architecture
                    </div>
                </div>
            </div>

            {/* Right Visual - HUD Concept */}
            <div className="relative group animate-in fade-in zoom-in-95 duration-1000 delay-500 hidden lg:block">
               {/* Glowing Orb Backdrop */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#E11D48]/20 to-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>

               {/* Glass Panel */}
               <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden">

                  {/* Decorative Header */}
                  <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                      <div className="flex gap-2">
                         <div className="w-3 h-3 rounded-full bg-red-500"></div>
                         <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                         <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                         Live Syllabus Engine v9.0
                      </div>
                  </div>

                  {/* Dynamic Content */}
                  <div className="space-y-6">
                      <div className="flex justify-between items-end">
                          <div>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Current Focus</p>
                              <h3 className="text-3xl font-display font-bold text-white leading-none">Engineering<br/>Mathematics-I</h3>
                          </div>
                          <div className="text-right">
                              <p className="text-5xl font-mono font-bold text-[#E11D48] tabular-nums">75%</p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Completion Rate</p>
                          </div>
                      </div>

                      {/* Animated Scanner Bar */}
                      <div className="h-64 bg-[#050505] rounded-xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center p-6">
                          {/* Scanning Line */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-[#E11D48] shadow-[0_0_20px_#E11D48] animate-[scan_3s_ease-in-out_infinite] z-20 opacity-50"></div>
                          <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(225,29,72,0.05)_50%,transparent_100%)] animate-[scan_3s_ease-in-out_infinite] pointer-events-none"></div>

                          {/* Data Points */}
                          <div className="w-full space-y-3 relative z-10">
                              {topics.map((topic, i) => (
                                  <div
                                    key={i}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 ${
                                        i === activeTopic
                                        ? 'bg-[#E11D48]/10 border-[#E11D48] scale-[1.02] shadow-[0_0_15px_rgba(225,29,72,0.1)]'
                                        : 'bg-white/5 border-white/5 text-slate-500 scale-100 opacity-50'
                                    }`}
                                  >
                                      <span className="font-mono text-xs">{topic}</span>
                                      {i === activeTopic && <Activity size={14} className="text-[#E11D48] animate-pulse" />}
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                          <span>Latency: 12ms</span>
                          <span>Cache: Optimized</span>
                          <span>Vectors: Loaded</span>
                      </div>
                  </div>
               </div>
            </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 px-6 relative">
         <div className="max-w-[1400px] mx-auto">
            <div className="mb-20">
               <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter">Engineered for <br/><span className="text-[#E11D48]">Excellence.</span></h2>
               <p className="text-slate-400 max-w-2xl text-xl font-light">A suite of tools designed specifically for the rigors of the engineering curriculum.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[300px]">

               {/* Large Card - Tracking */}
               <div className="md:col-span-2 lg:col-span-2 row-span-1 group relative p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-[#E11D48]/30 transition-all overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E11D48] opacity-5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:opacity-10 transition-opacity duration-700"></div>

                  <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-[#E11D48]/10 flex items-center justify-center text-[#E11D48] mb-6">
                         <BarChart3 size={28} />
                      </div>
                      <h3 className="text-3xl font-bold font-display mb-3">Syllabus Tracking</h3>
                      <p className="text-slate-400 leading-relaxed max-w-sm">
                         Visual progress bars for every unit. Mark topics as In-Progress, Revision, or Mastered to calculate your real-time academic velocity.
                      </p>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-8">
                      <div className="h-full bg-gradient-to-r from-[#E11D48] to-purple-600 w-3/4 shadow-[0_0_20px_#E11D48]"></div>
                  </div>
               </div>

               {/* Tall Card - AI */}
               <div className="md:col-span-1 lg:col-span-1 row-span-2 group relative p-10 rounded-[2rem] bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-white/5 hover:border-purple-500/30 transition-all overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
                     <Sparkles size={28} />
                  </div>
                  <h3 className="text-3xl font-bold font-display mb-4">Neural<br/>Assistant</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                     Instant answers to complex engineering topics, sourced directly from standard textbooks. Like having a professor on standby 24/7.
                  </p>

                  {/* Chat UI Simulation */}
                  <div className="space-y-4 mt-auto">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-[10px] text-slate-300 font-mono">
                          &gt; Explain Schrödinger's Wave Equation...
                      </div>
                      <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 text-[10px] text-purple-200 font-mono">
                          Calculating probability density functions...
                      </div>
                  </div>
               </div>

               {/* Standard Card - Vault */}
               <div className="md:col-span-1 lg:col-span-1 group p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-6">
                     <Database size={28} />
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-3">The Vault</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Centralized library for notes, PYQs, and streams.
                  </p>
               </div>

               {/* Standard Card - Tasks */}
               <div className="md:col-span-1 lg:col-span-1 group p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-yellow-500/30 transition-all flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-6">
                     <CheckSquare size={28} />
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-3">Task Command</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Prioritize assignments with critical path analysis.
                  </p>
               </div>

               {/* Wide Card - Privacy */}
               <div className="md:col-span-2 lg:col-span-2 group relative p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-green-500/30 transition-all overflow-hidden flex items-center justify-between">
                  <div className="relative z-10 max-w-sm">
                      <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6">
                         <Lock size={28} />
                      </div>
                      <h3 className="text-3xl font-bold font-display mb-3">Privacy First Architecture</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                         Your data lives on your device. We use `localStorage` for persistence, meaning no accounts, no tracking, and total ownership.
                      </p>
                  </div>
                  <div className="hidden lg:block relative">
                      <ShieldCheck size={120} className="text-green-500/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      <Code2 size={60} className="text-green-500 relative z-10" />
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="text-center md:text-left">
                  <p className="text-5xl lg:text-7xl font-display font-bold text-white mb-2">0ms</p>
                  <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">Server Latency</p>
              </div>
              <div className="h-12 w-px bg-white/10 hidden md:block"></div>
              <div className="text-center md:text-left">
                  <p className="text-5xl lg:text-7xl font-display font-bold text-white mb-2">100%</p>
                  <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">Client-Side</p>
              </div>
              <div className="h-12 w-px bg-white/10 hidden md:block"></div>
              <div className="text-center md:text-left">
                  <p className="text-5xl lg:text-7xl font-display font-bold text-white mb-2">24/7</p>
                  <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">Offline Access</p>
              </div>
          </div>
      </section>

      {/* Detailed Methodology */}
      <section id="how-it-works" className="py-32 px-6">
         <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-20 text-center">The Optimization Protocol</h2>

            <div className="space-y-24 relative">
                {/* Connecting Line */}
                <div className="absolute top-0 bottom-0 left-[27px] md:left-1/2 w-px bg-gradient-to-b from-[#E11D48] via-purple-500 to-transparent"></div>

                {/* Step 1 */}
                <div className="flex flex-col md:flex-row gap-12 items-center relative">
                    <div className="md:w-1/2 text-left md:text-right order-2 md:order-1">
                        <h3 className="text-3xl font-bold text-white mb-4">Configure Your Stack</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Initialize the system by selecting your semester subjects.
                            The engine automatically loads the latest 2024 Pattern syllabus into your local cache.
                        </p>
                    </div>
                    <div className="absolute left-0 md:left-1/2 -translate-x-[calc(50%-27px)] md:-translate-x-1/2 w-14 h-14 rounded-full bg-[#0a0a0a] border border-[#E11D48] flex items-center justify-center z-10 shadow-[0_0_20px_#E11D48]">
                        <span className="font-mono font-bold text-[#E11D48]">01</span>
                    </div>
                    <div className="md:w-1/2 order-3 pl-16 md:pl-0">
                         {/* Visual Icon/Abstract */}
                         <div className="w-full h-40 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden relative group">
                             <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
                             <Hexagon size={48} className="text-[#E11D48] animate-pulse" />
                         </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col md:flex-row gap-12 items-center relative">
                    <div className="md:w-1/2 order-2 md:order-3 pl-16 md:pl-0">
                        <h3 className="text-3xl font-bold text-white mb-4">Execute Study Cycles</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Dive into granular unit details. Mark topics as you progress to generate high-fidelity
                            completion metrics. Visualize your academic velocity.
                        </p>
                    </div>
                    <div className="absolute left-0 md:left-1/2 -translate-x-[calc(50%-27px)] md:-translate-x-1/2 w-14 h-14 rounded-full bg-[#0a0a0a] border border-white/20 flex items-center justify-center z-10">
                        <span className="font-mono font-bold text-white">02</span>
                    </div>
                    <div className="md:w-1/2 order-3 md:order-1 text-right">
                         <div className="w-full h-40 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden relative">
                             <Activity size={48} className="text-purple-500" />
                         </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col md:flex-row gap-12 items-center relative">
                    <div className="md:w-1/2 text-left md:text-right order-2 md:order-1">
                        <h3 className="text-3xl font-bold text-white mb-4">Deploy for Exam</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Utilize the PYQ tracker and curated Resource Vault to ensure maximum coverage.
                            Walk into the exam hall with statistically significant confidence.
                        </p>
                    </div>
                    <div className="absolute left-0 md:left-1/2 -translate-x-[calc(50%-27px)] md:-translate-x-1/2 w-14 h-14 rounded-full bg-[#0a0a0a] border border-white/20 flex items-center justify-center z-10">
                        <span className="font-mono font-bold text-white">03</span>
                    </div>
                    <div className="md:w-1/2 order-3 pl-16 md:pl-0">
                         <div className="w-full h-40 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden relative">
                             <Zap size={48} className="text-yellow-500" />
                         </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#E11D48]/10 pointer-events-none"></div>
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tighter">System Ready.</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
               Join the elite tier of engineering students. No sign-up required. Instant access.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                to="/onboarding"
                className="inline-flex items-center justify-center gap-3 px-12 py-6 bg-white text-black rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-slate-200 transition-all hover:scale-105 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] text-sm"
                >
                Launch PrepTracker <Zap size={18} className="fill-black" />
                </Link>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#050505]">
         <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
               <Hexagon size={24} className="text-[#E11D48] fill-[#E11D48]/10" strokeWidth={2.5} />
               <span className="font-display font-bold text-lg tracking-tight">PrepTracker</span>
            </div>

            <p className="text-slate-600 text-xs font-mono uppercase tracking-widest text-center md:text-right">
               © 2024 PrepTracker Pro Elite. <br className="md:hidden"/> Local-First Architecture.
            </p>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;

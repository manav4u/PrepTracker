
import React from 'react';
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
  Cpu
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#E11D48] selection:text-white overflow-x-hidden">

      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#E11D48] opacity-[0.03] blur-[150px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-600 opacity-[0.03] blur-[150px] rounded-full pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030303]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center text-[#E11D48]">
                <Hexagon size={24} strokeWidth={2.5} className="fill-[#E11D48]/10" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">PrepTracker</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How it Works</a>
            <Link
              to="/onboarding"
              className="px-5 py-2.5 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E11D48]/30 bg-[#E11D48]/10 text-[#E11D48] text-[10px] font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
            </span>
            New: 2024 Pattern Syllabus
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Master Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">Engineering Journey.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            The ultimate academic operating system for SPPU engineering students.
            Track syllabus coverage, manage assignments, and access premium resources—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link
              to="/onboarding"
              className="group px-8 py-4 bg-[#E11D48] text-white rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-[#be123c] transition-all shadow-[0_0_40px_-10px_#E11D48] hover:shadow-[0_0_60px_-10px_#E11D48] flex items-center gap-3"
            >
              Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border border-white/10 text-white rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-20 max-w-6xl mx-auto relative group animate-in fade-in zoom-in-95 duration-1000 delay-500">
           <div className="absolute -inset-1 bg-gradient-to-b from-[#E11D48] to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
           <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              {/* Mock Interface Header */}
              <div className="h-12 border-b border-white/5 bg-[#030303] flex items-center px-4 gap-2">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                 </div>
                 <div className="ml-4 px-3 py-1 bg-white/5 rounded-md border border-white/5 text-[10px] font-mono text-slate-500 w-64 flex items-center gap-2">
                    <ShieldCheck size={10} /> preptracker.local
                 </div>
              </div>

              {/* Content Placeholder with Skeleton UI style */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                  <div className="col-span-2 space-y-6">
                      <div className="h-40 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-[shimmer_2s_infinite]"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="h-32 bg-white/5 rounded-2xl border border-white/5"></div>
                          <div className="h-32 bg-white/5 rounded-2xl border border-white/5"></div>
                      </div>
                  </div>
                  <div className="space-y-4">
                      <div className="h-64 bg-white/5 rounded-2xl border border-white/5"></div>
                      <div className="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
                  </div>
              </div>

              {/* Overlay Text */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                 <span className="px-6 py-3 border border-white/20 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-xl">
                    Interactive Dashboard Preview
                 </span>
              </div>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Everything you need to <span className="text-[#E11D48]">Excel</span>.</h2>
               <p className="text-slate-400 max-w-2xl mx-auto">Built specifically for the rigors of engineering, designed to keep you focused and organized.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {/* Feature 1 */}
               <div className="group p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-[#E11D48]/30 transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-[#E11D48]/10 flex items-center justify-center text-[#E11D48] mb-6 group-hover:scale-110 transition-transform">
                     <BarChart3 size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">Syllabus Tracking</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Visual progress bars for every unit. Mark topics as In-Progress, Revision, or Mastered to calculate your real-time academic velocity.
                  </p>
               </div>

               {/* Feature 2 */}
               <div className="group p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-[#E11D48]/30 transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                     <Database size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">Resource Vault</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     A centralized library for lecture notes, PYQs, and video streams. Add your own custom links or access our curated system resources.
                  </p>
               </div>

               {/* Feature 3 */}
               <div className="group p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-[#E11D48]/30 transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-6 group-hover:scale-110 transition-transform">
                     <CheckSquare size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">Task Command</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Prioritize assignments and lab work with a dedicated task manager. Sort by critical deadlines and categorize by subject.
                  </p>
               </div>

               {/* Feature 4 */}
               <div className="group p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-[#E11D48]/30 transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-6 group-hover:scale-110 transition-transform">
                     <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">Zero Latency</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Built on a modern React stack with local-first architecture. No loading spinners, no server delays—instant interaction.
                  </p>
               </div>

               {/* Feature 5 */}
               <div className="group p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-[#E11D48]/30 transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                     <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">Privacy First</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Your data lives on your device. We use `localStorage` for persistence, meaning no accounts, no tracking, and total ownership.
                  </p>
               </div>

               {/* Feature 6 */}
               <div className="group p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-[#E11D48]/30 transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 mb-6 group-hover:scale-110 transition-transform">
                     <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">AI Assistant</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Integrated neural support for instant answers to complex engineering topics, sourced directly from standard textbooks.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* How it Works / Steps */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5 bg-white/[0.02]">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Streamlined for <br/>Success.</h2>
                  <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                     PrepTracker eliminates the chaos of multiple syllabus PDFs, scattered notes, and forgotten deadlines. It's a structured workflow for the modern engineer.
                  </p>

                  <div className="space-y-8">
                     <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full border border-[#E11D48] text-[#E11D48] flex items-center justify-center font-bold font-mono text-lg">01</div>
                        <div>
                           <h4 className="text-xl font-bold text-white mb-2">Configure Your Stack</h4>
                           <p className="text-slate-400 text-sm">Select your current semester subjects during onboarding. The system automatically loads the 2024 Pattern syllabus.</p>
                        </div>
                     </div>
                     <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full border border-white/20 text-white flex items-center justify-center font-bold font-mono text-lg">02</div>
                        <div>
                           <h4 className="text-xl font-bold text-white mb-2">Track Unit Progress</h4>
                           <p className="text-slate-400 text-sm">Dive into subject details. Mark units as you study them to watch your mastery score climb in real-time.</p>
                        </div>
                     </div>
                     <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full border border-white/20 text-white flex items-center justify-center font-bold font-mono text-lg">03</div>
                        <div>
                           <h4 className="text-xl font-bold text-white mb-2">Ace the Exam</h4>
                           <p className="text-slate-400 text-sm">Use the PYQ tracker and Resource Vault to ensure you've covered every angle before the final paper.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="relative">
                  {/* Decorative Elements */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E11D48] opacity-20 blur-[100px] rounded-full"></div>

                  <div className="relative z-10 bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                      <div className="flex justify-between items-center mb-8">
                          <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Metric</p>
                              <h3 className="text-3xl font-display font-bold">Overall Progress</h3>
                          </div>
                          <div className="text-[#E11D48]">
                              <BarChart3 size={32} />
                          </div>
                      </div>

                      <div className="space-y-6">
                          <div>
                              <div className="flex justify-between text-sm font-bold mb-2">
                                  <span>Engineering Mathematics-I</span>
                                  <span className="text-[#E11D48]">75%</span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#E11D48] w-3/4"></div>
                              </div>
                          </div>
                          <div>
                              <div className="flex justify-between text-sm font-bold mb-2">
                                  <span>Engineering Physics</span>
                                  <span className="text-slate-400">40%</span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-white/20 w-2/5"></div>
                              </div>
                          </div>
                          <div>
                              <div className="flex justify-between text-sm font-bold mb-2">
                                  <span>Basic Electronics</span>
                                  <span className="text-green-500">90%</span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500 w-[90%]"></div>
                              </div>
                          </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                          <div className="flex -space-x-2">
                              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#0a0a0a]"></div>
                              <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#0a0a0a]"></div>
                              <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-[#0a0a0a] flex items-center justify-center text-[8px] font-bold">+3</div>
                          </div>
                          <p className="text-xs text-slate-500 font-mono">UPDATED_JUST_NOW</p>
                      </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">Ready to upgrade your workflow?</h2>
            <p className="text-xl text-slate-400 mb-12">
               Join thousands of engineering students who have switched to a smarter way of studying. No sign-up required.
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-slate-200 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
               Launch PrepTracker <Zap size={20} className="fill-black" />
            </Link>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#050505]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
               <Hexagon size={24} className="text-[#E11D48] fill-[#E11D48]/10" strokeWidth={2.5} />
               <span className="font-display font-bold text-lg tracking-tight">PrepTracker</span>
            </div>

            <p className="text-slate-600 text-xs font-mono uppercase tracking-widest">
               © 2024 PrepTracker Pro Elite. Local-First Architecture.
            </p>

            <div className="flex gap-6">
               <a href="#" className="text-slate-500 hover:text-white transition-colors"><Cpu size={20} /></a>
               <a href="#" className="text-slate-500 hover:text-white transition-colors"><Layers size={20} /></a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;

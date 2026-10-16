import React, { useState, useEffect } from 'react';
import HeroV2 from '../components/landing/HeroV2';
import TrustStrip from '../components/landing/TrustStrip';
import ProblemSection from '../components/landing/ProblemSection';
import FeaturesBento from '../components/landing/FeaturesBento';
import HowItWorks from '../components/landing/HowItWorks';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Terminal,
  Cpu,
  Database,
  CheckSquare,
  BookOpen,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Code2,
  Zap,
  Layout,
  FileText,
  Clock
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-slate-300 font-sans selection:bg-[#E11D48] selection:text-white overflow-x-hidden">

      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#F7F5F2]/85 backdrop-blur-md border-b border-black/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E11D48] rounded flex items-center justify-center text-white font-bold font-mono">
              PT
            </div>
            <span className="font-bold text-[#141419] tracking-tight">PrepTracker</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#141419]/60">
            <a href="#syllabus" className="hover:text-[#141419] transition-colors">Syllabus</a>
            <a href="#vault" className="hover:text-[#141419] transition-colors">Resources</a>
            <a href="#tasks" className="hover:text-[#141419] transition-colors">Tasks</a>
          </div>
          <Link
            to="/onboarding"
            className="px-5 py-2.5 bg-[#141419] text-white text-xs font-bold tracking-wide rounded-full hover:bg-black transition-colors"
          >
            Launch App
          </Link>
        </div>
      </nav>

      <HeroV2 />

      <TrustStrip />

      <ProblemSection />

      <FeaturesBento />

      <HowItWorks />

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#E11D48]/20 pointer-events-none"></div>
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tighter">Ready for exam season?</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
               Built for SPPU first years. Set up in under a minute.
               <br />
               No account required. Data stays on your device.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                to="/onboarding"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-lg font-bold uppercase tracking-wider hover:bg-slate-200 transition-all hover:scale-105 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
                >
                  <Zap size={20} className="fill-black" /> Launch PrepTracker
                </Link>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#030303]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
           <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#E11D48] rounded flex items-center justify-center text-white text-[10px] font-bold">PT</div>
              <span className="font-semibold text-slate-300">PrepTracker</span>
           </div>
           <div className="text-slate-500 text-xs font-mono">Your data never leaves this browser.</div>
           <div className="font-mono text-xs">
              © 2026 • Local-First Architecture
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

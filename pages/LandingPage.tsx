import React, { useState, useEffect } from 'react';
import HeroScene from '../components/landing/HeroScene';
import TrustStrip from '../components/landing/TrustStrip';
import ProblemScene from '../components/landing/ProblemScene';
import FeatureStack from '../components/landing/FeatureStack';
import HowItWorks from '../components/landing/HowItWorks';
import FaqSection from '../components/landing/FaqSection';
import FinalCta from '../components/landing/FinalCta';
import { useGSAP } from '@gsap/react';
import { gsap, reduceMotion } from '../lib/scroll';
import { Link } from 'react-router-dom';
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
  const [isScrolled, setIsScrolled] = useState(false);

  useGSAP(() => {
    if (reduceMotion()) return;
    const footer = document.querySelector('[data-footer]');
    if (!footer) return;
    gsap.fromTo(
      footer,
      { yPercent: -14 },
      {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: footer, start: 'top bottom', end: 'top 55%', scrub: 1 },
      }
    );
  });

  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#F7F5F2';
    return () => { document.body.style.backgroundColor = prev; };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#141419] font-sans selection:bg-[#E11D48] selection:text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#F7F5F2]/85 backdrop-blur-md border-b border-black/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#BE123C] rounded flex items-center justify-center text-white font-bold font-mono">
              PT
            </div>
            <span className="font-bold text-[#141419] tracking-tight">PrepTracker</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#52525B]">
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

      <main>
        <HeroScene />

        <TrustStrip />

        <ProblemScene />

        <FeatureStack />

        <HowItWorks />

        <FaqSection />
        <FinalCta />
      </main>
      {/* Footer */}
      <footer data-footer className="px-6 pb-10 pt-4 border-t border-black/[0.08] bg-[#F7F5F2]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[#5A5A66]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#BE123C] rounded flex items-center justify-center text-white text-[10px] font-bold font-mono">PT</div>
            <span className="font-bold text-[#141419] tracking-tight">PrepTracker</span>
          </div>
          <nav aria-label="Footer" className="flex items-center gap-6">
            <a href="#syllabus" className="hover:text-[#141419] transition-colors">Syllabus</a>
            <a href="#vault" className="hover:text-[#141419] transition-colors">Resources</a>
            <a href="#tasks" className="hover:text-[#141419] transition-colors">Tasks</a>
            <a href="https://github.com/manav4u/PrepTracker" target="_blank" rel="noreferrer" className="hover:text-[#141419] transition-colors">Source</a>
          </nav>
          <div className="text-xs text-[#6E6E78]">SPPU FE, 2024 pattern · Free · Your data stays in this browser</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

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
import LogoMark from '../components/LogoMark';
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
    <div className="min-h-screen bg-[#F7F5F2] text-[#141419] font-sans selection:bg-[#D61A40] selection:text-white overflow-x-hidden">
      {/* Paper grain: fixed feTurbulence noise, multiply, pointer-events-none. Sits above sections, below nav/dock. */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[5] pointer-events-none opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#F7F5F2]/85 backdrop-blur-md border-b border-black/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2.5" aria-label="PrepTracker home">
            <LogoMark size={30} />
            <span className="font-brand font-bold text-lg text-[#141419] tracking-[-0.015em]">PrepTracker</span>
          </Link>
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
      <footer data-footer className="relative px-6 pt-14 md:pt-20 pb-10 border-t border-black/[0.08] bg-[#F7F5F2] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-sm text-[#5A5A66]">
            <nav aria-label="Footer" className="flex items-center gap-6">
              <a href="#syllabus" className="hover:text-[#141419] transition-colors">Syllabus</a>
              <a href="#vault" className="hover:text-[#141419] transition-colors">Resources</a>
              <a href="#tasks" className="hover:text-[#141419] transition-colors">Tasks</a>
              <a href="https://github.com/manav4u/PrepTracker" target="_blank" rel="noreferrer" className="hover:text-[#141419] transition-colors">Source</a>
            </nav>
            <div className="text-xs text-[#6E6E78]">SPPU FE, 2024 pattern · Free · Your data stays in this browser</div>
          </div>
          {/* Statement lockup: the document signs its own name */}
          <div className="mt-16 md:mt-24 flex items-end gap-[0.08em]">
            <span className="w-[0.62em] shrink-0 text-[13vw] md:text-[10.5rem]" aria-hidden="true">
              <LogoMark size={999} className="w-full h-auto block translate-y-[0.06em]" />
            </span>
            <span className="font-brand font-bold tracking-[-0.035em] leading-[0.82] text-[#141419] text-[13vw] md:text-[10.5rem]">PrepTracker</span>
          </div>
          <p className="mt-6 md:mt-8 font-mono text-[11px] uppercase tracking-[0.34em] text-[#D61A40]">Plan&nbsp;&nbsp;Focus&nbsp;&nbsp;Progress</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

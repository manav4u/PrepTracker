import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  RotateCcw,
  Pin,
  Calculator,
  Folder,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Layers,
  Hexagon
} from 'lucide-react';
import { CATALOG, CATALOG_NOTE } from '../lib/catalog';
import '../front-cover.css';

const sampleChapters = [
  {
    tab: 'Read',
    title: 'Know the unit outline.',
    text: 'Read official SPPU syllabus units topic by topic. Keep exact definitions close and inspect references when preparing for end-sem exams.'
  },
  {
    tab: 'Plan',
    title: 'Schedule your week.',
    text: 'Set daily focus budgets and allocate time per subject. Adjust session lengths to fit your actual routine without rigid lock-ins.'
  },
  {
    tab: 'Recall',
    title: 'Review before it fades.',
    text: 'Log your confidence after revision. Use spaced 1, 3, or 7-day intervals so topics stay fresh when exam dates approach.'
  }
];

export default function LandingPage() {
  const [chapter, setChapter] = useState(0);
  const [marked, setMarked] = useState(false);

  const features = [
    {
      num: '01',
      title: 'Structured Syllabus View',
      text: 'Official SPPU 2024 pattern unit topics, detailed outlines, and clear progress toggles.',
      icon: BookOpen
    },
    {
      num: '02',
      title: 'Weekly Study Folio',
      text: 'Plan daily study budgets, assign subject topics, and keep track of completed or skipped sessions.',
      icon: Calendar
    },
    {
      num: '03',
      title: 'Active Spaced Recall',
      text: 'Track review queues and self-assessed confidence intervals without fake AI-generated fluff.',
      icon: RotateCcw
    },
    {
      num: '04',
      title: 'Task Pins & Deadlines',
      text: 'Organize course assignments, practical submissions, and exam milestones with priority flags.',
      icon: Pin
    },
    {
      num: '05',
      title: 'Marks & Credit Ledger',
      text: 'Calculate First Year and upper semester marks estimates with transparent credit coverage.',
      icon: Calculator
    },
    {
      num: '06',
      title: 'Syllabus Link Cabinet',
      text: 'Bookmark lecture notes, reference PDFs, and YouTube tutorials directly attached to course units.',
      icon: Folder
    }
  ];

  const faqs = [
    {
      q: 'Is every SPPU course ready to track?',
      a: 'Yes. The catalog includes official SPPU 2024 Pattern theory courses for FE, SE, and TE across major branches like Computer, IT, AI&DS, E&TC, Electrical, Mechanical, and Civil.'
    },
    {
      q: 'Does PrepTracker sync across devices automatically?',
      a: 'Data persistence is 100% local to your browser for total privacy and offline reliability. You can easily export private JSON backups in Settings and restore them anytime.'
    },
    {
      q: 'How does the First Year (FE) subject rotation work?',
      a: 'FE colleges alternate subjects between Semester 1 and Semester 2 (e.g. Physics vs Chemistry, FPL vs PPS, Basic Electrical vs Basic Electronics). Onboarding lets you select your exact semester combination.'
    }
  ];

  return (
    <div className="front-cover bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header Navigation */}
      <nav className="front-nav">
        <Link to="/" className="front-logo flex items-center gap-2.5 text-slate-900 no-underline font-display">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <Hexagon size={22} strokeWidth={2.5} className="fill-rose-500/10" />
          </div>
          <span className="font-bold text-lg">PrepTracker</span>
          <small className="hidden sm:inline-block text-[10px] text-rose-600 uppercase font-semibold">2024 Pattern</small>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/directory" className="text-xs font-semibold text-slate-600 hover:text-slate-900 no-underline">
            Syllabus Library
          </Link>
          <Link to="/onboarding" className="front-launch">
            Open Study Desk ↗
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[1340px] mx-auto px-6 py-12">
        {/* HERO SECTION */}
        <section className="front-hero">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-100 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={14} /> SPPU Engineering Study Edition
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 font-display leading-[1.08] tracking-tight mb-6">
              Master your syllabus.<br />
              <span className="text-rose-600">One unit at a time.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              An offline-first study command center tailored for SPPU engineering students. Organize your course units, plan daily focus sessions, and master exam preparation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/onboarding"
                className="px-6 py-3.5 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 text-sm no-underline"
              >
                Configure My Subjects <ArrowRight size={16} />
              </Link>
              <Link
                to="/directory"
                className="px-6 py-3.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-2 text-sm no-underline shadow-sm"
              >
                Browse Syllabus Catalog
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>100% Local Browser Storage · No Login Required</span>
            </div>
          </div>

          {/* INTERACTIVE PREVIEW CARD */}
          <div className="front-preview">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Interactive Sample</span>
              <span className="text-xs text-slate-400 font-mono">Demo Desk</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 font-display mb-3">
              {sampleChapters[chapter].title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[72px] mb-6">
              {sampleChapters[chapter].text}
            </p>

            <div className="front-tabs">
              {sampleChapters.map((c, i) => (
                <button
                  key={c.tab}
                  type="button"
                  aria-pressed={chapter === i}
                  onClick={() => setChapter(i)}
                >
                  {c.tab}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMarked(!marked)}
                className={`w-full py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2.5 transition-all ${
                  marked
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 size={16} className={marked ? 'text-emerald-600' : 'text-slate-400'} />
                {marked ? 'Unit topic completed! Keep up the progress.' : 'Click to test marking a topic complete'}
              </button>
            </div>
          </div>
        </section>

        {/* CATALOG SUMMARY SHELF */}
        <section className="my-16 bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-2">
                Official Curriculum Sourced
              </span>
              <h2 className="text-3xl font-bold text-slate-900 font-display mb-3">
                {CATALOG.length} Sourced Theory Courses
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {CATALOG_NOTE}
              </p>
            </div>

            <div className="flex md:justify-end">
              <Link
                to="/directory"
                className="px-6 py-3.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-all no-underline shadow-sm inline-flex items-center gap-2"
              >
                View Syllabus Catalog <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURE HIGHLIGHTS */}
        <section className="my-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-2">Designed For Student Clarity</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
              Everything you need for exam preparation.
            </h2>
          </div>

          <div className="front-feature-grid">
            {features.map(f => {
              const Icon = f.icon;
              return (
                <article key={f.num} className="front-feature-card">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">{f.num}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="my-20 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="bg-white border border-slate-200 rounded-2xl p-6 group cursor-pointer shadow-sm">
                <summary className="font-bold text-slate-900 text-sm sm:text-base flex justify-between items-center list-none">
                  <span>{f.q}</span>
                  <ChevronDown size={18} className="text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed border-t border-slate-100 pt-3">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="my-16 bg-rose-600 rounded-3xl p-10 text-center text-white shadow-xl shadow-rose-600/20">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Ready to start studying?</h2>
          <p className="text-sm text-rose-100 max-w-md mx-auto mb-8">
            Set up your courses in under a minute. No registration or credit cards required.
          </p>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose-600 font-bold text-sm rounded-xl hover:bg-rose-50 transition-all shadow-md no-underline"
          >
            Launch Setup Matrix <ArrowRight size={16} />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6">
        <div className="max-w-[1340px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-display">
            <Hexagon size={18} className="text-rose-600" /> PrepTracker
          </div>
          <p className="text-center sm:text-left">SPPU 2024 Pattern Student Desk · Privacy-first, local browser storage</p>
          <Link to="/directory" className="text-rose-600 hover:underline no-underline">
            Syllabus Catalog ↗
          </Link>
        </div>
      </footer>
    </div>
  );
}

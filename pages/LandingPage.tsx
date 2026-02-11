import React, { useState, useEffect } from 'react';
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#030303]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E11D48] rounded flex items-center justify-center text-white font-bold font-mono">
              PT
            </div>
            <span className="font-bold text-white tracking-tight">PrepTracker</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#syllabus" className="hover:text-white transition-colors">Syllabus</a>
            <a href="#vault" className="hover:text-white transition-colors">Vault</a>
            <a href="#tasks" className="hover:text-white transition-colors">Tasks</a>
          </div>
          <Link
            to="/onboarding"
            className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-slate-200 transition-colors"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-widest text-[#E11D48] mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
            </span>
            System Online • SPPU 2024 Pattern
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-tight mb-8"
          >
            Engineer Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">Academic Success.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-light mb-12 leading-relaxed"
          >
            The definitive operating system for engineering students.
            Manage syllabus coverage, access curated resources, and track critical deadlines.
            Zero fluff. Pure efficiency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/onboarding"
              className="w-full sm:w-auto px-8 py-4 bg-[#E11D48] text-white font-bold rounded-lg hover:bg-[#be123c] transition-all flex items-center justify-center gap-2 group"
            >
              Initialize System <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#syllabus"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              Explore Features
            </a>
          </motion.div>
        </div>
      </section>

      {/* Feature: Syllabus Command */}
      <section id="syllabus" className="py-24 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-12 h-12 bg-[#E11D48]/10 rounded-lg flex items-center justify-center text-[#E11D48] mb-6">
              <Layout size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">Precision Syllabus Tracking.</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Forget scrolling through PDFs. We've digitized the entire SPPU 2024 syllabus into interactive modules.
              Mark units as "Pending," "In Progress," or "Mastered" and visualize your completion rate in real-time.
            </p>
            <ul className="space-y-4">
              {['Unit-wise Breakdown', 'Real-time Velocity Metrics', 'Revision Status Indicators'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-[#E11D48] rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="relative"
          >
            <div className="absolute inset-0 bg-[#E11D48] blur-[100px] opacity-10 rounded-full"></div>
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <span className="font-mono text-xs text-slate-500 uppercase">Engineering Mathematics-I</span>
                <span className="font-mono text-xs text-[#E11D48]">75% Complete</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Unit 1: Linear Algebra", status: "Mastered", color: "bg-green-500" },
                  { name: "Unit 2: Calculus", status: "In Progress", color: "bg-yellow-500" },
                  { name: "Unit 3: Statistics", status: "Pending", color: "bg-slate-700" }
                ].map((unit, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-sm font-medium text-slate-200">{unit.name}</span>
                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase text-black ${unit.color.replace('bg-', 'bg-').replace('700', '300') === 'bg-slate-300' ? 'bg-slate-700 text-slate-300' : 'bg-opacity-80'}`}>
                      {unit.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature: The Vault */}
      <section id="vault" className="py-24 px-6 border-t border-white/5 bg-[#030303]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="relative order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-10 rounded-full"></div>
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-2xl">
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: FileText, label: "PYQ Papers", count: "2019-2023" },
                    { icon: BookOpen, label: "Notes", count: "All Units" },
                    { icon: Code2, label: "Lab Manuals", count: "Verified" },
                    { icon: ExternalLink, label: "Reference", count: "Standard" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-lg hover:border-white/20 transition-colors group">
                      <item.icon className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" size={24} />
                      <div className="font-bold text-slate-200">{item.label}</div>
                      <div className="text-xs text-slate-500 font-mono mt-1">{item.count}</div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-500 mb-6">
              <Database size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">The Resource Vault.</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Stop hunting for study materials in random WhatsApp groups. The Vault aggregates high-quality notes,
              previous year question papers (PYQs), and decoded answers into one centralized repository.
            </p>
            <ul className="space-y-4">
              {['One-click Downloads', 'Subject-specific Sorting', 'Verified Content Only'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Feature: Task Command */}
      <section id="tasks" className="py-24 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-500 mb-6">
              <CheckSquare size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">Critical Path Task Management.</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Engineering deadlines are unforgiving. Manage your assignments, submissions, and exam prep with
              our priority-based task system. Never miss a submission date again.
            </p>
            <ul className="space-y-4">
              {['High/Medium/Low Priority Tags', 'Deadline Countdown', 'Subject Association'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="relative"
          >
            <div className="absolute inset-0 bg-yellow-500 blur-[100px] opacity-10 rounded-full"></div>
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-2xl">
               <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-white/5 border border-l-4 border-l-red-500 border-white/5 rounded-r-lg">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-500"></div>
                      <div className="flex-1">
                          <div className="text-sm font-bold text-white">Submit FPL Assignment</div>
                          <div className="text-xs text-red-400 font-mono mt-1">Due: Today, 5:00 PM</div>
                      </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/5 border border-l-4 border-l-yellow-500 border-white/5 rounded-r-lg">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-500"></div>
                      <div className="flex-1">
                          <div className="text-sm font-bold text-white">Complete Mechanics Lab</div>
                          <div className="text-xs text-yellow-400 font-mono mt-1">Due: Tomorrow</div>
                      </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/5 border border-l-4 border-l-green-500 border-white/5 rounded-r-lg opacity-50">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckSquare size={12} className="text-black" />
                      </div>
                      <div className="flex-1">
                          <div className="text-sm font-bold text-slate-400 line-through">Maths Tutorial</div>
                          <div className="text-xs text-slate-500 font-mono mt-1">Completed</div>
                      </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#E11D48]/20 pointer-events-none"></div>
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tighter">Ready to Deploy?</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
               Join thousands of students optimizing their engineering journey.
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
           <div className="flex gap-6">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
           </div>
           <div className="font-mono text-xs">
              © 2024 • Local-First Architecture
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

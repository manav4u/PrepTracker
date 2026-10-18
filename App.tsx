import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutGrid,
  Search,
  Library,
  Calculator,
  Settings,
  Menu,
  X,
  ListTodo,
  HardDrive
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import SubjectDetail from './pages/SubjectDetail';
import Resources from './pages/Resources';
import CalculatorPage from './pages/Calculator';
import SettingsPage from './pages/Settings';
import Onboarding from './pages/Onboarding';
import TodoList from './pages/TodoList';
import LandingPage from './pages/LandingPage';
import { UnitStatus } from './types';
import { useData } from './context/DataContext';
import ErrorBoundary from './components/ErrorBoundary';
import LogoMark from './components/LogoMark';
import GlobalSearch from './components/GlobalSearch';

const NotFound = () => (
  <div className="min-h-screen bg-[#030303] text-slate-200 flex flex-col items-center justify-center gap-8 px-6 text-center">
    <LogoMark size={40} />
    <div>
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#F63C49] mb-4">404</p>
      <h1 className="text-3xl font-bold text-white tracking-tight">This page does not exist.</h1>
    </div>
    <div className="flex items-center gap-4">
      <Link to="/" className="px-6 py-3 rounded-full border border-white/15 text-sm font-bold text-white/80 hover:text-white hover:border-white/40 transition-colors">Landing</Link>
      <Link to="/app" className="px-6 py-3 rounded-full bg-[#D61A40] text-sm font-bold text-white hover:bg-[#F63C49] transition-colors">Open the app</Link>
    </div>
  </div>
);

const NAV_V: string = (typeof localStorage !== 'undefined' && localStorage.getItem('nav_v')) || 'a';

const NavItem = ({ to, icon: Icon, active, label, short }: { to: string, icon: any, active: boolean, label: string, short?: string }) => {
  const desk = `lg:w-14 lg:h-14 lg:rounded-3xl lg:flex-row lg:gap-0 ${active ? 'lg:bg-white lg:text-black lg:shadow-[0_0_20px_rgba(255,255,255,0.3)] lg:scale-110' : 'lg:text-white/40 lg:hover:text-white lg:hover:bg-white/5'}`;
  let mob = '';
  if (NAV_V === 'a') {
    // Pill: active item expands into a red pill with its label, others icon-only
    mob = active
      ? 'h-11 px-4 gap-2 rounded-full bg-[#F63C49] text-white shadow-[0_6px_20px_rgba(246,60,73,0.45)]'
      : 'w-11 h-11 rounded-full text-white/45';
  } else if (NAV_V === 'b') {
    // Edge bar: all labels shown, red indicator line on top of the active item
    mob = `w-16 h-14 gap-1 rounded-xl ${active ? 'text-white' : 'text-white/40'}`;
  } else {
    // Icons only: active icon red with a soft red tile
    mob = `w-12 h-12 rounded-2xl ${active ? 'bg-[#F63C49]/15 text-[#F63C49]' : 'text-white/40'}`;
  }
  return (
    <Link
      to={to}
      aria-label={short || label}
      title={label}
      aria-current={active ? 'page' : undefined}
      className={`relative group flex ${NAV_V === 'a' ? 'flex-row' : 'flex-col'} items-center justify-center transition-all duration-300 ${mob} ${desk}`}
    >
      <Icon size={20} strokeWidth={active ? 2.4 : 2} className="lg:w-[22px] lg:h-[22px]" />
      {NAV_V === 'a' && active && <span className="lg:hidden text-[11px] font-bold tracking-wide leading-none">{short || label}</span>}
      {NAV_V === 'b' && <span aria-hidden="true" className="lg:hidden text-[9px] font-semibold tracking-wide leading-none">{short || label}</span>}
      {NAV_V === 'b' && active && <span className="lg:hidden absolute -top-[9px] left-3 right-3 h-[2px] rounded-full bg-[#F63C49] shadow-[0_0_10px_#F63C49]"></span>}
      {active && (
        <span className="hidden lg:block absolute top-1/2 -right-2 w-1.5 h-1.5 bg-[#D61A40] rounded-full shadow-[0_0_10px_#F63C49]"></span>
      )}
    </Link>
  );
};

export default function App() {
  const { profile, setProfile } = useData();
  const location = useLocation();
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

  // ROUTING LOGIC:
  // 1. If no profile/setup -> Show Landing Page by default.
  // 2. If user clicks "Launch App" on Landing Page -> Show Onboarding (handled via route).
  // 3. If setup complete -> Show Dashboard/App Shell.

  const isSetupComplete = profile && profile.setupComplete;

  return (
    <ErrorBoundary scope="app">
        <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<Navigate to="/" replace />} />
            <Route path="/onboarding" element={isSetupComplete ? <Navigate to="/app" replace /> : <Onboarding />} />

            {/* APP ROUTES (Protected by Setup Check) */}
            <Route path="/app/*" element={
                !isSetupComplete ? (
                    <Navigate to="/onboarding" replace />
                ) : (
                    // APP SHELL
                    <div className="flex flex-col lg:flex-row min-h-screen bg-[#030303] text-slate-200 selection:bg-[#D61A40] selection:text-white overflow-hidden">

                    {/* Mobile Branding Header */}
                    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <LogoMark size={26} />
                        </div>
                        <span className="font-bold tracking-widest uppercase text-xs text-white">PrepTracker</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <button
                        type="button"
                        onClick={() => setMobileSearchOpen(true)}
                        aria-label="Search"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        >
                        <Search size={18} />
                        </button>
                        <Link to="/app/settings" aria-label="Settings" className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/10">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}`} alt="User" />
                        </Link>
                        </div>
                    </header>

                    {/* Mobile search overlay */}
                    {mobileSearchOpen && (
                    <div role="dialog" aria-modal="true" aria-label="Search" className="lg:hidden fixed inset-0 z-[70] bg-[#030303]/95 backdrop-blur-xl p-6 animate-in fade-in duration-200">
                        <div className="flex justify-end mb-6">
                        <button
                        type="button"
                        onClick={() => setMobileSearchOpen(false)}
                        aria-label="Close search"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        >
                        <X size={22} />
                        </button>
                        </div>
                        <GlobalSearch selectedSubjects={profile.selectedSubjects || []} overlay onNavigate={() => setMobileSearchOpen(false)} />
                    </div>
                    )}

                    {/* Adaptive Navigation Dock */}
                    <aside className={`fixed z-50 transition-all duration-500
                        ${NAV_V === 'b' ? 'bottom-0 left-0 right-0 h-[72px] pb-1 glass-panel rounded-t-3xl border-t border-white/10' : NAV_V === 'a' ? 'bottom-5 left-4 right-4 h-16 glass-panel rounded-full' : 'bottom-5 left-1/2 -translate-x-1/2 w-[300px] h-16 glass-panel rounded-full'} flex items-center justify-around px-2 shadow-2xl lg:translate-x-0 lg:w-24
                        lg:bottom-auto lg:top-1/2 lg:left-6 lg:right-auto lg:h-auto lg:w-24 lg:flex-col lg:rounded-[3rem] lg:py-10 lg:gap-8 lg:-translate-y-1/2 lg:shadow-none
                    `}>
                        <div className="hidden lg:flex w-14 h-14 items-center justify-center mb-4">
                        <LogoMark size={34} />
                        </div>

                        <nav className="flex flex-row lg:flex-col w-full justify-evenly lg:gap-6 items-center">
                        <NavItem label="Dashboard" to="/app" short="Home" icon={LayoutGrid} active={location.pathname === '/app'} />
                        <NavItem label="Resources" to="/app/resources" short="Library" icon={Library} active={location.pathname === '/app/resources'} />
                        <NavItem label="Tasks" to="/app/tasks" short="Tasks" icon={ListTodo} active={location.pathname === '/app/tasks'} />
                        <NavItem label="SGPA calculator" to="/app/calculator" short="SGPA" icon={Calculator} active={location.pathname === '/app/calculator'} />
                        <NavItem label="Settings" to="/app/settings" short="Settings" icon={Settings} active={location.pathname === '/app/settings'} />
                        </nav>

                        <div className="hidden lg:flex mt-4 pt-8 border-t border-white/5 w-full flex-col items-center gap-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-[#D61A40] rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F63C49] transition-all">
                                <HardDrive size={20} />
                            </div>
                            <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-white text-black text-[8px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                                Local Storage Active
                            </div>
                        </div>
                        <Link to="/app/settings" aria-label="Settings" className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10 hover:ring-white/40 transition-all hover:scale-110">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}`} alt="User" />
                        </Link>
                        </div>
                    </aside>

                    <main className="flex-1 w-full min-w-0
                        pt-24 pb-32 px-4
                        lg:pl-40 lg:pr-12 lg:py-12 lg:pb-12
                    ">
                        {/* Desktop Top Bar */}
                        <div className="hidden lg:flex justify-between items-center mb-16 max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-4 text-sm font-medium text-white/60">
                            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="text-[#F63C49]">First Year Engineering</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <GlobalSearch selectedSubjects={profile.selectedSubjects || []} />
                        </div>
                        </div>

                        <div className="max-w-[1600px] mx-auto h-full">
                        <ErrorBoundary scope="page" resetKey={location.pathname}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="subject/:id" element={<SubjectDetail />} />
                            <Route path="resources" element={<Resources />} />
                            <Route path="tasks" element={<TodoList />} />
                            <Route path="calculator" element={<CalculatorPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="*" element={<Navigate to="/app" replace />} />
                        </Routes>
                        </ErrorBoundary>
                        </div>
                    </main>

                    {/* Background Decor */}
                    <div className="fixed top-0 right-0 w-[500px] lg:w-[800px] h-[500px] lg:h-[800px] bg-[#D61A40] opacity-[0.03] blur-[100px] lg:blur-[150px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3"></div>
                    <div className="fixed bottom-0 left-0 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-blue-600 opacity-[0.03] blur-[100px] lg:blur-[150px] rounded-full pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3"></div>
                    </div>
                )
            } />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </ErrorBoundary>
  );
}

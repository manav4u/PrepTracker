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

const NavItem = ({ to, icon: Icon, active, label, short }: { to: string, icon: any, active: boolean, label: string, short?: string }) => (
  <Link
    to={to}
    aria-label={label}
    title={label}
    aria-current={active ? 'page' : undefined}
    className={`relative group flex flex-col lg:flex-row items-center justify-center gap-0.5 lg:gap-0 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl lg:rounded-3xl transition-all duration-300 ${
      active
        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-110'
        : 'text-white/40 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} className="lg:w-[22px] lg:h-[22px]" />
    <span aria-hidden="true" className="lg:hidden text-[7px] font-bold uppercase tracking-widest leading-none">{short || label}</span>
    {active && (
      <span className="absolute -bottom-2 lg:top-1/2 lg:-right-2 w-1 h-1 lg:w-1.5 lg:h-1.5 bg-[#D61A40] rounded-full shadow-[0_0_10px_#F63C49]"></span>
    )}
  </Link>
);

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
            <Route path="/landing" element={isSetupComplete ? <Navigate to="/" /> : <LandingPage />} />
            <Route path="/onboarding" element={isSetupComplete ? <Navigate to="/" /> : <Onboarding />} />

            {/* APP ROUTES (Protected by Setup Check) */}
            <Route path="*" element={
                !isSetupComplete ? (
                    // Redirect root to landing if not setup
                     location.pathname === '/' ? <LandingPage /> : <Navigate to="/landing" />
                ) : (
                    // APP SHELL
                    <div className="flex flex-col lg:flex-row min-h-screen bg-[#030303] text-slate-200 selection:bg-[#D61A40] selection:text-white overflow-hidden">

                    {/* Mobile Branding Header */}
                    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
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
                        <Link to="/settings" aria-label="Settings" className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/10">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}`} alt="User" />
                        </Link>
                        </div>
                    </div>

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
                    <aside className="fixed z-50 transition-all duration-500
                        bottom-6 left-4 right-4 h-20 glass-panel rounded-[2.5rem] flex items-center justify-around px-2 shadow-2xl
                        lg:bottom-auto lg:top-1/2 lg:left-6 lg:right-auto lg:h-auto lg:w-24 lg:flex-col lg:rounded-[3rem] lg:py-10 lg:gap-8 lg:-translate-y-1/2 lg:shadow-none
                    ">
                        <div className="hidden lg:flex w-14 h-14 items-center justify-center mb-4">
                        <LogoMark size={34} />
                        </div>

                        <nav className="flex flex-row lg:flex-col w-full justify-evenly lg:gap-6 items-center">
                        <NavItem label="Dashboard" to="/" short="Home" icon={LayoutGrid} active={location.pathname === '/'} />
                        <NavItem label="Resources" to="/resources" short="Library" icon={Library} active={location.pathname === '/resources'} />
                        <NavItem label="Tasks" to="/tasks" short="Tasks" icon={ListTodo} active={location.pathname === '/tasks'} />
                        <NavItem label="SGPA calculator" to="/calculator" short="SGPA" icon={Calculator} active={location.pathname === '/calculator'} />
                        <NavItem label="Settings" to="/settings" short="Settings" icon={Settings} active={location.pathname === '/settings'} />
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
                        <Link to="/settings" aria-label="Settings" className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10 hover:ring-white/40 transition-all hover:scale-110">
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
                            <Route path="/subject/:id" element={<SubjectDetail />} />
                            <Route path="/resources" element={<Resources />} />
                            <Route path="/tasks" element={<TodoList />} />
                            <Route path="/calculator" element={<CalculatorPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
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
        </Routes>
    </ErrorBoundary>
  );
}

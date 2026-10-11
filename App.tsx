import React, { Component, ReactNode } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutGrid,
  Library,
  Calculator,
  Settings,
  Hexagon,
  AlertTriangle,
  RefreshCw,
  ListTodo,
  CheckCircle2,
  BookOpen,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Directory from './pages/Directory';
import AddToPlan from './pages/AddToPlan';
import SubjectDetail from './pages/SubjectDetail';
import Resources from './pages/Resources';
import CalculatorPage from './pages/Calculator';
import SettingsPage from './pages/Settings';
import Onboarding from './pages/Onboarding';
import TodoList from './pages/TodoList';
import LandingPage from './pages/LandingPage';
import Planner from './pages/Planner';
import Progress from './pages/Progress';
import Study from './pages/Study';
import { useData } from './context/DataContext';

import './round2-palette.css';

// --- ERROR BOUNDARY COMPONENT ---
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("CRITICAL APP CRASH:", error, errorInfo);
  }

  handleHardReset = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-md w-full bg-white border border-rose-200 p-8 rounded-3xl shadow-xl">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-600">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">System Notice</h1>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              The application encountered a temporary display issue.
            </p>
            <button
              onClick={this.handleHardReset}
              className="w-full py-3.5 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const NavItem = ({ to, icon: Icon, active, label }: { to: string; icon: any; active: boolean; label: string }) => (
  <Link
    to={to}
    aria-label={label}
    aria-current={active ? "page" : undefined}
    className={`relative group flex flex-col gap-1 items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-2xl transition-all duration-200 ${
      active
        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 scale-105'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium tracking-tight">{label}</span>
    {active && (
      <span className="absolute -bottom-1 lg:top-1/2 lg:-right-1.5 w-1.5 h-1.5 bg-rose-600 rounded-full ring-2 ring-white"></span>
    )}
  </Link>
);

export default function App() {
  const { profile } = useData();
  const location = useLocation();

  const isSetupComplete = profile && profile.setupComplete;

  return (
    <ErrorBoundary>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/add/:id" element={<AddToPlan />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/landing" element={isSetupComplete ? <Navigate to="/" /> : <LandingPage />} />
        <Route path="/onboarding" element={isSetupComplete ? <Navigate to="/" /> : <Onboarding />} />

        {/* APP ROUTES (Protected by Setup Check) */}
        <Route
          path="*"
          element={
            !isSetupComplete ? (
              location.pathname === '/' ? <LandingPage /> : <Navigate to="/landing" />
            ) : location.pathname === '/' ? (
              <Dashboard />
            ) : location.pathname === '/resources' ? (
              <Resources />
            ) : location.pathname === '/settings' ? (
              <SettingsPage />
            ) : location.pathname === '/progress' ? (
              <Progress />
            ) : location.pathname === '/study' ? (
              <Study />
            ) : location.pathname === '/planner' ? (
              <Planner />
            ) : location.pathname === '/tasks' ? (
              <TodoList />
            ) : location.pathname === '/calculator' ? (
              <CalculatorPage />
            ) : location.pathname.startsWith('/subject/') ? (
              <Routes>
                <Route path="/subject/:id" element={<SubjectDetail />} />
              </Routes>
            ) : location.pathname === '/directory' ? (
              <Directory />
            ) : location.pathname.startsWith('/add/') ? (
              <Routes>
                <Route path="/add/:id" element={<AddToPlan />} />
              </Routes>
            ) : (
              // APP SHELL
              <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 text-slate-800 selection:bg-rose-500 selection:text-white">
                {/* Mobile Branding Header */}
                <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-5 py-3 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                      <Hexagon size={22} strokeWidth={2.5} className="fill-rose-500/10" />
                    </div>
                    <span className="font-bold tracking-tight text-slate-900 text-sm font-display">PrepTracker</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link to="/directory" className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-100">
                      Library
                    </Link>
                    <Link to="/settings" aria-label="Open settings" className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-slate-200">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile?.name || 'Student'}`} alt="User" />
                    </Link>
                  </div>
                </div>

                {/* Navigation Sidebar / Dock */}
                <aside className="fixed z-50 transition-all duration-300
                  bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-2 shadow-lg
                  lg:bottom-auto lg:top-1/2 lg:left-6 lg:right-auto lg:h-auto lg:w-20 lg:flex-col lg:rounded-3xl lg:border lg:py-8 lg:gap-6 lg:-translate-y-1/2 lg:shadow-xl lg:bg-white
                ">
                  <Link to="/" className="hidden lg:flex w-12 h-12 rounded-2xl bg-rose-50 items-center justify-center text-rose-600 hover:scale-105 transition-transform">
                    <Hexagon size={28} strokeWidth={2.5} className="fill-rose-500/10" />
                  </Link>

                  <nav className="flex flex-row lg:flex-col w-full justify-evenly lg:gap-3 items-center">
                    <NavItem label="Home" to="/" icon={LayoutGrid} active={location.pathname === '/'} />
                    <NavItem label="Planner" to="/planner" icon={CalendarDays} active={location.pathname === '/planner'} />
                    <NavItem label="Study" to="/study" icon={BookOpen} active={location.pathname === '/study'} />
                    <NavItem label="Tasks" to="/tasks" icon={ListTodo} active={location.pathname === '/tasks'} />
                    <NavItem label="Marks" to="/calculator" icon={Calculator} active={location.pathname === '/calculator'} />
                    <NavItem label="Links" to="/resources" icon={Library} active={location.pathname === '/resources'} />
                    <NavItem label="Settings" to="/settings" icon={Settings} active={location.pathname === '/settings'} />
                  </nav>

                  <div className="hidden lg:flex mt-2 pt-4 border-t border-slate-100 w-full flex-col items-center gap-3">
                    <Link to="/settings" aria-label="Open settings" className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-200 hover:ring-rose-500 transition-all hover:scale-105">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile?.name || 'Student'}`} alt="User" />
                    </Link>
                  </div>
                </aside>

                <main className="flex-1 w-full min-w-0 pt-20 pb-24 px-4 lg:pl-32 lg:pr-10 lg:py-10">
                  {/* Desktop Top Header Bar */}
                  <div className="hidden lg:flex justify-between items-center mb-8 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      <span className="text-rose-600">{profile?.name ? `${profile.name}'s Desk` : 'Study Edition'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to="/directory"
                        className="px-4 py-2 bg-white text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex items-center gap-2"
                      >
                        <Library size={14} className="text-rose-600" /> Browse Course Catalog
                      </Link>
                    </div>
                  </div>

                  <div className="max-w-[1400px] mx-auto h-full">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/subject/:id" element={<SubjectDetail />} />
                      <Route path="/resources" element={<Resources />} />
                      <Route path="/planner" element={<Planner />} />
                      <Route path="/study" element={<Study />} />
                      <Route path="/tasks" element={<TodoList />} />
                      <Route path="/calculator" element={<CalculatorPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                  </div>
                </main>
              </div>
            )
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

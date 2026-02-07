import React, { useState, useEffect, ReactNode, Component } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Library, 
  Calculator, 
  Settings, 
  Bell, 
  Search, 
  Hexagon, 
  Menu, 
  AlertTriangle, 
  RefreshCw, 
  ListTodo,
  Cloud
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import SubjectDetail from './pages/SubjectDetail';
import Resources from './pages/Resources';
import CalculatorPage from './pages/Calculator';
import SettingsPage from './pages/Settings';
import Onboarding from './pages/Onboarding';
import TodoList from './pages/TodoList';
import Auth from './pages/Auth';
import { Profile, UserProgress, UnitStatus } from './types';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

// --- ERROR BOUNDARY COMPONENT ---
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("CRITICAL APP CRASH:", error, errorInfo);
  }

  handleHardReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
             {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
            
            <div className="relative z-10 max-w-md w-full bg-[#0a0a0a] border border-red-900/30 p-8 rounded-3xl shadow-2xl">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                    <AlertTriangle size={32} />
                </div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">System Failure</h1>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed font-mono">
                    The application encountered a non-recoverable data error. This usually happens due to corrupt local storage or an interrupted update.
                </p>
                <button 
                    onClick={this.handleHardReset}
                    className="w-full py-4 bg-red-600 text-white font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-3"
                >
                    <RefreshCw size={18} /> Execute Hard Reset
                </button>
                <p className="mt-6 text-[10px] text-slate-600 uppercase tracking-widest">Error Code: RENDER_PROCESS_TERMINATED</p>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const NavItem = ({ to, icon: Icon, active }: { to: string, icon: any, active: boolean }) => (
  <Link 
    to={to} 
    className={`relative group flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-2xl lg:rounded-3xl transition-all duration-300 ${
      active 
        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-110' 
        : 'text-white/40 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    {active && (
      <span className="absolute -bottom-2 lg:top-1/2 lg:-right-2 w-1 h-1 lg:w-1.5 lg:h-1.5 bg-[#E11D48] rounded-full shadow-[0_0_10px_#E11D48]"></span>
    )}
  </Link>
);

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      // Load profile and progress from Supabase
      const fetchData = async () => {
        // 1. Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileData && !profileError) {
          setProfile({
            name: profileData.name,
            prn: profileData.prn,
            theme: profileData.theme as 'light' | 'dark',
            selectedSubjects: profileData.selected_subjects,
            setupComplete: profileData.setup_complete,
            group: profileData.group,
            streak: profileData.streak,
            lastStudyDate: profileData.last_study_date,
          });
        }

        // 2. Fetch Progress
        const { data: progressData, error: progressError } = await supabase
          .from('subject_progress')
          .select('*')
          .eq('user_id', session.user.id);

        if (progressData && !progressError) {
          setUserProgress(progressData.map(p => ({
            unitId: p.unit_id,
            status: p.status as UnitStatus,
            pyqsCompleted: p.pyqs_completed
          })));
        }

        // 3. Migration Logic: If cloud profile is empty but local exists, migrate
        if (!profileData && !profileError) {
           const localProfile = localStorage.getItem('sppu_profile');
           if (localProfile) {
              const parsed = JSON.parse(localProfile);
              await supabase.from('profiles').upsert({
                 id: session.user.id,
                 name: parsed.name,
                 theme: parsed.theme,
                 selected_subjects: parsed.selectedSubjects,
                 setup_complete: parsed.setupComplete,
                 streak: parsed.streak,
                 last_study_date: parsed.lastStudyDate
              });
              // Refresh state
              setProfile(parsed);
           }

           const localTasks = localStorage.getItem('sppu_tasks');
           if (localTasks) {
              const tasks = JSON.parse(localTasks);
              for (const t of tasks) {
                 await supabase.from('tasks').insert({
                    user_id: session.user.id,
                    text: t.text,
                    completed: t.completed,
                    priority: t.priority,
                    category: t.category,
                    due_date: t.dueDate,
                    created_at: t.createdAt
                 });
              }
           }

           const localProgress = localStorage.getItem('sppu_user_progress');
           if (localProgress) {
              const progress = JSON.parse(localProgress);
              for (const p of progress) {
                  const subjectId = p.unitId.split('-')[0];
                  if (subjectId) {
                      await supabase.from('subject_progress').upsert({
                         user_id: session.user.id,
                         subject_id: subjectId,
                         unit_id: p.unitId,
                         status: p.status,
                         pyqs_completed: p.pyqsCompleted,
                         updated_at: new Date().toISOString()
                      }, { onConflict: 'user_id,subject_id,unit_id' });
                  }
              }
           }
        }
      };
      fetchData();
    }
  }, [session]);

  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-[#E11D48] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <ErrorBoundary>
        <Auth onSession={setSession} />
      </ErrorBoundary>
    );
  }

  // If we are not setup, show Onboarding (wrapped in ErrorBoundary handled by parent or just return directly)
  if (!profile || !profile.setupComplete) {
     return (
        <ErrorBoundary>
            <Onboarding onComplete={setProfile} />
        </ErrorBoundary>
     );
  }

  return (
    <ErrorBoundary>
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#030303] text-slate-200 selection:bg-[#E11D48] selection:text-white overflow-hidden">
        
        {/* Mobile Branding Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center text-[#E11D48]">
                <Hexagon size={24} strokeWidth={2.5} className="fill-[#E11D48]/10" />
            </div>
            <span className="font-bold tracking-widest uppercase text-xs text-white">PrepTracker</span>
            </div>
            <Link to="/settings" className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/10">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}`} alt="User" />
            </Link>
        </div>

        {/* Adaptive Navigation Dock */}
        <aside className="fixed z-50 transition-all duration-500
            bottom-6 left-4 right-4 h-20 glass-panel rounded-[2.5rem] flex items-center justify-around px-2 shadow-2xl
            lg:bottom-auto lg:top-1/2 lg:left-6 lg:right-auto lg:h-auto lg:w-24 lg:flex-col lg:rounded-[3rem] lg:py-10 lg:gap-8 lg:-translate-y-1/2 lg:shadow-none
        ">
            <div className="hidden lg:flex w-14 h-14 items-center justify-center text-[#E11D48] mb-4">
            <Hexagon size={32} strokeWidth={2.5} className="fill-[#E11D48]/10" />
            </div>
            
            <nav className="flex flex-row lg:flex-col w-full justify-evenly lg:gap-6 items-center">
            <NavItem to="/" icon={LayoutGrid} active={location.pathname === '/'} />
            <NavItem to="/resources" icon={Library} active={location.pathname === '/resources'} />
            <NavItem to="/tasks" icon={ListTodo} active={location.pathname === '/tasks'} />
            <NavItem to="/calculator" icon={Calculator} active={location.pathname === '/calculator'} />
            <NavItem to="/settings" icon={Settings} active={location.pathname === '/settings'} />
            </nav>

            <div className="hidden lg:flex mt-4 pt-8 border-t border-white/5 w-full flex-col items-center gap-6">
            <div className="relative group">
                <div className="absolute inset-0 bg-[#E11D48] rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E11D48] transition-all">
                    <Cloud size={20} />
                </div>
                <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-white text-black text-[8px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                    Cloud Matrix Active
                </div>
            </div>
            <button className="w-12 h-12 rounded-full bg-gradient-to-br from-white/5 to-white/0 border border-white/5 flex items-center justify-center hover:border-white/20 transition-all text-white/50 hover:text-white group">
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
            <Link to="/settings" className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10 hover:ring-white/40 transition-all hover:scale-110">
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
            <div className="flex items-center gap-4 text-sm font-medium text-white/40">
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span className="text-[#E11D48]">Engineering Cycle</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={18} />
                    <input 
                    type="text" 
                    placeholder="Search anything..."
                    className="bg-white/5 border border-white/5 rounded-full pl-12 pr-6 py-3 text-xs font-medium w-64 focus:w-80 focus:bg-white/10 focus:border-white/10 outline-none transition-all placeholder:text-white/20"
                    />
                </div>
            </div>
            </div>

            <div className="max-w-[1600px] mx-auto h-full">
            <Routes>
                <Route path="/" element={<Dashboard selectedIds={profile.selectedSubjects || []} userProgress={userProgress} profile={profile} />} />
                <Route path="/subject/:id" element={<SubjectDetail />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/tasks" element={<TodoList />} />
                <Route path="/calculator" element={<CalculatorPage selectedIds={profile.selectedSubjects || []} />} />
                <Route path="/settings" element={<SettingsPage profile={profile} setProfile={setProfile} />} />
            </Routes>
            </div>
        </main>
        
        {/* Background Decor */}
        <div className="fixed top-0 right-0 w-[500px] lg:w-[800px] h-[500px] lg:h-[800px] bg-[#E11D48] opacity-[0.03] blur-[100px] lg:blur-[150px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="fixed bottom-0 left-0 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-blue-600 opacity-[0.03] blur-[100px] lg:blur-[150px] rounded-full pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3"></div>
        </div>
    </ErrorBoundary>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { User, Save, RotateCcw, Trash2, ShieldCheck, Cpu, Power, CreditCard, Terminal, AlertTriangle, Upload, Download, Database, HardDrive, X, Check, AlertOctagon, FileJson, Loader2, ScanLine, Wifi, LogOut, Cloud } from 'lucide-react';
import { Profile } from '../types';
import { SUBJECTS } from '../constants';
import { supabase } from '../lib/supabase';

// --- MICRO-COMPONENTS ---

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
            <div className={`flex items-center gap-4 px-6 py-4 rounded-xl border backdrop-blur-xl shadow-2xl ${
                type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
                {type === 'success' ? <Check size={18} /> : <AlertOctagon size={18} />}
                <span className="text-sm font-mono font-bold uppercase tracking-wider">{message}</span>
            </div>
        </div>
    );
};

const ConfirmModal = ({ isOpen, title, description, onConfirm, onCancel, isDanger = false }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`w-full max-w-md bg-[#050505] border rounded-3xl p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 ${
                isDanger ? 'border-red-500/30' : 'border-white/10'
            }`}>
                <div className="flex items-center gap-3 mb-6">
                    {isDanger ? <AlertTriangle className="text-red-500" size={24} /> : <Terminal className="text-[#E11D48]" size={24} />}
                    <h3 className={`text-xl font-display font-bold ${isDanger ? 'text-red-500' : 'text-white'}`}>{title}</h3>
                </div>
                
                <p className="text-sm text-slate-400 leading-relaxed font-mono mb-8">
                    {description}
                </p>

                <div className="flex gap-4">
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg ${
                            isDanger 
                            ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-900/20' 
                            : 'bg-white text-black hover:scale-105'
                        }`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const SettingsPage: React.FC<{ profile: Profile, setProfile: any }> = ({ profile, setProfile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };
  const [dragActive, setDragActive] = useState(false);
  
  // State for Micro-interactions
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isBusy, setIsBusy] = useState<{ active: boolean, message: string }>({ active: false, message: '' });
  
  // Modal State Logic
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, type: 'RESET' | 'FORMAT' | null }>({
      isOpen: false, type: null
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
      setToast({ message: msg, type });
  };

  const update = (f: string, v: any) => {
      const newProfile = { ...profile, [f]: v };
      setProfile(newProfile);
      localStorage.setItem('sppu_profile', JSON.stringify(newProfile));
  };

  const manualSave = () => {
      localStorage.setItem('sppu_profile', JSON.stringify(profile));
      showToast("Settings Saved", 'success');
  }

  // --- MODAL HANDLERS ---

  const initiateReset = () => setModalConfig({ isOpen: true, type: 'RESET' });
  const initiateFormat = () => setModalConfig({ isOpen: true, type: 'FORMAT' });
  const closeModal = () => setModalConfig({ isOpen: false, type: null });

  const handleModalConfirm = () => {
      closeModal();
      
      if (modalConfig.type === 'RESET') {
          const newProfile = { ...profile, setupComplete: false };
          setProfile(newProfile);
          localStorage.setItem('sppu_profile', JSON.stringify(newProfile));
          showToast("Configuration Reset", 'success');
      } 
      else if (modalConfig.type === 'FORMAT') {
          // ACTIVATE LOCKOUT MODE
          setIsBusy({ active: true, message: 'WIPING DATA...' });
          
          // Critical Operation: Hard Reset sequence
          setTimeout(() => {
             localStorage.clear();
             // Force reload to root to prevent hash router ghosts
             window.location.reload();
          }, 1500);
      }
  };

  // --- DATA PORTABILITY ENGINE ---

  const exportData = () => {
      try {
          const rawProfile = localStorage.getItem('sppu_profile');
          const rawProgress = localStorage.getItem('sppu_user_progress');
          const rawMarks = localStorage.getItem('sppu_calculator_marks');
          const rawResources = localStorage.getItem('sppu_custom_resources');

          const payload = {
              profile: rawProfile ? JSON.parse(rawProfile) : null,
              progress: rawProgress ? JSON.parse(rawProgress) : [],
              marks: rawMarks ? JSON.parse(rawMarks) : {},
              resources: rawResources ? JSON.parse(rawResources) : []
          };

          const backup = {
              metadata: {
                  version: "2.4.1",
                  timestamp: new Date().toISOString(),
                  type: "SPPU_PREPTRACKER_BACKUP",
                  agent: navigator.userAgent
              },
              data: payload
          };

          const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `PrepTracker_Backup_${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          showToast("Backup Package Generated", 'success');
      } catch (err) {
          console.error("Export Error:", err);
          showToast("Export Failed: Internal Data Error", 'error');
      }
  };

  const validateAndRestore = (content: string) => {
      // ACTIVATE LOCKOUT MODE
      setIsBusy({ active: true, message: 'CHECKING BACKUP...' });

      setTimeout(() => {
        try {
            const parsed = JSON.parse(content);
            let restored = false;

            // Helper to check critical profile structure to prevent app crash
            const isValidProfile = (p: any) => p && Array.isArray(p.selectedSubjects) && typeof p.name === 'string';

            // STRATEGY 1: New Standard (Metadata wrapped)
            if (parsed.metadata && parsed.data) {
                const { profile: p, progress, marks, resources } = parsed.data;
                if (isValidProfile(p)) {
                    localStorage.setItem('sppu_profile', JSON.stringify(p));
                    if (progress) localStorage.setItem('sppu_user_progress', JSON.stringify(progress));
                    if (marks) localStorage.setItem('sppu_calculator_marks', JSON.stringify(marks));
                    if (resources) localStorage.setItem('sppu_custom_resources', JSON.stringify(resources));
                    restored = true;
                }
            } 
            // STRATEGY 2: Legacy/Raw Object
            else if (parsed.profile) {
                 const p = typeof parsed.profile === 'string' ? JSON.parse(parsed.profile) : parsed.profile;
                 
                 if (isValidProfile(p)) {
                     localStorage.setItem('sppu_profile', JSON.stringify(p));
                     if (parsed.progress) localStorage.setItem('sppu_user_progress', typeof parsed.progress === 'string' ? parsed.progress : JSON.stringify(parsed.progress));
                     if (parsed.marks) localStorage.setItem('sppu_calculator_marks', typeof parsed.marks === 'string' ? parsed.marks : JSON.stringify(parsed.marks));
                     if (parsed.resources) localStorage.setItem('sppu_custom_resources', typeof parsed.resources === 'string' ? parsed.resources : JSON.stringify(parsed.resources));
                     restored = true;
                 }
            }

            if (restored) {
                setIsBusy({ active: true, message: 'RESTARTING APP...' });
                setTimeout(() => window.location.reload(), 1000);
            } else {
                setIsBusy({ active: false, message: '' });
                showToast("Error: Invalid Backup Structure", 'error');
            }
        } catch (e) {
            console.error(e);
            setIsBusy({ active: false, message: '' });
            showToast("Error: Corrupt File Data", 'error');
        }
      }, 1000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => validateAndRestore(ev.target?.result as string);
      reader.readAsText(file);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
          setDragActive(true);
      } else if (e.type === "dragleave") {
          setDragActive(false);
      }
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const file = e.dataTransfer.files[0];
          if (file.type === "application/json" || file.name.endsWith('.json')) {
              const reader = new FileReader();
              reader.onload = (ev) => validateAndRestore(ev.target?.result as string);
              reader.readAsText(file);
          } else {
              showToast("Invalid File Type. JSON Required.", 'error');
          }
      }
  };

  const selectedSubjectsList = SUBJECTS.filter(s => profile.selectedSubjects.includes(s.id));

  return (
    <div className="min-h-screen relative animate-in fade-in duration-700 pb-20">
      
      {/* SYSTEM LOCKOUT OVERLAY */}
      {isBusy.active && (
        <div className="fixed inset-0 z-[100] bg-[#030303]/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#E11D48] rounded-full blur-xl opacity-20 animate-pulse"></div>
                <Loader2 size={64} className="text-[#E11D48] animate-spin relative z-10" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white tracking-[0.2em] uppercase animate-pulse mb-2">
                {isBusy.message}
            </h2>
            <div className="h-1 w-64 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#E11D48] animate-[progress_1.5s_ease-in-out_infinite] w-full origin-left"></div>
            </div>
            <p className="text-[10px] font-mono text-slate-500 mt-4 uppercase tracking-widest">Do not close window</p>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Confirmation Dialog */}
      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.type === 'RESET' ? 'Re-Initialize System' : 'Format Local Drive'}
        description={modalConfig.type === 'RESET' 
            ? 'This will reset your subject selection configuration. Your progress in individual units will remain, but you will need to run the onboarding sequence again.'
            : 'CRITICAL WARNING: This action will permanently wipe all academic records, subject progress, and user identity from this device. This process is irreversible.'
        }
        onConfirm={handleModalConfirm}
        onCancel={closeModal}
        isDanger={modalConfig.type === 'FORMAT'}
      />

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto pt-8 lg:pt-12 px-4">
        
        {/* Header */}
        <header className="mb-16 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <div className="flex items-center gap-2 text-[#E11D48] mb-2">
                    <Terminal size={16} />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">User & System Settings</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-display font-bold text-white tracking-tighter leading-none">
                    System <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-700">Settings</span>
                </h1>
            </div>
            <div className="flex items-center gap-3">
                 <div className="px-4 py-2 rounded border border-white/10 bg-white/5 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">System Operational</span>
                 </div>
                 {session && (
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded border border-red-500/30 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                    >
                        <LogOut size={12} /> Sign Out
                    </button>
                 )}
            </div>
        </header>

        <div className="space-y-8">

            {/* SECTION: OPERATOR IDENTITY */}
            <section className="relative group bg-[#050505] border border-white/10 rounded-3xl p-8 overflow-hidden hover:border-white/20 transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <User size={120} strokeWidth={0.5} />
                </div>
                
                <h2 className="text-xl font-display font-bold text-white mb-8 flex items-center gap-3">
                    <CreditCard size={20} className="text-[#E11D48]" />
                    Operator Identity
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Your Name</label>
                            <input 
                                type="text" 
                                value={profile.name}
                                onChange={(e) => update('name', e.target.value)}
                                className="w-full bg-transparent border-b border-white/20 py-2 text-2xl font-display font-bold text-white focus:border-[#E11D48] focus:outline-none transition-colors placeholder:text-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Student ID / PRN</label>
                            <input 
                                type="text" 
                                value={profile.prn || ''}
                                onChange={(e) => update('prn', e.target.value)}
                                placeholder="NOT_SET"
                                className="w-full bg-transparent border-b border-white/20 py-2 text-xl font-mono text-slate-300 focus:border-[#E11D48] focus:outline-none transition-colors placeholder:text-white/10"
                            />
                        </div>
                     </div>

                     {/* Visual ID Card Preview - Revamped */}
                     <div className="relative w-full aspect-[1.58/1] rounded-2xl bg-[#020202] overflow-hidden border border-white/10 group shadow-2xl hover:scale-[1.02] transition-transform duration-500">
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(225,29,72,0.1),transparent_70%)]"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.02)_50%,rgba(255,255,255,0.02)_75%,transparent_75%,transparent)] bg-[size:4px_4px]"></div>
                        
                        {/* Scanline Animation */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E11D48]/5 to-transparent h-1/4 animate-[scan_4s_linear_infinite] pointer-events-none"></div>

                        {/* Content Container */}
                        <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full">
                            
                            {/* Top Row: Chip & Header */}
                            <div className="flex justify-between items-start">
                                {/* Chip Simulation */}
                                <div className="w-12 h-9 rounded-md bg-gradient-to-br from-[#d4af37] via-[#f3e5ab] to-[#aa8c2c] border border-yellow-500/50 relative overflow-hidden flex items-center justify-center shadow-lg">
                                    <div className="absolute inset-0 grid grid-cols-2 gap-px bg-black/10">
                                        <div className="border-r border-b border-black/20"></div>
                                        <div className="border-b border-black/20"></div>
                                        <div className="border-r border-black/20"></div>
                                        <div></div>
                                    </div>
                                    <Cpu size={14} className="text-yellow-900/80 relative z-10 opacity-70" />
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-2 mb-1">
                                         <Wifi size={12} className="text-white/30" />
                                         <span className="text-[8px] font-bold border border-white/20 px-1.5 py-0.5 rounded text-white/50 bg-white/5">PREPTRACKER ELITE</span>
                                    </div>
                                    <p className="text-[7px] font-mono text-white/20 uppercase tracking-widest">Secure Access Protocol</p>
                                </div>
                            </div>

                            {/* Middle Row: Identity */}
                            <div className="mt-2">
                                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase tracking-tight drop-shadow-lg truncate">
                                    {profile.name || 'UNKNOWN'}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse"></span>
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Operator</span>
                                </div>
                            </div>

                            {/* Bottom Row: Metadata */}
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5 opacity-70">Universal PRN Identifier</span>
                                    <p className="font-mono font-bold text-[#E11D48] tracking-[0.2em] text-sm sm:text-base drop-shadow-[0_0_10px_rgba(225,29,72,0.4)]">
                                        {profile.prn || '0000000000'}
                                    </p>
                                </div>

                                {/* Holographic Watermark Simulation */}
                                <div className="relative w-12 h-12 flex items-center justify-center opacity-30">
                                     <ScanLine size={32} className="text-white" />
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </section>


            {/* SECTION: ACADEMIC CONFIGURATION */}
            <section className="bg-[#050505] border border-white/10 rounded-3xl p-8">
                <div className="flex justify-between items-start mb-8">
                    <h2 className="text-xl font-display font-bold text-white flex items-center gap-3">
                        <Cpu size={20} className="text-[#E11D48]" />
                        Active Modules
                    </h2>
                    <button 
                        onClick={initiateReset}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-[#E11D48] text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 border border-white/5"
                    >
                        <RotateCcw size={12} /> Re-Initialize
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedSubjectsList.map(sub => (
                        <div key={sub.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div>
                            <div>
                                <p className="text-xs font-bold text-white leading-tight">{sub.name}</p>
                                <p className="text-[9px] font-mono text-slate-500 mt-1">{sub.code}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION: DATA PORTABILITY */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                           <HardDrive size={16} /> Data Portability
                        </h3>
                        <p className="text-xs text-slate-500 font-mono leading-relaxed mb-6">
                            Backup your entire academic state to a local JSON file.
                        </p>
                        
                        <div className="space-y-4">
                            {/* Drag and Drop Zone */}
                            <div 
                                onDragEnter={handleDrag} 
                                onDragLeave={handleDrag} 
                                onDragOver={handleDrag} 
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                                    border border-dashed rounded-xl p-6 text-center transition-all cursor-pointer group
                                    ${dragActive 
                                        ? 'border-[#E11D48] bg-[#E11D48]/10 scale-[1.02]' 
                                        : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                                    }
                                `}
                            >
                                <div className="flex flex-col items-center gap-3 pointer-events-none">
                                    <div className={`p-3 rounded-full transition-colors ${dragActive ? 'bg-[#E11D48]/20 text-[#E11D48]' : 'bg-white/5 text-slate-400'}`}>
                                        <Upload size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white uppercase tracking-wider">
                                            {dragActive ? "Drop to Restore" : "Restore Data"}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-mono mt-1">
                                            Drop .JSON backup file here
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={handleFileSelect} 
                              className="hidden" 
                              accept=".json"
                            />
                            
                            <button 
                              onClick={exportData}
                              className="w-full py-3 bg-white/5 border border-white/10 text-white font-bold uppercase text-[10px] tracking-[0.2em] rounded-lg hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                            >
                              <Download size={12} /> Download Backup
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        onClick={manualSave}
                        className="mt-6 w-full py-3 bg-white/5 border border-white/10 text-slate-300 font-bold uppercase text-[10px] tracking-[0.2em] rounded-lg hover:bg-white/10 transition-transform flex items-center justify-center gap-2"
                    >
                        <Save size={12} /> Force Save State
                    </button>
                </div>

                <div className="bg-[#050505] border border-red-500/20 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-red-900/5 group-hover:bg-red-900/10 transition-colors"></div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold text-red-500 mb-2 flex items-center gap-2"><AlertTriangle size={16} /> Danger Zone</h3>
                        <p className="text-xs text-red-400/60 font-mono leading-relaxed">
                            Irreversible action. Wipes all progress vectors, marks, and subject configurations from this browser.
                        </p>
                    </div>
                    <button 
                        onClick={initiateFormat}
                        className="relative z-10 mt-6 w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 font-bold uppercase text-[10px] tracking-[0.2em] rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <Trash2 size={14} /> Format Drive
                    </button>
                </div>
            </section>

        </div>

        <div className="mt-12 text-center">
            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest flex items-center justify-center gap-2">
                PrepTracker OS v2.5.0 • <Cloud size={10} className="text-[#E11D48]" /> Cloud Active {session?.user?.email && `• ${session.user.email}`}
            </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

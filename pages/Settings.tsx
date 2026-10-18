
import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Trash2, Terminal, AlertTriangle, Upload, Download, Check, AlertOctagon, Loader2, ChevronDown, Share2, X } from 'lucide-react';
import { SUBJECTS } from '../constants';
import { useData } from '../context/DataContext';
import { BackupData, MAX_BYTES, Preview, createBackup, hasRollback, parseBackup, readState, restoreBackup, rollbackRestore, wipeAll } from '../lib/backup';
import { useModalA11y } from '../components/useModalA11y';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

// --- MICRO-COMPONENTS ---

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 6000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div role="status" className="fixed bottom-28 left-4 right-4 lg:bottom-8 lg:left-auto lg:right-8 z-[60] animate-in slide-in-from-bottom-4 fade-in duration-300">
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
    const dialogRef = useModalA11y(isOpen, onCancel);
    if (!isOpen) return null;

    return (
        <div role="dialog" aria-modal="true" aria-label={title} ref={dialogRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`w-full max-w-md bg-[#050505] border rounded-3xl p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 ${
                isDanger ? 'border-red-500/30' : 'border-white/10'
            }`}>
                <div className="flex items-center gap-3 mb-6">
                    {isDanger ? <AlertTriangle className="text-red-500" size={24} /> : <Terminal className="text-[#F63C49]" size={24} />}
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

const SettingsPage: React.FC = () => {
  const { profile, setProfile } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);

  // State for Micro-interactions
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isBusy, setIsBusy] = useState<{ active: boolean, message: string }>({ active: false, message: '' });
  
  // Modal State Logic
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, type: 'RESET' | 'FORMAT' | 'RESTORE' | null }>({
      isOpen: false, type: null
  });
  const [preview, setPreview] = useState<Preview | null>(null);
  const [canUndo] = useState(() => hasRollback(localStorage));

  if (!profile) return null;

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
      setToast({ message: msg, type });
  };

  const update = async (f: string, v: any) => {
      const newProfile = { ...profile, [f]: v };
      setProfile(newProfile);
  };

  // --- MODAL HANDLERS ---

  const initiateReset = () => setModalConfig({ isOpen: true, type: 'RESET' });
  const initiateFormat = () => setModalConfig({ isOpen: true, type: 'FORMAT' });
  const closeModal = () => { setModalConfig({ isOpen: false, type: null }); if (modalConfig.type === 'RESTORE') setPreview(null); };

  const handleModalConfirm = () => {
      closeModal();
      
      if (modalConfig.type === 'RESET') {
          const newProfile = { ...profile, setupComplete: false };
          setProfile(newProfile);
          showToast("Subject selection reset", 'success');
      } 
      else if (modalConfig.type === 'FORMAT') {
          // ACTIVATE LOCKOUT MODE
          setIsBusy({ active: true, message: 'WIPING DATA...' });
          setTimeout(() => {
             wipeAll(localStorage);
             window.location.hash = '#/';
             window.location.reload();
          }, 600);
      }
      else if (modalConfig.type === 'RESTORE' && preview) {
          try {
              restoreBackup(localStorage, preview.data as BackupData);
              setIsBusy({ active: true, message: 'RESTORING...' });
              setTimeout(() => window.location.reload(), 500);
          } catch (e: any) {
              showToast(e?.message || 'Restore failed. Your data was not changed.', 'error');
          }
          setPreview(null);
      }
  };

  // --- DATA PORTABILITY ENGINE ---

  // Last backup date and nudge snooze live in their own small keys (not part of the backup itself).
  const LAST_KEY = 'sppu_last_backup';
  const SNOOZE_KEY = 'sppu_backup_nudge_until';
  const [lastBackup, setLastBackup] = useState<number | null>(() => {
      const v = Number(localStorage.getItem(LAST_KEY));
      return v > 0 ? v : null;
  });
  const [nudgeHidden, setNudgeHidden] = useState(() => Number(localStorage.getItem(SNOOZE_KEY)) > Date.now());
  const WEEK = 7 * 86400000;
  // Nothing worth backing up yet: no progress, tasks, marks or custom links.
  const hasData = (() => {
      try {
          const d = readState(localStorage);
          return d.progress.length + d.tasks.length + d.resources.length + Object.keys(d.marks).length > 0;
      } catch { return true; }
  })();
  const nudgeDue = hasData && !nudgeHidden && (lastBackup === null || Date.now() - lastBackup > WEEK);
  const dismissNudge = () => {
      localStorage.setItem(SNOOZE_KEY, String(Date.now() + WEEK));
      setNudgeHidden(true);
  };
  const stampBackup = () => {
      const t = Date.now();
      localStorage.setItem(LAST_KEY, String(t));
      setLastBackup(t);
      setNudgeHidden(true);
  };
  const lastBackupLabel = lastBackup
      ? new Date(lastBackup).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      : null;

  const makeBackupFile = () => {
      const backup = createBackup(localStorage);
      const name = `PrepTracker_LocalBackup_${new Date().toISOString().split('T')[0]}.json`;
      const file = new File([JSON.stringify(backup, null, 2)], name, { type: 'application/json' });
      return file;
  };

  const downloadData = () => {
      try {
          const file = makeBackupFile();
          const url = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          stampBackup();
          showToast("Backup downloaded", 'success');
      } catch (err: any) {
          console.error("Export Error:", err);
          showToast(err?.message || "Export failed", 'error');
      }
  };

  // Opens the phone's share sheet (WhatsApp, Drive, Files). Falls back to a plain download.
  const canShareFile = typeof navigator !== 'undefined' && typeof navigator.canShare === 'function' &&
      (() => { try { return navigator.canShare({ files: [new File(['{}'], 'x.json', { type: 'application/json' })] }); } catch { return false; } })();
  const exportData = async () => {
      if (!canShareFile) { downloadData(); return; }
      try {
          const file = makeBackupFile();
          await navigator.share({ files: [file], title: 'PrepTracker backup' });
          stampBackup();
          showToast("Backup shared", 'success');
      } catch (err: any) {
          if (err?.name === 'AbortError') return;
          console.error("Share Error:", err);
          downloadData();
      }
  };

  // Step 1: read and check the file. Nothing is written until the user confirms the preview.
  const validateAndRestore = (content: string) => {
      try {
          const p = parseBackup(content, readState(localStorage));
          setPreview(p);
          setModalConfig({ isOpen: true, type: 'RESTORE' });
      } catch (e: any) {
          console.error(e);
          showToast(e?.message || 'Could not read that backup.', 'error');
      }
  };

  const undoRestore = () => {
      try {
          rollbackRestore(localStorage);
          setIsBusy({ active: true, message: 'UNDOING RESTORE...' });
          setTimeout(() => window.location.reload(), 500);
      } catch (e: any) {
          showToast(e?.message || 'Could not undo.', 'error');
      }
  };

  const readFile = (file: File) => {
      if (file.size > MAX_BYTES) { showToast('That file is over 5 MB.', 'error'); return; }
      const reader = new FileReader();
      reader.onload = (ev) => validateAndRestore(String(ev.target?.result ?? ''));
      reader.onerror = () => showToast('Could not read that file.', 'error');
      reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      readFile(file);
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
              readFile(file);
          } else {
              showToast("Invalid File Type. JSON Required.", 'error');
          }
      }
  };

  const examStart = profile.examStartDate ? new Date(`${profile.examStartDate}T00:00:00`) : null;
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
  const examDiff = examStart && !isNaN(examStart.getTime())
    ? Math.round((examStart.getTime() - startOfToday.getTime()) / 86400000)
    : null;
  const examValue = examDiff === null ? '--' : examDiff > 0 ? `${examDiff}d` : examDiff === 0 ? 'Today' : 'Now';
  const examSub = examDiff === null ? 'Set exam date below' : examDiff >= 0 && examStart
    ? `Starts ${examStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
    : 'Exams started';
  // Hidden easter eggs (no persistence, no extra tab stops)
  const [stopPop, setStopPop] = useState(false);
  const [unitIdx, setUnitIdx] = useState(0);
  const [spin, setSpin] = useState(0);
  const avatarTaps = useRef({ n: 0, t: 0 as any });
  const popStop = () => { setStopPop(true); setTimeout(() => setStopPop(false), 2200); };
  const tapAvatar = () => {
      const a = avatarTaps.current;
      clearTimeout(a.t);
      a.n += 1;
      if (a.n >= 5) { a.n = 0; setSpin(v => v + 1); }
      else a.t = setTimeout(() => { a.n = 0; }, 1500);
  };
  const [examOpen, setExamOpen] = useState(false);
  const examSubjects = SUBJECTS.filter(su => profile.selectedSubjects?.includes(su.id));
  const examSetCount = examSubjects.filter(su => (profile.examDates || {})[su.id]).length;
  const unit = ['days', 'hours', 'weeks'][unitIdx];
  const shownValue = examDiff !== null && examDiff > 0
      ? (unit === 'days' ? `${examDiff}d` : unit === 'hours' ? `${examDiff * 24}h` : `${(examDiff / 7).toFixed(1)}w`)
      : examValue;
  const selectedSubjectsList = SUBJECTS.filter(s => profile.selectedSubjects.includes(s.id));

  return (
    <div className="min-h-screen relative animate-in fade-in duration-700 pb-20">
      
      {/* SYSTEM LOCKOUT OVERLAY */}
      {isBusy.active && (
        <div className="fixed inset-0 z-[100] bg-[#030303]/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#D61A40] rounded-full blur-xl opacity-20 animate-pulse"></div>
                <Loader2 size={64} className="text-[#F63C49] animate-spin relative z-10" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white tracking-[0.2em] uppercase animate-pulse mb-2">
                {isBusy.message}
            </h2>
            <div className="h-1 w-64 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#D61A40] animate-[progress_1.5s_ease-in-out_infinite] w-full origin-left"></div>
            </div>
            <p className="text-[10px] font-mono text-slate-500 mt-4 uppercase tracking-widest">Do not close window</p>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Confirmation Dialog */}
      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.type === 'RESET' ? 'Change subjects?' : modalConfig.type === 'RESTORE' ? 'Replace saved data?' : 'Erase all data?'}
        description={modalConfig.type === 'RESET' 
            ? 'This will reset your subject selection configuration. Your progress in individual units will remain, but you will need to run the onboarding sequence again.'
            : modalConfig.type === 'RESTORE' && preview
            ? `${plural(preview.counts.courses, 'course')}, ${plural(preview.counts.units, 'unit record')}, ${plural(preview.counts.tasks, 'task')}, ${plural(preview.counts.resources, 'custom resource')}, marks for ${plural(preview.counts.marksCourses, 'course')}. This replaces the data saved in this browser. A copy of your current data is kept so you can undo.${preview.warnings.length ? ' Note: ' + preview.warnings.join(' ') : ''}`
            : 'This permanently wipes your progress, tasks, marks, links and name from this browser. It cannot be undone. Download a backup first if you might want anything back.'
        }
        onConfirm={handleModalConfirm}
        onCancel={closeModal}
        isDanger={modalConfig.type === 'FORMAT'}
      />

      <div className="max-w-3xl mx-auto pt-4 lg:pt-8 px-4">

        {/* Header */}
        <header className="relative mb-12 lg:mb-14">
            <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F63C49]"></span>Saved on this device
            </span>
            <h1 className="text-white leading-[0.95]">
                <span className="block text-6xl lg:text-8xl tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>Settings<span onClick={popStop} className={`inline-block text-[#F63C49] transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${stopPop ? 'scale-[1.6]' : 'scale-100'}`}>.</span></span>
            </h1>
            <p aria-hidden="true" className={`absolute left-0 -bottom-6 text-xs text-slate-500 transition-opacity duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${stopPop ? 'opacity-100' : 'opacity-0'}`}>Full stop. Literally.</p>
        </header>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 surface-1 p-5 lg:p-7 mb-5 lg:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="relative flex items-center gap-4 min-w-0">
                <div onClick={tapAvatar} style={{ transform: `rotate(${spin * 360}deg)` }} className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white overflow-hidden border border-white/20 shrink-0 transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                    <p className="text-2xl lg:text-3xl font-display font-bold text-white truncate">{profile.name || 'Your name'}</p>
                    <p className="text-xs font-mono text-slate-400 tracking-widest mt-1 truncate">{profile.prn || 'PRN not set'}</p>
                </div>
            </div>
            <div className="relative sm:text-right border-t sm:border-t-0 border-white/10 pt-5 sm:pt-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{examDiff !== null && examDiff > 0 ? `${unit} to exam` : 'Days to exam'}</p>
                <p onClick={() => setUnitIdx(i => (i + 1) % 3)} className="leading-none text-6xl lg:text-7xl mt-2 text-[#F63C49]" style={{ fontFamily: "'Instrument Serif', serif" }}>{shownValue}</p>
                <p className="text-xs text-slate-500 mt-2">{examSub}</p>
            </div>
        </section>

        <div className="space-y-5 lg:space-y-6">

            {/* PROFILE */}
            <section className="surface-1 rounded-3xl p-5 lg:p-7">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 mb-5">Your profile</h2>

                <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label htmlFor="profile-name" className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Your Name</label>
                            <input
                                id="profile-name"
                                type="text"
                                value={profile.name}
                                onChange={(e) => update('name', e.target.value)}
                                className="w-full surface-2 border border-white/10 rounded-2xl px-4 h-12 text-sm font-medium text-white focus:border-[#F63C49] outline-none transition-colors duration-[250ms] placeholder:text-slate-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="profile-prn" className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Student ID / PRN</label>
                            <input
                                id="profile-prn"
                                type="text"
                                value={profile.prn || ''}
                                onChange={(e) => update('prn', e.target.value)}
                                placeholder="Not set"
                                className="w-full surface-2 border border-white/10 rounded-2xl px-4 h-12 text-sm font-mono text-slate-200 focus:border-[#F63C49] outline-none transition-colors duration-[250ms] placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="exam-start" className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">First exam date (for Days to Exam)</label>
                        <div className="relative group">
                            <input
                                id="exam-start"
                                type="date"
                                value={profile.examStartDate || ''}
                                onChange={(e) => update('examStartDate', e.target.value || undefined)}
                                className="w-full surface-2 border border-white/10 rounded-2xl px-4 h-12 text-xs font-mono text-slate-300 focus:border-[#F63C49] outline-none transition-colors uppercase [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Per-subject exam dates (drive the dashboard timeline) */}
                    <div className="pt-1">
                        <button
                            type="button"
                            onClick={() => setExamOpen(o => !o)}
                            aria-expanded={examOpen}
                            aria-controls="exam-dates-panel"
                            className="w-full surface-2 border border-white/10 rounded-2xl px-4 h-14 flex items-center justify-between gap-3 text-left transition-colors duration-[250ms] hover:border-white/25"
                        >
                            <span className="min-w-0">
                                <span className="block text-sm font-medium text-slate-200">Exam date per subject</span>
                                <span className="block text-xs text-slate-500 mt-0.5">{examSetCount} of {examSubjects.length} set</span>
                            </span>
                            <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${examOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <div
                            id="exam-dates-panel"
                            inert={!examOpen}
                            className={`grid transition-[grid-template-rows,opacity] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${examOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                            <div className="overflow-hidden">
                                <p className="text-xs text-slate-500 mt-3 mb-1 leading-relaxed">These build your dashboard exam timeline. Leave blank if the timetable is not out yet.</p>
                                <div className="divide-y divide-white/5">
                                    {examSubjects.map(su => (
                                        <div key={su.id} className="flex items-center justify-between gap-3 py-3">
                                            <span className="text-sm text-slate-200 leading-snug min-w-0">{su.name}</span>
                                            <input
                                                type="date"
                                                aria-label={`Exam date for ${su.name}`}
                                                value={(profile.examDates || {})[su.id] || ''}
                                                onChange={(e) => {
                                                    const d = { ...(profile.examDates || {}) };
                                                    if (e.target.value) d[su.id] = e.target.value; else delete d[su.id];
                                                    update('examDates', d);
                                                }}
                                                className="w-[8.75rem] shrink-0 surface-2 border border-white/10 rounded-full px-3 h-9 text-[11px] font-mono text-slate-300 focus:border-[#F63C49] outline-none transition-colors uppercase [color-scheme:dark]"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SUBJECTS */}
            <section className="surface-1 rounded-3xl p-5 lg:p-7">
                <div className="flex items-center justify-between gap-4 mb-5">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 whitespace-nowrap">Your subjects</h2>
                    <button
                        onClick={initiateReset}
                        className="h-9 px-3 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:border-white/25 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors duration-[250ms] flex items-center gap-2"
                    >
                        <RotateCcw size={12} aria-hidden="true" /> Change<span className="sr-only"> subjects</span>
                    </button>
                </div>

                <div className="space-y-2.5">
                    {selectedSubjectsList.map(sub => (
                        <div key={sub.id} className="surface-2 border border-white/5 rounded-2xl px-4 py-3.5 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F63C49] shrink-0"></span>
                            <p className="text-sm font-medium text-white leading-snug">{sub.name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* BACKUP */}
            <section className="surface-1 rounded-3xl p-5 lg:p-7">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 mb-3">Data Portability</h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">
                    Save your progress, tasks, marks and links to a JSON file. Restoring shows what will change first and keeps an undo copy.
                </p>

                {nudgeDue && (
                    <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 surface-2 pl-4 pr-2 h-11">
                        <p className="text-xs text-slate-300">{lastBackup === null ? 'No backup yet. Save one now.' : 'It has been a week. Back up now.'}</p>
                        <button type="button" onClick={dismissNudge} aria-label="Dismiss reminder" className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors duration-[250ms]">
                            <X size={14} />
                        </button>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={exportData}
                        className="w-full h-12 bg-[#F63C49] hover:bg-[#e0303c] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-2xl transition-colors duration-[250ms] flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        {canShareFile ? <Share2 size={14} /> : <Download size={14} />} {canShareFile ? 'Share Backup' : 'Save Backup'}
                    </button>
                    <p className="text-[11px] text-slate-500 text-center">{lastBackupLabel ? `Last backup ${lastBackupLabel}` : 'Not backed up yet'}</p>

                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            border border-dashed rounded-2xl h-14 flex items-center justify-center gap-3 text-center transition-colors duration-[250ms] cursor-pointer
                            ${dragActive
                                ? 'border-[#F63C49] bg-[#F63C49]/10'
                                : 'border-white/15 hover:border-white/30 hover:bg-white/[0.03]'
                            }
                        `}
                    >
                        <Upload size={16} className={dragActive ? 'text-[#F63C49]' : 'text-slate-400'} />
                        <span className="text-xs font-bold text-white uppercase tracking-[0.18em]">Restore Backup</span>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".json"
                    />

                    {canShareFile && (
                        <button type="button" onClick={downloadData} className="w-full text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 hover:text-white transition-colors duration-[250ms] py-1">
                            Download file instead
                        </button>
                    )}

                    {canUndo && (
                        <button
                            onClick={undoRestore}
                            className="w-full h-11 bg-transparent border border-white/10 text-slate-300 font-bold uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-colors duration-[250ms] flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={12} /> Undo last restore
                        </button>
                    )}
                </div>
            </section>

            {/* DANGER ZONE */}
            <section className="rounded-3xl p-5 lg:p-7 border border-[#F63C49]/25 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F63C49] mb-2">Danger Zone</h2>
                    <p className="text-sm text-slate-400 leading-relaxed">Irreversible action. Wipes all data from this device.</p>
                </div>
                <button
                    onClick={initiateFormat}
                    className="h-12 px-6 shrink-0 bg-transparent text-[#F63C49] border border-[#F63C49]/40 font-bold uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-[#F63C49] hover:text-white transition-colors duration-[250ms] flex items-center justify-center gap-2"
                >
                    <Trash2 size={14} /> Erase all data
                </button>
            </section>

        </div>

        <div className="mt-10 text-center">
            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                PrepTracker • Built for the SPPU 2024 Pattern
            </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

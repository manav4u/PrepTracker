
import React, { useRef, useState, useEffect } from 'react';
import { User, RotateCcw, Trash2, Terminal, AlertTriangle, Upload, Download, HardDrive, Check, AlertOctagon, Loader2, ScanLine, Save } from 'lucide-react';
import { subjectsFor } from '../lib/curriculum';
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

  const exportData = () => {
      try {
          const backup = createBackup(localStorage);
          const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `PrepTracker_LocalBackup_${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showToast("Backup downloaded", 'success');
      } catch (err: any) {
          console.error("Export Error:", err);
          showToast(err?.message || "Export failed", 'error');
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

  const SUBJECTS = subjectsFor(profile);
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

      <div className="max-w-3xl mx-auto">

        {/* Compact header */}
        <header className="flex items-end justify-between gap-6 mb-10">
            <div>
                <div className="flex items-center gap-2 text-[#F63C49] mb-2">
                    <Terminal size={13} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em]">System</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tighter leading-none">Settings</h1>
            </div>
            <div className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 flex items-center gap-2 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Saved on this device</span>
            </div>
        </header>

        <div className="space-y-10">

            {/* GROUP: PROFILE */}
            <section>
                <div className="flex items-center gap-3 mb-3 px-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400">Profile</span>
                    <div className="flex-1 h-px bg-white/5"></div>
                </div>
                <div className="surface-1 rounded-2xl divide-y divide-white/5 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-5 py-4">
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest sm:w-40 shrink-0">Name</label>
                        <input
                            type="text"
                            aria-label="Your name"
                            value={profile.name}
                            onChange={(e) => update('name', e.target.value)}
                            className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-white focus:border-[#F63C49] focus:outline-none transition-colors placeholder:text-white/20"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-5 py-4">
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest sm:w-40 shrink-0">Student ID / PRN</label>
                        <input
                            type="text"
                            value={profile.prn || ''}
                            onChange={(e) => update('prn', e.target.value)}
                            placeholder="Not set"
                            className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:border-[#F63C49] focus:outline-none transition-colors placeholder:text-white/20"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-5 py-4">
                        <label htmlFor="exam-start" className="text-[10px] font-mono text-slate-500 uppercase tracking-widest sm:w-40 shrink-0">First exam date</label>
                        <input
                            id="exam-start"
                            type="date"
                            value={profile.examStartDate || ''}
                            onChange={(e) => update('examStartDate', e.target.value || undefined)}
                            className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:border-[#F63C49] focus:outline-none transition-colors [color-scheme:dark]"
                        />
                    </div>
                </div>

                <p className="text-[10px] text-slate-600 font-mono mt-4 mb-2 px-1">Exam date per subject - these build the dashboard countdown. Leave blank if the timetable is not out yet.</p>
                <div className="surface-1 rounded-2xl divide-y divide-white/5 overflow-hidden">
                    {SUBJECTS.filter(su => profile.selectedSubjects?.includes(su.id)).map(su => (
                        <div key={su.id} className="flex items-center justify-between gap-4 px-5 py-3">
                            <span className="text-xs font-bold text-slate-300 truncate">{su.name}</span>
                            <input
                                type="date"
                                aria-label={`Exam date for ${su.name}`}
                                value={(profile.examDates || {})[su.id] || ''}
                                onChange={(e) => {
                                    const d = { ...(profile.examDates || {}) };
                                    if (e.target.value) d[su.id] = e.target.value; else delete d[su.id];
                                    update('examDates', d);
                                }}
                                className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:border-[#F63C49] focus:outline-none transition-colors [color-scheme:dark]"
                            />
                        </div>
                    ))}
                </div>

                {/* ID card preview */}
                <div className="relative w-full max-w-md aspect-[1.58/1] rounded-2xl bg-[#020202] overflow-hidden border border-white/10 shadow-2xl mt-5 mx-auto">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(246,60,73,0.1),transparent_70%)]"></div>
                    <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <HardDrive size={22} className="text-[#F63C49]" />
                            <span className="text-[8px] font-bold border border-white/20 px-1.5 py-0.5 rounded text-white/50 bg-white/5 uppercase tracking-widest">PrepTracker Local</span>
                        </div>
                        <div className="mt-2">
                            <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight truncate">
                                {profile.name || 'UNKNOWN'}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Saved on this device</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5 opacity-70">PRN Identifier</span>
                                <p className="font-mono font-bold text-[#F63C49] tracking-[0.2em] text-sm">
                                    {profile.prn || '0000000000'}
                                </p>
                            </div>
                            <ScanLine size={30} className="text-white opacity-30" />
                        </div>
                    </div>
                </div>
            </section>

            {/* GROUP: SUBJECTS */}
            <section>
                <div className="flex items-center gap-3 mb-3 px-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400">Your subjects</span>
                    <div className="flex-1 h-px bg-white/5"></div>
                    <button
                        onClick={initiateReset}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#D61A40] text-slate-400 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 border border-white/5"
                    >
                        <RotateCcw size={11} /> Change subjects
                    </button>
                </div>
                <div className="surface-1 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedSubjectsList.map(sub => (
                        <div key={sub.id} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#F63C49]"></div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white leading-tight truncate">{sub.name}</p>
                                <p className="text-[9px] font-mono text-slate-500 mt-0.5">{sub.code}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* GROUP: BACKUP AND DATA */}
            <section>
                <div className="flex items-center gap-3 mb-3 px-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400">Backup and data</span>
                    <div className="flex-1 h-px bg-white/5"></div>
                </div>
                <div className="surface-1 rounded-2xl divide-y divide-white/5 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-5 py-4">
                        <div className="flex-1">
                            <p className="text-sm font-bold text-white">Download backup</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Progress, tasks, marks and links as one JSON file.</p>
                        </div>
                        <button
                            onClick={exportData}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 text-white font-bold uppercase text-[9px] tracking-[0.2em] rounded-lg hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 shrink-0"
                        >
                            <Download size={11} /> Download
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-5 py-4">
                        <div className="flex-1">
                            <p className="text-sm font-bold text-white">Restore backup</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Shows what will change first, keeps an undo copy.</p>
                        </div>
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`px-4 py-2.5 border border-dashed rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 shrink-0 text-[9px] font-bold uppercase tracking-[0.2em] ${
                                dragActive
                                    ? 'border-[#F63C49] bg-[#F63C49]/10 text-[#F63C49]'
                                    : 'border-white/15 text-slate-400 hover:border-white/30 hover:text-white'
                            }`}
                        >
                            <Upload size={11} /> Drop file or browse
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            accept=".json"
                        />
                    </div>
                    {canUndo && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-5 py-4">
                        <div className="flex-1">
                            <p className="text-sm font-bold text-white">Undo last restore</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Return to the data kept before the last restore.</p>
                        </div>
                        <button
                            onClick={undoRestore}
                            className="px-4 py-2.5 bg-transparent border border-white/10 text-slate-300 font-bold uppercase text-[9px] tracking-[0.2em] rounded-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2 shrink-0"
                        >
                            <RotateCcw size={11} /> Undo
                        </button>
                    </div>
                    )}
                </div>
            </section>

            {/* GROUP: DANGER */}
            <section>
                <div className="flex items-center gap-3 mb-3 px-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-red-500">Danger</span>
                    <div className="flex-1 h-px bg-red-500/10"></div>
                </div>
                <div className="surface-1 border-red-500/20 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-red-500 flex items-center gap-2"><AlertTriangle size={14} /> Erase all data</p>
                        <p className="text-[10px] text-red-300/70 font-mono mt-0.5">Irreversible. Wipes everything from this device. Download a backup first.</p>
                    </div>
                    <button
                        onClick={initiateFormat}
                        className="px-4 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 font-bold uppercase text-[9px] tracking-[0.2em] rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 shrink-0"
                    >
                        <Trash2 size={12} /> Erase
                    </button>
                </div>
            </section>

        </div>

        <div className="mt-12 text-center">
            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                PrepTracker - works fully offline, your data never leaves this browser
            </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

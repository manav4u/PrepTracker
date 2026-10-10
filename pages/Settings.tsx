import DeskSketch from "../components/DeskSketch";
import '../edition-care.css';import EditionNav from '../components/EditionNav';

import React, { useRef, useState, useEffect } from 'react';
import { User, RotateCcw, Trash2, Terminal, AlertTriangle, Upload, Download, HardDrive, Check, AlertOctagon, Loader2, ScanLine, Save } from 'lucide-react';
import { CATALOG as SUBJECTS } from '../lib/catalog';
import { useData } from '../context/DataContext';
import { createBackup, parseBackup, readState, restoreBackup, rollbackRestore, KEYS as KEYS_FOR_RESET, ROLLBACK_KEY, MAX_BYTES } from '../lib/backup.mjs';

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
    const dialogRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!isOpen) return;
      const previous = document.activeElement as HTMLElement | null;
      const dialog = dialogRef.current;
      const controls = () => Array.from(dialog?.querySelectorAll<HTMLButtonElement>('button') || []);
      controls()[0]?.focus();
      const key = (e: KeyboardEvent) => {
        if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
        if (e.key === 'Tab') { const buttons=controls();const first=buttons[0], last=buttons[buttons.length-1]; if(e.shiftKey && document.activeElement===first){e.preventDefault();last?.focus();} else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first?.focus();} }
      };
      document.addEventListener('keydown', key);
      return () => { document.removeEventListener('keydown', key); previous?.focus(); };
    }, [isOpen]);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={title} className={`care-dialog max-h-[85vh] overflow-y-auto w-full max-w-md p-8 ${
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

const SettingsPage: React.FC = () => {
  const { profile, setProfile } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<any>(null);
  const [hasRollback] = useState(() => !!localStorage.getItem(ROLLBACK_KEY));


  
  // State for Micro-interactions
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(null), 3000); return () => window.clearTimeout(timer); }, [toast]);
  const [isBusy, setIsBusy] = useState<{ active: boolean, message: string }>({ active: false, message: '' });
  
  // Modal State Logic
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, type: 'RESET' | 'FORMAT' | null }>({
      isOpen: false, type: null
  });

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
  const closeModal = () => setModalConfig({ isOpen: false, type: null });

  const handleModalConfirm = () => {
      closeModal();
      
      if (modalConfig.type === 'RESET') {
          const newProfile = { ...profile, setupComplete: false };
          setProfile(newProfile);

      } 
      else if (modalConfig.type === 'FORMAT') {
          // ACTIVATE LOCKOUT MODE
          setIsBusy({ active: true, message: 'WIPING DATA...' });
          
          // Critical Operation: Hard Reset sequence
          setTimeout(() => {
             [...Object.values(KEYS_FOR_RESET), ROLLBACK_KEY, 'sppu_user_progress'].forEach(key => localStorage.removeItem(key));
             // Force reload to root to prevent hash router ghosts
             window.location.reload();
          }, 1500);
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
      } catch (err) {
          console.error("Export Error:", err);
          showToast("Could not create a backup. Nothing was changed.", 'error');
      }
  };

  const validateAndRestore = (content: string) => {
      try { setPendingBackup(parseBackup(content, readState(localStorage))); }
      catch (e) { showToast(e instanceof Error ? e.message : 'Invalid backup', 'error'); }
  };
  const confirmRestore = () => {
      try { restoreBackup(localStorage, pendingBackup.data); window.location.reload(); }
      catch (e) { setPendingBackup(null); showToast(e instanceof Error ? e.message : 'Restore failed', 'error'); }
  };
  const readBackupFile = (file: File) => {
      if (file.size > MAX_BYTES) { showToast('Backup exceeds the 5 MB limit.', 'error'); return; }
      const reader = new FileReader();
      reader.onerror = () => showToast('Could not read this file. Nothing changed.', 'error');
      reader.onload = e => validateAndRestore(String(e.target?.result || ''));
      reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      readBackupFile(file);
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
              readBackupFile(file);
          } else {
              showToast("Invalid File Type. JSON Required.", 'error');
          }
      }
  };

  if (!profile) return null;

  const selectedSubjectsList = SUBJECTS.filter(s => profile.selectedSubjects.includes(s.id));

  return <div className="edition-care"><EditionNav/><main>{isBusy.active&&<div className="care-busy" role="status"><Loader2 size={38}/><h2>{isBusy.message}</h2><p>Do not close this window.</p></div>}{toast&&<div className={`care-toast ${toast.type}`} role="status">{toast.message}</div>}<ConfirmModal isOpen={modalConfig.isOpen} title={modalConfig.type==='RESET'?'Choose your courses again?':'Erase this edition?'} description={modalConfig.type==='RESET'?'Resets your course selection setup. Unit progress and saved history remain. You will run the starting map again.':'Permanently removes profile, marks, unit progress, study/revision/plan history, tasks, custom resources and hidden resources from this browser. Export a backup first. This cannot be undone.'} onConfirm={handleModalConfirm} onCancel={closeModal} isDanger={modalConfig.type==='FORMAT'}/><ConfirmModal isOpen={!!pendingBackup} title="Replace saved data?" description={pendingBackup?`${pendingBackup.data.profile?.name||'No profile'}: ${Object.keys(pendingBackup.data.study.topics).length} topic records, ${pendingBackup.data.study.events.length} legacy revision logs, ${pendingBackup.data.study.attempts?.length||0} practice attempts, ${pendingBackup.data.progress.length} unit records, ${pendingBackup.data.tasks.length} tasks, ${pendingBackup.data.resources.length} custom resources, ${pendingBackup.data.hiddenResourceIds.length} hidden resources, ${Object.keys(pendingBackup.data.marks).length} marks rows. This replaces saved data in this browser. A rollback snapshot is kept. ${pendingBackup.warnings.join(' ')}`:''} onConfirm={confirmRestore} onCancel={()=>setPendingBackup(null)} isDanger/><header className="care-heading"><p>THE EXAM EDITION / KEEP IT YOURS</p><h1>Care for<br/><i>your edition.</i></h1><span>LOCAL FIRST<br/>THIS BROWSER</span><DeskSketch kind="care"/></header><section className="care-custody" aria-label="Your data custody"><div className="care-seal" aria-hidden="true"><span>p.</span><small>YOUR<br/>EDITION</small></div><div><p>YOUR COPY LIVES HERE</p><strong>This browser.</strong><span>{selectedSubjectsList.length} courses on your shelf · {hasRollback?'Pre-import rollback available':'No restore rollback yet'}</span></div><a href="#care-backup" onClick={e=>{e.preventDefault();document.getElementById('care-backup')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}}>Keep it safe ↓</a></section><div className="care-layout"><section className="care-identity"><p className="care-eyebrow">THE NAME ON THE COVER</p><h2>Your bookplate.</h2><label>Your name<input aria-label="Your name" value={profile.name} onChange={e=>update('name',e.target.value)}/></label><div className="care-bookplate"><span>THIS EDITION BELONGS TO</span><strong>{profile.name||'Your name here'}</strong><p>PREPTRACKER · SAVED IN THIS BROWSER</p></div></section><section id="care-backup" className="care-backup"><p className="care-eyebrow">BEFORE YOU CLOSE THIS CHAPTER</p><h2>Keep a copy.</h2><p>Saved in this browser, not cloud-synced or app-encrypted. Export profile, unit progress, marks, tasks, study and revision history, your plan, custom resources and hidden resources. Keep the file private. Clearing browser data can remove your work.</p><div className="care-backup-actions"><button className="care-primary" onClick={exportData}>Download backup ↗</button><button type="button" aria-label="Choose a backup JSON file" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={()=>fileInputRef.current?.click()} className={`care-restore ${dragActive?'drag-active':''}`}><Upload size={24}/><span>Restore a backup</span><small>CHOOSE OR DROP JSON · UP TO 5 MB</small></button><input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".json"/>{hasRollback&&<button onClick={()=>{if(window.confirm('Restore the saved pre-import snapshot? Current data will become the next rollback snapshot.')){try{rollbackRestore(localStorage);window.location.reload()}catch(e){showToast(e instanceof Error?e.message:'Rollback failed','error')}}}}>Undo last restore ↺</button>}</div></section></div><section className="care-courses"><header><div><p className="care-eyebrow">WHAT YOU'RE CARRYING</p><h2>Your course shelf.</h2></div><a href="/#/directory">Add a course +</a></header><div className="care-course-grid">{selectedSubjectsList.map((sub,i)=><article key={sub.id}><span>{String(i+1).padStart(2,'0')}.</span><div><p>{sub.code}</p><h3>{sub.name}</h3><button aria-label={`Remove ${sub.name} from plan`} onClick={()=>setProfile({...profile,selectedSubjects:profile.selectedSubjects.filter(id=>id!==sub.id)})}>Remove from plan · keep progress</button></div></article>)}</div><button className="care-reconfigure" onClick={initiateReset}>Run the starting map again ↺</button></section><details className="care-danger"><summary>Start over completely.</summary><p>This permanently erases the saved edition in this browser, including the rollback snapshot. Download a backup first.</p><button onClick={initiateFormat}>Erase local data</button></details><footer>YOUR WORK · YOUR BROWSER · YOUR BACKUP</footer></main></div>;
};
export default SettingsPage;

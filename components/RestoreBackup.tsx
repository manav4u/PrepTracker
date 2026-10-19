import React, { useRef, useState } from 'react';
import { RotateCcw, Upload, X } from 'lucide-react';
import { BackupData, Preview, parseBackup, readState, restoreBackup } from '../lib/backup';

const EASE = 'duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]';
const plural = (n: number, s: string) => `${n} ${s}${n === 1 ? '' : 's'}`;

/** Onboarding "returning student" path: pick a PrepTracker backup file, preview it, restore, reload into the app. */
const RestoreBackup: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        setPreview(parseBackup(String(ev.target?.result ?? ''), readState(localStorage)));
      } catch (e: any) {
        setPreview(null);
        setError(e?.message || 'That file could not be read. Nothing was changed.');
      }
    };
    reader.readAsText(f);
  };

  const restore = () => {
    if (!preview) return;
    try {
      restoreBackup(localStorage, preview.data as BackupData);
      setRestoring(true);
      setTimeout(() => window.location.reload(), 500);
    } catch (e: any) {
      setError(e?.message || 'Restore failed. Your data was not changed.');
      setPreview(null);
    }
  };

  if (restoring) {
    return <p className="mt-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Restoring...</p>;
  }

  return (
    <div className="mt-4">
      <input ref={inputRef} type="file" accept=".json,application/json" className="hidden" onChange={e => { onFile(e.target.files?.[0]); e.target.value = ''; }} />

      {!preview && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full flex items-center justify-center gap-2.5 h-12 rounded-full border border-dashed border-white/15 text-slate-500 hover:text-white hover:border-white/35 transition-[color,border-color] ${EASE}`}
        >
          <Upload size={14} aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Been here before? Restore from a backup</span>
        </button>
      )}

      {error && (
        <p role="alert" className="mt-3 rounded-2xl border border-[#F63C49]/30 bg-[#F63C49]/[0.06] px-4 py-3 text-xs text-[#F63C49]">{error}</p>
      )}

      {preview && (
        <div className="rounded-3xl border border-white/[0.12] bg-[#0d0d10] p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start justify-between gap-3 mb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Backup found</p>
            <button type="button" onClick={() => setPreview(null)} aria-label="Cancel restore" className="text-slate-600 hover:text-white transition-colors"><X size={16} /></button>
          </div>
          <p className="text-sm text-white font-medium leading-relaxed">
            {plural(preview.counts.courses, 'course')}, {plural(preview.counts.units, 'unit record')}, {plural(preview.counts.tasks, 'task')}
            {preview.counts.resources > 0 && `, ${plural(preview.counts.resources, 'custom resource')}`}
            {preview.counts.marksCourses > 0 && `, marks for ${plural(preview.counts.marksCourses, 'course')}`}.
          </p>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            This replaces the data in this browser. A copy of the current data is kept so you can undo from Settings.
          </p>
          {preview.warnings.length > 0 && (
            <p className="mt-2 text-xs text-amber-400/90 leading-relaxed">{preview.warnings.join(' ')}</p>
          )}
          <div className="mt-4 flex gap-2.5">
            <button
              type="button"
              onClick={restore}
              className={`flex-1 h-12 rounded-full bg-[#F63C49] text-white text-[11px] font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2 hover:bg-[#ff4d59] active:bg-[#e8343f] transition-[background-color,transform] ${EASE} active:scale-[0.99]`}
            >
              <RotateCcw size={14} aria-hidden="true" /> Restore
            </button>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className={`h-12 px-6 rounded-full border border-white/15 text-slate-300 text-[11px] font-bold uppercase tracking-[0.16em] hover:border-white/40 hover:text-white transition-[color,border-color] ${EASE}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestoreBackup;

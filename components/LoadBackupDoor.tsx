import React, { useRef, useState } from 'react';
import { parseBackup, readState, restoreBackup, MAX_BYTES } from '../lib/backup.mjs';

// Onboarding door: restore a PrepTracker backup before setup. Uses the same
// verified parse/restore code as Settings. Nothing is written until the
// student confirms, and a rollback snapshot is kept by restoreBackup.
export default function LoadBackupDoor() {
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ data: any; warnings: string[] } | null>(null);
  const [error, setError] = useState('');

  const read = (file: File) => {
    setError('');
    if (file.size > MAX_BYTES) { setError('That file is over 5 MB. Nothing was changed.'); return; }
    const r = new FileReader();
    r.onerror = () => setError('Could not read that file. Nothing was changed.');
    r.onload = e => {
      try { setPending(parseBackup(String(e.target?.result || ''), readState(localStorage))); }
      catch (err) { setPending(null); setError(err instanceof Error ? err.message : 'That file is not a PrepTracker backup.'); }
    };
    r.readAsText(file);
  };
  const confirm = () => {
    if (!pending) return;
    try { restoreBackup(localStorage, pending.data); window.location.reload(); }
    catch (err) { setPending(null); setError(err instanceof Error ? err.message : 'Restore failed. Nothing was changed.'); }
  };
  const count = (k: string) => (pending && Array.isArray(pending.data[k]) ? pending.data[k].length : 0);

  return (
    <section className="load-door" aria-label="Load a backup">
      <div className="load-door-tab">ALREADY HAVE A DESK?</div>
      <p>Load a PrepTracker backup file and skip setup. Your history comes back exactly as saved.</p>
      <input ref={input} type="file" accept="application/json,.json" hidden onChange={e => { const f = e.target.files?.[0]; if (f) read(f); e.target.value = ''; }} />
      {!pending && <button type="button" className="load-door-btn" onClick={() => input.current?.click()}>Load a backup</button>}
      {pending && (
        <div className="load-door-confirm" role="group" aria-label="Confirm restore">
          <strong>Ready to restore</strong>
          <span>{count('tasks')} {count('tasks')===1?'task':'tasks'}, {count('progress')} {count('progress')===1?'topic record':'topic records'}</span>
          {pending.warnings.map(w => <small key={w}>{w}</small>)}
          <div>
            <button type="button" className="load-door-btn" onClick={confirm}>Restore and open my desk</button>
            <button type="button" className="load-door-ghost" onClick={() => setPending(null)}>Cancel</button>
          </div>
        </div>
      )}
      {error && <p role="alert" className="load-door-error">{error}</p>}
    </section>
  );
}

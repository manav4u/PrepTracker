import React, { useEffect, useRef, useState } from 'react';
import { AVATAR_PACKS, AVATAR_SHAPES, avatarFrame, type AvatarShape, avatarSrc, type AvatarChoice } from '../lib/avatars';
import ProfileAvatar from './ProfileAvatar';
import './avatar-picker.css';
const LABELS: Record<string, string> = { all: 'All', goofy: 'Goofy', cute: 'Cute', doodles: 'Doodles', pixel: 'Pixel', weird: 'Weird', abstract: 'Abstract' };
export default function AvatarPicker({ current, shape, name, onSave, onClose }: { current?: string; shape?: AvatarShape; name: string; onSave: (id: string, shape: AvatarShape) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<AvatarChoice[]>([]), [error, setError] = useState('');
  const [draftShape, setDraftShape] = useState<AvatarShape>(shape || 'circle');
  const [draft, setDraft] = useState(current || 'doodles-001'), [pack, setPack] = useState('all'), [limit, setLimit] = useState(24);
  useEffect(() => { const el = dialog.current!; const prior = document.activeElement as HTMLElement; el.showModal(); const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = old; el.close(); prior?.focus(); }; }, []);
  useEffect(() => { let alive = true; fetch('/avatars/v1/catalog.json').then(r => { if (!r.ok) throw Error(); return r.json(); }).then(v => { if (alive) setItems(v); }).catch(() => { if (alive) setError('Could not load avatars. Check your connection and reopen the picker.'); }); return () => { alive = false; }; }, []);
  const filtered = items.filter(a => pack === 'all' || a.pack === pack);
  // Interleave packs so the first page shows the range, not 24 similar faces.
  const ordered = pack === 'all' ? [...filtered].sort((a,b) => Number(a.id.split('-')[1]) - Number(b.id.split('-')[1]) || AVATAR_PACKS.indexOf(a.pack as any) - AVATAR_PACKS.indexOf(b.pack as any)) : filtered;
  const choice = items.find(a => a.id === draft);
  return <dialog ref={dialog} className="avatar-dialog" aria-labelledby="avatar-title" onKeyDown={e => {
    if (e.key !== 'Tab') return;
    const nodes = Array.from(dialog.current!.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], summary, [tabindex="0"]')).filter(el => el.getClientRects().length > 0 && (!el.closest('details:not([open])') || el.tagName === 'SUMMARY'));
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }} onCancel={e => { e.preventDefault(); onClose(); }}>
    <div className="avatar-layout">
      <aside className="avatar-preview"><ProfileAvatar id={draft} shape={draftShape} size={104} /><div><p className="avatar-eyebrow">Profile preview</p><h3>{name.trim() || 'Your profile'}</h3><p>Try one on. Save when it feels like you.</p><span className="avatar-choice" aria-live="polite">{choice?.label || 'Your current avatar'}</span></div></aside>
      <section className="avatar-browse"><header><h2 id="avatar-title">Pick your face<span>.</span></h2><button className="avatar-close" onClick={onClose} aria-label="Close avatar picker">×</button></header>
        <p className="avatar-sub">288 choices. Zero serious decisions.</p>
        <fieldset className="avatar-shapes"><legend>Frame shape</legend><div>{AVATAR_SHAPES.map(s => <button key={s} aria-pressed={draftShape === s} onClick={() => setDraftShape(s)}><span aria-hidden="true" style={avatarFrame(s)} />{({ circle: 'Circle', rounded: 'Rounded', square: 'Square', hexagon: 'Hexagon' })[s]}</button>)}</div></fieldset>
        <div className="avatar-filters" aria-label="Avatar categories">{['all', ...AVATAR_PACKS].map(p => <button key={p} aria-pressed={pack === p} onClick={() => { setPack(p); setLimit(24); }}>{LABELS[p]}</button>)}</div>
        <div className="avatar-quick"><button onClick={() => setDraft(current || 'doodles-001')}>Current</button><button disabled={!filtered.length} onClick={() => setDraft(filtered[Math.floor(Math.random() * filtered.length)].id)}>Shuffle</button></div>
        {error && <p role="alert">{error}</p>}{!items.length && !error && <p role="status">Loading avatars...</p>}
        <div className="avatar-grid" role="group" aria-label="Choose an avatar">{ordered.slice(0, limit).map(a => <button key={a.id} className={draft === a.id ? 'selected' : ''} aria-pressed={draft === a.id} aria-label={a.label} onClick={() => setDraft(a.id)}><img src={a.src} alt="" width={80} height={80} loading="lazy" decoding="async" /><span>{a.label}</span>{draft === a.id && <b aria-hidden="true">✓</b>}</button>)}</div>
        {limit < filtered.length && <button className="avatar-more" onClick={() => setLimit(v => v + 24)}>Show more · {Math.min(limit, filtered.length)} of {filtered.length}</button>}
        <footer className="avatar-actions"><small>Saved on this device.<br />Included in your backup.</small><div><button className="avatar-cancel" onClick={onClose}>Cancel</button><button className="avatar-save" onClick={() => onSave(draft, draftShape)}>Use this avatar</button></div></footer>
        <details className="avatar-credits"><summary>Avatar credits</summary><p>Fun Emoji by Davis Uche via <a href="https://www.dicebear.com/styles/fun-emoji/" target="_blank" rel="noreferrer">DiceBear</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Seed and solid background variants. Lorelei by Lisa Wischofsky, Notionists by Zoish, Pixel Art, Thumbs and Shapes by DiceBear: CC0. <a href="/avatars/v1/credits.txt" target="_blank" rel="noreferrer">Full credits</a>.</p></details>
      </section>
    </div>
  </dialog>;
}

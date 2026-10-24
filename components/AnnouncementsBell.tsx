import React, { useEffect, useLayoutEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X } from 'lucide-react';
import { useModalA11y } from './useModalA11y';
import {
  subscribeAnnouncements,
  getAnnouncementsState,
  refreshAnnouncements,
  markAllAnnouncementsSeen,
  unreadAnnouncements,
  type Announcement,
} from '../lib/announcements.ts';

const EASE = 'duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]';
const FEED_URL = `${(import.meta as any).env?.BASE_URL || '/'}announcements.json`;

const TAG_DOT: Record<string, string> = {
  'Exam alert': 'bg-[#F63C49] shadow-[0_0_8px_#F63C49]',
  Update: 'bg-white/70',
  Resource: 'bg-slate-500',
};

const formatDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

/** Compact row: tag dot, title, date; tap to unfold the body. */
const Row: React.FC<{ item: Announcement; fresh: boolean }> = ({ item, fresh }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full shrink-0 ${TAG_DOT[item.tag] ?? TAG_DOT.Resource}`} />
        <span className="flex-1 min-w-0">
          <span className="block text-xs font-bold text-white truncate">{item.title}</span>
          <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 mt-0.5">{item.tag}</span>
        </span>
        {fresh && <span aria-label="New" title="New" className="w-1.5 h-1.5 rounded-full bg-[#F63C49] shadow-[0_0_8px_#F63C49] shrink-0" />}
        <time dateTime={item.date} className="text-[10px] font-mono text-slate-500 shrink-0">{formatDate(item.date)}</time>
      </button>
      {open && (
        <div className="px-5 pb-4 pl-9">
          <p className="text-xs leading-relaxed text-slate-400 whitespace-pre-line">{item.body}</p>
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center h-8 px-4 rounded-full border border-white/15 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-200 hover:border-white/40 hover:text-white transition-colors">
              Open link
            </a>
          )}
        </div>
      )}
    </div>
  );
};

/** Notification-center popover: drop-down sheet under the header on phone,
    anchored dropdown under the top bar on desktop. Portal-mounted so the app
    header can't clip it. */
const Panel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const ref = useModalA11y(true, onClose);
  useLayoutEffect(() => { ref.current?.focus(); }, [ref]);
  const state = useSyncExternalStore(subscribeAnnouncements, getAnnouncementsState);
  const [freshIds] = React.useState(() => new Set(unreadAnnouncements(getAnnouncementsState()).map((a) => a.id)));

  useEffect(() => {
    markAllAnnouncementsSeen();
    refreshAnnouncements(FEED_URL);
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[80]" >
      <div onClick={onClose} aria-hidden="true" className={`absolute inset-0 bg-black/60 lg:bg-black/40 animate-in fade-in ${EASE}`}></div>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcements-title"
        tabIndex={-1}
        className={`absolute outline-none overflow-hidden flex flex-col surface-1 border-white/10
          inset-x-0 top-0 max-h-[75vh] rounded-b-3xl border-b animate-in fade-in slide-in-from-top-4
          lg:inset-x-auto lg:top-20 lg:right-12 lg:w-96 lg:max-h-[70vh] lg:rounded-3xl lg:border lg:slide-in-from-top-2 ${EASE}`}
      >
        <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-3">
          <p id="announcements-title" className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Announcements
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close announcements"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto">
          {state.items.length === 0 ? (
            <p className="text-xs leading-relaxed text-slate-500 py-8 px-5 text-center">
              {state.loaded ? 'No announcements yet. When PrepTracker has news, it shows up here.' : 'Checking for announcements…'}
            </p>
          ) : (
            state.items.map((item) => <Row key={item.id} item={item} fresh={freshIds.has(item.id)} />)
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

/** Bell with an unread dot. Lives in the app headers; opens the announcements popover. */
const AnnouncementsBell: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const state = useSyncExternalStore(subscribeAnnouncements, getAnnouncementsState);
  const unread = unreadAnnouncements(state).length;

  useEffect(() => { refreshAnnouncements(FEED_URL); }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={unread > 0 ? `Announcements, ${unread} new` : 'Announcements'}
        title="Announcements"
        aria-expanded={open}
        className="relative w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span aria-hidden="true" className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F63C49] shadow-[0_0_8px_#F63C49]" />
        )}
      </button>
      {open && <Panel onClose={() => setOpen(false)} />}
    </>
  );
};

export default AnnouncementsBell;

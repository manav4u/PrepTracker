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

const TAG_STYLE: Record<string, string> = {
  'Exam alert': 'text-[#F63C49] border-[#F63C49]/30 bg-[#F63C49]/10',
  Update: 'text-slate-200 border-white/15 bg-white/[0.04]',
  Resource: 'text-slate-300 border-white/10 bg-white/[0.02]',
};

const formatDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const TagPill: React.FC<{ tag: string }> = ({ tag }) => (
  <span className={`inline-flex items-center h-6 px-2.5 rounded-full border text-[9px] font-bold uppercase tracking-[0.14em] ${TAG_STYLE[tag] ?? TAG_STYLE.Resource}`}>
    {tag}
  </span>
);

const AnnouncementCard: React.FC<{ item: Announcement; fresh: boolean }> = ({ item, fresh }) => (
  <article className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
    <div className="flex items-center justify-between gap-3">
      <TagPill tag={item.tag} />
      <span className="flex items-center gap-2 shrink-0">
        {fresh && <span aria-label="New" title="New" className="w-1.5 h-1.5 rounded-full bg-[#F63C49] shadow-[0_0_8px_#F63C49]" />}
        <time dateTime={item.date} className="text-[10px] font-mono text-slate-500">{formatDate(item.date)}</time>
      </span>
    </div>
    <h3 className="mt-2.5 text-sm font-bold text-white leading-snug">{item.title}</h3>
    <p className="mt-1.5 text-xs leading-relaxed text-slate-400 whitespace-pre-line">{item.body}</p>
    {item.link && (
      <a href={item.link} target="_blank" rel="noopener noreferrer"
        className="mt-3 inline-flex items-center h-8 px-4 rounded-full border border-white/15 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-200 hover:border-white/40 hover:text-white transition-colors">
        Open link
      </a>
    )}
  </article>
);

/** Bottom sheet on phone, centered card on desktop - same pattern as the Revise sheet.
    Rendered in a portal: the mobile header's backdrop-blur would otherwise trap the
    fixed overlay inside the header box. */
const Panel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const ref = useModalA11y(true, onClose);
  useLayoutEffect(() => { ref.current?.focus(); }, [ref]);
  const state = useSyncExternalStore(subscribeAnnouncements, getAnnouncementsState);
  const freshIds = React.useMemo(() => new Set(unreadAnnouncements(state).map((a) => a.id)), [state]);

  // Opening the panel marks everything seen and re-checks for new posts.
  useEffect(() => {
    markAllAnnouncementsSeen();
    refreshAnnouncements(FEED_URL);
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end lg:items-center justify-center">
      <div onClick={onClose} aria-hidden="true" className={`absolute inset-0 bg-black/70 animate-in fade-in ${EASE}`}></div>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcements-title"
        tabIndex={-1}
        className={`relative outline-none w-full lg:max-w-md max-h-[85vh] flex flex-col rounded-t-3xl lg:rounded-3xl border border-white/10 surface-1 p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-8 ${EASE}`}
      >
        <div className="flex items-center justify-between gap-4">
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
        <div className="mt-5 flex flex-col gap-3 overflow-y-auto -mr-2 pr-2">
          {state.items.length === 0 ? (
            <p className="text-xs leading-relaxed text-slate-500 py-6 text-center">
              {state.loaded ? 'No announcements yet. When PrepTracker has news, it shows up here.' : 'Checking for announcements…'}
            </p>
          ) : (
            state.items.map((item) => <AnnouncementCard key={item.id} item={item} fresh={freshIds.has(item.id)} />)
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

/** Bell with an unread dot. Lives in the app headers; opens the announcements panel. */
const AnnouncementsBell: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const state = useSyncExternalStore(subscribeAnnouncements, getAnnouncementsState);
  const unread = unreadAnnouncements(state).length;

  // First mount anywhere kicks off the one fetch per session.
  useEffect(() => { refreshAnnouncements(FEED_URL); }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={unread > 0 ? `Announcements, ${unread} new` : 'Announcements'}
        title="Announcements"
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

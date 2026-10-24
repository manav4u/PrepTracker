import React, { useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import {
  subscribeAnnouncements,
  getAnnouncementsState,
  refreshAnnouncements,
  markAllAnnouncementsSeen,
  unreadAnnouncements,
} from '../lib/announcements.ts';
import { persist } from '../lib/persist.ts';

const FEED_URL = `${(import.meta as any).env?.BASE_URL || '/'}announcements.json`;
const DISMISS_KEY = 'sppu_announcements_dismissed';

const TAG_STYLE: Record<string, string> = {
  'Exam alert': 'text-[#F63C49] border-[#F63C49]/30 bg-[#F63C49]/10',
  Update: 'text-slate-200 border-white/15 bg-white/[0.04]',
  Resource: 'text-slate-300 border-white/10 bg-white/[0.02]',
};

const formatDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const readDismissed = (): string | null => {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(DISMISS_KEY) : null;
  } catch {
    return null;
  }
};

/** Ambient notice: the newest announcement sits on the dashboard itself, so it is
    seen without opening anything. Dismiss hides it until a newer one is published. */
const AnnouncementNotice: React.FC = () => {
  const state = useSyncExternalStore(subscribeAnnouncements, getAnnouncementsState);
  const [dismissedId, setDismissedId] = React.useState<string | null>(readDismissed);

  React.useEffect(() => { refreshAnnouncements(FEED_URL); }, []);

  const latest = state.items[0];
  if (!latest || dismissedId === latest.id) return null;
  const fresh = unreadAnnouncements(state).some((a) => a.id === latest.id);

  const dismiss = () => {
    setDismissedId(latest.id);
    markAllAnnouncementsSeen();
    if (typeof localStorage !== 'undefined') persist(localStorage, DISMISS_KEY, latest.id);
  };

  return (
    <section aria-label="Latest announcement" className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500" style={{ animationDelay: '120ms' }}>
      <div className="relative rounded-3xl surface-1 p-6 lg:p-7 border-l-2 border-l-[#F63C49]">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={15} />
        </button>
        <div className="flex items-center gap-3 flex-wrap pr-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">From Manav</span>
          <span className={`inline-flex items-center h-6 px-2.5 rounded-full border text-[9px] font-bold uppercase tracking-[0.14em] ${TAG_STYLE[latest.tag] ?? TAG_STYLE.Resource}`}>
            {latest.tag}
          </span>
          {fresh && <span aria-label="New" title="New" className="w-1.5 h-1.5 rounded-full bg-[#F63C49] shadow-[0_0_8px_#F63C49]" />}
          <time dateTime={latest.date} className="text-[10px] font-mono text-slate-500">{formatDate(latest.date)}</time>
        </div>
        <h3 className="mt-3 text-base lg:text-lg font-bold text-white leading-snug pr-8">{latest.title}</h3>
        <p className="mt-2 text-xs lg:text-sm leading-relaxed text-slate-400 whitespace-pre-line">{latest.body}</p>
        {latest.link && (
          <a href={latest.link} target="_blank" rel="noopener noreferrer"
            className="mt-4 inline-flex items-center h-9 px-5 rounded-full border border-white/15 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-200 hover:border-white/40 hover:text-white transition-colors">
            Open link
          </a>
        )}
      </div>
    </section>
  );
};

export default AnnouncementNotice;

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
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const TagPill: React.FC<{ tag: string }> = ({ tag }) => (
  <span className={`inline-flex items-center h-6 px-2.5 rounded-full border text-[9px] font-bold uppercase tracking-[0.14em] ${TAG_STYLE[tag] ?? TAG_STYLE.Resource}`}>
    {tag}
  </span>
);

/** Full-screen bulletin: notices as the main event. Newest featured large,
    earlier ones on a dated rail below. Same on phone and desktop. */
const Panel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const ref = useModalA11y(true, onClose);
  useLayoutEffect(() => { ref.current?.focus(); }, [ref]);
  const state = useSyncExternalStore(subscribeAnnouncements, getAnnouncementsState);
  const [freshIds] = React.useState(() => new Set(unreadAnnouncements(getAnnouncementsState()).map((a) => a.id)));

  useEffect(() => {
    markAllAnnouncementsSeen();
    refreshAnnouncements(FEED_URL);
  }, []);

  const [featured, ...earlier] = state.items;

  return createPortal(
    <div className="fixed inset-0 z-[80] bg-[#030303] animate-in fade-in slide-in-from-bottom-4 duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcements-title"
        tabIndex={-1}
        className="outline-none h-full w-full overflow-y-auto"
      >
        <div className="max-w-2xl mx-auto px-6 pt-8 lg:pt-14 pb-16">
          <div className="flex items-start justify-between gap-4">
            <p id="announcements-title" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F63C49]">
              Announcements
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close announcements"
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {!featured ? (
            <p className="mt-24 text-center text-sm text-slate-500">
              {state.loaded ? 'No announcements yet. When PrepTracker has news, it shows up here.' : 'Checking for announcements…'}
            </p>
          ) : (
            <>
              <article className="mt-10 lg:mt-14">
                <div className="flex items-center gap-3">
                  <TagPill tag={featured.tag} />
                  {freshIds.has(featured.id) && <span aria-label="New" title="New" className="w-1.5 h-1.5 rounded-full bg-[#F63C49] shadow-[0_0_8px_#F63C49]" />}
                  <time dateTime={featured.date} className="text-[11px] font-mono text-slate-500">{formatDate(featured.date)}</time>
                </div>
                <h2 className="mt-4 text-3xl lg:text-5xl font-bold text-white tracking-tight leading-[1.05]">
                  {featured.title}
                </h2>
                <p className="mt-4 text-sm lg:text-base leading-relaxed text-slate-400 whitespace-pre-line max-w-prose">
                  {featured.body}
                </p>
                {featured.link && (
                  <a href={featured.link} target="_blank" rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center h-11 px-6 rounded-full bg-[#D61A40] text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#F63C49] transition-colors">
                    Open link
                  </a>
                )}
              </article>

              {earlier.length > 0 && (
                <section aria-label="Earlier announcements" className="mt-14 lg:mt-20">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Earlier</p>
                  <div className="mt-5 border-l border-white/10">
                    {earlier.map((item) => (
                      <article key={item.id} className="relative pl-6 pb-8 last:pb-0">
                        <span aria-hidden="true" className={`absolute -left-[3px] top-1.5 w-1.5 h-1.5 rounded-full ${item.tag === 'Exam alert' ? 'bg-[#F63C49] shadow-[0_0_8px_#F63C49]' : 'bg-white/30'}`} />
                        <div className="flex items-center gap-3 flex-wrap">
                          <time dateTime={item.date} className="text-[10px] font-mono text-slate-500">{formatDate(item.date)}</time>
                          <TagPill tag={item.tag} />
                          {freshIds.has(item.id) && <span aria-label="New" title="New" className="w-1.5 h-1.5 rounded-full bg-[#F63C49] shadow-[0_0_8px_#F63C49]" />}
                        </div>
                        <h3 className="mt-2 text-sm font-bold text-white leading-snug">{item.title}</h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-400 whitespace-pre-line">{item.body}</p>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center h-8 px-4 rounded-full border border-white/15 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-200 hover:border-white/40 hover:text-white transition-colors">
                            Open link
                          </a>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

/** Bell with an unread dot. Lives in the app headers; opens the bulletin. */
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

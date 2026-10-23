import ProfileAvatar from '../ProfileAvatar';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, MotionConfig, LayoutGroup } from 'framer-motion';
import { LayoutGrid, Library, ListTodo, Repeat, Settings, HardDrive } from 'lucide-react';
import LogoMark from '../LogoMark';
import { useData } from '../../context/DataContext';

const EASE = 'duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]';
const SPRING = { type: 'tween' as const, duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

const ITEMS = [
  { label: 'Dashboard', short: 'Home', to: '/app', icon: LayoutGrid, match: (p: string) => p === '/app' },
  { label: 'Library', short: 'Library', to: '/app/resources', icon: Library, match: (p: string) => p === '/app/resources' },
  { label: 'Tasks', short: 'Tasks', to: '/app/tasks', icon: ListTodo, match: (p: string) => p === '/app/tasks' },
  { label: 'Revise', short: 'Revise', to: '/app/revise', icon: Repeat, match: (p: string) => p === '/app/revise' },
  { label: 'Settings', short: 'Settings', to: '/app/settings', icon: Settings, match: (p: string) => p === '/app/settings' },
];

const SaveHint: React.FC = () => {
  const { lastSavedAt, saveFailed } = useData();
  const failed = saveFailed.length > 0;
  const time = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
    : null;
  const label = failed
    ? `Saving failed for ${saveFailed.length} item${saveFailed.length === 1 ? '' : 's'}. Open Settings to export a backup.`
    : time
      ? `All progress saved in this browser. Last saved ${time}.`
      : 'Progress saves automatically in this browser.';
  return (
    <div role="status" aria-label={label} title={label}
      className={`w-10 h-10 rounded-full bg-white/5 border flex flex-col items-center justify-center ${failed ? 'border-[#F63C49] text-[#F63C49]' : 'border-white/10 text-[#F63C49]'}`}>
      <HardDrive size={failed ? 15 : 17} aria-hidden="true" />
      {failed && <span aria-hidden="true" className="text-[8px] font-mono font-bold leading-none mt-0.5">!</span>}
    </div>
  );
};

const Avatar: React.FC<{ size: number }> = ({ size }) => {
  const { profile } = useData();
  return (
    <Link to="/app/settings" aria-label="Settings" className="block" style={{ width: size, height: size }}>
      <ProfileAvatar id={profile?.avatarId} shape={profile?.avatarShape} size={size} />
    </Link>
  );
};

/** Desktop spine rail: floating side rail, active tab marked by a red book-spine strip that slides between tabs. */
const DesktopNav: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:flex fixed z-50 left-6 top-1/2 -translate-y-1/2 w-20 flex-col items-center rounded-[2rem] border border-white/[0.08] bg-[#0a0a0c] py-8 gap-7">
      <div className="w-11 h-11 flex items-center justify-center mb-1"><LogoMark size={30} /></div>
      <MotionConfig reducedMotion="user" transition={SPRING}>
        <LayoutGroup>
          <nav className="flex flex-col gap-5 items-center">
            {ITEMS.map(it => {
              const active = it.match(pathname);
              return (
                <Link key={it.to} to={it.to} aria-label={it.short} title={it.label} aria-current={active ? 'page' : undefined}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${EASE} ${active ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                  {active && (
                    <motion.span layoutId="spine-strip" transition={SPRING}
                      className="absolute -left-[13px] top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-full bg-[#F63C49]" />
                  )}
                  <it.icon size={21} strokeWidth={active ? 2.4 : 1.9} />
                </Link>
              );
            })}
          </nav>
        </LayoutGroup>
      </MotionConfig>
      <div className="mt-2 pt-6 border-t border-white/[0.07] w-full flex flex-col items-center gap-5">
        <SaveHint />
        <Avatar size={40} />
      </div>
    </aside>
  );
};

export default DesktopNav;

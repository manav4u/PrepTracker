import React from 'react';
import { avatarSrc } from '../lib/avatars';
export default function ProfileAvatar({ id, size = 40, className = '' }: { id?: string; size?: number; className?: string }) {
  const src = avatarSrc(id);
  React.useEffect(() => {
    // Cache only the chosen portrait, not all 288 choices. Failure is harmless.
    if ('caches' in window) caches.open('preptracker-avatars-v1').then(c => c.add(src)).catch(() => {});
  }, [src]);
  return <img src={src} width={size} height={size} alt="Your avatar" className={`w-full h-full rounded-full object-cover ${className}`} onError={e => { if (!e.currentTarget.src.endsWith('doodles-001.svg')) e.currentTarget.src = avatarSrc(); }} />;
}

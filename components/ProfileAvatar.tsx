import React from 'react';
import { avatarSrc, avatarFrame } from '../lib/avatars';
export default function ProfileAvatar({ id, shape, size = 40, className = '' }: { id?: string; shape?: string; size?: number; className?: string }) {
  const src = avatarSrc(id);
  React.useEffect(() => {
    // Cache only the chosen portrait, not all 288 choices. Failure is harmless.
    if ('caches' in window) caches.open('preptracker-avatars-v1').then(c => c.add(src)).catch(() => {});
  }, [src]);
  return <img src={src} width={size} height={size} alt="Your avatar" data-shape={shape || 'circle'} style={avatarFrame(shape)} className={`rounded-full object-cover ${className}`} onError={e => { if (!e.currentTarget.src.endsWith('doodles-001.svg')) e.currentTarget.src = avatarSrc(); }} />;
}

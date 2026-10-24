// Announcements: short broadcast notes from the site owner, published as a static
// announcements.json next to the app. No backend - the file is the database.
// The last good copy is kept in browser storage, so the panel works offline and
// invalid JSON or an invalid feed retains the last validated copy.
import { persist } from './persist.ts';

import { validateAnnouncementFeed, type Announcement } from './announcementValidation.ts';
export type { Announcement } from './announcementValidation.ts';

const CACHE_KEY = 'sppu_announcements_cache';
const SEEN_KEY = 'sppu_announcements_seen';
const MAX_ITEMS = 20;
const MAX_SEEN = 50;

const storageAvailable = () => typeof localStorage !== 'undefined';

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

const safeLink = (v: unknown): string | undefined =>
  typeof v === 'string' && /^https:\/\/\S+$/.test(v) ? v : undefined;

/** Forgiving display/cache parser. Network acceptance uses the strict validator first. */
export function parseAnnouncements(raw: unknown): Announcement[] {
  if (!raw || typeof raw !== 'object') return [];
  const file = raw as { version?: unknown; items?: unknown };
  if (file.version !== 1 || !Array.isArray(file.items)) return [];
  const items: Announcement[] = [];
  for (const entry of file.items) {
    if (!entry || typeof entry !== 'object') continue;
    const e = entry as Record<string, unknown>;
    if (!isNonEmptyString(e.id) || !isNonEmptyString(e.date) || !isNonEmptyString(e.tag) || !isNonEmptyString(e.title) || !isNonEmptyString(e.body)) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date)) continue;
    const link = safeLink(e.link);
    items.push({ id: e.id.trim(), date: e.date, tag: e.tag.trim(), title: e.title.trim(), body: e.body.trim(), ...(link ? { link } : {}) });
  }
  // Newest first; stable by id for same-day posts. Capped so the panel stays a glance.
  return items
    .sort((a, b) => (b.date.localeCompare(a.date)) || a.id.localeCompare(b.id))
    .slice(0, MAX_ITEMS);
}

function readCache(): Announcement[] {
  if (!storageAvailable()) return [];
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const saved = JSON.parse(raw) as { items?: unknown };
    return parseAnnouncements({ version: 1, items: saved.items });
  } catch {
    return [];
  }
}

function readSeen(): string[] {
  if (!storageAvailable()) return [];
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isNonEmptyString) : [];
  } catch {
    return [];
  }
}

export interface AnnouncementsState {
  items: Announcement[];
  seen: string[];
  loaded: boolean; // false until the first network attempt settled
}

let state: AnnouncementsState = { items: readCache(), seen: readSeen(), loaded: false };
const listeners = new Set<() => void>();

const emit = () => { listeners.forEach((l) => l()); };

export function subscribeAnnouncements(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAnnouncementsState(): AnnouncementsState {
  return state;
}

export function unreadAnnouncements(s: AnnouncementsState = state): Announcement[] {
  return s.items.filter((a) => !s.seen.includes(a.id));
}

export function markAllAnnouncementsSeen(): void {
  const ids = state.items.map((a) => a.id);
  const seen = [...new Set([...ids, ...state.seen])].slice(0, MAX_SEEN);
  state = { ...state, seen };
  if (storageAvailable()) persist(localStorage, SEEN_KEY, seen);
  emit();
}

let inFlight: Promise<void> | null = null;

/** Fetch the published file. On any failure the last good copy stays on screen. */
export function refreshAnnouncements(url: string): Promise<void> {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error('Feed unavailable');
      const raw = await res.json();
      if (validateAnnouncementFeed(raw).length) throw new Error('Invalid announcement feed');
      const items = parseAnnouncements(raw);
      state = { ...state, items, loaded: true };
      if (storageAvailable()) persist(localStorage, CACHE_KEY, { fetchedAt: Date.now(), items });
      emit();
    } catch {
      // Offline, blocked, malformed JSON: the cached copy (or empty state) stands.
      if (!state.loaded) { state = { ...state, loaded: true }; emit(); }
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}

/** Test hook: reset the module store. */
export function __resetAnnouncementsForTests(next?: AnnouncementsState): void {
  state = next ?? { items: [], seen: [], loaded: false };
}

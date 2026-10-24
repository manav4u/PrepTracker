// One strict contract shared by the sample publisher, network reader and CI.
export const ANNOUNCEMENT_TAGS = ['Update', 'Exam alert', 'Resource'] as const;
export interface Announcement {
  id: string; date: string; tag: string; title: string; body: string; link?: string;
}
export function validateAnnouncementFeed(raw: unknown): string[] {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return ['Feed must be an object.'];
  const f = raw as Record<string, unknown>;
  if (f.version !== 1 || !Array.isArray(f.items)) return ['Feed needs version 1 and an items array.'];
  const errors: string[] = [];
  if (Object.keys(f).some(k => !['version','items'].includes(k))) errors.push('Feed has an unknown field.');
  if (f.items.length > 20) errors.push('Keep at most 20 notices; remove an older notice first.');
  const ids = new Set<string>();
  f.items.forEach((entry, i) => {
    const at = `Notice ${i + 1}`;
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) { errors.push(`${at}: invalid entry.`); return; }
    const e = entry as Record<string, unknown>;
    for (const [key, max] of [['id', 100], ['title', 120], ['body', 2000]] as const) {
      if (typeof e[key] !== 'string' || !e[key].trim() || e[key].length > max) errors.push(`${at}: ${key} is required (max ${max} characters).`);
    }
    if (typeof e.id === 'string') {
      if (!/^[a-zA-Z0-9_-]+$/.test(e.id)) errors.push(`${at}: ID needs letters, numbers, hyphens or underscores.`);
      if (ids.has(e.id)) errors.push(`${at}: duplicate ID.`);
      ids.add(e.id);
    }
    if (typeof e.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(e.date) || !Number.isFinite(Date.parse(`${e.date}T00:00:00Z`)) || new Date(`${e.date}T00:00:00Z`).toISOString().slice(0,10) !== e.date) errors.push(`${at}: enter a real date as YYYY-MM-DD.`);
    if (!ANNOUNCEMENT_TAGS.includes(e.tag as any)) errors.push(`${at}: choose Update, Exam alert or Resource.`);
    if (e.link !== undefined) {
      try { const u = new URL(e.link as string); if (typeof e.link !== 'string' || u.protocol !== 'https:' || u.username || u.password || /\s/.test(e.link) || e.link.length > 2048) throw Error(); }
      catch { errors.push(`${at}: link must be a valid HTTPS URL without credentials.`); }
    }
    if (Object.keys(e).some(k => !['id','date','tag','title','body','link'].includes(k))) errors.push(`${at}: unknown field.`);
  });
  return errors;
}

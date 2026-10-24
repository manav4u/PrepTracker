import { readFileSync } from 'node:fs';
import { validateAnnouncementFeed } from '../lib/announcementValidation.ts';
const errors = validateAnnouncementFeed(JSON.parse(readFileSync('public/announcements.json', 'utf8')));
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Announcement feed validated.');

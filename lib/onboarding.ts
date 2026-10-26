import type { Profile } from '../types.ts';

/** Re-picking courses changes setup choices, never the student's study history. */
export const finishSetup = (
  previous: Profile | null,
  choices: Pick<Profile, 'name' | 'avatarId' | 'avatarShape' | 'selectedSubjects'>,
  now: Date = new Date()
): Profile => ({
  theme: 'dark',
  streak: 0,
  lastStudyDate: now.toISOString(),
  ...previous,
  ...choices,
  setupComplete: true,
});

import { SUBJECTS } from '../constants';
import { SE_COMPUTER_SUBJECTS, SE_IT_SUBJECTS, SE_ENTC_SUBJECTS, SE_MECH_SUBJECTS } from '../data/curriculum';
import { Profile, Subject } from '../types';

// Resolves the subject list for a profile. Existing profiles without a
// year/branch stay on the first-year curriculum.
export function subjectsFor(profile: Profile | null | undefined): Subject[] {
  if (profile?.year === 'SE' && profile?.branch === 'computer') return SE_COMPUTER_SUBJECTS;
  if (profile?.year === 'SE' && profile?.branch === 'it') return SE_IT_SUBJECTS;
  if (profile?.year === 'SE' && profile?.branch === 'entc') return SE_ENTC_SUBJECTS;
  if (profile?.year === 'SE' && profile?.branch === 'mech') return SE_MECH_SUBJECTS;
  return SUBJECTS;
}

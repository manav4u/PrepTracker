export const AVATAR_PACKS = ['goofy', 'cute', 'doodles', 'pixel', 'weird', 'abstract'] as const;
export const isAvatarId = (id: unknown): id is string => typeof id === 'string' && /^(goofy|cute|doodles|pixel|weird|abstract)-(00[1-9]|0[1-3][0-9]|04[0-8])$/.test(id);
export const avatarSrc = (id?: string) => `/avatars/v1/${isAvatarId(id) ? id : 'doodles-001'}.svg`;
export type AvatarChoice = { id: string; pack: string; label: string; src: string };

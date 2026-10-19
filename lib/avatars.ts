export const AVATAR_PACKS = ['goofy', 'cute', 'doodles', 'pixel', 'weird', 'abstract'] as const;
export const isAvatarId = (id: unknown): id is string => typeof id === 'string' && /^(goofy|cute|doodles|pixel|weird|abstract)-(00[1-9]|0[1-3][0-9]|04[0-8])$/.test(id);
export const avatarSrc = (id?: string) => `/avatars/v1/${isAvatarId(id) ? id : 'doodles-001'}.svg`;
export type AvatarChoice = { id: string; pack: string; label: string; src: string };
export const AVATAR_SHAPES = ['circle', 'rounded', 'square', 'hexagon'] as const;
export type AvatarShape = typeof AVATAR_SHAPES[number];
export const isAvatarShape = (shape: unknown): shape is AvatarShape => AVATAR_SHAPES.includes(shape as AvatarShape);
export const avatarFrame = (shape?: string) => shape === 'rounded' ? { borderRadius: '24%' } : shape === 'square' ? { borderRadius: '4%' } : shape === 'hexagon' ? { borderRadius: '0', clipPath: 'polygon(25% 6.7%,75% 6.7%,100% 50%,75% 93.3%,25% 93.3%,0% 50%)' } : { borderRadius: '50%' };

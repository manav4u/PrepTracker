import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { isAvatarId, avatarSrc, AVATAR_PACKS } from '../lib/avatars.ts';
test('avatar catalog has exactly 48 safe local choices per pack and no byte duplicates', () => {
  const rows=JSON.parse(readFileSync('public/avatars/v1/catalog.json','utf8'));
  assert.equal(rows.length,288);const bytes=new Set<string>();
  for(const p of AVATAR_PACKS) assert.equal(rows.filter((r:any)=>r.pack===p).length,48);
  for(const r of rows){assert.ok(isAvatarId(r.id));assert.equal(r.src,avatarSrc(r.id));const svg=readFileSync('public'+r.src,'utf8');assert.ok(!/<(?:script|foreignObject|animate|set)\b|\bon\w+=/i.test(svg));assert.ok(!bytes.has(svg));bytes.add(svg);}
});
test('avatar ids cannot be arbitrary paths or external URLs', () => {
 for(const id of ['../x','https://x.invalid','goofy-000','goofy-049',null,2]){assert.equal(isAvatarId(id),false);assert.equal(avatarSrc(id as any),'/avatars/v1/doodles-001.svg');}
 assert.equal(isAvatarId('cute-048'),true);
});

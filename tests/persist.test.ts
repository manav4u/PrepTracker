import test from 'node:test';
import assert from 'node:assert/strict';
import { persist } from '../lib/persist.ts';

test('persist saves JSON and reports success', () => {
  const m: Record<string, string> = {};
  assert.equal(persist({ setItem: (k, v) => { m[k] = v; } }, 'a', { x: 1 }), true);
  assert.equal(m.a, '{"x":1}');
});

test('persist reports a refused save instead of throwing', () => {
  const full = { setItem: () => { throw new DOMException('full', 'QuotaExceededError'); } };
  assert.equal(persist(full, 'a', [1, 2, 3]), false);
});

test('persist survives values that cannot be stringified', () => {
  const loop: any = {}; loop.self = loop;
  assert.equal(persist({ setItem: () => {} }, 'a', loop), false);
});

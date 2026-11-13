import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveOutline } from '../lib/outline.ts';

// deriveOutline's output lines are stored verbatim in saved ticks, so its
// splitting behavior is a data contract: no word added, dropped or
// reordered, commas never split. These tests pin that contract.

test('splits units at semicolons and line breaks', () => {
  assert.deepEqual(deriveOutline('Logic gates; Boolean algebra\nK-maps'), [
    'Logic gates',
    'Boolean algebra',
    'K-maps',
  ]);
});

test('splits sentences only at a period followed by a capital letter, keeping the period', () => {
  assert.deepEqual(deriveOutline('First topic. Second topic. third stays'), [
    'First topic.',
    'Second topic. third stays',
  ]);
});

test('never splits after common abbreviations', () => {
  assert.deepEqual(deriveOutline('Compare RAM vs. ROM, e.g. SRAM, i.e. static chips'), [
    'Compare RAM vs. ROM, e.g. SRAM, i.e. static chips',
  ]);
});

test('never splits after et al.', () => {
  assert.deepEqual(deriveOutline('Shannon et al. proved the theorem. Next unit'), [
    'Shannon et al. proved the theorem.',
    'Next unit',
  ]);
});

test('commas are never split and words are kept verbatim', () => {
  const unit = 'Sampling, quantization, and encoding, in that order';
  assert.deepEqual(deriveOutline(unit), [unit]);
});

test('trims whitespace and drops empty fragments', () => {
  assert.deepEqual(deriveOutline('  Alpha  ;;\n\n  Beta ; \n'), ['Alpha', 'Beta']);
});

test('a single paragraph with no separators yields one line', () => {
  assert.deepEqual(deriveOutline('One whole unit paragraph'), ['One whole unit paragraph']);
});

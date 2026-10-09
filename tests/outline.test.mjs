import {test} from 'node:test';import assert from 'node:assert/strict';import {deriveOutline} from '../lib/outline.mjs';
test('outline preserves words and order without comma splitting or summarization',()=>{assert.deepEqual(deriveOutline('A, B; C: D\nE.'),['A, B','C: D','E.']);assert.deepEqual(deriveOutline(''),[]);});

import test from 'node:test';import assert from 'node:assert/strict';
import {persistStudy} from '../lib/study-storage.mjs';import {KEYS} from '../lib/backup.mjs';
test('study commit stores exact state before returning success',()=>{let raw,key;const state={topics:{},events:[],attempts:[]};assert.equal(persistStudy({setItem(k,v){key=k;raw=v;}},state),state);assert.equal(key,KEYS.study);assert.deepEqual(JSON.parse(raw),state);});
test('study commit throws on storage failure, with retry guidance',()=>{const state={topics:{},events:[]};assert.throws(()=>persistStudy({setItem(){throw Error('QuotaExceeded');}},state),/Your work is still on this sheet/);assert.deepEqual(state,{topics:{},events:[]});});

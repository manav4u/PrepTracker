import {KEYS} from './backup.mjs';
// Commit before publishing React state or a success receipt. A failed write keeps
// the previous in-memory state and the unfinished form available for retry.
export function persistStudy(storage,state){
 try{storage.setItem(KEYS.study,JSON.stringify(state));}
 catch{throw Error('Could not save in this browser. Your work is still on this sheet. Free storage or make a backup, then try again.');}
 return state;
}

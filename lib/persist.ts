// Saving to browser storage can fail (storage full, private mode, blocked). A failed save must never
// take the app down: the screen keeps working from memory and the student is told once.

export interface StorageLike {
  setItem(key: string, value: string): void;
}

/** Save one value. Returns false when the browser refused it. */
export function persist(storage: StorageLike, key: string, value: unknown): boolean {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

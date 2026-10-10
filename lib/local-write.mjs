// Persist first. Failed writes never publish a saved-looking state.
export function writeLocal(storage, key, next) {
  try {
    storage.setItem(key, JSON.stringify(next));
  } catch {
    throw Error(
      "Could not save in this browser. Your previous data is unchanged. Free storage or keep a backup, then try again.",
    );
  }
  return next;
}
export function writeLocalBatch(storage, changes) {
  const old = changes.map(([key]) => [key, storage.getItem(key)]);
  try {
    for (const [key, value] of changes) writeLocal(storage, key, value);
  } catch (error) {
    for (const [key, value] of old) {
      try {
        value === null ? storage.removeItem(key) : storage.setItem(key, value);
      } catch {}
    }
    throw error;
  }
}

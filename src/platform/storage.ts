// IndexedDB persistence via idb-keyval (data-model §5): current/previous slots, a serialized write
// queue, debounce, and a flush on pagehide/visibilitychange because iOS may kill a background tab.
import { createStore, get, set } from 'idb-keyval';
import { log } from './log';

export type SaveStatus = 'ok' | 'paused';

const KEY_CURRENT = 'save:current';
const KEY_PREVIOUS = 'save:previous';

let store: ReturnType<typeof createStore> | null = null;
function kv() {
  store ??= createStore('petalport', 'kv');
  return store;
}

export interface StoredSaves {
  current: unknown;
  previous: unknown;
}

export async function readSaves(): Promise<StoredSaves | null> {
  try {
    const [current, previous] = await Promise.all([get(KEY_CURRENT, kv()), get(KEY_PREVIOUS, kv())]);
    return { current, previous };
  } catch (e) {
    log('error', `read failed: ${String(e)}`);
    return null;
  }
}

let queue: Promise<unknown> = Promise.resolve();
let pending: string | null = null;
let timer: number | undefined;
let firstDirtyAt = 0;
let status: SaveStatus = 'ok';
const statusListeners = new Set<(s: SaveStatus) => void>();

export function onSaveStatus(fn: (s: SaveStatus) => void) {
  statusListeners.add(fn);
  return () => statusListeners.delete(fn);
}

function setStatus(s: SaveStatus) {
  if (s === status) return;
  status = s;
  statusListeners.forEach((l) => l(s));
}

async function writeNow(json: string) {
  try {
    const prev = await get(KEY_CURRENT, kv());
    if (prev !== undefined) await set(KEY_PREVIOUS, prev, kv());
    await set(KEY_CURRENT, json, kv());
    setStatus('ok');
  } catch (e) {
    log('error', `write failed: ${String(e)}`);
    setStatus('paused');
  }
}

export function flush(): Promise<unknown> {
  window.clearTimeout(timer);
  timer = undefined;
  if (pending === null) return queue;
  const json = pending;
  pending = null;
  firstDirtyAt = 0;
  queue = queue.then(() => writeNow(json));
  return queue;
}

/** Debounced write: 400 ms after the last change, at most 1 s after the first. */
export function scheduleWrite(json: string) {
  pending = json;
  const now = Date.now();
  if (!firstDirtyAt) firstDirtyAt = now;
  window.clearTimeout(timer);
  const wait = Math.max(0, Math.min(400, 1000 - (now - firstDirtyAt)));
  timer = window.setTimeout(() => void flush(), wait);
}

window.addEventListener('pagehide', () => void flush());
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') void flush();
});

export async function requestPersist(): Promise<boolean | null> {
  try {
    if (!navigator.storage?.persist) return null;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return null;
  }
}

export function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

// Debug log ring buffer (data-model §9). Ships in production; viewed behind the grown-up gate.
export interface LogEntry {
  at: number;
  level: 'info' | 'warn' | 'error';
  msg: string;
}

const MAX = 200;
const entries: LogEntry[] = [];
const listeners = new Set<() => void>();

export function log(level: LogEntry['level'], msg: string) {
  entries.push({ at: Date.now(), level, msg: msg.slice(0, 500) });
  if (entries.length > MAX) entries.shift();
  listeners.forEach((l) => l());
}

export function getLog(): readonly LogEntry[] {
  return entries;
}

export function onLog(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function logText(): string {
  return entries.map((e) => `${new Date(e.at).toISOString()} ${e.level.toUpperCase()} ${e.msg}`).join('\n');
}

export function installGlobalErrorLogging() {
  window.addEventListener('error', (e) => log('error', `${e.message} @ ${e.filename}:${e.lineno}`));
  window.addEventListener('unhandledrejection', (e) => log('error', `Unhandled: ${String(e.reason)}`));
}

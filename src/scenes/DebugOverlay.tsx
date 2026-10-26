import { useEffect, useState, useSyncExternalStore } from 'react';
import { getLog, logText, onLog } from '../platform/log';
import { isStandalone } from '../platform/storage';
import { APP_VERSION } from '../platform/version';
import { useGame } from '../state/store';

function useFps() {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      frames++;
      if (t - last >= 1000) {
        setFps(Math.round((frames * 1000) / (t - last)));
        frames = 0;
        last = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return fps;
}

export function DebugOverlay({ onClose }: { onClose: () => void }) {
  const entries = useSyncExternalStore(onLog, getLog);
  const fps = useFps();
  const save = useGame((s) => s.save);
  const [persisted, setPersisted] = useState<string>('…');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    navigator.storage
      ?.persisted?.()
      .then((p) => setPersisted(String(p)))
      .catch(() => setPersisted('unknown'));
  }, []);
  return (
    <div className="debug" role="dialog" aria-label="Debug log" data-testid="debug-overlay">
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            const text = `${APP_VERSION}\n${navigator.userAgent}\n${logText()}`;
            void navigator.clipboard?.writeText(text).then(() => setCopied(true));
          }}
        >
          {copied ? 'Copied!' : 'Copy log'}
        </button>
      </div>
      <div>version: {APP_VERSION}</div>
      <div>fps: {fps}</div>
      <div>
        standalone: {String(isStandalone())} · persisted: {persisted}
      </div>
      <div>save updated: {new Date(save.updatedAt).toLocaleTimeString()}</div>
      <div>
        viewport: {window.innerWidth}×{window.innerHeight} @{window.devicePixelRatio}x
      </div>
      <hr />
      {entries.length === 0 && <div>(no log entries)</div>}
      {[...entries].reverse().map((e, i) => (
        <div key={i} style={{ color: e.level === 'error' ? '#FF8A65' : e.level === 'warn' ? '#FFC94A' : '#fff' }}>
          {new Date(e.at).toLocaleTimeString()} {e.msg}
        </div>
      ))}
    </div>
  );
}

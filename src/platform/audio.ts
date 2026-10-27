// Tiny Web Audio engine. The context is created inside the first user gesture (MDN autoplay policy).
// M0 synthesizes its sounds so no audio files are needed yet; CC0 samples replace them in M5.
import { log } from './log';

let ctx: AudioContext | null = null;
let enabled = true;

export function setSfxEnabled(on: boolean) {
  enabled = on;
}

/** Call from a click/tap handler. Safe to call repeatedly. */
export function unlockAudio(): boolean {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return false;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return true;
  } catch (e) {
    log('warn', `audio unlock failed: ${String(e)}`);
    return false;
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && ctx?.state === 'suspended') void ctx.resume().catch(() => undefined);
});

function tone(freq: number, start: number, dur: number, type: OscillatorType, gain: number) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(start);
  o.stop(start + dur + 0.02);
}

/** One piano note for the Bandstand. */
export function playNote(freq: number) {
  if (!enabled || !ctx || ctx.state !== 'running') return;
  tone(freq, ctx.currentTime, 0.5, 'triangle', 0.22);
}

export type Sfx = 'pop' | 'chime' | 'swap' | 'soft';

/** Every tap gets a soft pop with ±2 semitone variation (visual-design §11). */
export function play(name: Sfx) {
  if (!enabled || !ctx || ctx.state !== 'running') return;
  const t = ctx.currentTime;
  const vary = 2 ** ((Math.random() * 4 - 2) / 12);
  switch (name) {
    case 'pop':
      tone(660 * vary, t, 0.09, 'sine', 0.18);
      break;
    case 'swap':
      tone(523 * vary, t, 0.08, 'triangle', 0.14);
      tone(784 * vary, t + 0.06, 0.12, 'triangle', 0.12);
      break;
    case 'chime':
      [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.08, 0.35, 'sine', 0.12));
      break;
    case 'soft':
      tone(392 * vary, t, 0.12, 'sine', 0.1);
      break;
  }
}

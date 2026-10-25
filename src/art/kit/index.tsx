// Construction kit: shared drawing primitives so every asset shares one look
// (plum outline, three-tone shading, light from the top-left). Colors are always resolved hex props.
import { useId, type ReactNode } from 'react';
import type { Shade } from '../../content/palette';

export const OUTLINE = '#5B4A6E';
export const OUTLINE_W = 3.5;

interface ShadedProps {
  d: string;
  shade: Shade;
  /** Offset of the lit copy toward the top-left; the uncovered rim reads as shadow. */
  depth?: number;
  /** Highlight blob in the top-left of the shape: [cx, cy, rx, ry]. */
  shine?: [number, number, number, number];
  outline?: boolean;
  strokeWidth?: number;
  children?: ReactNode;
  testId?: string;
  tint?: 'main' | 'accent';
}

/**
 * A filled shape with three-tone shading: shadow base, lit copy shifted up-left
 * (so a crescent of shadow remains bottom-right), optional highlight, then the outline.
 * Children are drawn clipped inside the shape (patterns, stripes).
 */
export function Shaded({ d, shade, depth = 7, shine, outline = true, strokeWidth = OUTLINE_W, children, testId, tint }: ShadedProps) {
  const clip = useId().replace(/:/g, '');
  return (
    <g data-testid={testId} data-tint={tint}>
      <defs>
        <clipPath id={clip}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={shade.shadow} />
      <g clipPath={`url(#${clip})`}>
        <path d={d} fill={shade.base} transform={`translate(${-depth} ${-depth * 0.75})`} />
        {shine && <ellipse cx={shine[0]} cy={shine[1]} rx={shine[2]} ry={shine[3]} fill={shade.highlight} opacity={0.9} />}
        {children}
      </g>
      {outline && <path d={d} fill="none" stroke={OUTLINE} strokeWidth={strokeWidth} strokeLinejoin="round" />}
    </g>
  );
}

export type Pt = [number, number];

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
export function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${r(c1[0])},${r(c1[1])} ${r(c2[0])},${r(c2[1])} ${r(p2[0])},${r(p2[1])}`;
  }
  return d;
}

const r = (n: number) => Math.round(n * 10) / 10;

/** Point at fraction t (0..1) of a polyline's length, and the sub-polyline up to it. */
export function polylineUpTo(pts: Pt[], t: number): Pt[] {
  const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  let left = total * Math.max(0, Math.min(1, t));
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < segs.length; i++) {
    if (left >= segs[i]) {
      out.push(pts[i + 1]);
      left -= segs[i];
    } else {
      const f = segs[i] === 0 ? 0 : left / segs[i];
      out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]);
      break;
    }
  }
  return out;
}

/** Sub-polyline between fractions t0 and t1 of the total length. */
export function polylineRange(pts: Pt[], t0: number, t1: number): Pt[] {
  const upTo = polylineUpTo(pts, t1);
  const head = polylineUpTo(pts, t0);
  const start = head[head.length - 1];
  // Keep the vertices of upTo that lie beyond the t0 point.
  return [start, ...upTo.slice(head.length)];
}

/** Bumpy cloud outline around a circle: used for coily hair, buns, foliage, puffs. */
export function scallopCircle(cx: number, cy: number, rad: number, bumps: number, amp: number, phase = 0): string {
  let d = '';
  for (let i = 0; i <= bumps; i++) {
    const a = phase + (i / bumps) * Math.PI * 2;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad;
    if (i === 0) {
      d += `M${r(x)},${r(y)}`;
      continue;
    }
    const am = phase + ((i - 0.5) / bumps) * Math.PI * 2;
    const qx = cx + Math.cos(am) * (rad + amp * 2);
    const qy = cy + Math.sin(am) * (rad + amp * 2);
    d += ` Q${r(qx)},${r(qy)} ${r(x)},${r(y)}`;
  }
  return d + 'Z';
}

/**
 * A rounded limb (arm, sleeve, strap) drawn as stacked strokes: outline, shadow, then a lit stroke
 * nudged up-left. Cheap three-tone shading for capsule shapes.
 */
export function Limb({ pts, width, shade, outline = true }: { pts: Pt[]; width: number; shade: Shade; outline?: boolean }) {
  const d = smoothPath(pts);
  const lit = Math.max(2, width * 0.62);
  return (
    <g>
      {outline && <path d={d} fill="none" stroke={OUTLINE} strokeWidth={width + OUTLINE_W * 2} strokeLinecap="round" strokeLinejoin="round" />}
      <path d={d} fill="none" stroke={shade.shadow} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={d}
        fill="none"
        stroke={shade.base}
        strokeWidth={lit}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={`translate(${-width * 0.14} ${-width * 0.1})`}
      />
    </g>
  );
}

/** Mirror a path horizontally around x = cx (for left/right pairs). */
export function mirrorX(cx: number) {
  return `translate(${cx * 2} 0) scale(-1 1)`;
}

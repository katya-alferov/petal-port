// Glow Nails art (game-systems §18): a hand with five paintable nails, and a polish bottle.
// Colors arrive as props. viewBox 0 0 300 330.
import { OUTLINE } from '../kit';

const SKIN = '#FFD9C0';
const SKIN_SHADE = '#F2BFA2';
const sw = { stroke: OUTLINE, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** Local finger boxes: pinky, ring, middle, pointer, thumb (the thumb is drawn in its own rotated space). */
const FINGERS: { cx: number; top: number; w: number; h: number }[] = [
  { cx: 62, top: 128, w: 40, h: 130 },
  { cx: 114, top: 82, w: 44, h: 176 },
  { cx: 170, top: 60, w: 46, h: 198 },
  { cx: 226, top: 94, w: 44, h: 164 },
  { cx: 0, top: -112, w: 42, h: 140 },
];
const THUMB_T = 'translate(250 262) rotate(36)';
const tf = (i: number) => (i === 4 ? THUMB_T : undefined);

export function HandArt({
  colors,
  gems,
  shade,
  onTap,
  wobble = [],
  names = [],
}: {
  colors: (string | null)[];
  gems: boolean[];
  /** Darker rim color for each painted nail, same order as `colors`. */
  shade: (string | null)[];
  onTap?: (i: number) => void;
  wobble?: number[];
  names?: string[];
}) {
  const finger = (i: number) => {
    const f = FINGERS[i];
    return <rect x={f.cx - f.w / 2} y={f.top} width={f.w} height={f.h} rx={f.w / 2} fill={SKIN} {...sw} />;
  };
  return (
    <svg viewBox="0 0 340 340" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden={onTap ? undefined : true}>
      <g transform={THUMB_T}>{finger(4)}</g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>{finger(i)}</g>
      ))}
      <path
        d="M38,236 C38,300 90,332 160,332 C226,332 276,306 282,252 L282,236 C282,222 270,214 250,214 L70,214 C50,214 38,222 38,236 Z"
        fill={SKIN}
        {...sw}
      />
      {FINGERS.map((f, i) => {
        const nw = f.w * 0.68;
        const col = colors[i];
        const nail = (
          <g transform={tf(i)} className={wobble.includes(i) ? 'nail-wobble' : undefined}>
            <rect
              x={f.cx - nw / 2}
              y={f.top + 8}
              width={nw}
              height={48}
              rx={nw / 2.6}
              fill={col ?? '#FFEDE0'}
              stroke={col ? (shade[i] ?? OUTLINE) : SKIN_SHADE}
              strokeWidth={col ? 4 : 3}
              strokeDasharray={col ? undefined : '6 5'}
            />
            <ellipse cx={f.cx - nw * 0.2} cy={f.top + 22} rx={nw * 0.1} ry={7} fill="#FFFFFF" opacity={0.55} />
            {gems[i] && (
              <path
                d={`M${f.cx},${f.top + 24} l9,10 l-9,12 l-9,-12 Z`}
                fill="#FFFFFF"
                stroke={OUTLINE}
                strokeWidth={3}
                strokeLinejoin="round"
              />
            )}
          </g>
        );
        return onTap ? (
          <g
            key={i}
            role="button"
            tabIndex={0}
            aria-label={names[i] ?? `Nail ${i + 1}`}
            data-testid={`nail-${i}`}
            style={{ cursor: 'pointer' }}
            onClick={() => onTap(i)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onTap(i))}
          >
            {nail}
            <rect x={f.cx - 28} y={f.top - 4} width={56} height={76} fill="transparent" transform={tf(i)} />
          </g>
        ) : (
          <g key={i}>{nail}</g>
        );
      })}
    </svg>
  );
}

/** A polish bottle (viewBox 0 0 60 80). */
export function PolishBottle({ color, shade }: { color: string; shade: string }) {
  return (
    <svg viewBox="0 0 60 80" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
      <rect x={24} y={4} width={12} height={22} rx={4} fill="#5B4A6E" />
      <rect x={10} y={24} width={40} height={50} rx={14} fill={color} stroke={OUTLINE} strokeWidth={4} />
      <path d="M14,60 C14,70 46,70 46,60" fill="none" stroke={shade} strokeWidth={3} />
      <ellipse cx={20} cy={40} rx={4} ry={9} fill="#FFFFFF" opacity={0.55} />
    </svg>
  );
}

export function GemIcon() {
  return (
    <svg viewBox="0 0 60 80" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
      <path d="M30,18 L50,36 L30,64 L10,36 Z" fill="#CFE9FF" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <path d="M10,36 L50,36 M20,36 L30,18 L40,36 L30,64 Z" fill="none" stroke={OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />
    </svg>
  );
}

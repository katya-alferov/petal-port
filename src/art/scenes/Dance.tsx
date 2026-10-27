// Dance Studio back wall (game-systems §15): wood floor, a mirror wall, speakers and a disco ball.
// Canvas 1170×1400 anchored to the bottom. Also the five move icons (each a different shape and color).
import { OUTLINE } from '../kit';

const sw = { stroke: OUTLINE, strokeWidth: 6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export function DanceBackdrop() {
  return (
    <svg
      viewBox="0 0 1170 1400"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <linearGradient id="dance-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A2E4F" />
          <stop offset="1" stopColor="#6B4E8C" />
        </linearGradient>
        <linearGradient id="dance-mirror" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#CFE9FF" />
          <stop offset="1" stopColor="#9FC8F2" />
        </linearGradient>
      </defs>
      <rect width={1170} height={1400} fill="url(#dance-wall)" />
      {/* mirror wall */}
      <rect x={60} y={260} width={1050} height={620} rx={24} fill="url(#dance-mirror)" {...sw} strokeWidth={10} />
      {[260, 470, 680, 890].map((x) => (
        <path key={x} d={`M${x},270 L${x},870`} stroke="#FFFFFF" strokeWidth={8} opacity={0.5} />
      ))}
      <path d="M130,760 L330,330" stroke="#FFFFFF" strokeWidth={26} opacity={0.35} strokeLinecap="round" />
      <path d="M380,820 L520,520" stroke="#FFFFFF" strokeWidth={16} opacity={0.3} strokeLinecap="round" />
      {/* barre */}
      <rect x={90} y={700} width={990} height={16} rx={8} fill="#E5B07A" {...sw} strokeWidth={5} />
      {/* disco ball and light beams */}
      <path d="M585,0 L585,120" stroke="#B9B2C4" strokeWidth={6} />
      <circle cx={585} cy={170} r={64} fill="#E7E1F2" {...sw} />
      {[
        [560, 150],
        [600, 140],
        [575, 190],
        [615, 185],
        [545, 185],
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x - 9}
          y={y - 9}
          width={18}
          height={18}
          rx={3}
          fill={['#FF7BA9', '#FFC94A', '#8EC9FF', '#B692F6', '#7ED6A7'][i]}
          opacity={0.9}
        />
      ))}
      <path d="M520,220 L240,500 L360,520 Z" fill="#FFC94A" opacity={0.16} />
      <path d="M650,220 L940,500 L820,520 Z" fill="#FF7BA9" opacity={0.16} />
      {/* speakers */}
      {[70, 960].map((x) => (
        <g key={x}>
          <rect x={x} y={900} width={140} height={190} rx={18} fill="#2E2640" {...sw} />
          <circle cx={x + 70} cy={960} r={24} fill="#4B3F82" stroke="#FFFFFF" strokeWidth={4} />
          <circle cx={x + 70} cy={1034} r={36} fill="#4B3F82" stroke="#FFFFFF" strokeWidth={4} />
        </g>
      ))}
      {/* floor */}
      <rect x={0} y={1000} width={1170} height={400} fill="#D9A468" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${i * 100},1000 L${i * 100 - 120 + i * 24},1400`} stroke="#BC8651" strokeWidth={4} opacity={0.7} />
      ))}
      <rect x={0} y={990} width={1170} height={24} fill="#FFF7EC" {...sw} strokeWidth={5} />
      <ellipse cx={585} cy={1260} rx={460} ry={70} fill="#FF7BA9" opacity={0.18} />
    </svg>
  );
}

const MOVE_COLOR: Record<string, string> = { wave: '#8EC9FF', hips: '#FF9EC4', cheer: '#FFC94A', jump: '#7ED6A7', twirl: '#B692F6' };

/** A move button icon: a colored badge with a different glyph for each move. */
export function MoveIcon({ move }: { move: string }) {
  const c = MOVE_COLOR[move] ?? '#FFFFFF';
  const g = { fill: '#FFF7EC', stroke: OUTLINE, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" width="100%" height="100%">
      <circle cx={24} cy={24} r={21} fill={c} stroke={OUTLINE} strokeWidth={3.5} />
      {move === 'wave' && <path d="M14,28 C18,20 22,34 26,26 C30,18 34,32 38,22" {...g} fill="none" strokeWidth={5} />}
      {move === 'hips' && <path d="M12,32 L18,20 M36,32 L30,20 M18,20 L30,20" {...g} fill="none" strokeWidth={5} />}
      {move === 'cheer' && (
        <g>
          <circle cx={24} cy={15} r={4.5} {...g} />
          <path d="M24,20 L24,33 M24,33 L19,41 M24,33 L29,41 M24,23 L13,12 M24,23 L35,12" {...g} fill="none" strokeWidth={4} />
        </g>
      )}
      {move === 'jump' && (
        <g>
          <path d="M24,8 L33,19 L27,19 L27,29 L21,29 L21,19 L15,19 Z" {...g} />
          <path d="M12,38 L36,38" {...g} fill="none" strokeWidth={4} />
          <path d="M16,33 L16,36 M32,33 L32,36" {...g} fill="none" strokeWidth={3} />
        </g>
      )}
      {move === 'twirl' && <path d="M24,12 C36,12 38,28 26,30 C18,31 16,22 22,20 C26,19 28,23 25,25" {...g} fill="none" strokeWidth={5} />}
    </svg>
  );
}

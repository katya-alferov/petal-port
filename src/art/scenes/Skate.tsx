// Skate Park pieces (game-systems §16): a track backdrop and three obstacles. The track is drawn in
// track units: the ground line is y = 330 in a 400-high strip.
import { OUTLINE } from '../kit';

export const GROUND_Y = 330;
const sw = { stroke: OUTLINE, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** Scenery behind the track, `width` track units wide. */
export function SkateBackdrop({ width }: { width: number }) {
  const w = Math.max(width, 600);
  return (
    <g>
      <rect width={w} height={400} fill="#BFE6FF" />
      <circle cx={w - 90} cy={70} r={34} fill="#FFE08A" {...sw} strokeWidth={3} />
      {[0.12, 0.45, 0.78].map((k, i) => (
        <path key={i} d={`M${w * k},90 q-8,-26 26,-22 q8,-28 44,-12 q36,0 30,28 Z`} fill="#FFF7EC" opacity={0.95} />
      ))}
      {/* graffiti wall */}
      <rect x={0} y={150} width={w} height={180} fill="#8E78D8" />
      <rect x={0} y={150} width={w} height={14} fill="#6B4E8C" stroke={OUTLINE} strokeWidth={3} />
      {Array.from({ length: Math.ceil(w / 180) }, (_, i) => (
        <g key={i} transform={`translate(${30 + i * 180} 190)`}>
          <circle cx={30} cy={36} r={26} fill={['#FF7BA9', '#FFC94A', '#7ED6A7', '#8EC9FF'][i % 4]} stroke={OUTLINE} strokeWidth={3} />
          <path
            d="M80,20 L110,60 L90,60 L120,100"
            fill="none"
            stroke={['#FFC94A', '#FF7BA9', '#8EC9FF', '#7ED6A7'][i % 4]}
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
      {/* concrete floor */}
      <rect x={0} y={GROUND_Y} width={w} height={70} fill="#DAD3E6" />
      <rect x={0} y={GROUND_Y - 4} width={w} height={8} fill="#B9B2C4" stroke={OUTLINE} strokeWidth={3} />
      {Array.from({ length: Math.ceil(w / 120) }, (_, i) => (
        <path key={i} d={`M${i * 120},${GROUND_Y + 40} l60,0`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
      ))}
    </g>
  );
}

/** An obstacle standing on the ground with its left edge at `x`. */
export function SkateObstacle({ kind, x }: { kind: string; x: number }) {
  if (kind === 'cone')
    return (
      <g transform={`translate(${x} ${GROUND_Y})`}>
        <rect x={-6} y={-6} width={52} height={10} rx={3} fill="#E8503A" {...sw} />
        <path d="M2,-6 L20,-62 L38,-6 Z" fill="#FF8A3D" {...sw} />
        <path d="M10,-30 L30,-30 M6,-16 L34,-16" stroke="#FFF7EC" strokeWidth={6} strokeLinecap="round" />
      </g>
    );
  if (kind === 'rail')
    return (
      <g transform={`translate(${x} ${GROUND_Y})`}>
        <rect x={0} y={-48} width={150} height={9} rx={4} fill="#C9C2D6" {...sw} />
        <rect x={14} y={-40} width={9} height={40} fill="#8E86A0" {...sw} />
        <rect x={126} y={-40} width={9} height={40} fill="#8E86A0" {...sw} />
      </g>
    );
  return (
    <g transform={`translate(${x} ${GROUND_Y})`}>
      <path d="M0,0 L120,0 L120,-56 Z" fill="#FFC94A" {...sw} />
      <path d="M30,-6 L100,-6" stroke="#FFF7EC" strokeWidth={5} strokeLinecap="round" />
    </g>
  );
}

export function Board() {
  return (
    <svg viewBox="0 0 140 40" aria-hidden="true" width="100%" height="100%">
      <path d="M8,14 C8,8 22,8 70,8 C118,8 132,8 132,14 C132,20 118,20 70,20 C22,20 8,20 8,14 Z" fill="#FF7BA9" {...sw} />
      <circle cx={34} cy={30} r={8} fill="#FFF7EC" {...sw} />
      <circle cx={106} cy={30} r={8} fill="#FFF7EC" {...sw} />
    </svg>
  );
}

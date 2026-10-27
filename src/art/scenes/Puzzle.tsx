// Puzzle Shop pictures (game-systems §25): three small scenes drawn in a 300×300 box, cut into pieces by
// showing a different window (viewBox) of the same drawing.
import { OUTLINE } from '../kit';

const sw = { stroke: OUTLINE, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export function PuzzleArt({ id }: { id: string }) {
  if (id === 'harbour')
    return (
      <g>
        <rect width={300} height={300} fill="#CDEBFF" />
        <circle cx={240} cy={50} r={26} fill="#FFE08A" {...sw} />
        <rect y={150} width={300} height={150} fill="#3BB7C4" />
        <path d="M0,190 C50,180 100,200 150,190 C200,180 250,200 300,190" stroke="#BDEBF0" strokeWidth={6} fill="none" />
        <path d="M0,240 C60,230 120,250 180,240 C230,232 270,248 300,240" stroke="#BDEBF0" strokeWidth={6} fill="none" />
        <rect x={40} y={70} width={44} height={110} fill="#FFFFFF" {...sw} />
        <rect x={40} y={100} width={44} height={22} fill="#FF7BA9" />
        <rect x={40} y={140} width={44} height={22} fill="#FF7BA9" />
        <path d="M34,70 L62,40 L90,70 Z" fill="#FFC94A" {...sw} />
        <path d="M130,230 L250,230 L230,265 L150,265 Z" fill="#FF8A65" {...sw} />
        <path d="M190,225 L190,130 L240,225 Z" fill="#FFFFFF" {...sw} />
        <path d="M184,225 L184,140 L146,225 Z" fill="#FFF1D8" {...sw} />
      </g>
    );
  if (id === 'castle')
    return (
      <g>
        <rect width={300} height={300} fill="#E6DBFF" />
        <circle cx={60} cy={60} r={24} fill="#FFFFFF" opacity={0.9} />
        <rect y={250} width={300} height={50} fill="#9FD9AE" />
        <rect x={80} y={120} width={140} height={140} fill="#D9D3E0" {...sw} />
        <rect x={50} y={90} width={50} height={170} fill="#C9C1D6" {...sw} />
        <rect x={200} y={90} width={50} height={170} fill="#C9C1D6" {...sw} />
        <path d="M44,90 L75,40 L106,90 Z" fill="#FF7BA9" {...sw} />
        <path d="M194,90 L225,40 L256,90 Z" fill="#FF7BA9" {...sw} />
        <path d="M75,40 L75,18 L100,26 L75,34" fill="#FFC94A" {...sw} />
        <path d="M120,260 L120,210 C120,185 180,185 180,210 L180,260 Z" fill="#B57D4E" {...sw} />
        <rect x={64} y={130} width={22} height={30} rx={11} fill="#7CC4F5" {...sw} />
        <rect x={214} y={130} width={22} height={30} rx={11} fill="#7CC4F5" {...sw} />
        <path d="M80,120 h20 v-14 h20 v14 h20 v-14 h20 v14 h20" fill="none" {...sw} />
      </g>
    );
  return (
    <g>
      <rect width={300} height={300} fill="#CDEBFF" />
      <circle cx={246} cy={50} r={28} fill="#FFE08A" {...sw} />
      <path d="M0,170 C70,110 150,120 220,150 C260,165 280,160 300,150 L300,300 L0,300 Z" fill="#9FD9AE" {...sw} />
      <path d="M0,230 C100,200 200,230 300,210 L300,300 L0,300 Z" fill="#7ED6A7" {...sw} />
      <rect x={52} y={140} width={14} height={60} fill="#9E6A42" {...sw} />
      <circle cx={59} cy={125} r={36} fill="#5FA67A" {...sw} />
      {[
        [130, 250, '#FF7BA9'],
        [175, 265, '#FFC94A'],
        [225, 245, '#B692F6'],
        [100, 270, '#FF8A65'],
      ].map(([x, y, c]) => (
        <g key={String(x)}>
          <path d={`M${x},${y} L${x},${Number(y) + 22}`} stroke="#3F7F5A" strokeWidth={4} />
          <circle cx={Number(x)} cy={Number(y)} r={11} fill={String(c)} {...sw} />
          <circle cx={Number(x)} cy={Number(y)} r={4} fill="#FFF7EC" />
        </g>
      ))}
    </g>
  );
}

/** A window of the picture: column `col` of `cols`, row `row` of `rows`. */
export function PuzzlePiece({ id, col, row, cols, rows }: { id: string; col: number; row: number; cols: number; rows: number }) {
  const w = 300 / cols;
  const h = 300 / rows;
  return (
    <svg
      viewBox={`${col * w} ${row * h} ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <PuzzleArt id={id} />
    </svg>
  );
}

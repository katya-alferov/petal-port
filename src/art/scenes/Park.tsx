// Petal Park back drop (game-systems §21, §22): sky, hills, a pond with ducks, trees and a picnic blanket.
// Canvas 1170×1400 anchored to the bottom.
import { OUTLINE } from '../kit';

const sw = { stroke: OUTLINE, strokeWidth: 6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-18} y={-10} width={36} height={130} rx={10} fill="#9E6A42" {...sw} />
      <circle cx={0} cy={-70} r={96} fill="#5FA67A" {...sw} />
      <circle cx={-34} cy={-96} r={26} fill="#8CCB9E" opacity={0.7} />
    </g>
  );
}

export function ParkBackdrop() {
  return (
    <svg
      viewBox="0 0 1170 1400"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <rect width={1170} height={1400} fill="#CDEBFF" />
      <circle cx={960} cy={220} r={70} fill="#FFE08A" {...sw} strokeWidth={5} />
      <path d="M0,640 C240,520 500,560 760,600 C940,540 1080,560 1170,600 L1170,1400 L0,1400 Z" fill="#9FD9AE" {...sw} />
      <path d="M0,820 C300,740 700,760 1170,800 L1170,1400 L0,1400 Z" fill="#B8E6C4" {...sw} />
      <Tree x={150} y={620} s={1.2} />
      <Tree x={1030} y={640} s={1} />
      <ellipse cx={600} cy={900} rx={300} ry={90} fill="#7FD0DC" {...sw} />
      <ellipse cx={560} cy={890} rx={180} ry={40} fill="#BDEBF0" opacity={0.7} />
      <g transform="translate(520 870)">
        <ellipse cx={0} cy={0} rx={46} ry={26} fill="#FFFFFF" {...sw} strokeWidth={5} />
        <circle cx={34} cy={-26} r={22} fill="#FFFFFF" {...sw} strokeWidth={5} />
        <path d="M52,-26 L78,-20 L52,-14 Z" fill="#FFC94A" {...sw} strokeWidth={4} />
        <circle cx={40} cy={-32} r={4} fill={OUTLINE} />
      </g>
      <path d="M0,1130 L1170,1070 L1170,1400 L0,1400 Z" fill="#8FD0A0" />
      <g transform="translate(580 1120)">
        <path d="M-330,0 L330,0 L380,160 L-380,160 Z" fill="#FF9EC4" {...sw} />
        {[-240, -80, 80, 240].map((x) => (
          <path key={x} d={`M${x},0 L${x * 1.1},160`} stroke="#FFFFFF" strokeWidth={26} opacity={0.8} />
        ))}
      </g>
    </svg>
  );
}

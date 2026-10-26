// Album stickers: a scalloped, glossy sticker with one motif, in a 100×100 box.
// Locked stickers draw as a soft silhouette so the album shows what is still to find.
import type { ReactElement } from 'react';
import { OUTLINE, scallopCircle } from '../kit';
import { ShellArt } from '../shells';

const W = '#FFF7EC';
const sw = { stroke: OUTLINE, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

const HEART = 'M50,76 C24,60 18,48 18,38 C18,28 26,22 34,22 C42,22 47,27 50,32 C53,27 58,22 66,22 C74,22 82,28 82,38 C82,48 76,60 50,76 Z';
const STAR = 'M50,18 L58.5,37 L79,39 L63.5,52.5 L68,73 L50,62.5 L32,73 L36.5,52.5 L21,39 L41.5,37 Z';

const MOTIF: Record<string, (ink: string) => ReactElement> = {
  map: (c) => (
    <g {...sw}>
      <path d="M22,30 L38,24 L62,30 L78,24 L78,70 L62,76 L38,70 L22,76 Z" fill={c} />
      <path d="M38,24 L38,70 M62,30 L62,76" fill="none" />
      <path d="M50,36 C56,36 58,40 58,43 C58,48 50,56 50,56 C50,56 42,48 42,43 C42,40 44,36 50,36 Z" fill="#FF7BA9" />
    </g>
  ),
  cup: (c) => (
    <g {...sw}>
      <path d="M28,40 L68,40 L64,74 C63,78 33,78 32,74 Z" fill={W} />
      <path d="M68,46 C80,46 80,62 66,62" fill="none" />
      <path d="M30,44 L66,44 L65,52 L31,52 Z" fill={c} stroke="none" />
      <path d="M40,32 C36,26 44,22 40,16 M54,32 C50,26 58,22 54,16" fill="none" strokeWidth={3} />
    </g>
  ),
  star: (c) => <path d={STAR} fill={c} {...sw} />,
  crown: (c) => (
    <g {...sw}>
      <path d="M22,70 L22,34 L36,48 L50,26 L64,48 L78,34 L78,70 Z" fill={c} />
      <circle cx={50} cy={58} r={6} fill="#FF7BA9" />
    </g>
  ),
  pancake: (c) => (
    <g {...sw}>
      <ellipse cx={50} cy={64} rx={30} ry={10} fill="#E3B183" />
      <ellipse cx={50} cy={54} rx={30} ry={10} fill="#E3B183" />
      <ellipse cx={50} cy={44} rx={30} ry={10} fill="#F2C98F" />
      <path d="M40,40 C44,48 56,48 60,40 L62,52 C58,56 56,50 54,56" fill={c} />
    </g>
  ),
  crepe: (c) => (
    <g {...sw}>
      <path d="M20,62 C30,30 70,30 80,62 Z" fill="#F7D79A" />
      <path d="M28,58 C40,44 60,44 72,58" fill="none" stroke="#E3B183" />
      <circle cx={40} cy={50} r={6} fill={c} />
      <circle cx={58} cy={46} r={5} fill="#FF6B6B" />
    </g>
  ),
  bag: (c) => (
    <g {...sw}>
      <path d="M24,38 L76,38 L80,78 L20,78 Z" fill={c} />
      <path d="M38,42 L38,32 C38,20 62,20 62,32 L62,42" fill="none" />
      <path d={HEART} transform="translate(35 40) scale(0.3)" fill={W} strokeWidth={6} />
    </g>
  ),
  hanger: (c) => (
    <g {...sw}>
      <path d="M50,32 C50,26 56,22 56,18 C56,14 52,12 50,12 C47,12 45,14 45,16" fill="none" />
      <path d="M50,32 L18,54 L82,54 Z" fill="none" />
      <path d="M30,54 L70,54 L74,84 L26,84 Z" fill={c} />
    </g>
  ),
  sofa: (c) => (
    <g {...sw}>
      <path d="M24,40 C24,32 30,28 38,28 L62,28 C70,28 76,32 76,40 L76,56 L24,56 Z" fill={c} />
      <path d="M16,48 C16,42 26,42 26,48 L26,70 L16,70 Z M74,48 C74,42 84,42 84,48 L84,70 L74,70 Z" fill={c} />
      <path d="M26,54 L74,54 L74,70 L26,70 Z" fill={W} />
      <path d="M22,70 L22,78 M78,70 L78,78" />
    </g>
  ),
  house: (c) => (
    <g {...sw}>
      <path d="M26,46 L26,78 L74,78 L74,46" fill={c} />
      <path d="M18,48 L50,22 L82,48 Z" fill="#FF8A65" />
      <path d="M44,78 L44,60 C44,56 56,56 56,60 L56,78 Z" fill="#FF7BA9" />
    </g>
  ),
  paw: (c) => (
    <g {...sw}>
      <path d="M50,48 C62,48 72,60 70,68 C68,78 58,74 50,74 C42,74 32,78 30,68 C28,60 38,48 50,48 Z" fill={c} />
      <ellipse cx={26} cy={44} rx={7} ry={9} fill={c} />
      <ellipse cx={40} cy={30} rx={7} ry={9} fill={c} />
      <ellipse cx={60} cy={30} rx={7} ry={9} fill={c} />
      <ellipse cx={74} cy={44} rx={7} ry={9} fill={c} />
    </g>
  ),
  heart: (c) => <path d={HEART} fill={c} {...sw} />,
  ball: (c) => (
    <g {...sw}>
      <circle cx={50} cy={50} r={26} fill={c} />
      <path d="M26,46 C40,56 60,56 74,46 M50,24 C44,40 44,60 50,76" fill="none" stroke={W} strokeWidth={4} />
    </g>
  ),
  trophy: (c) => (
    <g {...sw}>
      <path d="M32,22 L68,22 L66,46 C64,58 36,58 34,46 Z" fill={c} />
      <path d="M32,28 C18,28 20,46 34,46 M68,28 C82,28 80,46 66,46" fill="none" />
      <path d="M44,58 L56,58 L58,70 L42,70 Z" fill={c} />
      <path d="M34,70 L66,70 L66,80 L34,80 Z" fill="#8B5E3C" />
    </g>
  ),
  note: (c) => (
    <g {...sw}>
      <path d="M24,22 L76,20 L78,78 L26,80 Z" fill={c} />
      <circle cx={50} cy={22} r={5} fill="#FF7BA9" />
      <path d="M34,40 L66,39 M34,52 L66,51 M34,64 L52,63.5" fill="none" />
    </g>
  ),
  friends: (c) => (
    <g {...sw}>
      <circle cx={36} cy={40} r={12} fill="#FFD9C9" />
      <circle cx={64} cy={40} r={12} fill="#F2C9A0" />
      <path d="M18,78 C18,60 54,60 54,78 Z" fill={c} />
      <path d="M46,78 C46,60 82,60 82,78 Z" fill="#FFC94A" />
      <path d={HEART} transform="translate(40 14) scale(0.2)" fill="#FF7BA9" strokeWidth={8} />
    </g>
  ),
  envelope: (c) => (
    <g {...sw}>
      <path d="M18,30 L82,30 L82,74 L18,74 Z" fill={W} />
      <path d="M18,30 L50,54 L82,30" fill="none" />
      <path d={HEART} transform="translate(38 46) scale(0.24)" fill={c} strokeWidth={8} />
    </g>
  ),
  coin: (c) => (
    <g {...sw}>
      <circle cx={50} cy={50} r={26} fill={c} />
      <circle cx={50} cy={50} r={18} fill="none" stroke={W} strokeWidth={3} />
      <path d="M50,38 L53,46 L61,46 L55,51 L57,59 L50,54 L43,59 L45,51 L39,46 L47,46 Z" fill={W} strokeWidth={2} />
    </g>
  ),
  dress: (c) => (
    <g {...sw}>
      <path d="M40,18 L46,26 L54,26 L60,18 L64,34 L58,42 L76,80 L24,80 L42,42 L36,34 Z" fill={c} />
      <path d="M42,42 L58,42" fill="none" />
      <path d="M50,52 L52,57 L57,58 L53,61 L54,66 L50,63 L46,66 L47,61 L43,58 L48,57 Z" fill={W} strokeWidth={1.5} />
    </g>
  ),
  scissors: (c) => (
    <g {...sw}>
      <path d="M40,22 L60,64 M60,22 L40,64" fill="none" strokeWidth={5} />
      <circle cx={36} cy={70} r={10} fill={c} />
      <circle cx={64} cy={70} r={10} fill={c} />
      <circle cx={50} cy={43} r={3} fill={W} />
    </g>
  ),
  burger: (c) => (
    <g {...sw}>
      <path d="M22,48 C22,26 78,26 78,48 Z" fill={c} />
      <path d="M22,54 q7,-7 14,0 q7,7 14,0 q7,-7 14,0 q7,7 14,0" fill="none" stroke="#7ED6A7" strokeWidth={6} />
      <rect x={22} y={58} width={56} height={10} rx={5} fill="#8A5A3C" />
      <path d="M22,72 L78,72 L74,80 Q50,86 26,80 Z" fill={c} />
      <circle cx={42} cy={38} r={2.5} fill={W} stroke="none" />
      <circle cx={56} cy={34} r={2.5} fill={W} stroke="none" />
    </g>
  ),
  flower: (c) => (
    <g {...sw}>
      <path d="M50,58 C48,68 50,76 50,84" fill="none" stroke="#5FA67A" strokeWidth={5} />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={50 + Math.cos(((a - 90) * Math.PI) / 180) * 14}
          cy={40 + Math.sin(((a - 90) * Math.PI) / 180) * 14}
          r={11}
          fill={c}
        />
      ))}
      <circle cx={50} cy={40} r={8} fill="#FFC94A" />
    </g>
  ),
  shell: (c) => (
    <g transform="translate(14 12) scale(0.72)">
      <ShellArt kind="scallop" color={c} />
    </g>
  ),
};

export function StickerArt({ motif, color, locked = false }: { motif: string; color: string; locked?: boolean }) {
  const draw = MOTIF[motif] ?? MOTIF.star;
  if (locked)
    return (
      <g opacity={0.35}>
        <path d={scallopCircle(50, 50, 42, 12, 4)} fill="#E3D3CC" stroke={OUTLINE} strokeWidth={3} strokeDasharray="6 5" />
        {draw('#B4ABBF')}
      </g>
    );
  return (
    <g>
      <path d={scallopCircle(50, 52, 44, 12, 4)} fill="#3A2E4F" opacity={0.18} />
      <path d={scallopCircle(50, 50, 44, 12, 4)} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={3} />
      <circle cx={50} cy={50} r={36} fill={color} opacity={0.25} />
      {draw(color)}
      {/* Gloss and a sparkle, like a shiny 2009 sticker */}
      <path d="M24,30 C30,20 40,15 50,14" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.9} />
      <path d="M82,16 L84,22 L90,24 L84,26 L82,32 L80,26 L74,24 L80,22 Z" fill="#FFF7EC" stroke={OUTLINE} strokeWidth={1.5} />
    </g>
  );
}

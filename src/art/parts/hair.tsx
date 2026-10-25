// Hairstyles: each has a back layer (behind the head) and a front layer (over the face edge).
import type { Shade } from '../../content/palette';
import { Shaded, scallopCircle, OUTLINE } from '../kit';

export interface HairProps {
  shade: Shade;
}

/** Bumpy edge along an elliptical arc from angle a0 to a1 (radians), returned as path segments (no M). */
function bumpyArc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, bumps: number, amp: number) {
  let d = '';
  for (let i = 1; i <= bumps; i++) {
    const am = a0 + ((i - 0.5) / bumps) * (a1 - a0);
    const a = a0 + (i / bumps) * (a1 - a0);
    const qx = cx + Math.cos(am) * (rx + amp);
    const qy = cy + Math.sin(am) * (ry + amp);
    d += ` Q${qx.toFixed(1)},${qy.toFixed(1)} ${(cx + Math.cos(a) * rx).toFixed(1)},${(cy + Math.sin(a) * ry).toFixed(1)}`;
  }
  return d;
}

function Strand({ d, color }: { d: string; color: string }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.9} />;
}

export const HAIR_BACK: Record<string, (p: HairProps) => React.ReactElement> = {
  'hair/wavy-long': ({ shade }) => (
    <Shaded
      shade={shade}
      depth={9}
      d="M128,120 C118,62 158,34 200,34 C242,34 282,62 272,120 C282,178 292,238 286,296 C294,318 280,342 262,334 C252,352 230,350 224,334 L176,334 C170,350 148,352 138,334 C120,342 106,318 114,296 C108,238 118,178 128,120 Z"
    >
      <Strand d="M140,200 C132,240 140,280 132,316" color={shade.shadow} />
      <Strand d="M262,200 C270,240 262,280 270,316" color={shade.shadow} />
    </Shaded>
  ),
  'hair/coily-puff': ({ shade }) => (
    <Shaded shade={shade} depth={10} shine={[160, 46, 26, 14]} d={scallopCircle(200, 94, 72, 16, 6, 0.2)} />
  ),
  'hair/space-buns': ({ shade }) => (
    <g>
      <Shaded shade={shade} shine={[126, 42, 10, 7]} d={scallopCircle(136, 58, 32, 9, 3, 0.4)} />
      <Shaded shade={shade} shine={[252, 42, 10, 7]} d={scallopCircle(264, 58, 32, 9, 3, 0.1)} />
    </g>
  ),
};

export const HAIR_FRONT: Record<string, (p: HairProps) => React.ReactElement> = {
  'hair/wavy-long': ({ shade }) => (
    <g>
      <Shaded
        shade={shade}
        depth={6}
        shine={[176, 60, 26, 9]}
        d="M127,140 C120,80 156,40 200,40 C246,40 282,78 273,140 C268,118 258,102 246,94 C236,110 214,118 190,111 C168,104 156,94 150,90 C138,104 131,120 127,140 Z"
      />
      <Shaded shade={shade} depth={4} d="M128,128 C122,170 128,210 140,238 C150,214 148,170 146,128 Z" />
      <Shaded shade={shade} depth={4} d="M272,128 C278,170 272,210 260,238 C250,214 252,170 254,128 Z" />
      <path d="M244,58 C232,76 214,90 192,96" fill="none" stroke={shade.shadow} strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  'hair/coily-puff': ({ shade }) => (
    <Shaded
      shade={shade}
      depth={5}
      d={`M128,138 C122,90 156,58 200,58 C244,58 278,90 272,138 ${bumpyArc(200, 122, 72, 26, 0, -Math.PI, 9, -8).replace(/^ /, '')} Z`}
    />
  ),
  'hair/space-buns': ({ shade }) => (
    <g>
      <Shaded
        shade={shade}
        depth={5}
        shine={[168, 62, 20, 8]}
        d="M127,142 C120,82 156,42 200,42 C244,42 280,82 273,142 C266,112 250,88 222,76 C214,82 206,88 200,96 C194,88 186,82 178,76 C150,88 134,112 127,142 Z"
      />
      <circle cx={152} cy={82} r={7} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={2.5} />
      <circle cx={248} cy={82} r={7} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
};

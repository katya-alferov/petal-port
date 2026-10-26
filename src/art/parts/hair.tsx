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

/** Glossy "halo" band across the crown: the shine that makes hair look soft and pretty. */
function Shine({ shade, y = 64 }: { shade: Shade; y?: number }) {
  // A glossy halo of broken strand glints across the crown, like 2009 doll hair.
  return (
    <g opacity={0.9} strokeLinecap="round" fill="none">
      <path
        d={`M146,${y + 24} C162,${y} 196,${y - 8} 222,${y - 2} C236,${y + 2} 246,${y + 10} 254,${y + 22}`}
        stroke={shade.highlight}
        strokeWidth={9}
        strokeDasharray="44 6 26 6 60 0"
      />
      <path d={`M156,${y + 30} C170,${y + 12} 196,${y + 6} 214,${y + 8}`} stroke="#FFFFFF" strokeWidth={3} opacity={0.75} />
      <path d={`M232,${y + 6} l6,-8 M240,${y + 12} l7,-7`} stroke="#FFFFFF" strokeWidth={2.5} opacity={0.8} />
    </g>
  );
}

function Strand({ d, color }: { d: string; color: string }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.9} />;
}

export const HAIR_BACK: Record<string, (p: HairProps) => React.ReactElement> = {
  'hair/doll-curls': ({ shade }) => (
    <Shaded
      shade={shade}
      depth={10}
      d="M124,120 C112,60 158,30 200,30 C242,30 288,60 276,120 C290,170 280,200 296,236 C310,268 288,292 302,322 C312,346 294,368 272,356 C262,372 236,368 232,350 L168,350 C164,368 138,372 128,356 C106,368 88,346 98,322 C112,292 90,268 104,236 C120,200 110,170 124,120 Z"
    >
      {[1, -1].map((k) => (
        <g key={k} transform={k === -1 ? 'translate(400 0) scale(-1 1)' : undefined}>
          <path
            d="M282,160 C294,196 278,226 292,258 C304,286 286,306 296,330"
            fill="none"
            stroke={shade.highlight}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.85}
          />
          <path d="M266,200 C274,232 262,262 272,296" fill="none" stroke={shade.shadow} strokeWidth={3} strokeLinecap="round" />
          <path
            d="M286,348 C296,344 298,332 288,330 C282,330 282,338 288,338"
            fill="none"
            stroke={shade.shadow}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path d="M248,356 C258,354 258,342 250,342" fill="none" stroke={shade.shadow} strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}
    </Shaded>
  ),
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
  'hair/ponytail': ({ shade }) => (
    <g>
      <Shaded
        shade={shade}
        depth={8}
        d="M236,70 C282,52 306,92 300,140 C296,196 306,248 288,298 C278,322 258,314 264,284 C272,232 262,180 250,128 Z"
      >
        <Strand d="M272,120 C282,170 276,230 278,280" color={shade.shadow} />
      </Shaded>
      <Shaded
        shade={shade}
        depth={9}
        d="M126,132 C118,72 156,38 200,38 C244,38 282,72 274,132 C276,150 272,160 266,164 L134,164 C128,160 124,150 126,132 Z"
      />
      <circle cx={244} cy={74} r={11} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
  'hair/bob': ({ shade }) => (
    <Shaded
      shade={shade}
      depth={9}
      d="M124,130 C116,70 156,38 200,38 C244,38 284,70 276,130 C282,170 282,200 270,216 C256,226 238,222 232,212 L168,212 C162,222 144,226 130,216 C118,200 118,170 124,130 Z"
    />
  ),
  'hair/braids': ({ shade }) => (
    <Shaded
      shade={shade}
      depth={9}
      d="M126,132 C118,72 156,38 200,38 C244,38 282,72 274,132 C278,160 276,184 268,196 L132,196 C124,184 122,160 126,132 Z"
    />
  ),
};

export const HAIR_FRONT: Record<string, (p: HairProps) => React.ReactElement> = {
  'hair/doll-curls': ({ shade }) => (
    <g>
      {[1, -1].map((k) => (
        <g key={k} transform={k === -1 ? 'translate(400 0) scale(-1 1)' : undefined}>
          <Shaded
            shade={shade}
            depth={4}
            d="M130,100 C116,150 132,180 120,214 C110,240 122,266 142,262 C158,258 156,238 144,236 C150,226 146,210 148,196 C150,170 144,130 154,100 Z"
          />
          <path d="M126,150 C122,174 130,190 122,212" fill="none" stroke={shade.highlight} strokeWidth={3.5} strokeLinecap="round" />
          <path d="M138,254 C132,248 138,240 145,244" fill="none" stroke={shade.shadow} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      ))}
      {/* Side-swept bangs with a soft curl at the left temple */}
      <Shaded
        shade={shade}
        depth={6}
        d="M126,142 C116,78 156,36 200,36 C248,36 286,76 274,140 C268,120 262,108 254,100 C230,116 196,118 172,108 C160,104 150,108 144,120 C142,128 136,136 126,142 Z"
      />
      <Shine shade={shade} y={58} />
      <path d="M252,62 C236,84 206,100 176,104" fill="none" stroke={shade.shadow} strokeWidth={3} strokeLinecap="round" />
      <path d="M214,48 C200,64 180,76 158,84" fill="none" stroke={shade.shadow} strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
      {/* Flower clip */}
      <g>
        {[0, 72, 144, 216, 288].map((a) => (
          <circle
            key={a}
            cx={256 + Math.cos((a * Math.PI) / 180) * 8}
            cy={80 + Math.sin((a * Math.PI) / 180) * 8}
            r={7}
            fill="#FF9BBE"
            stroke={OUTLINE}
            strokeWidth={2}
          />
        ))}
        <circle cx={256} cy={80} r={5} fill="#FFC94A" stroke={OUTLINE} strokeWidth={1.8} />
      </g>
    </g>
  ),
  'hair/wavy-long': ({ shade }) => (
    <g>
      <Shaded
        shade={shade}
        depth={4}
        d="M128,96 C116,168 122,210 132,236 C140,250 152,250 150,236 C144,222 150,214 146,196 C142,172 150,130 156,96 Z"
      />
      <Shaded
        shade={shade}
        depth={4}
        d="M272,96 C284,168 278,210 268,236 C260,250 248,250 250,236 C256,222 250,214 254,196 C258,172 250,130 244,96 Z"
      />
      <Shaded
        shade={shade}
        depth={6}
        d="M126,142 C118,80 156,38 200,38 C246,38 284,78 274,142 C268,118 258,100 244,90 C234,108 212,118 186,112 C166,106 156,96 150,90 C138,104 130,122 126,142 Z"
      />
      <Shine shade={shade} />
      <path d="M244,58 C232,78 212,92 188,98" fill="none" stroke={shade.shadow} strokeWidth={3} strokeLinecap="round" />
      <path d="M150,92 C156,102 164,108 172,110" fill="none" stroke={shade.shadow} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  ),
  'hair/coily-puff': ({ shade }) => (
    <g>
      <Shaded
        shade={shade}
        depth={5}
        d={`M128,138 C122,90 156,58 200,58 C244,58 278,90 272,138 ${bumpyArc(200, 122, 72, 26, 0, -Math.PI, 9, -8).replace(/^ /, '')} Z`}
      />
      <Shine shade={shade} y={72} />
    </g>
  ),
  'hair/space-buns': ({ shade }) => (
    <g>
      <Shaded
        shade={shade}
        depth={5}
        shine={[168, 62, 20, 8]}
        d="M127,142 C120,82 156,42 200,42 C244,42 280,82 273,142 C266,112 250,88 222,76 C214,82 206,88 200,96 C194,88 186,82 178,76 C150,88 134,112 127,142 Z"
      />
      <Shine shade={shade} y={66} />
      <circle cx={152} cy={82} r={7} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={2.5} />
      <circle cx={248} cy={82} r={7} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
  'hair/ponytail': ({ shade }) => (
    <g>
      <Shaded
        shade={shade}
        depth={6}
        d="M126,142 C120,80 156,40 200,40 C246,40 282,80 274,142 C268,110 248,88 218,82 C190,92 162,106 140,112 C134,120 129,130 126,142 Z"
      />
      <Shine shade={shade} />
      <path d="M218,82 C196,96 170,106 146,110" fill="none" stroke={shade.shadow} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  ),
  'hair/bob': ({ shade }) => (
    <g>
      <Shaded shade={shade} depth={4} d="M128,110 C120,160 124,196 138,214 C150,206 150,170 148,110 Z" />
      <Shaded shade={shade} depth={4} d="M272,110 C280,160 276,196 262,214 C250,206 250,170 252,110 Z" />
      <Shaded
        shade={shade}
        depth={6}
        d="M126,138 C120,80 156,40 200,40 C244,40 280,80 274,138 C268,124 264,114 260,106 L140,106 C136,114 132,124 126,138 Z"
      />
      <Shine shade={shade} y={62} />
      {[166, 186, 214, 234].map((x) => (
        <path key={x} d={`M${x},92 L${x + 1},106`} stroke={shade.shadow} strokeWidth={2.5} strokeLinecap="round" />
      ))}
    </g>
  ),
  'hair/braids': ({ shade }) => (
    <g>
      {([-1, 1] as const).map((side) => (
        <g key={side}>
          {Array.from({ length: 7 }, (_, i) => (
            <ellipse
              key={i}
              cx={200 + side * (64 - i * 1.5)}
              cy={200 + i * 19}
              rx={13 - i * 0.6}
              ry={12}
              fill={i % 2 ? shade.shadow : shade.base}
              stroke={OUTLINE}
              strokeWidth={2.5}
            />
          ))}
          <circle cx={200 + side * 54} cy={336} r={7} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={2.5} />
          <path
            d={`M${200 + side * 54},342 l${side * -5},14 M${200 + side * 54},342 l${side * 2},15 M${200 + side * 54},342 l${side * 8},12`}
            stroke={shade.shadow}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      ))}
      <Shaded
        shade={shade}
        depth={6}
        d="M126,142 C120,80 156,40 200,40 C244,40 280,80 274,142 C268,110 240,88 200,84 C160,88 132,110 126,142 Z"
      />
      <path d="M200,44 L200,84" stroke={shade.shadow} strokeWidth={3} strokeLinecap="round" />
      <Shine shade={shade} y={60} />
    </g>
  ),
};

// Furniture art. Every piece is drawn in a 300×300 slot box and sits on its bottom edge (y = 300),
// so any item fits any home slot of its type.
import type { ReactElement } from 'react';
import type { Shade } from '../../content/palette';
import { Limb, OUTLINE, Shaded, scallopCircle } from '../kit';

export interface FurnArtProps {
  main: Shade;
  accent: Shade;
}

const WOOD: Shade = { base: '#C98F5E', shadow: '#9E6A42', highlight: '#E3B183' };
const BRASS: Shade = { base: '#E8B04C', shadow: '#B98431', highlight: '#F8D88E' };
const LEAF: Shade = { base: '#5FA67A', shadow: '#3F7F5A', highlight: '#8CCB9E' };

export const FURN_ART: Record<string, (p: FurnArtProps) => ReactElement> = {
  'furn/seat/modern-sofa': ({ main, accent }) => (
    <g>
      <Limb
        pts={[
          [46, 262],
          [46, 296],
        ]}
        width={10}
        shade={WOOD}
      />
      <Limb
        pts={[
          [254, 262],
          [254, 296],
        ]}
        width={10}
        shade={WOOD}
      />
      <Shaded
        d="M30,140 C30,118 46,106 70,106 L230,106 C254,106 270,118 270,140 L270,200 L30,200 Z"
        shade={main}
        shine={[90, 126, 40, 10]}
      />
      <Shaded
        d="M20,190 C20,176 30,168 44,168 L256,168 C270,168 280,176 280,190 L280,262 C280,272 272,278 262,278 L38,278 C28,278 20,272 20,262 Z"
        shade={main}
      />
      <Shaded
        d="M42,176 L146,176 C152,176 156,180 156,186 L156,214 L42,214 C36,214 32,210 32,204 L32,186 C32,180 36,176 42,176 Z"
        shade={main}
        depth={4}
        shine={[70, 184, 26, 5]}
      />
      <Shaded
        d="M154,176 L258,176 C264,176 268,180 268,186 L268,204 C268,210 264,214 258,214 L154,214 L154,186 C154,180 150,176 154,176 Z"
        shade={main}
        depth={4}
        shine={[180, 184, 26, 5]}
      />
      <Shaded d="M64,118 C80,108 108,110 116,126 C124,142 106,160 84,160 C62,160 50,132 64,118 Z" shade={accent} depth={5} />
      <Shaded d="M232,122 C246,132 246,156 228,162 C210,168 194,150 198,134 C202,118 220,114 232,122 Z" shade={accent} depth={5} />
    </g>
  ),
  'furn/rug/round': ({ main, accent }) => (
    <g>
      <Shaded
        d="M10,240 C10,206 72,186 150,186 C228,186 290,206 290,240 C290,274 228,294 150,294 C72,294 10,274 10,240 Z"
        shade={main}
        depth={5}
      />
      <path
        d="M44,240 C44,218 92,206 150,206 C208,206 256,218 256,240 C256,262 208,274 150,274 C92,274 44,262 44,240 Z"
        fill="none"
        stroke={accent.base}
        strokeWidth={8}
      />
      <path
        d="M90,240 C90,228 116,222 150,222 C184,222 210,228 210,240 C210,252 184,258 150,258 C116,258 90,252 90,240 Z"
        fill={accent.highlight}
        stroke={accent.base}
        strokeWidth={4}
      />
    </g>
  ),
  'furn/wall/harbour-print': ({ main, accent }) => (
    <g>
      <Shaded d="M40,40 L260,40 L260,240 L40,240 Z" shade={main} depth={6} />
      <rect x={62} y={62} width={176} height={156} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={3} />
      <rect x={62} y={62} width={176} height={86} fill="#BDE8EC" />
      <circle cx={196} cy={96} r={16} fill="#FFC94A" />
      <path d="M62,148 C100,138 140,156 238,144 L238,218 L62,218 Z" fill={accent.base} />
      <path d="M62,170 C100,162 150,178 238,166" fill="none" stroke="#FFF7EC" strokeWidth={4} opacity={0.7} />
      <path d="M120,142 L120,96 L150,138 Z" fill="#FFF7EC" stroke={OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M100,144 L156,144 L148,156 L108,156 Z" fill="#FF8A65" stroke={OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />
      <rect x={62} y={62} width={176} height={156} fill="none" stroke={OUTLINE} strokeWidth={3} />
    </g>
  ),
  'furn/lamp/arc': ({ main }) => (
    <g>
      <path d="M232,284 C240,160 190,60 96,56" fill="none" stroke={OUTLINE} strokeWidth={14} strokeLinecap="round" />
      <path d="M232,284 C240,160 190,60 96,56" fill="none" stroke={BRASS.base} strokeWidth={7} strokeLinecap="round" />
      <Shaded
        d="M196,282 C196,270 212,264 232,264 C252,264 268,270 268,282 C268,292 252,296 232,296 C212,296 196,292 196,282 Z"
        shade={BRASS}
        depth={3}
      />
      <Shaded d="M56,96 C56,62 74,44 98,44 C122,44 140,62 140,96 Z" shade={main} shine={[78, 66, 10, 12]} />
      <ellipse cx={98} cy={100} rx={22} ry={6} fill="#FFE08A" stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
  'furn/plant/fiddle-leaf': ({ main }) => (
    <g>
      <path d="M150,230 C148,180 156,120 150,40" fill="none" stroke="#7A5A3A" strokeWidth={8} strokeLinecap="round" />
      {[
        [118, 64, -30],
        [184, 52, 28],
        [110, 120, -40],
        [192, 112, 34],
        [124, 176, -30],
        [180, 168, 30],
        [150, 30, 0],
      ].map(([x, y, rot], i) => (
        <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
          <Shaded
            d={`M${x},${y - 34} C${x + 26},${y - 26} ${x + 26},${y + 22} ${x},${y + 34} C${x - 26},${y + 22} ${x - 26},${y - 26} ${x},${y - 34} Z`}
            shade={LEAF}
            depth={5}
          />
          <path d={`M${x},${y - 26} L${x},${y + 28}`} stroke={LEAF.shadow} strokeWidth={2.5} />
        </g>
      ))}
      <Shaded d="M100,220 L200,220 L188,296 L112,296 Z" shade={main} shine={[122, 236, 8, 14]} />
      <rect x={94} y={212} width={112} height={20} rx={8} fill={main.highlight} stroke={OUTLINE} strokeWidth={3} />
    </g>
  ),
  'furn/table/bistro': ({ main }) => (
    <g>
      <Limb
        pts={[
          [150, 150],
          [150, 280],
        ]}
        width={12}
        shade={BRASS}
      />
      <Shaded
        d="M96,286 C96,276 120,270 150,270 C180,270 204,276 204,286 C204,294 180,298 150,298 C120,298 96,294 96,286 Z"
        shade={BRASS}
        depth={3}
      />
      <Shaded
        d="M40,140 C40,124 90,114 150,114 C210,114 260,124 260,140 C260,156 210,164 150,164 C90,164 40,156 40,140 Z"
        shade={main}
        depth={5}
        shine={[100, 128, 36, 6]}
      />
      <path d="M128,114 C126,96 134,84 150,84 C166,84 174,96 172,114" fill="#BDE8EC" stroke={OUTLINE} strokeWidth={3} />
      <circle cx={142} cy={74} r={10} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={2.5} />
      <circle cx={160} cy={68} r={9} fill="#FFC94A" stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
  'furn/shelf/floating': ({ main }) => (
    <g>
      <Shaded d="M10,236 L290,236 L290,262 L10,262 Z" shade={main} depth={4} />
      <rect x={34} y={170} width={18} height={66} rx={3} fill="#3BB7C4" stroke={OUTLINE} strokeWidth={3} />
      <rect x={54} y={180} width={16} height={56} rx={3} fill="#FF8A65" stroke={OUTLINE} strokeWidth={3} />
      <rect x={72} y={176} width={20} height={60} rx={3} fill="#B39DFF" stroke={OUTLINE} strokeWidth={3} transform="rotate(8 82 236)" />
      <Shaded d={scallopCircle(250, 206, 18, 8, 3)} shade={LEAF} depth={3} />
      <path d="M232,214 L268,214 L262,236 L238,236 Z" fill="#FFF7EC" stroke={OUTLINE} strokeWidth={3} />
    </g>
  ),
  'furn/window/blinds': ({ main, accent }) => (
    <g>
      <Shaded d="M8,16 L292,16 L292,36 L8,36 Z" shade={accent} depth={3} />
      <Shaded d="M20,36 L280,36 L280,128 L20,128 Z" shade={main} depth={4}>
        {[56, 76, 96, 116].map((y) => (
          <path key={y} d={`M20,${y} L280,${y}`} stroke={main.shadow} strokeWidth={3} />
        ))}
      </Shaded>
      <path d="M262,128 L262,186" stroke={OUTLINE} strokeWidth={2.5} />
      <circle cx={262} cy={192} r={7} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
  'furn/rug/heart': ({ main, accent }) => (
    <g>
      <Shaded
        d="M150,294 C70,280 6,262 12,232 C18,204 70,196 100,206 C120,212 140,218 150,222 C160,218 180,212 200,206 C230,196 282,204 288,232 C294,262 230,280 150,294 Z"
        shade={main}
        depth={5}
      />
      <path
        d="M150,276 C92,266 46,254 50,234 C54,218 88,214 108,220 C126,226 140,232 150,236 C160,232 174,226 192,220 C212,214 246,218 250,234 C254,254 208,266 150,276 Z"
        fill="none"
        stroke={accent.base}
        strokeWidth={6}
        strokeDasharray="10 8"
      />
    </g>
  ),
  'furn/wall/rainbow-print': ({ main }) => (
    <g>
      <Shaded d="M40,40 L260,40 L260,240 L40,240 Z" shade={main} depth={6} />
      <rect x={62} y={62} width={176} height={156} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={3} />
      {['#FF7BA9', '#FFC94A', '#7ED6A7', '#3BB7C4', '#B39DFF'].map((c, i) => (
        <path
          key={c}
          d={`M${86 + i * 12},190 A${64 - i * 12},${64 - i * 12} 0 0 1 ${214 - i * 12},190`}
          fill="none"
          stroke={c}
          strokeWidth={11}
        />
      ))}
      <ellipse cx={90} cy={194} rx={22} ry={12} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={2.5} />
      <ellipse cx={210} cy={194} rx={22} ry={12} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
  'furn/plant/cactus': ({ main }) => (
    <g>
      <Shaded d="M130,250 C126,180 128,120 150,110 C172,120 174,180 170,250 Z" shade={LEAF} shine={[142, 140, 5, 18]} />
      <Shaded d="M132,200 C112,200 104,186 106,160 C106,150 118,150 118,160 C118,176 122,184 134,184 Z" shade={LEAF} depth={3} />
      <Shaded d="M168,180 C188,180 196,166 194,140 C194,130 182,130 182,140 C182,156 178,164 166,164 Z" shade={LEAF} depth={3} />
      <circle cx={150} cy={106} r={9} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={2.5} />
      <Shaded d="M106,236 L194,236 L184,296 L116,296 Z" shade={main} depth={4} shine={[124, 250, 6, 10]} />
      <rect x={100} y={228} width={100} height={16} rx={6} fill={main.base} stroke={OUTLINE} strokeWidth={3} />
    </g>
  ),
  'furn/lamp/mushroom': ({ main, accent }) => (
    <g>
      <path d="M150,290 L150,130" stroke={OUTLINE} strokeWidth={16} strokeLinecap="round" />
      <path d="M150,290 L150,130" stroke="#FFF7EC" strokeWidth={9} strokeLinecap="round" />
      <Shaded d="M110,290 C110,280 128,276 150,276 C172,276 190,280 190,290 Z" shade={main} depth={3} />
      <Shaded d="M60,134 C60,80 100,52 150,52 C200,52 240,80 240,134 C210,144 90,144 60,134 Z" shade={main} shine={[110, 80, 20, 10]}>
        {[
          [100, 100, 12],
          [160, 80, 10],
          [204, 112, 11],
          [140, 120, 7],
        ].map(([x, y, r]) => (
          <circle key={`${x}`} cx={x} cy={y} r={r} fill={accent.highlight} />
        ))}
      </Shaded>
    </g>
  ),
  'furn/seat/loveseat': ({ main, accent }) => (
    <g>
      <Limb
        pts={[
          [60, 262],
          [56, 296],
        ]}
        width={10}
        shade={WOOD}
      />
      <Limb
        pts={[
          [240, 262],
          [244, 296],
        ]}
        width={10}
        shade={WOOD}
      />
      <Shaded d={`M40,180 C34,130 70,96 150,96 C230,96 266,130 260,180 Z`} shade={main} shine={[100, 120, 30, 10]} />
      <Shaded d="M44,186 L256,186 L256,266 L44,266 Z" shade={main} depth={5} />
      <Shaded d="M60,172 C60,160 70,156 150,156 C230,156 240,160 240,172 L240,200 L60,200 Z" shade={accent} depth={4} />
      <Shaded d="M20,170 C20,154 50,154 50,170 L50,266 L20,266 Z" shade={main} depth={4} />
      <Shaded d="M250,170 C250,154 280,154 280,170 L280,266 L250,266 Z" shade={main} depth={4} />
      {[110, 150, 190].map((x) => (
        <circle key={x} cx={x} cy={128} r={4} fill={main.shadow} />
      ))}
    </g>
  ),
  'furn/window/curtains': ({ main, accent }) => (
    <g>
      <path d="M8,22 L292,22" stroke={OUTLINE} strokeWidth={10} strokeLinecap="round" />
      <path d="M8,22 L292,22" stroke={BRASS.base} strokeWidth={5} strokeLinecap="round" />
      <Shaded d="M14,26 L84,26 C80,90 66,150 58,200 C64,240 50,280 30,290 L14,290 Z" shade={main} depth={4}>
        {[30, 50, 70].map((x) => (
          <path key={x} d={`M${x},30 C${x - 4},120 ${x - 10},200 ${x - 14},290`} stroke={main.shadow} strokeWidth={3} fill="none" />
        ))}
      </Shaded>
      <Shaded d="M286,26 L216,26 C220,90 234,150 242,200 C236,240 250,280 270,290 L286,290 Z" shade={main} depth={-4}>
        {[230, 250, 270].map((x) => (
          <path key={x} d={`M${x},30 C${x + 4},120 ${x + 10},200 ${x + 14},290`} stroke={main.shadow} strokeWidth={3} fill="none" />
        ))}
      </Shaded>
      <rect x={34} y={192} width={36} height={12} rx={6} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} />
      <rect x={230} y={192} width={36} height={12} rx={6} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
};

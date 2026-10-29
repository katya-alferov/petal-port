// Furniture art. Every piece is drawn in a 300×300 slot box and sits on its bottom edge (y = 300),
// so any item fits any home slot of its type.
import type { ReactElement } from 'react';
import type { Shade } from '../../content/palette';
import { Limb, OUTLINE, Shaded, scallopCircle } from '../kit';

const STAR = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    return `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
  }).join(' ') + ' Z';

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
  'furn/seat/beanbag': ({ main, accent }) => (
    <g>
      <Shaded d="M40,296 C24,250 50,170 150,160 C250,170 276,250 260,296 Z" shade={main} shine={[84, 196, 12, 22]} />
      <path d="M64,220 C110,206 190,206 236,220" fill="none" stroke={accent.base} strokeWidth={6} strokeLinecap="round" />
      <path d="M150,162 C148,190 148,206 150,214" fill="none" stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  'furn/lamp/cloud': ({ main, accent }) => (
    <g>
      <path d="M150,290 L150,170" stroke={OUTLINE} strokeWidth={14} strokeLinecap="round" />
      <path d="M150,290 L150,170" stroke={BRASS.base} strokeWidth={7} strokeLinecap="round" />
      <Shaded d="M110,290 C110,278 128,272 150,272 C172,272 190,278 190,290 Z" shade={BRASS} depth={3} />
      <Shaded
        d="M82,160 C60,160 54,130 80,122 C78,92 118,78 140,96 C156,70 206,80 208,114 C240,112 250,152 222,160 Z"
        shade={main}
        shine={[110, 100, 12, 10]}
      />
      <circle cx={132} cy={132} r={5} fill={OUTLINE} />
      <circle cx={168} cy={132} r={5} fill={OUTLINE} />
      <path d="M140,144 Q150,152 160,144" fill="none" stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
      <circle cx={118} cy={142} r={7} fill={accent.base} opacity={0.7} />
      <circle cx={182} cy={142} r={7} fill={accent.base} opacity={0.7} />
    </g>
  ),
  'furn/plant/tulips': ({ main }) => (
    <g>
      {[
        [120, 120],
        [150, 96],
        [180, 124],
      ].map(([x, y]) => (
        <g key={`t${x}`}>
          <path d={`M${x},232 C${x},190 ${x},150 ${x},${y + 30}`} stroke={OUTLINE} strokeWidth={12} strokeLinecap="round" fill="none" />
          <path d={`M${x},232 C${x},190 ${x},150 ${x},${y + 30}`} stroke={LEAF.base} strokeWidth={6} strokeLinecap="round" fill="none" />
          <Shaded
            d={`M${x - 20},${y} C${x - 20},${y + 34} ${x + 20},${y + 34} ${x + 20},${y} L${x + 10},${y - 18} L${x},${y - 4} L${x - 10},${y - 18} Z`}
            shade={{ base: '#FF7BA9', shadow: '#D65A87', highlight: '#FFB3CD' }}
            depth={3}
          />
        </g>
      ))}
      <Shaded d="M106,236 L194,236 L184,296 L116,296 Z" shade={main} depth={4} shine={[124, 250, 6, 10]} />
      <rect x={100} y={228} width={100} height={16} rx={6} fill={main.base} stroke={OUTLINE} strokeWidth={3} />
    </g>
  ),
  'furn/table/tea': ({ main, accent }) => (
    <g>
      <path d="M96,296 L108,200 M204,296 L192,200" stroke={OUTLINE} strokeWidth={14} strokeLinecap="round" />
      <path d="M96,296 L108,200 M204,296 L192,200" stroke={WOOD.base} strokeWidth={7} strokeLinecap="round" />
      <Shaded
        d="M70,196 C70,186 100,182 150,182 C200,182 230,186 230,196 C230,206 200,210 150,210 C100,210 70,206 70,196 Z"
        shade={main}
        depth={4}
      />
      <Shaded d="M116,182 C112,150 128,140 150,140 C172,140 188,150 184,182 Z" shade={accent} depth={3} shine={[128, 154, 8, 10]} />
      <path d="M184,160 C204,158 206,178 188,178" fill="none" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
      <circle cx={150} cy={134} r={7} fill={accent.base} stroke={OUTLINE} strokeWidth={3} />
    </g>
  ),
  'furn/seat/armchair': ({ main, accent }) => (
    <g>
      <Limb
        pts={[
          [70, 270],
          [70, 296],
        ]}
        width={10}
        shade={WOOD}
      />
      <Limb
        pts={[
          [230, 270],
          [230, 296],
        ]}
        width={10}
        shade={WOOD}
      />
      <Shaded
        d="M70,170 C70,100 100,60 150,60 C200,60 230,100 230,170 L230,230 L70,230 Z"
        shade={main}
        depth={5}
        shine={[110, 110, 14, 26]}
      />
      <Shaded d="M40,170 C40,150 70,150 70,170 L70,270 L40,270 Z" shade={main} depth={4} />
      <Shaded d="M230,170 C230,150 260,150 260,170 L260,270 L230,270 Z" shade={main} depth={4} />
      <Shaded d="M70,226 L230,226 L236,270 L64,270 Z" shade={accent} depth={4} />
      <circle cx={150} cy={104} r={8} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
  'furn/seat/bench': ({ main, accent }) => (
    <g>
      <Limb
        pts={[
          [56, 230],
          [56, 296],
        ]}
        width={10}
        shade={WOOD}
      />
      <Limb
        pts={[
          [244, 230],
          [244, 296],
        ]}
        width={10}
        shade={WOOD}
      />
      <Shaded d="M30,200 L270,200 L270,232 L30,232 Z" shade={main} depth={4} shine={[70, 212, 20, 5]} />
      <Shaded d="M44,130 L256,130 L256,176 L44,176 Z" shade={main} depth={4} />
      <path d="M70,176 L70,200 M230,176 L230,200" stroke={OUTLINE} strokeWidth={8} />
      <path d="M70,176 L70,200 M230,176 L230,200" stroke={accent.base} strokeWidth={3.5} />
      <circle cx={150} cy={153} r={9} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
  'furn/table/flower': ({ main, accent }) => (
    <g>
      <path d="M150,296 L150,200" stroke={OUTLINE} strokeWidth={16} strokeLinecap="round" />
      <path d="M150,296 L150,200" stroke={WOOD.base} strokeWidth={8} strokeLinecap="round" />
      <Shaded d="M96,296 C96,286 120,282 150,282 C180,282 204,286 204,296 Z" shade={WOOD} depth={3} />
      <Shaded
        d="M60,200 C60,188 100,182 150,182 C200,182 240,188 240,200 C240,212 200,218 150,218 C100,218 60,212 60,200 Z"
        shade={main}
        depth={5}
      />
      <Shaded d="M126,182 L174,182 L168,138 L132,138 Z" shade={accent} depth={3} shine={[140, 154, 5, 10]} />
      <path d="M150,138 C150,118 150,104 150,92" stroke={LEAF.base} strokeWidth={5} strokeLinecap="round" fill="none" />
      <circle cx={150} cy={86} r={11} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={2.5} />
      <circle cx={150} cy={86} r={4} fill="#FFC94A" />
    </g>
  ),
  'furn/shelf/bookcase': ({ main, accent }) => (
    <g>
      <Shaded d="M30,40 L270,40 L270,290 L30,290 Z" shade={main} depth={5} />
      <rect x={44} y={54} width={212} height={102} fill={main.shadow} stroke={OUTLINE} strokeWidth={3} />
      <rect x={44} y={170} width={212} height={104} fill={main.shadow} stroke={OUTLINE} strokeWidth={3} />
      {[
        [54, 22, '#FF7BA9'],
        [78, 18, '#FFC94A'],
        [98, 24, '#3BB7C4'],
        [124, 20, '#B39DFF'],
        [146, 22, '#7ED6A7'],
      ].map(([x, w, c]) => (
        <rect key={`bk${x}`} x={x as number} y={92} width={w as number} height={64} fill={c as string} stroke={OUTLINE} strokeWidth={2.5} />
      ))}
      <circle cx={214} cy={134} r={18} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} />
      <circle cx={202} cy={120} r={7} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} />
      <circle cx={226} cy={120} r={7} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} />
      <rect x={60} y={232} width={60} height={42} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={2.5} />
      <path d="M72,262 L84,246 L94,256 L104,242 L110,262 Z" fill="#7ED6A7" />
      <ellipse cx={200} cy={258} rx={34} ry={16} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
  'furn/wall/clock': ({ main, accent }) => (
    <g>
      <Shaded d="M60,100 L150,30 L240,100 L240,250 L60,250 Z" shade={main} depth={6} />
      <circle cx={150} cy={170} r={56} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={4} />
      {[0, 90, 180, 270].map((a) => (
        <circle
          key={`ck${a}`}
          cx={150 + Math.cos((a * Math.PI) / 180) * 44}
          cy={170 + Math.sin((a * Math.PI) / 180) * 44}
          r={4}
          fill={OUTLINE}
        />
      ))}
      <path d="M150,170 L150,132 M150,170 L180,184" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
      <circle cx={150} cy={170} r={6} fill={accent.base} stroke={OUTLINE} strokeWidth={2} />
      <path d="M130,262 L130,290 M170,262 L170,290" stroke={OUTLINE} strokeWidth={3} />
      <ellipse cx={130} cy={296} rx={9} ry={10} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} />
      <ellipse cx={170} cy={296} rx={9} ry={10} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
  'furn/wall/heart-mirror': ({ main, accent }) => (
    <g>
      <Shaded
        d="M150,262 C20,170 40,40 110,48 C132,50 144,64 150,80 C156,64 168,50 190,48 C260,40 280,170 150,262 Z"
        shade={main}
        depth={6}
      />
      <path
        d="M150,236 C52,164 64,70 112,76 C130,78 142,92 150,110 C158,92 170,78 188,76 C236,70 248,164 150,236 Z"
        fill="#DDF3F6"
        stroke={OUTLINE}
        strokeWidth={3}
      />
      <path d="M96,100 C92,118 98,132 106,142" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
      <circle cx={150} cy={262} r={0} fill={accent.base} />
    </g>
  ),
  'furn/wall/bunting': ({ main, accent }) => (
    <g>
      <path d="M10,60 C80,110 220,110 290,60" fill="none" stroke={OUTLINE} strokeWidth={4} />
      {[
        [48, 'main'],
        [92, 'accent'],
        [136, 'main'],
        [180, 'accent'],
        [224, 'main'],
      ].map(([x, t], i) => (
        <path
          key={`bu${x}`}
          d={`M${x as number},${i === 0 || i === 4 ? 82 : 96} L${(x as number) + 38},${i === 0 || i === 4 ? 86 : 100} L${(x as number) + 18},${i === 0 || i === 4 ? 140 : 156} Z`}
          fill={t === 'main' ? main.base : accent.base}
          stroke={OUTLINE}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      ))}
    </g>
  ),
  'furn/window/round': ({ main, accent }) => (
    <g>
      <Shaded
        d="M150,20 C220,20 276,70 276,140 C276,210 220,260 150,260 C80,260 24,210 24,140 C24,70 80,20 150,20 Z"
        shade={main}
        depth={6}
      />
      <circle cx={150} cy={140} r={92} fill="#CDEEF4" stroke={OUTLINE} strokeWidth={4} />
      <path d="M150,48 L150,232 M58,140 L242,140" stroke={OUTLINE} strokeWidth={6} />
      <path d="M150,48 L150,232 M58,140 L242,140" stroke={main.base} strokeWidth={3} />
      <path d="M92,92 C86,106 86,116 90,126" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
      <Shaded d="M60,266 L240,266 L234,290 L66,290 Z" shade={accent} depth={3} />
    </g>
  ),
  'furn/plant/palm': ({ main }) => (
    <g>
      <path d="M150,236 C146,190 152,150 150,120" stroke={OUTLINE} strokeWidth={14} strokeLinecap="round" fill="none" />
      <path d="M150,236 C146,190 152,150 150,120" stroke="#9E6A42" strokeWidth={8} strokeLinecap="round" fill="none" />
      {[
        'M150,120 C110,90 70,100 56,128 C90,116 120,120 150,120 Z',
        'M150,120 C190,90 230,100 244,128 C210,116 180,120 150,120 Z',
        'M150,120 C120,70 90,50 62,56 C86,76 120,100 150,120 Z',
        'M150,120 C180,70 210,50 238,56 C214,76 180,100 150,120 Z',
        'M150,120 C140,80 146,50 150,34 C158,56 162,86 150,120 Z',
      ].map((d) => (
        <Shaded key={d} d={d} shade={LEAF} depth={3} />
      ))}
      <Shaded d="M106,236 L194,236 L184,296 L116,296 Z" shade={main} depth={4} shine={[124, 250, 6, 10]} />
      <rect x={100} y={228} width={100} height={16} rx={6} fill={main.base} stroke={OUTLINE} strokeWidth={3} />
    </g>
  ),
  'furn/plant/blossom-tree': ({ main }) => (
    <g>
      <path
        d="M150,236 C150,200 146,170 150,130 M150,190 C130,176 118,166 110,150 M150,170 C170,158 182,148 192,134"
        stroke={OUTLINE}
        strokeWidth={13}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M150,236 C150,200 146,170 150,130 M150,190 C130,176 118,166 110,150 M150,170 C170,158 182,148 192,134"
        stroke="#9E6A42"
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
      {[
        [150, 100, 40],
        [104, 134, 28],
        [196, 120, 30],
        [126, 80, 24],
        [176, 76, 24],
      ].map(([x, y, r]) => (
        <circle key={`bl${x}-${y}`} cx={x} cy={y} r={r} fill="#FFB3CD" stroke={OUTLINE} strokeWidth={3} />
      ))}
      {[
        [140, 96],
        [170, 110],
        [100, 130],
        [196, 116],
      ].map(([x, y]) => (
        <circle key={`bd${x}-${y}`} cx={x} cy={y} r={4} fill="#FFF7EC" />
      ))}
      <Shaded d="M106,236 L194,236 L184,296 L116,296 Z" shade={main} depth={4} shine={[124, 250, 6, 10]} />
      <rect x={100} y={228} width={100} height={16} rx={6} fill={main.base} stroke={OUTLINE} strokeWidth={3} />
    </g>
  ),
  'furn/lamp/lantern': ({ main, accent }) => (
    <g>
      <path d="M150,290 L150,196" stroke={OUTLINE} strokeWidth={14} strokeLinecap="round" />
      <path d="M150,290 L150,196" stroke={BRASS.base} strokeWidth={7} strokeLinecap="round" />
      <Shaded d="M110,290 C110,278 128,272 150,272 C172,272 190,278 190,290 Z" shade={BRASS} depth={3} />
      <Shaded
        d="M150,60 C206,60 232,110 232,150 C232,190 206,226 150,226 C94,226 68,190 68,150 C68,110 94,60 150,60 Z"
        shade={main}
        depth={6}
        shine={[110, 110, 12, 18]}
      >
        {[104, 150, 196].map((x) => (
          <path key={`ln${x}`} d={`M${x},60 C${x - 20},110 ${x - 20},180 ${x},226`} fill="none" stroke={accent.base} strokeWidth={3} />
        ))}
      </Shaded>
      <rect x={128} y={48} width={44} height={14} rx={5} fill={BRASS.base} stroke={OUTLINE} strokeWidth={3} />
      <rect x={128} y={222} width={44} height={14} rx={5} fill={BRASS.base} stroke={OUTLINE} strokeWidth={3} />
    </g>
  ),
  'furn/lamp/moon': ({ main, accent }) => (
    <g>
      <path d="M150,290 L150,210" stroke={OUTLINE} strokeWidth={14} strokeLinecap="round" />
      <path d="M150,290 L150,210" stroke={BRASS.base} strokeWidth={7} strokeLinecap="round" />
      <Shaded d="M110,290 C110,278 128,272 150,272 C172,272 190,278 190,290 Z" shade={BRASS} depth={3} />
      <Shaded
        d="M190,70 C130,66 90,110 96,160 C102,210 150,236 196,222 C150,210 130,170 142,130 C150,104 170,84 190,70 Z"
        shade={main}
        depth={6}
        shine={[116, 150, 8, 18]}
      />
      <path d={STAR(216, 94, 12)} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={STAR(226, 150, 8)} fill={accent.base} stroke={OUTLINE} strokeWidth={2} strokeLinejoin="round" />
    </g>
  ),
  'furn/rug/rainbow': ({ main, accent }) => (
    <g>
      <Shaded
        d="M150,296 C60,296 10,270 10,240 C10,210 60,196 150,196 C240,196 290,210 290,240 C290,270 240,296 150,296 Z"
        shade={main}
        depth={5}
      />
      {['#FF7BA9', '#FFC94A', '#7ED6A7', '#3BB7C4'].map((c, i) => (
        <path
          key={c}
          d={`M${48 + i * 18},250 A${102 - i * 18},${46 - i * 8} 0 0 1 ${252 - i * 18},250`}
          fill="none"
          stroke={c}
          strokeWidth={9}
        />
      ))}
      <ellipse cx={60} cy={252} rx={16} ry={8} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} />
      <ellipse cx={240} cy={252} rx={16} ry={8} fill={accent.base} stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
  'furn/rug/daisy': ({ main, accent }) => (
    <g>
      <g transform="translate(0,122) scale(1,0.5)">
        <Shaded d={scallopCircle(150, 244, 130, 12, 14)} shade={main} depth={5} />
        <circle cx={150} cy={244} r={50} fill={accent.base} stroke={OUTLINE} strokeWidth={3.5} />
        <circle cx={150} cy={244} r={34} fill="#FFC94A" stroke={OUTLINE} strokeWidth={3} />
      </g>
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
  'furn/plant/sunflower': ({ main }) => (
    <g>
      <path d="M150,236 C148,190 152,150 150,110" stroke={OUTLINE} strokeWidth={14} strokeLinecap="round" fill="none" />
      <path d="M150,236 C148,190 152,150 150,110" stroke={LEAF.base} strokeWidth={8} strokeLinecap="round" fill="none" />
      <Shaded d="M150,190 C126,170 104,176 96,190 C112,204 134,204 150,190 Z" shade={LEAF} depth={3} />
      <Shaded d="M152,160 C176,140 198,146 206,160 C190,174 168,174 152,160 Z" shade={LEAF} depth={3} />
      <path d={scallopCircle(150, 92, 56, 14, 12)} fill="#FFC94A" stroke={OUTLINE} strokeWidth={3.5} />
      <path d={scallopCircle(150, 92, 44, 14, 7, 0.2)} fill="#FFDE8D" />
      <circle cx={150} cy={92} r={26} fill="#8B5E3C" stroke={OUTLINE} strokeWidth={3} />
      {[
        [142, 84],
        [156, 88],
        [146, 100],
        [160, 100],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={3} fill="#5B3B26" />
      ))}
      <Shaded d="M106,236 L194,236 L184,296 L116,296 Z" shade={main} depth={4} shine={[124, 250, 6, 10]} />
      <rect x={100} y={228} width={100} height={16} rx={6} fill={main.base} stroke={OUTLINE} strokeWidth={3} />
    </g>
  ),
  'furn/rug/patchwork': ({ main, accent }) => (
    <g>
      <Shaded
        d="M26,212 C26,200 40,192 60,192 L240,192 C260,192 274,200 274,212 L284,276 C284,288 270,296 250,296 L50,296 C30,296 16,288 16,276 Z"
        shade={main}
        depth={5}
      />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${48 + i * 52},${206} L${96 + i * 52},${206} L${100 + i * 54},${244} L${46 + i * 54},${244} Z`}
          fill={i % 2 ? accent.base : main.highlight}
          stroke={OUTLINE}
          strokeWidth={2}
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={`b${i}`}
          d={`M${44 + i * 56},${248} L${98 + i * 56},${248} L${102 + i * 58},${284} L${40 + i * 58},${284} Z`}
          fill={i % 2 ? main.highlight : accent.base}
          stroke={OUTLINE}
          strokeWidth={2}
        />
      ))}
      <path d="M30,214 L270,214 M24,280 L278,280" stroke="#FFF7EC" strokeWidth={3} strokeDasharray="6 6" />
    </g>
  ),
  'furn/wall/blossom-print': ({ main }) => (
    <g>
      <Shaded d="M40,40 L260,40 L260,240 L40,240 Z" shade={main} depth={6} />
      <rect x={62} y={62} width={176} height={156} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={3} />
      <path
        d="M80,206 C110,180 130,150 150,140 C170,130 196,120 222,96"
        fill="none"
        stroke="#8B5E3C"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <path
        d="M130,160 C126,136 116,120 104,110 M176,128 C184,108 196,96 206,88"
        fill="none"
        stroke="#8B5E3C"
        strokeWidth={4}
        strokeLinecap="round"
      />
      {[
        [104, 106],
        [140, 146],
        [206, 86],
        [176, 120],
        [96, 190],
        [222, 104],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle
              key={a}
              cx={x + Math.cos((a * Math.PI) / 180) * 8}
              cy={y + Math.sin((a * Math.PI) / 180) * 8}
              r={7}
              fill="#FFADCA"
              stroke={OUTLINE}
              strokeWidth={1.5}
            />
          ))}
          <circle cx={x} cy={y} r={4} fill="#FF7BA9" />
        </g>
      ))}
    </g>
  ),
  'furn/lamp/star': ({ main }) => (
    <g>
      <path d="M150,290 L150,150" stroke={OUTLINE} strokeWidth={14} strokeLinecap="round" />
      <path d="M150,290 L150,150" stroke={BRASS.base} strokeWidth={7} strokeLinecap="round" />
      <Shaded d="M106,290 C106,278 126,272 150,272 C174,272 194,278 194,290 Z" shade={BRASS} depth={3} />
      <Shaded
        d={
          Array.from({ length: 10 }, (_, i) => {
            const a = -Math.PI / 2 + (i * Math.PI) / 5;
            const r = i % 2 ? 40 : 88;
            return `${i ? 'L' : 'M'}${(150 + Math.cos(a) * r).toFixed(1)},${(112 + Math.sin(a) * r).toFixed(1)}`;
          }).join(' ') + ' Z'
        }
        shade={main}
        shine={[124, 84, 10, 8]}
      />
      <circle cx={136} cy={110} r={5} fill={OUTLINE} />
      <circle cx={164} cy={110} r={5} fill={OUTLINE} />
      <path d="M140,126 Q150,134 160,126" fill="none" stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
};

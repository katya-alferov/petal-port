// Paw Parlour pets: kitten, puppy and bunny sitting front-on in a 300×300 box, feet on y≈292.
// Original chibi drawings built from the kit: plum outline, three-tone fur, light from the top left.
import type { ReactElement } from 'react';
import type { Shade } from '../../content/palette';
import { OUTLINE, Shaded, scallopCircle } from '../kit';

export type PetArtKind = 'kitten' | 'puppy' | 'bunny';
export type PetMood = 'idle' | 'happy' | 'eat' | 'paw';

export interface PetArtProps {
  kind: PetArtKind;
  fur: Shade;
  light: string;
  mood?: PetMood;
  accessory?: { art: 'bow' | 'bandana' | 'crown' | 'bell'; color: string };
  /** Bath: which of PET_SPOTS are muddy (true) or already foamy (false). Omit outside the bath. */
  mud?: boolean[];
}

/** Spots used by the bath, in box coordinates. Scenes put their tap targets here. */
export const PET_SPOTS: [number, number][] = [
  [112, 92],
  [196, 104],
  [120, 222],
  [184, 244],
  [150, 270],
];

const PINK = '#FF9BBE';
const BODY = 'M150,168 C200,168 224,214 222,252 C220,284 192,294 150,294 C108,294 80,284 78,252 C76,214 100,168 150,168 Z';
const HEAD = 'M150,58 C200,58 232,88 232,128 C232,170 196,194 150,194 C104,194 68,170 68,128 C68,88 100,58 150,58 Z';

function Ears({ kind, fur, light }: { kind: PetArtKind; fur: Shade; light: string }) {
  if (kind === 'kitten')
    return (
      <g>
        <Shaded d="M84,98 L86,34 L134,70 Z" shade={fur} depth={4} />
        <Shaded d="M216,98 L214,34 L166,70 Z" shade={fur} depth={-4} />
        <path d="M94,84 L95,50 L120,70 Z" fill={light} />
        <path d="M206,84 L205,50 L180,70 Z" fill={light} />
      </g>
    );
  if (kind === 'bunny')
    return (
      <g>
        <Shaded d="M118,80 C96,40 100,6 118,4 C136,2 146,40 140,78 Z" shade={fur} depth={4} />
        <Shaded d="M182,80 C204,40 200,6 182,4 C164,2 154,40 160,78 Z" shade={fur} depth={-4} />
        <path d="M120,70 C108,44 110,20 119,18 C128,18 132,44 130,70 Z" fill={PINK} opacity={0.75} />
        <path d="M180,70 C192,44 190,20 181,18 C172,18 168,44 170,70 Z" fill={PINK} opacity={0.75} />
      </g>
    );
  return null; // puppy ears flop over the head, drawn in front
}

function Eyes({ mood }: { mood: PetMood }) {
  if (mood === 'happy' || mood === 'eat')
    return (
      <g fill="none" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round">
        {mood === 'happy' ? (
          <>
            <path d="M110,130 Q122,114 134,130" />
            <path d="M166,130 Q178,114 190,130" />
          </>
        ) : (
          <>
            <path d="M110,124 Q122,136 134,124" />
            <path d="M166,124 Q178,136 190,124" />
          </>
        )}
      </g>
    );
  return (
    <g>
      {[122, 178].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={126} rx={12} ry={15} fill="#3A2E4F" />
          <circle cx={x - 4} cy={120} r={5} fill="#FFFFFF" />
          <circle cx={x + 5} cy={132} r={2.5} fill="#FFFFFF" />
        </g>
      ))}
    </g>
  );
}

function Accessory({ art, color }: { art: 'bow' | 'bandana' | 'crown' | 'bell'; color: string }) {
  if (art === 'bow')
    return (
      <g>
        <path
          d="M200,72 C180,48 162,58 170,74 C162,92 182,96 200,72 Z"
          fill={color}
          stroke={OUTLINE}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
        <path
          d="M200,72 C220,48 238,58 230,74 C238,92 218,96 200,72 Z"
          fill={color}
          stroke={OUTLINE}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
        <circle cx={200} cy={73} r={8} fill={color} stroke={OUTLINE} strokeWidth={3} />
        <path d="M176,66 L184,72" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      </g>
    );
  if (art === 'bandana')
    return (
      <g>
        <path d="M100,180 C130,192 170,192 200,180 L150,236 Z" fill={color} stroke={OUTLINE} strokeWidth={3.5} strokeLinejoin="round" />
        {[
          [130, 194],
          [160, 198],
          [148, 214],
        ].map(([x, y]) => (
          <circle key={`${x}`} cx={x} cy={y} r={4} fill="#FFF7EC" />
        ))}
      </g>
    );
  if (art === 'bell')
    return (
      <g>
        <path d="M100,180 C130,194 170,194 200,180" fill="none" stroke={OUTLINE} strokeWidth={14} strokeLinecap="round" />
        <path d="M100,180 C130,194 170,194 200,180" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
        <circle cx={150} cy={204} r={13} fill="#FFC94A" stroke={OUTLINE} strokeWidth={3} />
        <path d="M142,206 L158,206" stroke={OUTLINE} strokeWidth={2.5} />
        <circle cx={146} cy={199} r={3} fill="#FFF7EC" />
      </g>
    );
  return (
    <g>
      <path
        d="M118,66 L122,34 L136,50 L150,26 L164,50 L178,34 L182,66 Z"
        fill={color}
        stroke={OUTLINE}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <circle cx={150} cy={52} r={5} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={2} />
    </g>
  );
}

export function PetArt({ kind, fur, light, mood = 'idle', accessory, mud }: PetArtProps) {
  const pawUp = mood === 'paw';
  return (
    <g>
      <ellipse cx={150} cy={292} rx={84} ry={10} fill="#3A2E4F" opacity={0.15} />
      {/* Tail, behind the body */}
      {kind === 'kitten' && (
        <g>
          <path d="M206,270 C252,262 262,214 236,186" fill="none" stroke={OUTLINE} strokeWidth={22} strokeLinecap="round" />
          <path d="M206,270 C252,262 262,214 236,186" fill="none" stroke={fur.base} strokeWidth={14} strokeLinecap="round" />
        </g>
      )}
      {kind === 'puppy' && (
        <g className="pet-wag" style={{ transformOrigin: '210px 250px' }}>
          <path d="M206,252 C232,246 248,226 250,206" fill="none" stroke={OUTLINE} strokeWidth={20} strokeLinecap="round" />
          <path d="M206,252 C232,246 248,226 250,206" fill="none" stroke={fur.base} strokeWidth={12} strokeLinecap="round" />
        </g>
      )}
      {kind === 'bunny' && <path d={scallopCircle(214, 268, 20, 7, 4)} fill={light} stroke={OUTLINE} strokeWidth={3.5} />}

      <Shaded d={BODY} shade={fur} shine={[110, 196, 10, 16]} />
      <ellipse cx={150} cy={248} rx={40} ry={38} fill={light} />
      {/* Front paws */}
      <ellipse cx={124} cy={284} rx={21} ry={13} fill={fur.highlight} stroke={OUTLINE} strokeWidth={3.5} />
      {pawUp ? (
        <g>
          <path d="M188,232 C206,216 214,196 216,176" fill="none" stroke={OUTLINE} strokeWidth={30} strokeLinecap="round" />
          <path d="M188,232 C206,216 214,196 216,176" fill="none" stroke={fur.base} strokeWidth={22} strokeLinecap="round" />
          <ellipse cx={217} cy={170} rx={16} ry={14} fill={fur.highlight} stroke={OUTLINE} strokeWidth={3.5} />
          <circle cx={217} cy={172} r={5} fill={PINK} />
        </g>
      ) : (
        <ellipse cx={176} cy={284} rx={21} ry={13} fill={fur.highlight} stroke={OUTLINE} strokeWidth={3.5} />
      )}
      <path d="M118,284 L118,292 M130,284 L130,292" stroke={OUTLINE} strokeWidth={2} opacity={0.5} />

      <Ears kind={kind} fur={fur} light={light} />
      <Shaded d={HEAD} shade={fur} shine={[100, 86, 16, 10]} />
      {kind === 'puppy' && (
        <g>
          <Shaded d="M86,78 C56,76 44,130 58,160 C70,176 92,150 98,108 Z" shade={fur} depth={-4}>
            <path d="M86,78 C56,76 44,130 58,160" fill="none" stroke={fur.shadow} strokeWidth={10} />
          </Shaded>
          <Shaded d="M214,78 C244,76 256,130 242,160 C230,176 208,150 202,108 Z" shade={fur} depth={4} />
          <ellipse cx={150} cy={156} rx={34} ry={24} fill={light} />
        </g>
      )}
      {kind !== 'puppy' && <ellipse cx={150} cy={156} rx={26} ry={18} fill={light} opacity={0.9} />}

      <Eyes mood={mood} />
      <ellipse cx={102} cy={152} rx={13} ry={8} fill={PINK} opacity={0.55} />
      <ellipse cx={198} cy={152} rx={13} ry={8} fill={PINK} opacity={0.55} />
      {/* Nose and mouth */}
      <path
        d="M141,144 C141,139 159,139 159,144 C159,150 153,153 150,153 C147,153 141,150 141,144 Z"
        fill={kind === 'puppy' ? '#3A2E4F' : PINK}
        stroke={OUTLINE}
        strokeWidth={2.5}
      />
      {mood === 'happy' || mood === 'eat' ? (
        <path d="M136,158 Q150,182 164,158 Z" fill="#E8607F" stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
      ) : (
        <path d="M136,158 Q143,166 150,158 Q157,166 164,158" fill="none" stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
      )}
      {kind === 'bunny' && mood !== 'happy' && mood !== 'eat' && (
        <rect x={144} y={159} width={12} height={10} rx={3} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={2} />
      )}
      {kind === 'kitten' && (
        <g stroke={OUTLINE} strokeWidth={2.5} strokeLinecap="round" opacity={0.7}>
          <path d="M112,150 L82,144 M112,158 L84,162" />
          <path d="M188,150 L218,144 M188,158 L216,162" />
        </g>
      )}
      {accessory && <Accessory {...accessory} />}

      {/* Bath: mud splats or foam */}
      {mud?.map((dirty, i) => {
        const [x, y] = PET_SPOTS[i];
        return dirty ? (
          <path key={i} d={scallopCircle(x, y, 15, 6, 4, i)} fill="#9E6A42" opacity={0.85} />
        ) : (
          <g key={i}>
            <circle cx={x - 8} cy={y} r={11} fill="#FFFFFF" stroke="#BDE8EC" strokeWidth={2} />
            <circle cx={x + 8} cy={y - 4} r={9} fill="#FFFFFF" stroke="#BDE8EC" strokeWidth={2} />
            <circle cx={x + 2} cy={y + 8} r={8} fill="#FFFFFF" stroke="#BDE8EC" strokeWidth={2} />
          </g>
        );
      })}
    </g>
  );
}

const FOOD: Record<string, (x: number, y: number) => ReactElement> = {
  'food.fish': (x, y) => (
    <g>
      <path
        d={`M${x - 30},${y} C${x - 14},${y - 20} ${x + 14},${y - 18} ${x + 22},${y} C${x + 14},${y + 18} ${x - 14},${y + 20} ${x - 30},${y} Z`}
        fill="#8AD3DA"
        stroke={OUTLINE}
        strokeWidth={3}
      />
      <path
        d={`M${x + 20},${y} L${x + 36},${y - 14} L${x + 36},${y + 14} Z`}
        fill="#8AD3DA"
        stroke={OUTLINE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <circle cx={x - 16} cy={y - 3} r={3.5} fill={OUTLINE} />
    </g>
  ),
  'food.milk': (x, y) => (
    <g>
      <path
        d={`M${x - 16},${y - 14} L${x + 16},${y - 14} L${x + 16},${y + 22} L${x - 16},${y + 22} Z`}
        fill="#FFFFFF"
        stroke={OUTLINE}
        strokeWidth={3}
      />
      <path
        d={`M${x - 16},${y - 14} L${x - 8},${y - 28} L${x + 8},${y - 28} L${x + 16},${y - 14} Z`}
        fill="#BDE8EC"
        stroke={OUTLINE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <rect x={x - 10} y={y} width={20} height={12} rx={3} fill="#3BB7C4" />
    </g>
  ),
  'food.cookie': (x, y) => (
    <g>
      <path
        d={`M${x - 26},${y - 6} a10,10 0 1 1 12,-10 h28 a10,10 0 1 1 12,10 v12 a10,10 0 1 1 -12,10 h-28 a10,10 0 1 1 -12,-10 Z`}
        fill="#E3B183"
        stroke={OUTLINE}
        strokeWidth={3}
      />
    </g>
  ),
  'food.bone': (x, y) => (
    <g>
      <path
        d={`M${x - 22},${y - 6} a9,9 0 1 1 6,-12 L${x + 16},${y - 18} a9,9 0 1 1 6,12 a9,9 0 1 1 -6,12 L${x - 16},${y + 6} a9,9 0 1 1 -6,-12 Z`}
        fill="#FFF7EC"
        stroke={OUTLINE}
        strokeWidth={3}
      />
    </g>
  ),
  'food.apple': (x, y) => (
    <g>
      <path
        d={`M${x},${y - 12} C${x - 30},${y - 26} ${x - 32},${y + 20} ${x},${y + 24} C${x + 32},${y + 20} ${x + 30},${y - 26} ${x},${y - 12} Z`}
        fill="#FF6B6B"
        stroke={OUTLINE}
        strokeWidth={3}
      />
      <path d={`M${x},${y - 12} L${x + 2},${y - 24}`} stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
      <path
        d={`M${x + 4},${y - 20} C${x + 14},${y - 30} ${x + 22},${y - 22} ${x + 14},${y - 16} Z`}
        fill="#7ED6A7"
        stroke={OUTLINE}
        strokeWidth={2}
      />
      <path d={`M${x - 14},${y - 6} L${x - 10},${y - 12}`} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  'food.carrot': (x, y) => (
    <g>
      <path
        d={`M${x - 8},${y - 18} L${x + 8},${y - 18} L${x},${y + 26} Z`}
        fill="#FF8A65"
        stroke={OUTLINE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path
        d={`M${x},${y - 18} L${x - 10},${y - 32} M${x},${y - 18} L${x},${y - 34} M${x},${y - 18} L${x + 10},${y - 32}`}
        stroke="#5FA67A"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </g>
  ),
  'food.berries': (x, y) => (
    <g>
      {[
        [-12, 4],
        [10, 6],
        [-1, -10],
      ].map(([dx, dy]) => (
        <circle key={`${dx}`} cx={x + dx} cy={y + dy} r={11} fill="#B39DFF" stroke={OUTLINE} strokeWidth={3} />
      ))}
      <path d={`M${x - 1},${y - 20} L${x + 6},${y - 28}`} stroke="#5FA67A" strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
};

/** A pet food drawn around (x, y), about 70×60. Unknown ids draw a cookie. */
export function FoodArt({ id, x = 50, y = 50 }: { id: string; x?: number; y?: number }) {
  return (FOOD[id] ?? FOOD['food.cookie'])(x, y);
}

/** A food bowl with the food on top, in a 100×100 box. */
export function PetBowlArt({ food, color = '#3BB7C4' }: { food: string; color?: string }) {
  return (
    <g>
      <FoodArt id={food} x={50} y={46} />
      <path
        d="M12,62 L88,62 C86,84 70,94 50,94 C30,94 14,84 12,62 Z"
        fill={color}
        stroke={OUTLINE}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <path d="M22,70 L40,70" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
    </g>
  );
}

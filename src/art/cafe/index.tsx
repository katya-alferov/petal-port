// Sunny Café art: ingredient icons, the drink being built, pastries and the café backdrop.
import type { ReactElement } from 'react';
import type { Shade } from '../../content/palette';
import { OUTLINE, Shaded, scallopCircle } from '../kit';

const sh = (base: string, shadow: string, highlight: string): Shade => ({ base, shadow, highlight });
const CUP = sh('#FFF7EC', '#E3D3CC', '#FFFFFF');
const MUG = sh('#3BB7C4', '#2F8E9F', '#8AD3DA');
const LIQUID: Record<string, string> = {
  'base.cocoa': '#8B5E3C',
  'base.lemonade': '#FFE08A',
  'base.berry-tea': '#E5739B',
  'base.petal-latte': '#E9C9A5',
};
const DOUGH = sh('#E8B06A', '#C98A4A', '#F6D398');
const CREAM = sh('#FFFFFF', '#EADFE6', '#FFFFFF');

function heart(cx: number, cy: number, r: number) {
  return `M${cx},${cy + r} C${cx - r * 1.6},${cy - r * 0.2} ${cx - r * 0.9},${cy - r * 1.5} ${cx},${cy - r * 0.55} C${cx + r * 0.9},${cy - r * 1.5} ${cx + r * 1.6},${cy - r * 0.2} ${cx},${cy + r} Z`;
}
function star(cx: number, cy: number, r: number) {
  return (
    Array.from({ length: 10 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.45 : r;
      return `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
    }).join(' ') + ' Z'
  );
}
function flower(cx: number, cy: number, r: number) {
  return scallopCircle(cx, cy, r, 5, r * 0.45);
}

const STENCIL_PATH: Record<string, (cx: number, cy: number, r: number) => string> = {
  'stencil.heart': heart,
  'stencil.star': star,
  'stencil.flower': flower,
};

function Sprinkles({ cx, cy, w }: { cx: number; cy: number; w: number }) {
  const colors = ['#FF7BA9', '#FFC94A', '#7ED6A7', '#B39DFF', '#3BB7C4'];
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={cx - w / 2 + ((i * 37) % w)}
          y={cy - 6 + ((i * 13) % 12)}
          width={9}
          height={3.5}
          rx={1.75}
          fill={colors[i % colors.length]}
          transform={`rotate(${(i * 47) % 180} ${cx - w / 2 + ((i * 37) % w)} ${cy + ((i * 13) % 12)})`}
        />
      ))}
    </g>
  );
}

/** A topping drawn on a drink whose surface is centred at (cx, cy) with half-width w. */
function Topping({ id, cx, cy, w }: { id: string; cx: number; cy: number; w: number }) {
  switch (id) {
    case 'top.cream':
      return (
        <g>
          <Shaded
            d={`M${cx - w * 0.8},${cy} C${cx - w * 0.8},${cy - 30} ${cx - 20},${cy - 34} ${cx - 6},${cy - 56} C${cx + 6},${cy - 40} ${cx + w * 0.8},${cy - 34} ${cx + w * 0.8},${cy} Z`}
            shade={CREAM}
            depth={4}
          />
          <path
            d={`M${cx - w * 0.5},${cy - 14} Q${cx},${cy - 4} ${cx + w * 0.5},${cy - 16}`}
            fill="none"
            stroke={CREAM.shadow}
            strokeWidth={3}
          />
        </g>
      );
    case 'top.marshmallow':
      return (
        <g>
          {[-0.4, 0.25].map((dx, i) => (
            <rect
              key={i}
              x={cx + dx * w - 14}
              y={cy - 22 - i * 8}
              width={28}
              height={22}
              rx={8}
              fill={i ? '#FFC8DD' : '#FFFFFF'}
              stroke={OUTLINE}
              strokeWidth={3}
            />
          ))}
        </g>
      );
    case 'top.lemon':
      return (
        <g transform={`translate(${cx + w * 0.7} ${cy - 10})`}>
          <circle r={24} fill="#FFE08A" stroke={OUTLINE} strokeWidth={3.5} />
          <circle r={17} fill="#FFF3B8" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path
              key={a}
              d={`M0,0 L${Math.cos((a * Math.PI) / 180) * 16},${Math.sin((a * Math.PI) / 180) * 16}`}
              stroke="#F2C94C"
              strokeWidth={2.5}
            />
          ))}
        </g>
      );
    case 'top.sprinkles':
      return <Sprinkles cx={cx} cy={cy - 8} w={w * 1.4} />;
    case 'top.caramel':
      return (
        <path
          d={`M${cx - w * 0.7},${cy - 6} Q${cx - w * 0.35},${cy + 12} ${cx},${cy - 6} T${cx + w * 0.7},${cy - 6}`}
          fill="none"
          stroke="#C9772E"
          strokeWidth={7}
          strokeLinecap="round"
        />
      );
    default:
      return null;
  }
}

export interface DrinkArtProps {
  cup?: string;
  base?: string;
  toppings?: string[];
  stencil?: string;
}

/** A drink in a 200×220 box, sitting on y = 210. Missing parts are simply not drawn. */
export function DrinkArt({ cup, base, toppings = [], stencil }: DrinkArtProps): ReactElement {
  const large = cup === 'cup.large';
  const top = large ? 70 : 100;
  const w = large ? 70 : 56;
  const cupShade = large ? MUG : CUP;
  const body = large
    ? `M${100 - w},${top} L${100 + w},${top} L${100 + w - 6},210 L${100 - w + 6},210 Z`
    : `M${100 - w},${top} L${100 + w},${top} L${100 + w - 16},210 L${100 - w + 16},210 Z`;
  const liquid = base ? (LIQUID[base] ?? '#8B5E3C') : undefined;
  // Cream and marshmallows stack: draw drizzle/sprinkles last so they sit on top.
  const order = ['top.lemon', 'top.marshmallow', 'top.cream', 'top.caramel', 'top.sprinkles'];
  const sorted = [...toppings].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return (
    <g>
      {cup ? (
        <g>
          {large && (
            <path
              d={`M${100 + w - 2},${top + 30} C${100 + w + 40},${top + 30} ${100 + w + 40},${top + 100} ${100 + w - 6},${top + 100}`}
              fill="none"
              stroke={OUTLINE}
              strokeWidth={16}
            />
          )}
          {large && (
            <path
              d={`M${100 + w - 2},${top + 30} C${100 + w + 40},${top + 30} ${100 + w + 40},${top + 100} ${100 + w - 6},${top + 100}`}
              fill="none"
              stroke={cupShade.base}
              strokeWidth={8}
            />
          )}
          <Shaded d={body} shade={cupShade} depth={6} shine={[100 - w + 22, top + 40, 8, 26]} />
          {!large && <rect x={100 - w + 10} y={top + 40} width={(w - 10) * 2} height={30} fill="#FF7BA9" opacity={0.85} />}
          <ellipse cx={100} cy={top} rx={w} ry={14} fill={liquid ?? '#F1E7EF'} stroke={OUTLINE} strokeWidth={3.5} />
          {liquid && <ellipse cx={100 - w * 0.3} cy={top - 3} rx={w * 0.35} ry={4} fill="#FFFFFF" opacity={0.35} />}
          {stencil && STENCIL_PATH[stencil] && (
            <path
              d={STENCIL_PATH[stencil](100, top, 11)}
              fill="#8B5E3C"
              transform={`translate(0 ${top}) scale(1 0.6) translate(0 ${-top})`}
            />
          )}
          {sorted.map((t) => (
            <Topping key={t} id={t} cx={100} cy={top} w={w} />
          ))}
        </g>
      ) : (
        <path d="M44,100 L156,100 L140,210 L60,210 Z" fill="none" stroke={OUTLINE} strokeWidth={4} strokeDasharray="10 8" opacity={0.5} />
      )}
    </g>
  );
}

export function PastryArt({ id }: { id?: string }): ReactElement {
  return (
    <g>
      <ellipse cx={100} cy={196} rx={88} ry={20} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={4} />
      <ellipse cx={100} cy={192} rx={60} ry={10} fill="#F1E7EF" />
      {id === 'pastry.croissant' && (
        <g>
          <Shaded
            d="M30,180 C30,130 70,110 100,110 C130,110 170,130 170,180 C150,170 130,166 100,166 C70,166 50,170 30,180 Z"
            shade={DOUGH}
            shine={[78, 126, 16, 8]}
          />
          {[70, 100, 130].map((x) => (
            <path key={x} d={`M${x},116 C${x - 8},140 ${x - 6},156 ${x},166`} fill="none" stroke={DOUGH.shadow} strokeWidth={3} />
          ))}
        </g>
      )}
      {id === 'pastry.cupcake' && (
        <g>
          <Shaded d="M62,130 L138,130 L126,186 L74,186 Z" shade={sh('#FF8A65', '#D86A58', '#FFB89E')} depth={4}>
            {[80, 100, 120].map((x) => (
              <path key={x} d={`M${x},130 L${x - 3},186`} stroke="#D86A58" strokeWidth={3} />
            ))}
          </Shaded>
          <Shaded d={scallopCircle(100, 118, 40, 8, 6)} shade={sh('#FFC8DD', '#F59BBE', '#FFFFFF')} depth={5} />
          <circle cx={100} cy={78} r={10} fill="#E5484D" stroke={OUTLINE} strokeWidth={3} />
        </g>
      )}
      {id === 'pastry.cookie' && (
        <g>
          <Shaded d={scallopCircle(100, 160, 48, 12, 3)} shade={DOUGH} depth={5} shine={[84, 140, 12, 6]} />
          {[
            [84, 150],
            [112, 146],
            [100, 172],
            [124, 168],
            [78, 174],
          ].map(([x, y]) => (
            <circle key={`${x}`} cx={x} cy={y} r={5.5} fill="#5A3A28" />
          ))}
        </g>
      )}
      {!id && <path d="M60,170 L140,170" stroke={OUTLINE} strokeWidth={4} strokeDasharray="10 8" opacity={0.4} />}
    </g>
  );
}

/** Small square icon for an ingredient jar button (viewBox 0 0 100 100). */
export function CafeIcon({ id }: { id: string }): ReactElement {
  if (id.startsWith('cup.'))
    return (
      <svg viewBox="0 0 200 220" aria-hidden="true">
        <DrinkArt cup={id} />
      </svg>
    );
  if (id.startsWith('pastry.'))
    return (
      <svg viewBox="20 60 160 160" aria-hidden="true">
        <PastryArt id={id} />
      </svg>
    );
  if (id.startsWith('base.'))
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path
          d="M30,22 L70,22 L74,34 C84,40 86,52 86,62 L86,84 C86,90 82,94 76,94 L24,94 C18,94 14,90 14,84 L14,62 C14,52 16,40 26,34 Z"
          fill="#FFFFFF"
          stroke={OUTLINE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path d="M16,56 L84,56 L84,84 C84,89 80,92 76,92 L24,92 C20,92 16,89 16,84 Z" fill={LIQUID[id]} />
        <path
          d="M30,22 L70,22 L74,34 C84,40 86,52 86,62 L86,84 C86,90 82,94 76,94 L24,94 C18,94 14,90 14,84 L14,62 C14,52 16,40 26,34 Z"
          fill="none"
          stroke={OUTLINE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <rect x={26} y={10} width={48} height={14} rx={5} fill="#FF7BA9" stroke={OUTLINE} strokeWidth={4} />
        <path d="M26,46 L26,82" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
      </svg>
    );
  if (id.startsWith('stencil.'))
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx={50} cy={50} r={40} fill="#E3D3CC" stroke={OUTLINE} strokeWidth={4} />
        <path d={STENCIL_PATH[id]?.(50, 52, 22) ?? ''} fill="#8B5E3C" stroke={OUTLINE} strokeWidth={2} />
      </svg>
    );
  return (
    <svg viewBox="0 0 200 160" aria-hidden="true">
      <ellipse cx={100} cy={120} rx={70} ry={18} fill="#E9C9A5" stroke={OUTLINE} strokeWidth={4} />
      <Topping id={id} cx={id === 'top.lemon' ? 70 : 100} cy={118} w={60} />
    </svg>
  );
}

/** The café interior behind the counter. */
export function CafeBackdrop({ decor = [] }: { decor?: string[] }) {
  return (
    <svg
      viewBox="0 0 1170 1400"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <rect width={1170} height={1400} fill="#FFE7C2" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={i * 100} y={0} width={50} height={1400} fill="#FFDDB0" />
      ))}
      {/* Menu board */}
      <rect x={70} y={180} width={360} height={300} rx={20} fill="#3F3A48" stroke="#8B5E3C" strokeWidth={18} />
      <text x={250} y={250} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize={48} fill="#FFF7EC">
        Menu
      </text>
      {[300, 350, 400, 440].map((y, i) => (
        <path
          key={y}
          d={`M120,${y} L${330 - i * 30},${y}`}
          stroke={['#FF7BA9', '#FFC94A', '#7ED6A7', '#B39DFF'][i]}
          strokeWidth={10}
          strokeLinecap="round"
        />
      ))}
      {/* Window with the sea */}
      <rect x={760} y={160} width={340} height={360} rx={30} fill="#BDE8EC" stroke="#5B4A6E" strokeWidth={10} />
      <path d="M760,400 C860,380 980,410 1100,390 L1100,520 L760,520 Z" fill="#3BB7C4" />
      <circle cx={1010} cy={250} r={40} fill="#FFC94A" stroke="#5B4A6E" strokeWidth={5} />
      <path d="M930,160 L930,520 M760,340 L1100,340" stroke="#5B4A6E" strokeWidth={8} />
      {/* Shelf with cups */}
      <rect x={60} y={620} width={1050} height={22} rx={8} fill="#C98F5E" stroke="#5B4A6E" strokeWidth={5} />
      {[120, 240, 360, 800, 920, 1040].map((x, i) => (
        <g key={x}>
          <path
            d={`M${x - 34},${560} L${x + 34},${560} L${x + 26},${620} L${x - 26},${620} Z`}
            fill={['#FFF7EC', '#3BB7C4', '#FF7BA9'][i % 3]}
            stroke="#5B4A6E"
            strokeWidth={5}
            strokeLinejoin="round"
          />
        </g>
      ))}
      {/* Espresso machine */}
      <rect x={480} y={470} width={210} height={150} rx={20} fill="#D9D3E0" stroke="#5B4A6E" strokeWidth={6} />
      <rect x={510} y={500} width={150} height={40} rx={10} fill="#3F3A48" />
      <circle cx={585} cy={520} r={10} fill="#7ED6A7" />
      {decor.includes('decor.bunting') && (
        <g>
          <path d="M0,60 Q585,160 1170,60" fill="none" stroke="#5B4A6E" strokeWidth={4} />
          {Array.from({ length: 11 }, (_, i) => {
            const x = 50 + i * 106;
            const y = 60 + Math.sin((x / 1170) * Math.PI) * 50;
            return (
              <path
                key={i}
                d={`M${x - 30},${y} L${x + 30},${y} L${x},${y + 60} Z`}
                fill={['#FF7BA9', '#FFC94A', '#3BB7C4', '#B39DFF'][i % 4]}
                stroke="#5B4A6E"
                strokeWidth={4}
              />
            );
          })}
        </g>
      )}
      {/* Counter */}
      <rect x={0} y={1060} width={1170} height={340} fill="#C98F5E" />
      <rect x={0} y={1040} width={1170} height={50} rx={10} fill="#FFF7EC" stroke="#5B4A6E" strokeWidth={6} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={30 + i * 145} y={1120} width={110} height={240} rx={14} fill="#B57D4E" stroke="#5B4A6E" strokeWidth={4} />
      ))}
    </svg>
  );
}

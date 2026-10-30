// Art for the trips beyond Paris (game-systems §31): the New York street, the two attraction hubs and
// the pieces of each ride. All original, stylized drawings. Hubs use a 390×560 canvas anchored to the bottom.
import type { ReactNode } from 'react';
import { OUTLINE } from '../kit';

const sw = { stroke: OUTLINE, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Hot({ id, label, onTap, children }: { id: string; label: string; onTap?: () => void; children: ReactNode }) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      data-testid={id}
      style={{ cursor: 'pointer' }}
      onClick={onTap}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTap?.()}
    >
      {children}
    </g>
  );
}

function Pill({ x, y, text, w }: { x: number; y: number; text: string; w: number }) {
  return (
    <g aria-hidden="true">
      <rect x={x - w / 2} y={y - 15} width={w} height={26} rx={13} fill="#FFF7EC" {...sw} />
      <text x={x} y={y + 4} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={14} fill={OUTLINE}>
        {text}
      </text>
    </g>
  );
}

const SVG_STYLE = { width: '100%', height: '100%', display: 'block' } as const;

// ---------------------------------------------------------------------------------------------------
// New York

export type NySpot = 'statue' | 'cab' | 'cart' | 'musician' | 'ferry';

export function NewYorkArt({ onTap, torch, cabGo }: { onTap?: (id: NySpot) => void; torch: boolean; cabGo: boolean }) {
  const windows = (x: number, y: number, cols: number, rows: number) =>
    Array.from({ length: cols * rows }, (_, i) => (
      <rect
        key={i}
        x={x + (i % cols) * 14}
        y={y + Math.floor(i / cols) * 16}
        width={8}
        height={10}
        rx={2}
        fill={(i * 7) % 5 === 0 ? '#FFE08A' : '#8EC9FF'}
      />
    ));
  return (
    <svg
      viewBox="0 0 390 560"
      preserveAspectRatio="xMidYMax slice"
      role="group"
      aria-label="A New York street at sunset"
      data-testid="newyork-art"
      style={SVG_STYLE}
    >
      <defs>
        <linearGradient id="ny-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB38A" />
          <stop offset="0.55" stopColor="#FFD9A8" />
          <stop offset="1" stopColor="#FFEFC8" />
        </linearGradient>
      </defs>
      <rect width={390} height={560} fill="url(#ny-sky)" />
      <circle cx={300} cy={120} r={44} fill="#FFE9A8" opacity={0.9} />
      {/* skyline */}
      <g>
        <rect x={0} y={190} width={64} height={190} fill="#7C86C9" {...sw} />
        {windows(10, 206, 4, 6)}
        <rect x={64} y={130} width={56} height={250} fill="#6A74B8" {...sw} />
        {windows(72, 146, 3, 8)}
        <path d="M120,380 L120,170 L150,60 L180,170 L180,380 Z" fill="#8A93D6" {...sw} />
        <path d="M150,60 L150,30" stroke={OUTLINE} strokeWidth={4} />
        {windows(128, 190, 3, 8)}
        <rect x={180} y={210} width={70} height={170} fill="#7C86C9" {...sw} />
        {windows(190, 226, 4, 6)}
        <rect x={250} y={160} width={62} height={220} fill="#6A74B8" {...sw} />
        {windows(258, 176, 3, 7)}
        <rect x={312} y={230} width={78} height={150} fill="#8A93D6" {...sw} />
        {windows(322, 246, 4, 5)}
      </g>
      {/* harbour and the statue on its island, far away */}
      <rect x={0} y={380} width={390} height={26} fill="#5CC6D0" stroke={OUTLINE} strokeWidth={3} />
      <Hot id="ny-statue" label="Statue" onTap={() => onTap?.('statue')}>
        <rect x={286} y={296} width={90} height={110} fill="transparent" />
        <path d="M312,392 L360,392 L352,372 L320,372 Z" fill="#B7B0C4" {...sw} />
        <path d="M326,372 L326,330 C326,322 346,322 346,330 L346,372 Z" fill="#7ED6A7" {...sw} />
        <circle cx={336} cy={318} r={8} fill="#7ED6A7" {...sw} />
        <path d="M344,326 L354,300" stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
        <path d="M344,326 L354,300" stroke="#7ED6A7" strokeWidth={3} strokeLinecap="round" />
        <path
          d="M354,276 C360,286 362,292 354,298 C346,292 348,286 354,276 Z"
          fill={torch ? '#FFC94A' : '#E8D9B0'}
          {...sw}
          style={torch ? { filter: 'drop-shadow(0 0 6px #FFE08A)' } : undefined}
        />
        <Pill x={331} y={420} text="Statue" w={70} />
      </Hot>
      {/* street */}
      <rect x={0} y={406} width={390} height={154} fill="#B7B0C4" stroke={OUTLINE} strokeWidth={3} />
      <rect x={0} y={456} width={390} height={10} fill="#FFF7EC" opacity={0.0} />
      {[20, 100, 180, 260, 340].map((x) => (
        <rect key={x} x={x} y={500} width={46} height={8} rx={4} fill="#FFF7EC" />
      ))}
      <rect x={0} y={406} width={390} height={22} fill="#D9D3E0" stroke={OUTLINE} strokeWidth={3} />
      {/* cab */}
      <g className={cabGo ? 'ny-cab-go' : undefined}>
        <Hot id="ny-cab" label="Taxi" onTap={() => onTap?.('cab')}>
          <rect x={14} y={436} width={118} height={70} fill="transparent" />
          <path
            d="M20,490 C20,472 30,468 42,466 L52,450 C54,446 58,446 64,446 L92,446 C98,446 102,448 104,452 L112,466 C124,468 128,476 128,490 Z"
            fill="#FFC94A"
            {...sw}
          />
          <path
            d="M58,452 L64,452 L64,466 L48,466 Z M72,452 L92,452 L100,466 L72,466 Z"
            fill="#DFF3FF"
            stroke={OUTLINE}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <rect x={66} y={436} width={20} height={10} rx={3} fill="#FFF7EC" {...sw} />
          <circle cx={44} cy={494} r={11} fill="#5B4A6E" {...sw} />
          <circle cx={106} cy={494} r={11} fill="#5B4A6E" {...sw} />
          <Pill x={74} y={526} text="Taxi" w={56} />
        </Hot>
      </g>
      {/* cart */}
      <Hot id="ny-cart" label="Snack cart" onTap={() => onTap?.('cart')}>
        <rect x={150} y={420} width={110} height={110} fill="transparent" />
        <path d="M156,422 C156,402 254,402 254,422 Z" fill="#FF7BA9" {...sw} />
        <path d="M168,422 v-16 M190,422 v-18 M212,422 v-18 M234,422 v-16" stroke="#FFF7EC" strokeWidth={5} />
        <rect x={162} y={430} width={86} height={50} rx={8} fill="#FFF7EC" {...sw} />
        <circle cx={186} cy={452} r={9} fill="#D9964E" {...sw} />
        <circle cx={214} cy={452} r={9} fill="#FFC94A" {...sw} />
        <circle cx={176} cy={490} r={9} fill="#5B4A6E" {...sw} />
        <circle cx={236} cy={490} r={9} fill="#5B4A6E" {...sw} />
        <Pill x={205} y={526} text="Snack cart" w={92} />
      </Hot>
      {/* musician */}
      <Hot id="ny-musician" label="Musician" onTap={() => onTap?.('musician')}>
        <rect x={274} y={420} width={100} height={110} fill="transparent" />
        <circle cx={322} cy={450} r={12} fill="#F6D9AE" {...sw} />
        <path d="M310,446 C312,432 332,432 334,446 Z" fill="#B692F6" {...sw} />
        <path d="M306,462 L338,462 L342,500 L302,500 Z" fill="#8E78D8" {...sw} />
        <path d="M338,468 C356,466 362,476 360,490 C354,484 346,482 338,484" fill="#FFC94A" {...sw} />
        <Pill x={324} y={526} text="Musician" w={78} />
      </Hot>
    </svg>
  );
}

// ---------------------------------------------------------------------------------------------------
// Attraction hubs

export type StorySpot = 'carousel' | 'fireworks' | 'fountain';

export function StorybookHub({ onTap, stamps, lit }: { onTap?: (id: StorySpot) => void; stamps: string[]; lit: boolean }) {
  const has = (r: string) => stamps.includes(`storybook.${r}`);
  return (
    <svg
      viewBox="0 0 390 560"
      preserveAspectRatio="xMidYMax slice"
      role="group"
      aria-label="Storybook Kingdom"
      data-testid="storybook-art"
      style={SVG_STYLE}
    >
      <defs>
        <linearGradient id="sb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lit ? '#2F2A6B' : '#9ED8FF'} />
          <stop offset="1" stopColor={lit ? '#7A5FB8' : '#E8F6FF'} />
        </linearGradient>
      </defs>
      <rect width={390} height={560} fill="url(#sb-sky)" />
      {lit &&
        [
          [40, 40],
          [120, 90],
          [280, 50],
          [350, 110],
          [200, 30],
        ].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={2.5} fill="#FFF7EC" />)}
      {/* castle */}
      <g>
        <rect x={140} y={170} width={110} height={150} fill="#FFE2F0" {...sw} />
        <rect x={110} y={140} width={48} height={180} fill="#FFD0E6" {...sw} />
        <rect x={232} y={140} width={48} height={180} fill="#FFD0E6" {...sw} />
        {[134, 256].map((x) => (
          <g key={x}>
            <path d={`M${x - 32},140 L${x},84 L${x + 32},140 Z`} fill="#B692F6" {...sw} />
            <path d={`M${x},84 L${x},60 L${x + 22},68 L${x},76`} fill="#FFC94A" {...sw} />
          </g>
        ))}
        <path d="M156,170 L195,100 L234,170 Z" fill="#8E78D8" {...sw} />
        <path d="M195,100 L195,70 L219,78 L195,86" fill="#FF7BA9" {...sw} />
        <path d="M168,320 L168,262 C168,236 222,236 222,262 L222,320 Z" fill="#8E5B3C" {...sw} />
        {[134, 256, 195].map((x, i) => (
          <rect key={x} x={x - 8} y={i === 2 ? 190 : 196} width={16} height={26} rx={8} fill={lit ? '#FFE08A' : '#BDE8EC'} {...sw} />
        ))}
      </g>
      <rect x={0} y={320} width={390} height={240} fill="#8FD6A4" stroke={OUTLINE} strokeWidth={3} />
      <path d="M150,560 C170,480 210,430 195,320 L215,320 C240,430 270,480 290,560 Z" fill="#F3D9B1" {...sw} />
      {/* carousel */}
      <Hot id="ride-carousel" label="Carousel" onTap={() => onTap?.('carousel')}>
        <rect x={6} y={330} width={130} height={176} fill="transparent" />
        <path d="M14,400 L70,350 L126,400 Z" fill="#FF7BA9" {...sw} />
        <path d="M30,388 L70,356 L110,388" fill="none" stroke="#FFF7EC" strokeWidth={4} />
        <rect x={20} y={400} width={100} height={14} rx={4} fill="#FFC94A" {...sw} />
        {[34, 70, 106].map((x) => (
          <g key={x}>
            <path d={`M${x},414 L${x},452`} stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
            <path
              d={`M${x - 14},432 C${x - 14},420 ${x + 12},420 ${x + 14},430 L${x + 14},440 L${x - 14},440 Z`}
              fill={x === 70 ? '#FFFFFF' : '#FFE2F0'}
              {...sw}
            />
          </g>
        ))}
        <rect x={14} y={456} width={112} height={14} rx={6} fill="#B692F6" {...sw} />
        <Pill x={70} y={492} text="Carousel" w={84} />
        {has('carousel') && <circle cx={118} cy={346} r={10} fill="#7ED6A7" {...sw} />}
      </Hot>
      {/* fireworks stage */}
      <Hot id="ride-fireworks" label="Fireworks" onTap={() => onTap?.('fireworks')}>
        <rect x={254} y={330} width={130} height={176} fill="transparent" />
        <rect x={264} y={430} width={110} height={34} rx={6} fill="#B692F6" {...sw} />
        {[284, 314, 344].map((x, i) => (
          <g key={x}>
            <path d={`M${x - 8},430 L${x - 6},392 L${x + 6},392 L${x + 8},430 Z`} fill={['#FF7BA9', '#FFC94A', '#3BB7C4'][i]} {...sw} />
            <path d={`M${x},392 L${x},378`} stroke={OUTLINE} strokeWidth={3} />
            <path
              d={`M${x},366 L${x + 4},374 L${x + 12},376 L${x + 4},380 L${x},388 L${x - 4},380 L${x - 12},376 L${x - 4},374 Z`}
              fill="#FFC94A"
              {...sw}
              opacity={lit || has('fireworks') ? 1 : 0.7}
            />
          </g>
        ))}
        <Pill x={320} y={492} text="Fireworks" w={92} />
        {has('fireworks') && <circle cx={364} cy={346} r={10} fill="#7ED6A7" {...sw} />}
      </Hot>
      {/* wishing fountain */}
      <Hot id="ride-fountain" label="Fountain" onTap={() => onTap?.('fountain')}>
        <rect x={140} y={440} width={110} height={90} fill="transparent" />
        <ellipse cx={195} cy={492} rx={52} ry={16} fill="#B7B0C4" {...sw} />
        <ellipse cx={195} cy={488} rx={42} ry={11} fill="#8EDDE8" stroke={OUTLINE} strokeWidth={3} />
        <path d="M195,488 L195,452" stroke={OUTLINE} strokeWidth={9} strokeLinecap="round" />
        <path d="M195,488 L195,452" stroke="#B7B0C4" strokeWidth={4} strokeLinecap="round" />
        <path
          d="M195,452 C180,440 176,462 172,470 M195,452 C210,440 214,462 218,470"
          fill="none"
          stroke="#8EDDE8"
          strokeWidth={5}
          strokeLinecap="round"
        />
        <Pill x={195} y={522} text="Fountain" w={84} />
        {has('fountain') && <circle cx={238} cy={452} r={10} fill="#7ED6A7" {...sw} />}
      </Hot>
    </svg>
  );
}

export type FairSpot = 'wheel' | 'bell' | 'neon';

export function FunfairHub({ onTap, stamps }: { onTap?: (id: FairSpot) => void; stamps: string[] }) {
  const has = (r: string) => stamps.includes(`funfair.${r}`);
  return (
    <svg
      viewBox="0 0 390 560"
      preserveAspectRatio="xMidYMax slice"
      role="group"
      aria-label="Boardwalk Funfair"
      data-testid="funfair-art"
      style={SVG_STYLE}
    >
      <defs>
        <linearGradient id="ff-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8EC9FF" />
          <stop offset="1" stopColor="#FFE6C2" />
        </linearGradient>
      </defs>
      <rect width={390} height={560} fill="url(#ff-sky)" />
      <rect x={0} y={250} width={390} height={90} fill="#5CC6D0" stroke={OUTLINE} strokeWidth={3} />
      {[30, 130, 240, 330].map((x) => (
        <path key={x} d={`M${x},290 q12,-8 24,0 t24,0`} stroke="#BDEBF0" strokeWidth={4} fill="none" strokeLinecap="round" />
      ))}
      <rect x={0} y={340} width={390} height={220} fill="#E6C29A" stroke={OUTLINE} strokeWidth={3} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M0,${360 + i * 30} L390,${360 + i * 30}`} stroke="#C99C6E" strokeWidth={3} />
      ))}
      {/* ferris wheel */}
      <Hot id="ride-wheel" label="Big Wheel" onTap={() => onTap?.('wheel')}>
        <rect x={20} y={90} width={170} height={400} fill="transparent" />
        <path d="M105,330 L70,430 M105,330 L140,430" stroke={OUTLINE} strokeWidth={10} strokeLinecap="round" />
        <path d="M105,330 L70,430 M105,330 L140,430" stroke="#FF7BA9" strokeWidth={5} strokeLinecap="round" />
        <circle cx={105} cy={230} r={92} fill="none" stroke={OUTLINE} strokeWidth={9} />
        <circle cx={105} cy={230} r={92} fill="none" stroke="#FFC94A" strokeWidth={5} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const x = 105 + Math.cos(a) * 92;
          const y = 230 + Math.sin(a) * 92;
          return (
            <g key={i}>
              <path d={`M105,230 L${x},${y}`} stroke={OUTLINE} strokeWidth={3} />
              <rect
                x={x - 11}
                y={y - 4}
                width={22}
                height={18}
                rx={6}
                fill={['#FF7BA9', '#3BB7C4', '#B692F6', '#7ED6A7'][i % 4]}
                {...sw}
                strokeWidth={3}
              />
            </g>
          );
        })}
        <circle cx={105} cy={230} r={11} fill="#FFF7EC" {...sw} />
        <Pill x={105} y={480} text="Big Wheel" w={90} />
        {has('wheel') && <circle cx={190} cy={160} r={10} fill="#7ED6A7" {...sw} />}
      </Hot>
      {/* strongman bell */}
      <Hot id="ride-bell" label="Strong Bell" onTap={() => onTap?.('bell')}>
        <rect x={240} y={150} width={140} height={340} fill="transparent" />
        <rect x={296} y={190} width={28} height={230} rx={8} fill="#FFF7EC" {...sw} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={296}
            y={380 - i * 44}
            width={28}
            height={14}
            fill={['#7ED6A7', '#7ED6A7', '#FFC94A', '#FF8A65', '#FF7BA9'][i]}
            stroke={OUTLINE}
            strokeWidth={2.5}
          />
        ))}
        <path d="M296,180 C296,150 324,150 324,180 L330,196 L290,196 Z" fill="#FFC94A" {...sw} />
        <circle cx={310} cy={200} r={4} fill={OUTLINE} />
        <rect x={270} y={416} width={80} height={20} rx={8} fill="#B692F6" {...sw} />
        <path d="M344,440 L376,414 L384,424 L352,452 Z" fill="#8E5B3C" {...sw} />
        <Pill x={310} y={480} text="Strong Bell" w={100} />
        {has('bell') && <circle cx={364} cy={170} r={10} fill="#7ED6A7" {...sw} />}
      </Hot>
      {/* neon arcade */}
      <Hot id="ride-neon" label="Neon Lights" onTap={() => onTap?.('neon')}>
        <rect x={150} y={380} width={100} height={110} fill="transparent" />
        <rect x={156} y={404} width={88} height={56} rx={10} fill="#3A2E4F" {...sw} />
        {['#FF7BA9', '#FFC94A', '#3BB7C4', '#7ED6A7'].map((c, i) => (
          <circle key={c} cx={174 + i * 18} cy={432} r={7} fill={c} {...sw} strokeWidth={2.5} />
        ))}
        <path d="M156,404 L200,380 L244,404 Z" fill="#FF7BA9" {...sw} />
        <Pill x={200} y={480} text="Neon Lights" w={100} />
        {has('neon') && <circle cx={238} cy={384} r={10} fill="#7ED6A7" {...sw} />}
      </Hot>
    </svg>
  );
}

// ---------------------------------------------------------------------------------------------------
// Ride pieces. `m` is the marker 0..1, `zone` the start of the glowing zone, both from game/trips.

const ZONE_W = 0.3;

/** Carousel ring game: a brass ring swings along an arm; catch it in the glowing zone. 360×200. */
export function CarouselRide({ m, zone, ok }: { m: number; zone: number; ok: boolean | null }) {
  const x = 40 + m * 280;
  return (
    <svg viewBox="0 0 360 200" role="img" aria-label="The carousel ring arm" data-testid="ride-art" style={SVG_STYLE}>
      <rect width={360} height={200} rx={20} fill="#FFE2F0" stroke={OUTLINE} strokeWidth={4} />
      <rect
        x={40 + zone * 280}
        y={44}
        width={ZONE_W * 280}
        height={92}
        rx={14}
        fill="#FFE08A"
        opacity={0.75}
        stroke={OUTLINE}
        strokeWidth={3}
        strokeDasharray="8 6"
      />
      <path d="M30,50 L330,50" stroke={OUTLINE} strokeWidth={8} strokeLinecap="round" />
      <path d="M30,50 L330,50" stroke="#C98F5E" strokeWidth={4} strokeLinecap="round" />
      <g transform={`translate(${x} 90)`} className={ok === true ? 'ride-pop' : undefined}>
        <path d="M0,-40 L0,-14" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
        <circle r={20} fill="none" stroke={OUTLINE} strokeWidth={10} />
        <circle r={20} fill="none" stroke="#FFC94A" strokeWidth={5} />
      </g>
      {[60, 150, 240].map((px) => (
        <g key={px} transform={`translate(${px} 170)`}>
          <path d="M-22,0 C-22,-16 14,-16 22,-4 L22,10 L-22,10 Z" fill="#FFFFFF" {...sw} />
        </g>
      ))}
    </svg>
  );
}

/** Big wheel photo game: a gondola rides the top arc; snap when it is in the glowing window. 360×240. */
export function WheelRide({ m, zone, ok }: { m: number; zone: number; ok: boolean | null }) {
  const pt = (t: number) => {
    const a = Math.PI * (1 - t);
    return [180 + Math.cos(a) * 130, 200 - Math.sin(a) * 150] as const;
  };
  const [gx, gy] = pt(m);
  const [z0x, z0y] = pt(zone);
  const [z1x, z1y] = pt(zone + ZONE_W);
  return (
    <svg viewBox="0 0 360 240" role="img" aria-label="The big wheel's arc" data-testid="ride-art" style={SVG_STYLE}>
      <rect width={360} height={240} rx={20} fill="#BFE6FF" stroke={OUTLINE} strokeWidth={4} />
      <path d="M50,200 A130,150 0 0 1 310,200" fill="none" stroke={OUTLINE} strokeWidth={10} />
      <path d="M50,200 A130,150 0 0 1 310,200" fill="none" stroke="#FFF7EC" strokeWidth={5} />
      <path
        d={`M${z0x},${z0y} A130,150 0 0 1 ${z1x},${z1y}`}
        fill="none"
        stroke="#FFC94A"
        strokeWidth={22}
        strokeLinecap="round"
        opacity={0.85}
      />
      <g transform={`translate(${gx} ${gy})`} className={ok === true ? 'ride-pop' : undefined}>
        <path d="M0,-14 L0,0" stroke={OUTLINE} strokeWidth={4} />
        <rect x={-18} y={0} width={36} height={28} rx={8} fill="#FF7BA9" {...sw} />
        <circle cx={0} cy={12} r={6} fill="#FFF7EC" {...sw} strokeWidth={2.5} />
      </g>
      <path d="M170,210 L190,210 L200,236 L160,236 Z" fill="#B7B0C4" {...sw} />
      <g opacity={0.9}>
        <path d="M20,236 L20,190 L40,190 L40,236 Z M320,236 L320,176 L344,176 L344,236 Z" fill="#8A93D6" {...sw} />
      </g>
    </svg>
  );
}

/** Strong bell game: the puck slides up the tower; stop it in the glowing band to ring the bell. 220×330. */
export function BellRide({ m, zone, ok }: { m: number; zone: number; ok: boolean | null }) {
  const y = 290 - m * 230;
  return (
    <svg viewBox="0 0 220 330" role="img" aria-label="The strong bell tower" data-testid="ride-art" style={SVG_STYLE}>
      <rect width={220} height={330} rx={20} fill="#FFF0D0" stroke={OUTLINE} strokeWidth={4} />
      <rect x={90} y={50} width={40} height={250} rx={12} fill="#FFFFFF" {...sw} />
      <rect
        x={88}
        y={290 - (zone + ZONE_W) * 230 - 6}
        width={44}
        height={ZONE_W * 230}
        rx={8}
        fill="#FFC94A"
        opacity={0.85}
        stroke={OUTLINE}
        strokeWidth={3}
        strokeDasharray="8 6"
      />
      <g transform={`translate(110 ${y})`} className={ok === true ? 'ride-pop' : undefined}>
        <circle r={16} fill="#FF7BA9" {...sw} />
        <circle cx={-4} cy={-4} r={4} fill="#FFF7EC" />
      </g>
      <g transform={`translate(110 34)`} className={ok === true ? 'ride-ring' : undefined}>
        <path d="M-24,12 C-24,-16 24,-16 24,12 L30,22 L-30,22 Z" fill="#FFC94A" {...sw} />
        <circle cx={0} cy={26} r={5} fill={OUTLINE} />
      </g>
      <rect x={60} y={298} width={100} height={20} rx={8} fill="#B692F6" {...sw} />
    </svg>
  );
}

/** The wishing fountain: a coin arcs into the water and ripples spread. 360×240. */
export function FountainRide({ phase }: { phase: 'pick' | 'toss' | 'wish' }) {
  return (
    <svg viewBox="0 0 360 240" role="img" aria-label="The wishing fountain" data-testid="ride-art" style={SVG_STYLE}>
      <rect width={360} height={240} rx={20} fill="#DFF3FF" stroke={OUTLINE} strokeWidth={4} />
      <ellipse cx={180} cy={190} rx={120} ry={34} fill="#B7B0C4" {...sw} />
      <ellipse cx={180} cy={184} rx={100} ry={24} fill="#8EDDE8" stroke={OUTLINE} strokeWidth={3} />
      <path d="M180,184 L180,110" stroke={OUTLINE} strokeWidth={14} strokeLinecap="round" />
      <path d="M180,184 L180,110" stroke="#B7B0C4" strokeWidth={7} strokeLinecap="round" />
      <path
        d="M180,110 C150,84 142,130 132,150 M180,110 C210,84 218,130 228,150"
        fill="none"
        stroke="#8EDDE8"
        strokeWidth={8}
        strokeLinecap="round"
      />
      {phase !== 'pick' && (
        <g className="ripples">
          <ellipse cx={180} cy={190} rx={30} ry={8} fill="none" stroke="#FFFFFF" strokeWidth={3} />
          <ellipse cx={180} cy={190} rx={56} ry={14} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.7} />
        </g>
      )}
      {phase === 'toss' && (
        <g className="coin-arc">
          <circle cx={60} cy={150} r={11} fill="#FFC94A" {...sw} />
        </g>
      )}
      {phase === 'wish' &&
        [
          [90, 70],
          [270, 60],
          [150, 40],
          [220, 90],
        ].map(([x, y]) => (
          <path
            key={`${x}${y}`}
            d={`M${x},${y - 12} L${x + 4},${y - 3} L${x + 13},${y} L${x + 4},${y + 3} L${x},${y + 12} L${x - 4},${y + 3} L${x - 13},${y} L${x - 4},${y - 3} Z`}
            fill="#FFC94A"
            {...sw}
            strokeWidth={2.5}
            className="wish-star"
          />
        ))}
    </svg>
  );
}

/** A burst of colour for light games and finales. 360×200. */
export function BurstArt({ color, active }: { color: string | null; active: boolean }) {
  return (
    <svg viewBox="0 0 360 200" role="img" aria-label="The night show" data-testid="burst-art" style={SVG_STYLE}>
      <rect width={360} height={200} rx={20} fill="#2F2A6B" stroke={OUTLINE} strokeWidth={4} />
      {[
        [30, 30],
        [90, 60],
        [250, 30],
        [320, 70],
        [200, 20],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={2.2} fill="#FFF7EC" opacity={0.7} />
      ))}
      {active && color && (
        <g className="burst" style={{ transformOrigin: '180px 100px' }}>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <path
                key={i}
                d={`M${180 + Math.cos(a) * 26},${100 + Math.sin(a) * 26} L${180 + Math.cos(a) * 72},${100 + Math.sin(a) * 72}`}
                stroke={color}
                strokeWidth={7}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={180} cy={100} r={14} fill="#FFF7EC" />
        </g>
      )}
      <path d="M0,170 C80,150 160,168 240,156 C300,148 340,160 360,154 L360,200 L0,200 Z" fill="#3E7D6A" stroke={OUTLINE} strokeWidth={3} />
    </svg>
  );
}

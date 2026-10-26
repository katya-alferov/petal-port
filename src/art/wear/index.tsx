// Wearable art on the 400×800 rig. Each component draws its whole item (both shoes, both lenses).
// Sleeves are not drawn here: the rig draws them on the arms from the item's `sleeve` type.
import type { ReactElement } from 'react';
import type { Shade } from '../../content/palette';
import { Limb, Shaded, OUTLINE, mirrorX } from '../kit';

export interface WearArtProps {
  main: Shade;
  accent: Shade;
}

const TEE =
  'M146,258 C150,248 166,242 182,240 C188,257 212,257 218,240 C234,242 250,248 254,258 C258,290 248,330 244,372 C246,384 248,394 248,404 C216,412 184,412 152,404 C152,394 154,384 156,372 C152,330 142,290 146,258 Z';

const SKIRT = 'M156,390 C186,398 214,398 244,390 L272,528 C226,546 174,546 128,528 Z';

const TROUSERS =
  'M154,390 C186,398 214,398 246,390 C252,450 256,520 256,600 L254,756 L208,756 C206,660 204,560 201,476 L199,476 C196,560 194,660 192,756 L146,756 L144,600 C144,520 148,450 154,390 Z';

const DRESS =
  'M146,258 C150,248 166,242 182,240 C188,257 212,257 218,240 C234,242 250,248 254,258 C258,290 248,330 244,368 L284,562 C228,584 172,584 116,562 L156,368 C152,330 142,290 146,258 Z';

const CARDI_LEFT =
  'M146,258 C150,248 166,242 182,240 C186,300 190,370 193,430 L150,430 C150,396 155,370 156,346 C150,316 142,286 146,258 Z';

const SNEAKER = 'M157,752 C158,741 170,737 182,739 C196,741 203,752 203,764 C203,775 196,781 180,781 C165,781 155,777 155,766 Z';
const MARY_JANE = 'M158,756 C160,748 170,745 182,746 C196,747 203,756 203,766 C203,776 196,781 180,781 C166,781 156,777 156,768 Z';
const BOOT = 'M164,698 L195,698 C197,720 201,742 203,762 C203,775 196,781 180,781 C165,781 155,777 155,764 C158,740 162,720 164,698 Z';

/** Hem with round scallops from (x1,y) back to (x0,y), as path segments (no M). */
function scallopHem(x1: number, x0: number, y: number, bumps: number, amp: number) {
  let d = '';
  const w = (x1 - x0) / bumps;
  for (let i = 0; i < bumps; i++) {
    const a = x1 - i * w;
    d += ` Q${(a - w / 2).toFixed(1)},${(y + amp).toFixed(1)} ${(a - w).toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
}

const TANK =
  'M160,262 C164,252 172,246 178,244 L186,244 C190,264 210,264 214,244 L222,244 C228,246 236,252 240,262 C246,290 246,330 244,372 C246,384 248,394 248,404 C216,412 184,412 152,404 C152,394 154,384 156,372 C154,330 154,290 160,262 Z';
const SHORTS = 'M154,390 C186,398 214,398 246,390 C250,420 254,450 257,480 L206,484 L200,450 L194,484 L143,480 C146,450 150,420 154,390 Z';
const TUTU_TOP = `M156,390 C186,398 214,398 244,390 L286,478${scallopHem(286, 114, 478, 8, 16)} Z`;
const TUTU_UNDER = `M150,400 L296,494${scallopHem(296, 104, 494, 9, 14)} Z`;
const SUNDRESS =
  'M164,262 C170,256 178,254 184,254 L216,254 C222,254 230,256 236,262 C244,300 246,340 244,368 L284,562 C228,584 172,584 116,562 L156,368 C154,340 156,300 164,262 Z';
const PARTY = `M146,258 C150,248 166,242 182,240 C188,257 212,257 218,240 C234,242 250,248 254,258 C258,290 248,330 244,364 L290,548${scallopHem(290, 110, 548, 9, 18)} L156,364 C152,330 142,290 146,258 Z`;
const APRON = 'M168,262 L232,262 L234,330 C246,334 252,340 252,350 L258,520 C220,532 180,532 142,520 L148,350 C148,340 154,334 166,330 Z';
const HEART = (cx: number, cy: number, r: number) =>
  `M${cx},${cy + r} C${cx - r * 1.6},${cy - r * 0.2} ${cx - r * 0.9},${cy - r * 1.5} ${cx},${cy - r * 0.55} C${cx + r * 0.9},${cy - r * 1.5} ${cx + r * 1.6},${cy - r * 0.2} ${cx},${cy + r} Z`;
const STAR = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    return `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
  }).join(' ') + ' Z';

function Flower({ x, y, r, petal, center }: { x: number; y: number; r: number; petal: string; center: string }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * r} cy={y + Math.sin((a * Math.PI) / 180) * r} r={r * 0.75} fill={petal} />
      ))}
      <circle cx={x} cy={y} r={r * 0.6} fill={center} />
    </g>
  );
}

const FLAT = 'M157,758 C160,750 170,748 182,749 C196,750 203,758 203,767 C203,776 196,781 180,781 C165,781 155,777 155,768 Z';
const RAIN_BOOT = 'M162,662 L196,662 C197,700 201,740 204,762 C204,775 196,781 180,781 C165,781 154,777 154,764 C158,730 161,700 162,662 Z';

function Pair({ children }: { children: ReactElement }) {
  // Feet sit at x≈179 and x≈221; the right shoe is the left one mirrored around x = 200.
  return (
    <g>
      {children}
      <g transform={mirrorX(200)}>{children}</g>
    </g>
  );
}

export const WEAR_ART: Record<string, (p: WearArtProps) => ReactElement> = {
  'wear/top/sailor-tee': ({ main, accent }) => (
    <Shaded d={TEE} shade={main} shine={[172, 280, 22, 34]} tint="main">
      {[296, 326, 356, 386].map((y) => (
        <rect key={y} x={130} y={y} width={140} height={9} fill={accent.base} data-tint="accent" />
      ))}
      <path d="M182,240 C188,257 212,257 218,240" fill="none" stroke={accent.base} strokeWidth={6} />
    </Shaded>
  ),
  'wear/top/long-tee': ({ main, accent }) => (
    <Shaded d={TEE} shade={main} shine={[172, 280, 22, 34]} tint="main">
      <rect x={130} y={392} width={140} height={14} fill={accent.base} data-tint="accent" />
      <path d="M184,241 C190,254 210,254 216,241" fill="none" stroke={accent.base} strokeWidth={5} />
    </Shaded>
  ),
  'wear/bottom/a-line-skirt': ({ main, accent }) => (
    <Shaded d={SKIRT} shade={main} shine={[160, 440, 14, 40]} tint="main">
      <rect x={120} y={388} width={160} height={14} fill={accent.base} data-tint="accent" />
      <circle cx={186} cy={430} r={4} fill={accent.base} stroke={OUTLINE} strokeWidth={1.5} />
      <circle cx={186} cy={458} r={4} fill={accent.base} stroke={OUTLINE} strokeWidth={1.5} />
      <path d="M200,404 L200,536" stroke={main.shadow} strokeWidth={2} />
    </Shaded>
  ),
  'wear/bottom/wide-trousers': ({ main }) => (
    <Shaded d={TROUSERS} shade={main} shine={[160, 470, 10, 60]} tint="main">
      <path d="M200,398 L200,476" stroke={main.shadow} strokeWidth={2.5} />
      <path d="M160,404 C170,420 178,424 188,424" fill="none" stroke={main.shadow} strokeWidth={2} />
      <path d="M240,404 C230,420 222,424 212,424" fill="none" stroke={main.shadow} strokeWidth={2} />
    </Shaded>
  ),
  'wear/dress/picnic': ({ main, accent }) => (
    <Shaded d={DRESS} shade={main} shine={[170, 290, 20, 40]} tint="main">
      {Array.from({ length: 7 }).flatMap((_, row) =>
        Array.from({ length: 6 }).map((__, col) => (
          <circle
            key={`${row}-${col}`}
            cx={128 + col * 30 + (row % 2) * 15}
            cy={276 + row * 42}
            r={5}
            fill={accent.base}
            data-tint="accent"
          />
        )),
      )}
      <rect x={120} y={356} width={160} height={16} fill={accent.base} data-tint="accent" />
      <path d="M118,554 C172,578 228,578 282,554" fill="none" stroke={accent.base} strokeWidth={7} />
    </Shaded>
  ),
  'wear/outerwear/cardigan': ({ main, accent }) => {
    const panel = (
      <Shaded d={CARDI_LEFT} shade={main} shine={[160, 290, 10, 30]} tint="main">
        <rect x={140} y={414} width={60} height={16} fill={accent.base} data-tint="accent" />
        <path d="M182,240 C186,300 190,370 193,430" fill="none" stroke={accent.base} strokeWidth={8} />
      </Shaded>
    );
    return (
      <g>
        {panel}
        <g transform={mirrorX(200)}>{panel}</g>
        {[300, 340, 380].map((y) => (
          <circle key={y} cx={190 - (430 - y) * 0.02} cy={y} r={4.5} fill={accent.base} stroke={OUTLINE} strokeWidth={1.5} />
        ))}
      </g>
    );
  },
  'wear/shoes/sneakers': ({ main, accent }) => (
    <Pair>
      <Shaded d={SNEAKER} shade={main} depth={4} tint="main">
        <rect x={150} y={772} width={60} height={10} fill={accent.base} data-tint="accent" />
        <path d="M172,746 L188,744 M172,752 L190,750" stroke={accent.shadow} strokeWidth={2.5} strokeLinecap="round" />
      </Shaded>
    </Pair>
  ),
  'wear/shoes/mary-janes': ({ main }) => (
    <Pair>
      <g>
        <Shaded d={MARY_JANE} shade={main} depth={4} shine={[172, 758, 8, 3]} tint="main" />
        <path d="M164,752 C174,748 186,748 196,752" fill="none" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
        <path d="M164,752 C174,748 186,748 196,752" fill="none" stroke={main.shadow} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={194} cy={752} r={3} fill="#FFC94A" stroke={OUTLINE} strokeWidth={1.2} />
      </g>
    </Pair>
  ),
  'wear/shoes/boots': ({ main }) => (
    <Pair>
      <Shaded d={BOOT} shade={main} depth={5} shine={[170, 716, 4, 12]} tint="main">
        <rect x={150} y={698} width={60} height={12} fill={main.highlight} />
        <rect x={150} y={774} width={60} height={10} fill={main.shadow} />
      </Shaded>
    </Pair>
  ),
  'wear/headwear/sun-hat': ({ main, accent }) => (
    <g>
      <Shaded
        d="M80,92 C80,70 140,58 200,58 C260,58 320,70 320,92 C320,112 260,120 200,120 C140,120 80,112 80,92 Z"
        shade={main}
        depth={6}
        tint="main"
      />
      <Shaded
        d="M144,92 C140,46 162,24 200,24 C238,24 260,46 256,92 C238,98 162,98 144,92 Z"
        shade={main}
        shine={[178, 44, 16, 10]}
        tint="main"
      >
        <rect x={130} y={70} width={140} height={18} fill={accent.base} data-tint="accent" />
      </Shaded>
      <circle cx={244} cy={80} r={11} fill={accent.highlight} stroke={OUTLINE} strokeWidth={2.5} />
      <circle cx={244} cy={80} r={4} fill={accent.base} />
    </g>
  ),
  'wear/eyewear/round-glasses': ({ main }) => (
    <g data-tint="main">
      {[167, 233].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={146} r={22} fill="#FFFFFF" opacity={0.18} />
          <circle cx={cx} cy={146} r={22} fill="none" stroke={OUTLINE} strokeWidth={7} />
          <circle cx={cx} cy={146} r={22} fill="none" stroke={main.base} strokeWidth={3.5} />
          <path d={`M${cx - 12},${133} L${cx - 5},${128}`} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
        </g>
      ))}
      <path d="M189,144 Q200,136 211,144" fill="none" stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <path d="M189,144 Q200,136 211,144" fill="none" stroke={main.base} strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  'wear/bag/crossbody': ({ main }) => (
    <g data-tint="main">
      <Limb
        pts={[
          [168, 246],
          [204, 320],
          [236, 396],
        ]}
        width={7}
        shade={main}
      />
      <Shaded
        d="M218,392 C218,384 224,380 232,380 L256,380 C264,380 268,386 268,394 L268,420 C268,428 262,432 254,432 L232,432 C224,432 218,428 218,420 Z"
        shade={main}
        depth={5}
        shine={[228, 390, 6, 4]}
      >
        <path d="M218,404 L268,404" stroke={main.shadow} strokeWidth={3} />
      </Shaded>
      <circle cx={243} cy={406} r={4.5} fill="#FFC94A" stroke={OUTLINE} strokeWidth={1.5} />
    </g>
  ),

  'wear/top/ruffle-blouse': ({ main, accent }) => (
    <g>
      <Shaded d={TEE} shade={main} shine={[172, 280, 22, 34]} tint="main">
        {[300, 330, 360].map((y) => (
          <circle key={y} cx={200} cy={y} r={4} fill={accent.base} data-tint="accent" />
        ))}
        <rect x={130} y={396} width={140} height={10} fill={accent.base} data-tint="accent" />
      </Shaded>
      <Shaded
        d={`M172,244 C184,262 216,262 228,244 L232,252${scallopHem(232, 168, 262, 6, 9)} L168,252 Z`}
        shade={accent}
        depth={3}
        tint="accent"
      />
    </g>
  ),
  'wear/top/tank-heart': ({ main, accent }) => (
    <Shaded d={TANK} shade={main} shine={[176, 286, 14, 30]} tint="main">
      <Shaded d={HEART(206, 320, 20)} shade={accent} depth={3} tint="accent" />
      <rect x={130} y={398} width={140} height={10} fill={main.shadow} />
    </Shaded>
  ),
  'wear/top/star-hoodie': ({ main, accent }) => (
    <g>
      <Shaded d="M164,250 C164,226 236,226 236,250 C228,264 172,264 164,250 Z" shade={main} depth={4} tint="main" />
      <Shaded d={TEE} shade={main} shine={[172, 284, 20, 32]} tint="main">
        <path d="M168,350 L232,350 L240,396 L160,396 Z" fill={main.shadow} stroke={OUTLINE} strokeWidth={2} />
        <Shaded d={STAR(200, 300, 22)} shade={accent} depth={3} tint="accent" />
        <rect x={130} y={396} width={140} height={14} fill={main.shadow} />
      </Shaded>
      <path d="M188,252 L184,284 M212,252 L216,284" stroke={accent.base} strokeWidth={3} strokeLinecap="round" />
      <circle cx={184} cy={288} r={3.5} fill={accent.base} stroke={OUTLINE} strokeWidth={1.2} />
      <circle cx={216} cy={288} r={3.5} fill={accent.base} stroke={OUTLINE} strokeWidth={1.2} />
    </g>
  ),
  'wear/bottom/tutu': ({ main, accent }) => (
    <g>
      <Shaded d={TUTU_UNDER} shade={accent} depth={4} tint="accent" />
      <Shaded d={TUTU_TOP} shade={main} shine={[170, 430, 14, 30]} tint="main">
        <rect x={120} y={386} width={160} height={14} fill={main.shadow} />
        {[
          [170, 440],
          [226, 456],
          [196, 420],
          [150, 466],
          [252, 432],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={STAR(x, y, 5)} fill="#FFFFFF" opacity={0.9} />
        ))}
      </Shaded>
    </g>
  ),
  'wear/bottom/denim-shorts': ({ main, accent }) => (
    <Shaded d={SHORTS} shade={main} shine={[164, 420, 8, 24]} tint="main">
      <rect x={130} y={466} width={140} height={20} fill={main.highlight} />
      <path d="M200,398 L200,448" stroke={main.shadow} strokeWidth={2.5} />
      <path
        d="M160,404 C170,418 178,422 188,422"
        fill="none"
        stroke={accent.base}
        strokeWidth={2}
        strokeDasharray="4 3"
        data-tint="accent"
      />
      <path d="M240,404 C230,418 222,422 212,422" fill="none" stroke={accent.base} strokeWidth={2} strokeDasharray="4 3" />
    </Shaded>
  ),
  'wear/bottom/pleated-skirt': ({ main, accent }) => (
    <Shaded d={SKIRT} shade={main} shine={[160, 440, 10, 36]} tint="main">
      <rect x={120} y={388} width={160} height={14} fill={accent.base} data-tint="accent" />
      {[156, 178, 200, 222, 244].map((x) => (
        <path key={x} d={`M${200 + (x - 200) * 0.8},404 L${200 + (x - 200) * 1.25},540`} stroke={main.shadow} strokeWidth={2.5} />
      ))}
      <path d="M130,516 C176,532 224,532 270,516" fill="none" stroke={accent.base} strokeWidth={4} />
    </Shaded>
  ),
  'wear/dress/sundress': ({ main, accent }) => (
    <g>
      <path d="M172,258 L178,240 M228,258 L222,240" stroke={OUTLINE} strokeWidth={9} strokeLinecap="round" />
      <path d="M172,258 L178,240 M228,258 L222,240" stroke={main.base} strokeWidth={5} strokeLinecap="round" />
      <Shaded d={SUNDRESS} shade={main} shine={[176, 290, 14, 34]} tint="main">
        {[
          [150, 420],
          [210, 400],
          [250, 470],
          [180, 490],
          [130, 530],
          [230, 540],
          [196, 300],
          [168, 340],
          [226, 330],
        ].map(([x, y]) => (
          <Flower key={`${x}-${y}`} x={x} y={y} r={6} petal={accent.base} center="#FF8A65" />
        ))}
        <rect x={140} y={358} width={120} height={14} fill={accent.base} data-tint="accent" />
      </Shaded>
    </g>
  ),
  'wear/dress/party': ({ main, accent }) => (
    <g>
      <Shaded d={PARTY} shade={main} shine={[172, 290, 18, 36]} tint="main">
        {[
          [140, 470],
          [200, 430],
          [250, 500],
          [170, 520],
          [230, 450],
          [120, 530],
          [270, 540],
          [200, 500],
          [186, 300],
          [222, 320],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={STAR(x, y, 6)} fill={accent.highlight} data-tint="accent" />
        ))}
        <rect x={120} y={352} width={160} height={14} fill={accent.base} data-tint="accent" />
      </Shaded>
      <Shaded d="M200,360 C186,344 170,346 172,360 C170,374 186,376 200,360 Z" shade={accent} depth={3} />
      <Shaded d="M200,360 C214,344 230,346 228,360 C230,374 214,376 200,360 Z" shade={accent} depth={3} />
      <circle cx={200} cy={360} r={6} fill={accent.base} stroke={OUTLINE} strokeWidth={2} />
    </g>
  ),
  'wear/outerwear/denim-jacket': ({ main, accent }) => {
    const panel = (
      <g>
        <Shaded d={CARDI_LEFT} shade={main} shine={[160, 290, 10, 30]} tint="main">
          <path
            d="M152,322 L180,322 L181,344 L154,344 Z"
            fill="none"
            stroke={accent.base}
            strokeWidth={2}
            strokeDasharray="4 3"
            data-tint="accent"
          />
          <rect x={140} y={410} width={60} height={20} fill={main.shadow} />
          <path d="M182,246 C186,300 190,370 192,428" fill="none" stroke={accent.base} strokeWidth={2} strokeDasharray="4 3" />
        </Shaded>
        <Shaded d="M182,240 L168,244 L160,276 L186,262 Z" shade={main} depth={2} />
      </g>
    );
    return (
      <g>
        {panel}
        <g transform={mirrorX(200)}>{panel}</g>
        {[300, 350, 400].map((y) => (
          <circle key={y} cx={188} cy={y} r={4} fill="#E8B04C" stroke={OUTLINE} strokeWidth={1.5} />
        ))}
      </g>
    );
  },
  'wear/outerwear/cafe-apron': ({ main, accent }) => (
    <g>
      <path d="M170,264 L184,236 M230,264 L216,236" stroke={OUTLINE} strokeWidth={8} strokeLinecap="round" />
      <path d="M170,264 L184,236 M230,264 L216,236" stroke={main.base} strokeWidth={4.5} strokeLinecap="round" />
      <Shaded d={APRON} shade={main} shine={[170, 290, 8, 22]} tint="main">
        <path d="M170,420 L230,420 L230,466 L170,466 Z" fill={main.shadow} stroke={OUTLINE} strokeWidth={2} />
        <path
          d="M188,300 L212,300 L210,322 C208,328 192,328 190,322 Z"
          fill={accent.base}
          stroke={OUTLINE}
          strokeWidth={2}
          data-tint="accent"
        />
        <path d="M212,306 C220,306 220,316 211,316" fill="none" stroke={OUTLINE} strokeWidth={2} />
        <path
          d="M194,294 C192,290 196,288 194,284 M204,294 C202,290 206,288 204,284"
          stroke={accent.base}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      </Shaded>
      <path d="M148,360 L252,360" stroke={accent.base} strokeWidth={6} />
    </g>
  ),
  'wear/shoes/ballet-flats': ({ main }) => (
    <Pair>
      <g>
        <Shaded d={FLAT} shade={main} depth={4} shine={[170, 760, 6, 3]} tint="main" />
        <path
          d="M184,752 C178,746 172,748 174,754 C172,760 178,760 184,754 C190,760 196,760 194,754 C196,748 190,746 184,752 Z"
          fill={main.highlight}
          stroke={OUTLINE}
          strokeWidth={1.5}
        />
      </g>
    </Pair>
  ),
  'wear/shoes/rain-boots': ({ main }) => (
    <Pair>
      <Shaded d={RAIN_BOOT} shade={main} depth={5} shine={[170, 690, 4, 16]} tint="main">
        <rect x={150} y={660} width={60} height={12} fill={main.shadow} />
        <rect x={150} y={772} width={60} height={12} fill="#5B4A6E" opacity={0.55} />
      </Shaded>
    </Pair>
  ),
  'wear/headwear/bow-headband': ({ main }) => (
    <g data-tint="main">
      <path d="M128,120 C132,72 164,50 200,50 C236,50 268,72 272,120" fill="none" stroke={OUTLINE} strokeWidth={13} strokeLinecap="round" />
      <path
        d="M128,120 C132,72 164,50 200,50 C236,50 268,72 272,120"
        fill="none"
        stroke={main.base}
        strokeWidth={7}
        strokeLinecap="round"
      />
      <Shaded d="M240,62 C222,38 200,44 206,64 C200,84 222,88 240,62 Z" shade={main} depth={3} />
      <Shaded d="M240,62 C258,38 280,44 274,64 C280,84 258,88 240,62 Z" shade={main} depth={3} />
      <circle cx={240} cy={62} r={8} fill={main.base} stroke={OUTLINE} strokeWidth={2.5} />
    </g>
  ),
  'wear/headwear/beret': ({ main }) => (
    <g data-tint="main">
      <Shaded
        d="M118,84 C114,52 164,30 212,32 C262,34 294,56 288,82 C284,98 248,104 200,102 C156,102 120,100 118,84 Z"
        shade={main}
        shine={[170, 50, 24, 8]}
      />
      <path d="M206,32 L208,20" stroke={OUTLINE} strokeWidth={8} strokeLinecap="round" />
      <path d="M206,32 L208,20" stroke={main.base} strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  'wear/headwear/barista-cap': ({ main, accent }) => (
    <g>
      <Shaded d="M232,90 C262,86 296,92 304,102 C294,110 262,108 232,104 Z" shade={main} depth={3} tint="main" />
      <Shaded
        d="M132,100 C130,56 162,34 200,34 C240,34 270,56 268,100 C230,92 170,92 132,100 Z"
        shade={main}
        shine={[172, 52, 18, 8]}
        tint="main"
      >
        <ellipse cx={200} cy={70} rx={12} ry={15} fill={accent.base} data-tint="accent" />
        <path d="M200,57 C194,66 206,74 200,83" fill="none" stroke={main.shadow} strokeWidth={2.5} />
      </Shaded>
    </g>
  ),
  'wear/neck/heart-necklace': ({ main }) => (
    <g data-tint="main">
      <path d="M182,246 C186,266 194,276 200,278 C206,276 214,266 218,246" fill="none" stroke="#E8B04C" strokeWidth={2.5} />
      <Shaded d={HEART(200, 284, 9)} shade={main} depth={2} strokeWidth={2.5} />
    </g>
  ),
  'wear/neck/scarf': ({ main, accent }) => (
    <g>
      <Shaded d="M214,252 C224,280 222,310 228,336 L206,340 C204,312 200,282 198,256 Z" shade={main} depth={3} tint="main">
        <rect x={196} y={318} width={40} height={8} fill={accent.base} data-tint="accent" />
      </Shaded>
      <Shaded
        d="M170,236 C190,246 210,246 230,236 C236,244 236,256 230,262 C210,270 190,270 170,262 C164,256 164,244 170,236 Z"
        shade={main}
        depth={3}
        tint="main"
      >
        <rect x={160} y={246} width={80} height={6} fill={accent.base} />
      </Shaded>
    </g>
  ),
  'wear/bag/heart-purse': ({ main }) => (
    <g data-tint="main">
      <Limb
        pts={[
          [226, 248],
          [250, 330],
          [256, 404],
        ]}
        width={5}
        shade={main}
      />
      <Shaded d={HEART(256, 426, 26)} shade={main} depth={4} shine={[244, 412, 6, 4]} />
      <circle cx={256} cy={418} r={4} fill="#E8B04C" stroke={OUTLINE} strokeWidth={1.5} />
    </g>
  ),
  'wear/headwear/flower-crown': ({ main, accent }) => {
    // Flowers along the same arc as the headband, alternating the two tints.
    const pts = [158, 136, 114, 90, 66, 44, 22].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return [200 + Math.cos(a) * 74, 118 - Math.sin(a) * 70] as const;
    });
    return (
      <g>
        <path
          d="M128,120 C132,72 164,50 200,50 C236,50 268,72 272,120"
          fill="none"
          stroke={OUTLINE}
          strokeWidth={9}
          strokeLinecap="round"
        />
        <path
          d="M128,120 C132,72 164,50 200,50 C236,50 268,72 272,120"
          fill="none"
          stroke="#5FA67A"
          strokeWidth={5}
          strokeLinecap="round"
        />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x + (i % 2 ? 12 : -12)} cy={y + 6} rx={9} ry={5} fill="#7ED6A7" stroke={OUTLINE} strokeWidth={2} />
            <circle cx={x} cy={y} r={15} fill={OUTLINE} />
            <Flower x={x} y={y} r={8} petal={i % 2 ? accent.base : main.base} center={i % 2 ? main.highlight : accent.highlight} />
          </g>
        ))}
      </g>
    );
  },
  'wear/headwear/bucket-hat': ({ main, accent }) => (
    <g>
      <Shaded d="M134,98 C130,56 160,32 200,32 C240,32 270,56 266,98 Z" shade={main} shine={[168, 50, 20, 8]} tint="main" />
      <path
        d="M134,90 C170,82 230,82 266,90 L267,102 C230,94 170,94 133,102 Z"
        fill={accent.base}
        stroke={OUTLINE}
        strokeWidth={3}
        data-tint="accent"
      />
      <Shaded
        d="M104,116 C120,96 280,96 296,116 C300,126 290,130 280,128 C230,116 170,116 120,128 C110,130 100,126 104,116 Z"
        shade={main}
        depth={4}
        tint="main"
      />
      {[150, 200, 250].map((x) => (
        <circle key={x} cx={x} cy={60 + (x === 200 ? -6 : 4)} r={4} fill={accent.base} />
      ))}
    </g>
  ),
  'wear/eyewear/heart-sunglasses': ({ main }) => (
    <g data-tint="main">
      {[167, 233].map((cx) => (
        <g key={cx}>
          <path d={HEART(cx, 144, 24)} fill={main.shadow} opacity={0.82} stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
          <path d={HEART(cx, 144, 24)} fill="none" stroke={main.base} strokeWidth={2.5} strokeLinejoin="round" />
          <path d={`M${cx - 16},${134} L${cx - 8},${126}`} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
        </g>
      ))}
      <path d="M189,138 Q200,130 211,138" fill="none" stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <path d="M189,138 Q200,130 211,138" fill="none" stroke={main.base} strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  'wear/bag/star-purse': ({ main, accent }) => (
    <g>
      <Limb
        pts={[
          [226, 248],
          [250, 330],
          [258, 396],
        ]}
        width={5}
        shade={accent}
      />
      <Shaded d={STAR(258, 428, 36)} shade={main} depth={4} shine={[246, 412, 6, 4]} tint="main" />
      <circle cx={258} cy={430} r={7} fill={accent.base} stroke={OUTLINE} strokeWidth={2} data-tint="accent" />
    </g>
  ),
};

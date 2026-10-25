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

const CARDI_LEFT = 'M146,258 C150,248 166,242 182,240 C186,300 190,370 193,430 L150,430 C150,396 155,370 156,346 C150,316 142,286 146,258 Z';

const SNEAKER = 'M157,752 C158,741 170,737 182,739 C196,741 203,752 203,764 C203,775 196,781 180,781 C165,781 155,777 155,766 Z';
const MARY_JANE = 'M158,756 C160,748 170,745 182,746 C196,747 203,756 203,766 C203,776 196,781 180,781 C166,781 156,777 156,768 Z';
const BOOT = 'M164,698 L195,698 C197,720 201,742 203,762 C203,775 196,781 180,781 C165,781 155,777 155,764 C158,740 162,720 164,698 Z';

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
          <circle key={`${row}-${col}`} cx={128 + col * 30 + (row % 2) * 15} cy={276 + row * 42} r={5} fill={accent.base} data-tint="accent" />
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
      <Shaded d="M80,92 C80,70 140,58 200,58 C260,58 320,70 320,92 C320,112 260,120 200,120 C140,120 80,112 80,92 Z" shade={main} depth={6} tint="main" />
      <Shaded d="M144,92 C140,46 162,24 200,24 C238,24 260,46 256,92 C238,98 162,98 144,92 Z" shade={main} shine={[178, 44, 16, 10]} tint="main">
        <rect x={130} y={70} width={140} height={18} fill={accent.base} data-tint="accent" />
      </Shaded>
      <circle cx={244} cy={80} r={11} fill={accent.highlight} stroke={OUTLINE} strokeWidth={2.5} />
      <circle cx={244} cy={80} r={4} fill={accent.base} />
    </g>
  ),
  'wear/eyewear/round-glasses': ({ main }) => (
    <g data-tint="main">
      {[170, 230].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={142} r={19} fill="#FFFFFF" opacity={0.18} />
          <circle cx={cx} cy={142} r={19} fill="none" stroke={OUTLINE} strokeWidth={7} />
          <circle cx={cx} cy={142} r={19} fill="none" stroke={main.base} strokeWidth={3.5} />
          <path d={`M${cx - 10},${130} L${cx - 4},${126}`} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
        </g>
      ))}
      <path d="M189,140 Q200,132 211,140" fill="none" stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <path d="M189,140 Q200,132 211,140" fill="none" stroke={main.base} strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  'wear/bag/crossbody': ({ main }) => (
    <g data-tint="main">
      <Limb pts={[[168, 246], [204, 320], [236, 396]]} width={7} shade={main} />
      <Shaded d="M218,392 C218,384 224,380 232,380 L256,380 C264,380 268,386 268,394 L268,420 C268,428 262,432 254,432 L232,432 C224,432 218,428 218,420 Z" shade={main} depth={5} shine={[228, 390, 6, 4]}>
        <path d="M218,404 L268,404" stroke={main.shadow} strokeWidth={3} />
      </Shaded>
      <circle cx={243} cy={406} r={4.5} fill="#FFC94A" stroke={OUTLINE} strokeWidth={1.5} />
    </g>
  ),
};

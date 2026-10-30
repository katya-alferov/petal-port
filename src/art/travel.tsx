// Small Paris things in a 100×100 box: souvenirs, photo stickers and photo props. Original drawings.
import { OUTLINE } from './kit';

const sw = { stroke: OUTLINE, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Star({ c }: { c: string }) {
  return <path d="M50,12 L61,38 L89,40 L67,58 L74,86 L50,71 L26,86 L33,58 L11,40 L39,38 Z" fill={c} {...sw} />;
}

function TowerMini({ c }: { c: string }) {
  return (
    <g>
      <path d="M30,90 C36,64 44,44 48,14 L52,14 C56,44 64,64 70,90 L60,90 C58,74 54,68 50,66 C46,68 42,74 40,90 Z" fill={c} {...sw} />
      <rect x={38} y={52} width={24} height={6} rx={2} fill="#FFF7EC" {...sw} />
    </g>
  );
}

export function SouvenirArt({ kind, color }: { kind: string; color: string }) {
  switch (kind) {
    case 'postcard':
      return (
        <g>
          <rect x={10} y={22} width={80} height={58} rx={8} fill="#FFF7EC" {...sw} />
          <rect x={16} y={28} width={44} height={46} rx={4} fill={color} {...sw} />
          <path d="M38,34 L34,66 L42,66 Z" fill="#FFF7EC" {...sw} />
          <path d="M68,34 h14 M68,44 h14 M68,54 h14" stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
          <rect x={70} y={62} width={12} height={10} rx={2} fill="#FF7BA9" {...sw} />
        </g>
      );
    case 'tower':
      return <TowerMini c={color} />;
    case 'beret':
      return (
        <g>
          <ellipse cx={50} cy={58} rx={38} ry={24} fill={color} {...sw} />
          <ellipse cx={46} cy={50} rx={22} ry={8} fill="#FFADCA" opacity={0.7} />
          <rect x={47} y={26} width={7} height={14} rx={3} fill={color} {...sw} />
        </g>
      );
    case 'snowglobe':
      return (
        <g>
          <circle cx={50} cy={46} r={34} fill="#DFF3FF" {...sw} />
          <path
            d="M30,66 h8 v-18 h8 v18 h8 v-26 h8 v26 h8 v-12 h4 v12 Z"
            fill={color}
            stroke={OUTLINE}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          {[
            [34, 30],
            [58, 26],
            [44, 38],
            [66, 40],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={2.2} fill="#FFFFFF" />
          ))}
          <path d="M28,80 h44 l6,10 h-56 Z" fill="#B692F6" {...sw} />
        </g>
      );
    case 'cab':
      return (
        <g>
          <path
            d="M10,64 C10,52 18,48 28,46 L36,34 C38,30 42,30 46,30 L62,30 C66,30 70,32 72,36 L78,46 C86,48 90,54 90,64 Z"
            fill={color}
            {...sw}
          />
          <path
            d="M40,36 L46,36 L46,46 L32,46 Z M52,36 L62,36 L68,46 L52,46 Z"
            fill="#DFF3FF"
            stroke={OUTLINE}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <rect x={44} y={22} width={14} height={8} rx={2} fill="#FFF7EC" {...sw} />
          <circle cx={28} cy={68} r={9} fill="#5B4A6E" {...sw} />
          <circle cx={72} cy={68} r={9} fill="#5B4A6E" {...sw} />
          <path d="M12,56 h8 M82,56 h6" stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    case 'pretzel':
      return (
        <g>
          <path d="M50,84 C14,70 14,28 34,26 C46,24 50,36 50,44 C50,36 54,24 66,26 C86,28 86,70 50,84 Z" fill={color} {...sw} />
          <path d="M34,44 C44,52 56,52 66,44" fill="none" stroke={OUTLINE} strokeWidth={3} />
          {[
            [30, 40],
            [70, 40],
            [50, 70],
            [40, 62],
            [60, 62],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={2} fill="#FFF7EC" />
          ))}
          <circle cx={50} cy={14} r={7} fill="none" stroke={OUTLINE} strokeWidth={3.5} />
        </g>
      );
    case 'snowdome':
      return (
        <g>
          <path d="M18,70 C14,30 30,16 50,16 C70,16 86,30 82,70 Z" fill="#DFF3FF" {...sw} />
          <path
            d="M34,66 L34,40 L40,34 L40,42 L46,38 L46,26 L50,20 L54,26 L54,38 L60,42 L60,34 L66,40 L66,66 Z"
            fill={color}
            stroke={OUTLINE}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <circle cx={26} cy={36} r={2.2} fill="#FFFFFF" />
          <circle cx={76} cy={44} r={2.2} fill="#FFFFFF" />
          <rect x={14} y={70} width={72} height={16} rx={6} fill="#FFC94A" {...sw} />
        </g>
      );
    case 'rocketpin':
      return (
        <g>
          <path d="M50,10 C66,26 68,52 62,70 L38,70 C32,52 34,26 50,10 Z" fill="#FFF7EC" {...sw} />
          <circle cx={50} cy={40} r={8} fill="#8EC9FF" {...sw} />
          <path d="M38,56 L24,78 L40,70 Z M62,56 L76,78 L60,70 Z" fill={color} {...sw} />
          <path d="M44,74 L50,92 L56,74 Z" fill="#FFC94A" {...sw} />
        </g>
      );
    case 'wand':
      return (
        <g>
          <path d="M24,86 L62,40" stroke={OUTLINE} strokeWidth={13} strokeLinecap="round" />
          <path d="M24,86 L62,40" stroke="#FFF7EC" strokeWidth={7} strokeLinecap="round" />
          <path d="M66,12 L72,28 L88,30 L75,40 L80,56 L66,47 L52,56 L57,40 L44,30 L60,28 Z" fill={color} {...sw} />
        </g>
      );
    case 'skylens':
      return (
        <g>
          <circle cx={46} cy={46} r={30} fill="#DFF3FF" {...sw} />
          <circle cx={46} cy={46} r={20} fill={color} {...sw} />
          <path d="M34,40 C38,32 46,30 52,32" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
          <path d="M68,68 L86,86" stroke={OUTLINE} strokeWidth={12} strokeLinecap="round" />
          <path d="M68,68 L86,86" stroke="#FFC94A" strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    case 'teddy':
      return (
        <g>
          <circle cx={30} cy={26} r={11} fill={color} {...sw} />
          <circle cx={70} cy={26} r={11} fill={color} {...sw} />
          <circle cx={50} cy={40} r={26} fill={color} {...sw} />
          <ellipse cx={50} cy={48} rx={11} ry={8} fill="#F6D9AE" {...sw} />
          <circle cx={40} cy={36} r={3} fill={OUTLINE} />
          <circle cx={60} cy={36} r={3} fill={OUTLINE} />
          <circle cx={50} cy={46} r={3} fill={OUTLINE} />
          <path d="M34,72 C34,64 66,64 66,72 L66,88 L34,88 Z" fill={color} {...sw} />
          <path d="M44,64 L50,72 L56,64 Z" fill="#FF7BA9" {...sw} />
        </g>
      );
    case 'rainbowpop':
      return (
        <g>
          <path d="M50,92 L50,56" stroke={OUTLINE} strokeWidth={10} strokeLinecap="round" />
          <path d="M50,92 L50,56" stroke="#FFF7EC" strokeWidth={5} strokeLinecap="round" />
          <circle cx={50} cy={34} r={26} fill="#FF7BA9" {...sw} />
          {['#FFC94A', '#7ED6A7', '#3BB7C4', '#B692F6'].map((c, i) => (
            <circle key={c} cx={50} cy={34} r={22 - i * 5} fill="none" stroke={c} strokeWidth={4} />
          ))}
        </g>
      );
    default: // macarons
      return (
        <g>
          <rect x={12} y={50} width={76} height={34} rx={8} fill="#FFF7EC" {...sw} />
          {['#FF7BA9', '#FFC94A', color, '#7ED6A7'].map((c, i) => (
            <g key={c}>
              <circle cx={26 + i * 16} cy={44} r={11} fill={c} {...sw} />
              <path d={`M${15 + i * 16},45 h22`} stroke="#FFF7EC" strokeWidth={3} />
            </g>
          ))}
        </g>
      );
  }
}

export function PhotoStickerArt({ id }: { id: string }) {
  switch (id) {
    case 'heart':
      return <path d="M50,84 C14,56 12,28 32,22 C42,20 48,26 50,32 C52,26 58,20 68,22 C88,28 86,56 50,84 Z" fill="#FF7BA9" {...sw} />;
    case 'star':
      return <Star c="#FFC94A" />;
    case 'bonjour':
      return (
        <g>
          <path
            d="M10,22 h80 a8,8 0 0 1 8,8 v28 a8,8 0 0 1 -8,8 h-48 l-14,14 v-14 h-18 a8,8 0 0 1 -8,-8 v-28 a8,8 0 0 1 8,-8 Z"
            fill="#FFF7EC"
            {...sw}
          />
          <text x={50} y={52} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={19} fill={OUTLINE}>
            Bonjour!
          </text>
        </g>
      );
    case 'tower':
      return <TowerMini c="#FFC94A" />;
    case 'macaron':
      return (
        <g>
          <path d="M20,44 C20,26 80,26 80,44 Z" fill="#FF7BA9" {...sw} />
          <rect x={20} y={44} width={60} height={9} rx={4} fill="#FFF7EC" {...sw} />
          <path d="M20,53 C20,72 80,72 80,53 Z" fill="#FF7BA9" {...sw} />
        </g>
      );
    case 'beret':
      return <SouvenirArt kind="beret" color="#FF7BA9" />;
    default:
      return (
        <g>
          <path d="M50,10 L58,42 L90,50 L58,58 L50,90 L42,58 L10,50 L42,42 Z" fill="#B692F6" {...sw} />
          <circle cx={78} cy={22} r={5} fill="#FFE08A" />
        </g>
      );
  }
}

export function PropArt({ id }: { id: string }) {
  if (id === 'croissant')
    return (
      <g>
        <path
          d="M12,66 C14,40 34,26 50,26 C66,26 86,40 88,66 C80,58 74,56 68,60 C62,50 56,48 50,48 C44,48 38,50 32,60 C26,56 20,58 12,66 Z"
          fill="#E8A857"
          {...sw}
        />
        <path d="M34,40 l6,14 M50,32 l0,16 M66,40 l-6,14" stroke="#B87A3A" strokeWidth={3.5} strokeLinecap="round" />
      </g>
    );
  return (
    <g>
      <path d="M50,92 C48,80 50,72 52,66" fill="none" stroke={OUTLINE} strokeWidth={3} />
      <path d="M50,10 C78,10 84,34 70,52 C64,60 56,64 50,64 C44,64 36,60 30,52 C16,34 22,10 50,10 Z" fill="#FF7BA9" {...sw} />
      <ellipse cx={40} cy={26} rx={8} ry={12} fill="#FFADCA" opacity={0.8} />
      <path d="M46,64 L50,72 L54,64 Z" fill="#D86094" {...sw} />
    </g>
  );
}

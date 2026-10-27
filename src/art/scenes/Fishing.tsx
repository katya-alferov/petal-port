// Fishing Dock art (game-systems §26): the dock and sea, the bobber in its phases, and ten fish.
import { OUTLINE } from '../kit';

const sw = { stroke: OUTLINE, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

const FISH: Record<string, { body: string; fin: string; mark?: 'stripes' | 'spots' | 'dots' }> = {
  minnow: { body: '#B4C9D6', fin: '#8FA9BA' },
  goldfish: { body: '#FFA94D', fin: '#FF8A3D' },
  clownfish: { body: '#FF8A3D', fin: '#FF6A2B', mark: 'stripes' },
  bluetang: { body: '#4A8FE0', fin: '#FFD04A' },
  pufferfish: { body: '#E8C86B', fin: '#D9A846', mark: 'spots' },
  angelfish: { body: '#FFE9A8', fin: '#B692F6', mark: 'stripes' },
};

/** A fish centred in a 120×80 box. */
export function FishArt({ id, dim = false }: { id: string; dim?: boolean }) {
  const f = FISH[id];
  const dimStyle = dim ? { filter: 'grayscale(1) brightness(0.55)', opacity: 0.45 } : undefined;
  if (id === 'jellyfish')
    return (
      <svg viewBox="0 0 120 80" aria-hidden="true" style={dimStyle}>
        <path d="M30,44 C30,10 90,10 90,44 Z" fill="#E8B4F0" {...sw} />
        {[40, 55, 70, 82].map((x) => (
          <path
            key={x}
            d={`M${x},44 C${x - 6},56 ${x + 6},64 ${x},76`}
            fill="none"
            stroke="#C98BDB"
            strokeWidth={4}
            strokeLinecap="round"
          />
        ))}
        <circle cx={48} cy={28} r={5} fill="#FFFFFF" opacity={0.7} />
      </svg>
    );
  if (id === 'starfish')
    return (
      <svg viewBox="0 0 120 80" aria-hidden="true" style={dimStyle}>
        <path d="M60,6 L71,32 L99,34 L77,50 L85,76 L60,61 L35,76 L43,50 L21,34 L49,32 Z" fill="#FF8A65" {...sw} />
        <circle cx={60} cy={40} r={4} fill="#FFD1B8" />
      </svg>
    );
  if (id === 'seahorse')
    return (
      <svg viewBox="0 0 120 80" aria-hidden="true" style={dimStyle}>
        <path
          d="M54,12 C70,8 78,20 70,30 C86,36 80,56 64,60 C54,64 48,72 56,76 C44,74 38,62 48,52 C40,44 40,26 54,12 Z"
          fill="#FFC94A"
          {...sw}
        />
        <path d="M54,14 L40,18" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
        <circle cx={60} cy={20} r={3} fill={OUTLINE} />
      </svg>
    );
  if (id === 'whale')
    return (
      <svg viewBox="0 0 120 80" aria-hidden="true" style={dimStyle}>
        <path d="M12,48 C12,22 56,14 84,34 C98,28 106,18 112,22 C110,34 104,44 96,48 C80,70 20,72 12,48 Z" fill="#7CC4F5" {...sw} />
        <path d="M30,58 C46,66 70,64 84,52" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" />
        <circle cx={32} cy={40} r={3.5} fill={OUTLINE} />
        <path d="M44,18 C42,8 52,4 56,10 M56,10 C60,4 70,8 66,18" fill="none" stroke="#BDEBF0" strokeWidth={4} strokeLinecap="round" />
      </svg>
    );
  const fish = f ?? FISH.minnow;
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true" style={dimStyle}>
      <path d="M92,40 L114,20 L114,60 Z" fill={fish.fin} {...sw} />
      <path d="M18,40 C30,12 82,12 96,40 C82,68 30,68 18,40 Z" fill={fish.body} {...sw} />
      <path d="M50,20 C56,6 70,6 76,18" fill={fish.fin} {...sw} />
      {fish.mark === 'stripes' && (
        <g stroke={id === 'clownfish' ? '#FFFFFF' : OUTLINE} strokeWidth={5} strokeLinecap="round">
          <path d="M44,20 C40,34 40,46 44,60" fill="none" />
          <path d="M66,18 C62,34 62,46 66,62" fill="none" />
        </g>
      )}
      {fish.mark === 'spots' &&
        [
          [46, 34],
          [60, 48],
          [72, 32],
        ].map(([x, y]) => <circle key={x} cx={x} cy={y} r={3.5} fill="#B8862B" />)}
      <circle cx={36} cy={36} r={4} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={2} />
      <circle cx={36} cy={36} r={1.8} fill={OUTLINE} />
    </svg>
  );
}

/** The dock, sea and sky (viewBox 390×560, anchored to the bottom) with the bobber in its current phase. */
export function DockArt({ phase }: { phase: 'idle' | 'wait' | 'bite' | 'result' | 'missed' }) {
  const out = phase === 'wait' || phase === 'bite';
  return (
    <svg
      viewBox="0 0 390 560"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <rect width={390} height={560} fill="#CDEBFF" />
      <circle cx={320} cy={70} r={30} fill="#FFE08A" {...sw} />
      <path d="M0,200 L390,200 L390,560 L0,560 Z" fill="#3BB7C4" />
      <path d="M0,230 C60,220 120,240 190,230 C260,220 330,240 390,228" stroke="#BDEBF0" strokeWidth={5} fill="none" />
      <path d="M0,300 C80,290 160,312 240,300 C300,292 350,306 390,298" stroke="#BDEBF0" strokeWidth={5} fill="none" opacity={0.8} />
      <path d="M0,400 C90,392 180,410 270,400 C330,394 360,402 390,398" stroke="#BDEBF0" strokeWidth={5} fill="none" opacity={0.6} />
      {/* the rod and line */}
      <path d="M96,420 L190,300" stroke="#9E6A42" strokeWidth={8} strokeLinecap="round" />
      <path d="M96,420 L190,300" stroke={OUTLINE} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
      {out && <path d={`M190,300 L262,${phase === 'bite' ? 340 : 330}`} stroke={OUTLINE} strokeWidth={2} fill="none" />}
      {out && (
        <g transform={`translate(262 ${phase === 'bite' ? 342 : 330})`}>
          <ellipse rx={30} ry={9} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={phase === 'bite' ? 1 : 0.6} />
          {phase === 'bite' && <ellipse rx={46} ry={13} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.7} />}
          <circle r={10} cy={phase === 'bite' ? 2 : -8} fill="#FF7BA9" {...sw} />
          <path d="M-10,-6 L10,-6" stroke="#FFFFFF" strokeWidth={4} transform={`translate(0 ${phase === 'bite' ? 2 : -8})`} />
        </g>
      )}
      {phase === 'bite' && (
        <g>
          <circle cx={262} cy={270} r={22} fill="#FFC94A" {...sw} />
          <text x={262} y={281} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={34} fill="#3A2E4F">
            !
          </text>
        </g>
      )}
      {/* the dock */}
      <path d="M0,430 L390,430 L390,560 L0,560 Z" fill="#C98F5E" {...sw} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M${i * 60},430 L${i * 60 - 14},560`} stroke="#9E6A42" strokeWidth={4} />
      ))}
      <path d="M0,470 L390,470" stroke="#9E6A42" strokeWidth={4} />
      <rect x={20} y={380} width={16} height={60} rx={6} fill="#9E6A42" {...sw} />
      <rect x={350} y={380} width={16} height={60} rx={6} fill="#9E6A42" {...sw} />
    </svg>
  );
}

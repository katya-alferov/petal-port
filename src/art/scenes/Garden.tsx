// Petal Garden art (game-systems §10.2): flowers at each growth stage, in a 200×240 box with the
// soil line at y=200.
import type { FlowerArt } from '../../content/types';

type Stage = 'seed' | 'sprout' | 'bud' | 'bloom';
import { OUTLINE } from '../kit';

const LEAF = '#7ED6A7';
const STEM = '#5FA67A';

function Bloom({ art, petal, center }: { art: FlowerArt; petal: string; center: string }) {
  const sw = { stroke: OUTLINE, strokeWidth: 4, strokeLinejoin: 'round' as const };
  switch (art) {
    case 'tulip':
      return (
        <g>
          <path
            d="M70,70 C70,40 80,30 86,24 L100,44 L114,24 C120,30 130,40 130,70 C130,96 112,106 100,106 C88,106 70,96 70,70 Z"
            fill={petal}
            {...sw}
          />
          <path d="M100,44 L100,100" stroke={center} strokeWidth={4} opacity={0.5} />
        </g>
      );
    case 'sunflower':
      return (
        <g>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <ellipse
                key={i}
                cx={100 + Math.cos(a) * 34}
                cy={66 + Math.sin(a) * 34}
                rx={14}
                ry={9}
                transform={`rotate(${(i * 30) % 360} ${100 + Math.cos(a) * 34} ${66 + Math.sin(a) * 34})`}
                fill={petal}
                {...sw}
                strokeWidth={3}
              />
            );
          })}
          <circle cx={100} cy={66} r={24} fill={center} {...sw} />
        </g>
      );
    case 'daisy':
      return (
        <g>
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i * Math.PI) / 5;
            return (
              <ellipse
                key={i}
                cx={100 + Math.cos(a) * 28}
                cy={66 + Math.sin(a) * 28}
                rx={16}
                ry={8}
                transform={`rotate(${i * 36} ${100 + Math.cos(a) * 28} ${66 + Math.sin(a) * 28})`}
                fill={petal}
                {...sw}
                strokeWidth={3}
              />
            );
          })}
          <circle cx={100} cy={66} r={16} fill={center} {...sw} />
        </g>
      );
    case 'rose':
      return (
        <g>
          <circle cx={100} cy={66} r={36} fill={petal} {...sw} />
          <path
            d="M100,66 C92,58 104,48 112,58 C120,70 100,84 88,72 C76,58 92,38 112,42 C130,48 132,74 118,88"
            fill="none"
            stroke={center}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
      );
    case 'bell':
      return (
        <g>
          {[
            [76, 64],
            [100, 50],
            [124, 64],
          ].map(([x, y]) => (
            <path
              key={x}
              d={`M${x - 16},${y + 24} C${x - 16},${y} ${x - 10},${y - 14} ${x},${y - 14} C${x + 10},${y - 14} ${x + 16},${y} ${x + 16},${y + 24} L${x + 10},${y + 18} L${x + 4},${y + 26} L${x - 4},${y + 18} L${x - 10},${y + 26} Z`}
              fill={petal}
              {...sw}
              strokeWidth={3}
            />
          ))}
          <path d="M76,50 C80,36 120,36 124,50" fill="none" stroke={STEM} strokeWidth={4} />
        </g>
      );
    case 'star':
      return (
        <g>
          <path d="M100,22 L112,52 L144,54 L120,74 L128,106 L100,88 L72,106 L80,74 L56,54 L88,52 Z" fill={petal} {...sw} />
          <circle cx={100} cy={66} r={12} fill={center} {...sw} strokeWidth={3} />
          <path d="M150,24 L153,32 L161,35 L153,38 L150,46 L147,38 L139,35 L147,32 Z" fill="#FFF7EC" stroke={OUTLINE} strokeWidth={2} />
        </g>
      );
  }
}

export function FlowerArtStage({ stage, art, petal, center }: { stage: Stage; art: FlowerArt; petal: string; center: string }) {
  return (
    <g>
      {/* Soil mound */}
      <ellipse cx={100} cy={204} rx={70} ry={20} fill="#9E6A42" stroke={OUTLINE} strokeWidth={4} />
      <ellipse cx={86} cy={198} rx={20} ry={5} fill="#C98F5E" />
      {stage === 'seed' && (
        <g>
          <ellipse cx={100} cy={190} rx={10} ry={7} fill="#E3B183" stroke={OUTLINE} strokeWidth={3} />
          <path d="M100,176 L100,168 M92,178 L88,172 M108,178 L112,172" stroke="#FFC94A" strokeWidth={3} strokeLinecap="round" />
        </g>
      )}
      {stage !== 'seed' && (
        <path d={`M100,196 L100,${stage === 'sprout' ? 150 : 90}`} stroke={STEM} strokeWidth={8} strokeLinecap="round" />
      )}
      {stage === 'sprout' && (
        <g>
          <path d="M100,160 C84,150 74,152 70,160 C80,170 92,168 100,160 Z" fill={LEAF} stroke={OUTLINE} strokeWidth={3} />
          <path d="M100,152 C116,142 126,144 130,152 C120,162 108,160 100,152 Z" fill={LEAF} stroke={OUTLINE} strokeWidth={3} />
        </g>
      )}
      {(stage === 'bud' || stage === 'bloom') && (
        <g>
          <path d="M100,160 C78,148 64,152 60,164 C76,176 92,172 100,160 Z" fill={LEAF} stroke={OUTLINE} strokeWidth={3} />
          <path d="M100,140 C122,128 136,132 140,144 C124,156 108,152 100,140 Z" fill={LEAF} stroke={OUTLINE} strokeWidth={3} />
        </g>
      )}
      {stage === 'bud' && (
        <path d="M88,96 C88,72 96,62 100,58 C104,62 112,72 112,96 C112,106 88,106 88,96 Z" fill={petal} stroke={OUTLINE} strokeWidth={4} />
      )}
      {stage === 'bloom' && <Bloom art={art} petal={petal} center={center} />}
    </g>
  );
}

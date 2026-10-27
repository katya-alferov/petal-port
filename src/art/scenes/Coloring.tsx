// Art Studio coloring pages (game-systems §24). viewBox 0 0 300 300. Each part is a tappable region; `colors`
// holds a hex per part (or null for white). Drawn back to front, so later parts sit on top.
import { OUTLINE } from '../kit';

interface Part {
  d: string;
  name: string;
}
const circle = (cx: number, cy: number, r: number) => `M${cx - r},${cy} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0 Z`;
const rect = (x: number, y: number, w: number, h: number, r = 0) =>
  `M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Parts in paint order; each picture's part count matches game/studio.ts. */
const PAGES: Record<string, { parts: Part[]; order: number[] }> = {
  butterfly: {
    parts: [
      { name: 'Left top wing', d: 'M150,140 C110,60 40,50 40,110 C40,150 100,160 150,150 Z' },
      { name: 'Right top wing', d: 'M150,140 C190,60 260,50 260,110 C260,150 200,160 150,150 Z' },
      { name: 'Left bottom wing', d: 'M150,150 C100,165 50,180 70,230 C95,260 140,220 150,190 Z' },
      { name: 'Right bottom wing', d: 'M150,150 C200,165 250,180 230,230 C205,260 160,220 150,190 Z' },
      { name: 'Body', d: 'M150,95 C168,95 168,215 150,225 C132,215 132,95 150,95 Z' },
      { name: 'Left spot', d: circle(82, 102, 15) },
      { name: 'Right spot', d: circle(218, 102, 15) },
      { name: 'Background', d: rect(0, 0, 300, 300) },
    ],
    order: [7, 0, 1, 2, 3, 4, 5, 6],
  },
  cupcake: {
    parts: [
      { name: 'Cherry', d: circle(150, 52, 16) },
      { name: 'Top frosting', d: 'M105,115 C100,80 135,70 150,76 C165,70 200,80 195,115 Z' },
      { name: 'Bottom frosting', d: 'M85,155 C78,120 108,112 105,115 L195,115 C192,112 222,120 215,155 Z' },
      { name: 'Wrapper', d: 'M90,155 L210,155 L190,240 L110,240 Z' },
      { name: 'Plate', d: 'M40,255 C40,235 260,235 260,255 C260,278 40,278 40,255 Z' },
      { name: 'Background', d: rect(0, 0, 300, 300) },
    ],
    order: [5, 4, 3, 2, 1, 0],
  },
  house: {
    parts: [
      { name: 'Roof', d: 'M55,132 L150,58 L245,132 Z' },
      { name: 'Wall', d: rect(78, 132, 144, 110) },
      { name: 'Door', d: rect(134, 178, 40, 64, 10) },
      { name: 'Left window', d: rect(94, 150, 30, 30, 4) },
      { name: 'Right window', d: rect(180, 150, 30, 30, 4) },
      { name: 'Sun', d: circle(252, 52, 26) },
      { name: 'Sky', d: rect(0, 0, 300, 300) },
      { name: 'Grass', d: rect(0, 242, 300, 58) },
    ],
    order: [6, 7, 5, 1, 0, 2, 3, 4],
  },
};

export function ColoringArt({
  id,
  colors,
  onTap,
  testId,
}: {
  id: string;
  colors: readonly (string | null)[];
  onTap?: (part: number) => void;
  testId?: string;
}) {
  const page = PAGES[id] ?? PAGES.butterfly;
  return (
    <svg
      viewBox="0 0 300 300"
      style={{ width: '100%', height: '100%', display: 'block' }}
      role={onTap ? 'group' : 'img'}
      aria-label={onTap ? 'Coloring page' : 'A finished picture'}
      data-testid={testId}
    >
      {page.order.map((i) => {
        const part = page.parts[i];
        return (
          <path
            key={i}
            d={part.d}
            fill={colors[i] ?? '#FFFFFF'}
            stroke={OUTLINE}
            strokeWidth={4}
            strokeLinejoin="round"
            data-testid={onTap ? `part-${i}` : undefined}
            role={onTap ? 'button' : undefined}
            tabIndex={onTap ? 0 : undefined}
            aria-label={onTap ? part.name : undefined}
            style={onTap ? { cursor: 'pointer' } : undefined}
            onClick={onTap ? () => onTap(i) : undefined}
            onKeyDown={onTap ? (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onTap(i)) : undefined}
          />
        );
      })}
    </svg>
  );
}

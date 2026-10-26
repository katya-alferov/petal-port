// Drifting seasonal confetti (game-systems §10.3): decoration only, never tappable. It moves with
// transform and opacity only, and the global reduced-motion rule stops it.
type Kind = 'spring' | 'summer' | 'autumn' | 'winter';

const LOOK: Record<Kind, { colors: string[]; path: string }> = {
  spring: {
    colors: ['#FFADCA', '#FFC2D6', '#FFFFFF'],
    path: 'M10,2 C16,2 18,10 10,18 C2,10 4,2 10,2 Z',
  },
  summer: {
    colors: ['#FFE08A', '#FFC94A', '#FFFFFF'],
    path: 'M10,0 L12.4,7.6 L20,10 L12.4,12.4 L10,20 L7.6,12.4 L0,10 L7.6,7.6 Z',
  },
  autumn: {
    colors: ['#FF8A65', '#FFC94A', '#C8683A'],
    path: 'M10,1 C16,5 18,11 12,13 L11,19 L9,19 L8,13 C2,11 4,5 10,1 Z',
  },
  winter: {
    colors: ['#FFFFFF', '#DDF4F6', '#BDE8EC'],
    path: 'M10,2 A8,8 0 1 1 9.9,2 Z',
  },
};

const COUNT = 9;

export function SeasonDrift({ season }: { season: Kind }) {
  const { colors, path } = LOOK[season];
  return (
    <div className="season-drift" aria-hidden="true" data-season={season} data-testid="season-drift">
      {Array.from({ length: COUNT }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="season-bit"
          style={{ left: `${(i * 11 + 6) % 96}%`, animationDelay: `${-(i * 1.7) % 9}s`, animationDuration: `${8 + (i % 4) * 2}s` }}
        >
          <path d={path} fill={colors[i % colors.length]} stroke="#5B4A6E" strokeWidth={1.2} strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

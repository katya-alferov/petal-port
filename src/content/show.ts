// Starlight Stage show themes and the secret shells hidden around town (game-systems §9.1–9.2).
// Ids are permanent: best stars and found shells are saved under them.
import type { ShowThemeRule } from '../game/show';

export interface ShowTheme extends ShowThemeRule {
  name: string;
  /** What the judges are hoping to see, in kid words. */
  blurb: string;
  /** Friendly names for the tags, shown as "loves" chips. */
  loves: string[];
  /** Stage light color. */
  color: string;
}

export const SHOW_THEMES: ShowTheme[] = [
  {
    id: 'show.sunny-picnic',
    name: 'Sunny Picnic',
    tags: ['sunny', 'park'],
    blurb: 'A picnic in Petal Park! Dress for sunshine and grass.',
    loves: ['sunny', 'park'],
    color: '#FFC94A',
  },
  {
    id: 'show.party-princess',
    name: 'Party Princess',
    tags: ['party', 'dressy'],
    blurb: 'You’re invited to the royal ball. Sparkle and twirl!',
    loves: ['party', 'dressy'],
    color: '#FF7BA9',
  },
  {
    id: 'show.cozy-day',
    name: 'Cozy Day',
    tags: ['cozy'],
    blurb: 'Rainy day, hot cocoa, snuggly clothes.',
    loves: ['cozy'],
    color: '#B39DFF',
  },
  {
    id: 'show.harbour-stroll',
    name: 'Harbour Stroll',
    tags: ['harbour', 'casual'],
    blurb: 'A walk by the boats and the lighthouse.',
    loves: ['harbour', 'casual'],
    color: '#3BB7C4',
  },
  {
    id: 'show.smart-chic',
    name: 'Smart & Chic',
    tags: ['smart'],
    blurb: 'Off to the museum! Look clever and stylish.',
    loves: ['smart'],
    color: '#B23A6B',
  },
  {
    id: 'show.sporty-star',
    name: 'Sporty Star',
    tags: ['sporty'],
    blurb: 'Sports day at school. Ready, set, style!',
    loves: ['sporty'],
    color: '#7ED6A7',
  },
];

export function showTheme(id: string): ShowTheme | undefined {
  return SHOW_THEMES.find((t) => t.id === id);
}

export type ShellKind = 'scallop' | 'conch' | 'starfish' | 'spiral';
export type ShellScene = 'town' | 'home' | 'boutique' | 'cafe' | 'kitchen' | 'petshop' | 'show';

export interface ShellDef {
  id: string;
  name: string;
  kind: ShellKind;
  color: string;
  scene: ShellScene;
  /** Town: map units (1170×3860). Show: percent of the stage. Other scenes: percent of the whole scene. */
  x: number;
  y: number;
  /** Shown in the album until it is found. */
  hint: string;
}

export const SHELLS: ShellDef[] = [
  {
    id: 'shell.beach',
    name: 'Beach Scallop',
    kind: 'scallop',
    color: '#FFADCA',
    scene: 'town',
    x: 600,
    y: 2300,
    hint: 'On the sandy beach',
  },
  { id: 'shell.pond', name: 'Pond Spiral', kind: 'spiral', color: '#B39DFF', scene: 'town', x: 520, y: 1420, hint: 'By the duck pond' },
  { id: 'shell.windmill', name: 'Hilltop Star', kind: 'starfish', color: '#FFC94A', scene: 'town', x: 760, y: 500, hint: 'Up the hill' },
  {
    id: 'shell.runway',
    name: 'Runway Conch',
    kind: 'conch',
    color: '#FF8A65',
    scene: 'town',
    x: 1110,
    y: 3780,
    hint: 'Where the planes take off',
  },
  { id: 'shell.home', name: 'Cozy Scallop', kind: 'scallop', color: '#7ED6A7', scene: 'home', x: 90, y: 62, hint: 'Somewhere at home' },
  {
    id: 'shell.boutique',
    name: 'Ribbon Spiral',
    kind: 'spiral',
    color: '#FF7BA9',
    scene: 'boutique',
    x: 88,
    y: 12,
    hint: 'In the Ribbon Boutique',
  },
  { id: 'shell.cafe', name: 'Café Conch', kind: 'conch', color: '#FFDE8D', scene: 'cafe', x: 93, y: 24, hint: 'At the Sunny Café' },
  {
    id: 'shell.kitchen',
    name: 'Kitchen Star',
    kind: 'starfish',
    color: '#FF8A65',
    scene: 'kitchen',
    x: 90,
    y: 14,
    hint: 'In your kitchen',
  },
  {
    id: 'shell.parlour',
    name: 'Paw Print Scallop',
    kind: 'scallop',
    color: '#B39DFF',
    scene: 'petshop',
    x: 90,
    y: 30,
    hint: 'In the Paw Parlour',
  },
  {
    id: 'shell.stage',
    name: 'Starlight Spiral',
    kind: 'spiral',
    color: '#FFC94A',
    scene: 'show',
    x: 8,
    y: 70,
    hint: 'On the Starlight Stage',
  },
];

export function shellsIn(scene: ShellScene): ShellDef[] {
  return SHELLS.filter((s) => s.scene === scene);
}

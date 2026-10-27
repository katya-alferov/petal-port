// Bedroom choices (game-systems §17). Ids are permanent; the first of each list is the starter look.
export interface WallColor {
  id: string;
  name: string;
  wall: string;
  stripe: string;
  floor: string;
}
export interface Bedding {
  id: string;
  name: string;
  main: string;
  accent: string;
}
export interface Choice {
  id: string;
  name: string;
}

export const WALLS: WallColor[] = [
  { id: 'cream', name: 'Cream', wall: '#FFF1D8', stripe: '#FFE6BD', floor: '#D9A468' },
  { id: 'blush', name: 'Blush pink', wall: '#FFD9E6', stripe: '#FFC7DA', floor: '#D9A468' },
  { id: 'mint', name: 'Mint', wall: '#D4F5E6', stripe: '#BFEBD7', floor: '#CFA46E' },
  { id: 'sky', name: 'Sky blue', wall: '#D6ECFF', stripe: '#C2E0FA', floor: '#D2A46E' },
  { id: 'lilac', name: 'Lilac', wall: '#E6DBFF', stripe: '#D8C9FA', floor: '#D2A46E' },
  { id: 'sun', name: 'Sunshine', wall: '#FFF0A8', stripe: '#FFE680', floor: '#D2A46E' },
  { id: 'night', name: 'Midnight', wall: '#4B3F82', stripe: '#5A4C96', floor: '#8E6B50' },
];
export const BEDDINGS: Bedding[] = [
  { id: 'pink', name: 'Pink', main: '#FF9EC4', accent: '#FFD1E3' },
  { id: 'teal', name: 'Teal', main: '#3BB7C4', accent: '#A9E5EA' },
  { id: 'lilac', name: 'Lilac', main: '#B692F6', accent: '#E1D0FF' },
  { id: 'sun', name: 'Sunny', main: '#FFC94A', accent: '#FFE9A8' },
  { id: 'mint', name: 'Mint', main: '#7ED6A7', accent: '#C6F0DB' },
  { id: 'coral', name: 'Coral', main: '#FF8A65', accent: '#FFC9B8' },
  { id: 'berry', name: 'Berry', main: '#C94C8A', accent: '#F2B1D2' },
];
export const LAMPS: Choice[] = [
  { id: 'dome', name: 'Dome lamp' },
  { id: 'star', name: 'Star lamp' },
  { id: 'cloud', name: 'Cloud lamp' },
  { id: 'tulip', name: 'Tulip lamp' },
];
export const PICTURES: Choice[] = [
  { id: 'sunset', name: 'Sunset' },
  { id: 'flowers', name: 'Flowers' },
  { id: 'stars', name: 'Starry sky' },
  { id: 'boat', name: 'Little boat' },
  { id: 'cat', name: 'Sleepy cat' },
];
export const RUGS: Choice[] = [
  { id: 'round', name: 'Round rug' },
  { id: 'star', name: 'Star rug' },
  { id: 'heart', name: 'Heart rug' },
];

export const wallColor = (id: string | undefined) => WALLS.find((w) => w.id === id) ?? WALLS[0];
export const bedding = (id: string | undefined) => BEDDINGS.find((b) => b.id === id) ?? BEDDINGS[0];

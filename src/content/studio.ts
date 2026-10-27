// Art Studio, Puzzle Shop and Fishing Dock content (game-systems §24 to §26): names and colors for ids in game/.
export const PAINT_HEX: Record<string, { name: string; hex: string }> = {
  rose: { name: 'Rose', hex: '#FF7BA9' },
  berry: { name: 'Berry', hex: '#C94C8A' },
  orange: { name: 'Orange', hex: '#FF9A5C' },
  sun: { name: 'Sunny', hex: '#FFD04A' },
  mint: { name: 'Mint', hex: '#7ED6A7' },
  sky: { name: 'Sky', hex: '#7CC4F5' },
  lilac: { name: 'Lilac', hex: '#B692F6' },
  cream: { name: 'Cream', hex: '#FFF1D8' },
  brown: { name: 'Brown', hex: '#B57D4E' },
};

export const PUZZLE_NAMES: Record<string, string> = { meadow: 'Sunny Meadow', harbour: 'Harbour', castle: 'Castle' };

export const FISH_NAMES: Record<string, string> = {
  minnow: 'Minnow',
  goldfish: 'Goldfish',
  clownfish: 'Clownfish',
  bluetang: 'Blue Tang',
  seahorse: 'Seahorse',
  pufferfish: 'Pufferfish',
  angelfish: 'Angelfish',
  jellyfish: 'Jellyfish',
  starfish: 'Starfish',
  whale: 'Little Whale',
};

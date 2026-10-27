// Glow Nails and Petal Posies content (game-systems §18, §19): names and colors for the ids in game/.
export const NAIL_POLISH: Record<string, { name: string; hex: string; shade: string }> = {
  rose: { name: 'Rose', hex: '#FF7BA9', shade: '#E0568A' },
  berry: { name: 'Berry', hex: '#C94C8A', shade: '#A33A70' },
  sky: { name: 'Sky', hex: '#5BB8F0', shade: '#3A95CF' },
  mint: { name: 'Mint', hex: '#5FD3A0', shade: '#3DB383' },
  sun: { name: 'Sunny', hex: '#FFC94A', shade: '#E0A92A' },
  lilac: { name: 'Lilac', hex: '#B692F6', shade: '#9370DB' },
};

export const FLOWER_NAMES: Record<string, { one: string; many: string }> = {
  rose: { one: 'rose', many: 'roses' },
  tulip: { one: 'tulip', many: 'tulips' },
  daisy: { one: 'daisy', many: 'daisies' },
  sunflower: { one: 'sunflower', many: 'sunflowers' },
  lilac: { one: 'lilac', many: 'lilacs' },
  lily: { one: 'lily', many: 'lilies' },
};

export const WRAP_COLORS: Record<string, { name: string; main: string; accent: string }> = {
  pink: { name: 'Pink', main: '#FF9EC4', accent: '#FFD1E3' },
  mint: { name: 'Mint', main: '#7ED6A7', accent: '#C6F0DB' },
  sky: { name: 'Sky', main: '#7CC4F5', accent: '#C5E5FB' },
  sun: { name: 'Sunny', main: '#FFD04A', accent: '#FFEBA6' },
};

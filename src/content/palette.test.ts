import { describe, expect, it } from 'vitest';
import { contrast, FASHION_SWATCHES, TEXT_PAIRS, TOKENS } from './palette';

describe('palette', () => {
  it.each(TEXT_PAIRS)('%s on %s meets WCAG AA (4.5:1)', (fg, bg) => {
    expect(contrast(TOKENS[fg], TOKENS[bg])).toBeGreaterThanOrEqual(4.5);
  });
  it('white on sea fails, which is why bright fills carry ink labels', () => {
    expect(contrast(TOKENS.white, TOKENS.sea)).toBeLessThan(4.5);
  });
  it('offers exactly 12 player swatches', () => {
    expect(FASHION_SWATCHES).toHaveLength(12);
  });
});

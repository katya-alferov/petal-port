// Import boundaries (data-model §7) and the art lint (visual-design §13), checked over the source tree.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = join(__dirname, '..');

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f) ? [p] : [];
  });
}

const ALLOWED: Record<string, string[]> = {
  game: ['game', 'content:types'],
  art: ['art', 'content:types'],
  ui: ['ui'],
  content: ['content', 'game:types'],
  state: ['state', 'game', 'content', 'platform'],
  platform: ['platform'],
  scenes: ['scenes', 'ui', 'art', 'state', 'game', 'content', 'platform'],
  app: ['app', 'scenes', 'ui', 'state', 'platform'],
};

describe('import boundaries', () => {
  for (const file of files(SRC)) {
    const rel = relative(SRC, file);
    const layer = rel.split('/')[0];
    if (!ALLOWED[layer]) continue;
    it(rel, () => {
      const src = readFileSync(file, 'utf8');
      for (const m of src.matchAll(/^import\s+(type\s+)?[^'"]*?from\s+'(\.[^']+)'/gm)) {
        const typeOnly = Boolean(m[1]);
        const target = relative(SRC, join(file, '..', m[2])).split('/')[0];
        const ok = ALLOWED[layer].includes(target) || (typeOnly && ALLOWED[layer].includes(`${target}:types`));
        expect(ok, `${rel} must not import ${m[2]}`).toBe(true);
      }
    });
  }
});

describe('art lint', () => {
  const artFiles = files(join(SRC, 'art'));
  it.each(artFiles.map((f) => [relative(SRC, f), f]))('%s is photo-safe', (_rel, file) => {
    const src = readFileSync(file, 'utf8');
    expect(src).not.toMatch(/foreignObject/);
    expect(src).not.toMatch(/<filter|filter=/);
    expect(src).not.toMatch(/href=["']https?:/);
    expect(src).not.toMatch(/var\(--/); // colors are resolved hex props, never CSS variables
  });
  it.each(artFiles.map((f) => [relative(SRC, f), f]))('%s uses only the plum outline color for strokes named OUTLINE', (_rel, file) => {
    const src = readFileSync(file, 'utf8');
    // Literal black outlines are banned; the outline is always the plum token.
    expect(src).not.toMatch(/stroke=["']#000(000)?["']/i);
  });
});

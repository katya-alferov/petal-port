// Test hooks for preview builds only (?seed=, ?fixture=, ?scene=). The production build compiles them out.
export const TEST_HOOKS_ENABLED = import.meta.env.VITE_TEST_HOOKS === '1';

export function testParam(name: 'seed' | 'fixture' | 'scene'): string | null {
  if (!TEST_HOOKS_ENABLED) return null;
  return new URLSearchParams(window.location.search).get(name);
}

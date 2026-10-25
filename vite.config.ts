import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import { defineConfig, type PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';
import pkg from './package.json' with { type: 'json' };

const MILESTONE = 'm0';

function sha(): string {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'local';
  }
}

// Modes:
//  - default: production build for GitHub Pages, with the PWA service worker.
//  - "preview": same as production plus test hooks (?seed=, ?fixture=, ?scene=) for automated checks.
//  - "artifact": a single self-contained HTML file for quick phone previews (no service worker).
export default defineConfig(({ mode }) => {
  const singleFile = mode === 'artifact';
  const plugins: PluginOption[] = [react()];
  if (singleFile) plugins.push(viteSingleFile());
  else
    plugins.push(
      VitePWA({
        registerType: 'prompt',
        injectRegister: false,
        includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
        manifest: {
          name: 'Petalport',
          short_name: 'Petalport',
          description: 'A pocket seaside town: dress up, decorate, cook and travel. Offline, no ads, no chat.',
          theme_color: '#3BB7C4',
          background_color: '#FFF7EC',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] },
      }),
    );
  return {
    base: process.env.VITE_BASE ?? './',
    plugins,
    define: {
      __APP_VERSION__: JSON.stringify(`v${pkg.version}-${MILESTONE}+${sha()}`),
    },
    build: singleFile ? { assetsInlineLimit: 100_000_000, cssCodeSplit: false } : {},
  };
});

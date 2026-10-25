// Build version label, e.g. v0.0.1-m0+3f2a1c9 (injected by vite.config.ts).
declare const __APP_VERSION__: string;

export const APP_VERSION: string = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'dev';

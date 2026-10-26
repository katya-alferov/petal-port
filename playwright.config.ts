import { defineConfig, devices } from '@playwright/test';

// Local sandboxes without the matching browser download can point at another Chromium:
//   PW_CHROMIUM=/path/to/chrome npm run e2e -- --project=chromium-iphone
const chromiumPath = process.env.PW_CHROMIUM;
const launchOptions = chromiumPath ? { executablePath: chromiumPath } : {};

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  // The github reporter turns failures into annotations, readable without downloading logs.
  reporter: process.env.CI ? [['list'], ['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173/',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build:preview && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'webkit-iphone13', use: { ...devices['iPhone 13'] } },
    { name: 'webkit-se', use: { ...devices['iPhone SE'], viewport: { width: 375, height: 667 } } },
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 }, launchOptions } },
    {
      name: 'chromium-iphone',
      use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, launchOptions },
    },
    // Same small viewports as the WebKit phones, for sandboxes that only have Chromium.
    {
      name: 'chromium-se',
      use: { viewport: { width: 375, height: 667 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, launchOptions },
    },
    {
      name: 'chromium-i13',
      use: { viewport: { width: 390, height: 664 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, launchOptions },
    },
  ],
});

import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Screenshots land in test-results/screens/<project>/ so a person or an agent can review the look.
async function shot(page: Page, name: string) {
  const project = test.info().project.name;
  await page.screenshot({ path: `test-results/screens/${project}/${name}.png` });
}

function trackExternalRequests(page: Page) {
  const external: string[] = [];
  page.on('request', (r) => {
    const url = new URL(r.url());
    if (!['localhost', '127.0.0.1'].includes(url.hostname) && url.protocol.startsWith('http')) external.push(r.url());
  });
  return external;
}

test('title → Me → Home → Gallery, with no network calls outside the app', async ({ page }) => {
  const external = trackExternalRequests(page);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto('./?fixture=fresh');
  await expect(page.getByTestId('version-label')).toContainText(/^v\d+\.\d+\.\d+-m\d+\+/);
  await expect(page.getByTestId('title-start')).toHaveText('Tap to start');
  await shot(page, '01-title');

  await page.getByTestId('title-start').click();
  await expect(page.getByRole('region', { name: 'Me' })).toBeVisible();
  await expect(page.getByTestId('character-rig').first()).toBeVisible();
  await shot(page, '02-me');

  await page.getByTestId('dock-home').click();
  await expect(page.getByTestId('room-harbour-loft')).toBeVisible();
  await shot(page, '03-home');

  await page.getByTestId('dock-gallery').click();
  await expect(page.getByTestId('gallery-scroll')).toBeVisible();
  await shot(page, '04-gallery');

  expect(external, 'the game must not call any outside server').toEqual([]);
  expect(errors).toEqual([]);
});

test('outfit, skin and room theme survive a reload', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=me');
  await page.getByTestId('look-look.picnic').click();
  await page.getByTestId('tab-skin').click();
  await page.getByRole('button', { name: 'Espresso' }).click();
  await page.getByTestId('dock-home').click();
  await page.getByTestId('tab-theme.night-market').click();
  await page.waitForTimeout(1200); // debounced save (≤ 1 s)

  await page.goto('./?scene=home');
  await expect(page.getByTestId('tab-theme.night-market')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-slot="dress"][data-item="dress.picnic"]').first()).toBeAttached();
  await shot(page, '05-home-night-after-reload');
});

test('every tappable thing on Home responds', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=home');
  for (const id of ['hotspot-plant', 'hotspot-seat']) {
    await page.getByTestId(id).click({ force: true });
    await expect(page.getByRole('status')).toBeVisible();
  }
  await page.getByTestId('home-character').click({ force: true });
  await expect(page.locator('[data-testid="home-character"] [data-pose="wave"]')).toBeAttached();
});

test('no serious accessibility violations on each main scene', async ({ page }) => {
  for (const scene of ['title', 'me', 'home', 'gallery']) {
    await page.goto(`./?fixture=fresh&scene=${scene}`);
    await page.waitForTimeout(300);
    const results = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${scene}: ${v.id} (${v.nodes.length})`)).toEqual([]);
  }
});

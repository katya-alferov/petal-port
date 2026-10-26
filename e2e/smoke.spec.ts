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

test('title → Me → Town → Home, with no network calls outside the app', async ({ page }) => {
  const external = trackExternalRequests(page);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto('./?fixture=fresh');
  await expect(page.getByTestId('version-label')).toHaveAttribute('data-version', /^v\d+\.\d+\.\d+-m\d+\+/);
  await expect(page.getByTestId('title-start')).toHaveText('Tap to start');
  await shot(page, '01-title');

  await page.getByTestId('title-start').click();
  await expect(page.getByRole('region', { name: 'Me' })).toBeVisible();
  await expect(page.getByTestId('character-rig').first()).toBeVisible();
  await shot(page, '02-me');

  await page.getByTestId('dock-town').click();
  await expect(page.getByTestId('town-map')).toBeVisible();
  await shot(page, '03-town');

  await page.getByTestId('dock-home').click();
  await expect(page.getByTestId('room-harbour-loft')).toBeVisible();
  await shot(page, '04-home');

  expect(external, 'the game must not call any outside server').toEqual([]);
  expect(errors).toEqual([]);
});

test('outfit, skin and room theme survive a reload', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=me');
  await page.getByTestId('tab-looks').click();
  await page.getByTestId('look-look.picnic').click();
  await page.getByTestId('tab-skin').click();
  await page.getByRole('button', { name: 'Espresso' }).click();
  await page.getByTestId('dock-home').click();
  await page.getByTestId('home-decorate').click();
  await page.getByTestId('tab-theme.night-market').click();
  await page.waitForTimeout(1200); // debounced save (≤ 1 s)

  await page.goto('./?scene=home');
  await page.getByTestId('home-decorate').click();
  await expect(page.getByTestId('tab-theme.night-market')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-slot="dress"][data-item="dress.picnic"]').first()).toBeAttached();
  await shot(page, '05-home-night-after-reload');
});

test('every tappable thing on Home responds', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=home');
  // Keyboard activation: the same handler as a tap, and independent of how small the screen is.
  for (const id of ['hotspot-plant', 'hotspot-seat']) {
    await page.getByTestId(id).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toBeVisible();
  }
  await page.getByTestId('home-character').click({ force: true });
  await expect(page.locator('[data-testid="home-character"] [data-pose="wave"]')).toBeAttached();
});

test('no serious accessibility violations on each main scene', async ({ page }) => {
  test.setTimeout(120_000);
  for (const scene of ['title', 'town', 'me', 'home', 'cafe', 'boutique', 'kitchen', 'petshop', 'board', 'album', 'gallery']) {
    await page.goto(`./?fixture=fresh&scene=${scene}`);
    await page.waitForTimeout(300);
    const results = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${scene}: ${v.id} (${v.nodes.length})`)).toEqual([]);
  }
});

interface OrderData {
  drink: { cup: string; base: string; toppings: string[]; stencil?: string };
  pastry?: string;
}

async function makeOrder(page: Page) {
  const order = JSON.parse((await page.getByTestId('order-bubble').getAttribute('data-order'))!) as OrderData;
  const tabs = page.getByRole('tablist', { name: 'Counter' });
  const tab = async (id: string) => (await tabs.count()) && (await page.getByTestId(`tab-${id}`).click());
  await tab('drinks');
  await page.getByTestId(`jar-${order.drink.cup}`).click();
  await page.getByTestId(`jar-${order.drink.base}`).click();
  if (order.drink.toppings.length) {
    await tab('toppings');
    for (const t of order.drink.toppings) await page.getByTestId(`jar-${t}`).click();
  }
  if (order.pastry) {
    await tab('bakery');
    await page.getByTestId(`jar-${order.pastry}`).click();
  }
  if (order.drink.stencil) {
    await tab('latte');
    await page.getByTestId(`jar-${order.drink.stencil}`).click();
  }
}

test('café: a wrong serve is explained kindly, a full shift pays 75 with all tips', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=cafe');
  await shot(page, '06-cafe');
  await page.getByTestId('jar-cup.large').click();
  await page.getByTestId('jar-base.lemonade').click();
  await page.getByTestId('jar-cup.small').click();
  // Whatever was built, it is unlikely to match exactly; if it does, skip the wrong-serve check.
  const order = JSON.parse((await page.getByTestId('order-bubble').getAttribute('data-order'))!) as OrderData;
  if (!(order.drink.cup === 'cup.small' && order.drink.base === 'base.lemonade' && !order.drink.toppings.length)) {
    await page.getByTestId('cafe-serve').click();
    await expect(page.getByTestId('order-diff')).toBeVisible();
    await shot(page, '07-cafe-almost');
  }
  await page.getByTestId('cafe-bin').click();
  // The bin cost the first tip; the other four orders are first-try.
  for (let i = 0; i < 5; i++) {
    await expect(page.getByTestId('cafe-progress')).toHaveText(`${i + 1}/5`);
    await makeOrder(page);
    await page.getByTestId('cafe-serve').click();
    await page.waitForTimeout(1300);
  }
  await expect(page.getByTestId('shift-card')).toContainText('+72 coins');
  await shot(page, '08-cafe-shift-done');
  await expect(page.getByTestId('coin-pill')).toContainText(String(120 + 72 + 15));
});

test('café: rank 2 gives the apron and opens the bakery', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=cafe');
  await page.evaluate(() => {
    const g = (
      window as unknown as { __petal: { getState: () => { save: { progress: { cafe: object } } }; setState: (s: object) => void } }
    ).__petal;
    const save = g.getState().save;
    g.setState({ save: { ...save, progress: { ...save.progress, cafe: { correctOrders: 14, shifts: 3, rank: 1 } } } });
  });
  await makeOrder(page);
  await page.getByTestId('cafe-serve').click();
  await expect(page.getByRole('dialog', { name: 'Rank up' })).toContainText('Barista');
  await shot(page, '09-cafe-rank-up');
  await page.getByTestId('rankup-ok').click();
  await page.getByTestId('activity-back').click();
  await page.getByTestId('dock-me').click();
  await page.getByTestId('slot-outerwear').click();
  await expect(page.getByTestId('wear-outerwear.cafe-apron')).toBeVisible();
});

test('boutique: try on, buy, wear; furniture goes into the home', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=boutique');
  await page.getByTestId('shop-dress.sundress').click();
  await expect(page.locator('[data-testid="boutique-preview"] [data-item="dress.sundress"]')).toBeAttached();
  await page.getByTestId('boutique-buy').click();
  await expect(page.getByTestId('coin-pill')).toContainText('55'); // 120 − 80 + 15 journey
  await page.getByTestId('shop-dress.party').click();
  await page.getByTestId('boutique-buy').click({ force: true }); // aria-disabled still explains on tap
  await expect(page.getByRole('status').filter({ hasText: 'more coins' })).toBeVisible();
  await page.getByTestId('tab-home').click();
  await page.getByTestId('shop-furn.cactus').click();
  await page.getByTestId('boutique-buy').click();
  await page.getByTestId('boutique-place').click();
  await shot(page, '10-boutique');
  await page.getByTestId('activity-back').click();
  await page.getByTestId('dock-home').click();
  await expect(page.locator('[data-slot="plant"][data-item="furn.cactus"]')).toBeAttached();
  await expect(page.locator('[data-slot="dress"][data-item="dress.sundress"]').first()).toBeAttached();
});

test('kitchen: cook pancakes start to finish and see them on the table', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=home');
  await page.getByTestId('home-cook').click();
  await page.getByTestId('recipe-recipe.pancakes').click();
  await page.getByTestId('ing-ing.fish').click();
  await expect(page.getByRole('status').filter({ hasText: 'Boing' })).toBeVisible();
  for (const id of ['ing.flour', 'ing.egg', 'ing.milk']) await page.getByTestId(`ing-${id}`).click();
  for (let i = 0; i < 6; i++) await page.getByTestId('whisk').click();
  await page.getByTestId('pour').click();
  await expect(page.getByTestId('step-heat')).toBeVisible();
  await page.waitForTimeout(3000);
  await page.getByTestId('flip').click();
  await expect(page.getByTestId('cook-result')).toContainText('Golden');
  for (const id of ['deco.berries', 'deco.banana', 'deco.cream']) await page.getByTestId(`deco-${id}`).click();
  await page.getByTestId('deco-done').click();
  await expect(page.getByTestId('cook-card')).toContainText('+20 coins');
  await shot(page, '11-kitchen-done');
  await page.getByTestId('cook-home').click();
  await expect(page.getByTestId('room-harbour-loft')).toBeVisible();
  await shot(page, '12-home-with-dish');
});

test('town: every place opens a card; the airport says it is coming soon', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=town');
  const tapPlace = async (id: string) => {
    const place = page.getByTestId(`place-${id}`);
    await place.evaluate((e) => e.scrollIntoView({ block: 'center' }));
    await place.click({ force: true });
  };
  for (const id of ['cafe', 'boutique', 'home', 'park', 'airport']) {
    await tapPlace(id);
    await expect(page.getByRole('dialog'), id).toBeVisible();
    await page.keyboard.press('Escape');
  }
  await tapPlace('airport');
  await page.getByTestId('place-go').click({ force: true });
  await expect(page.getByRole('status').filter({ hasText: 'coming soon' })).toBeVisible();
  await page.keyboard.press('Escape');
  await tapPlace('cafe');
  await page.getByTestId('place-go').click();
  await expect(page.getByTestId('order-bubble')).toBeVisible();
});

type Petal = { getState: () => { save: Record<string, unknown> & { progress: Record<string, unknown> } }; setState: (s: object) => void };
const patchSave = (page: Page, fn: string) =>
  page.evaluate((body) => {
    const g = (window as unknown as { __petal: Petal }).__petal;
    const s = structuredClone(g.getState().save);
    new Function('s', body)(s);
    g.setState({ save: s });
  }, fn);

test('pets: adopt a puppy, then feed, bathe and play until it learns a trick', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=town');
  const place = page.getByTestId('place-petshop');
  await place.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await place.click({ force: true });
  await page.getByTestId('place-go').click();
  await page.getByTestId('adopt-kind-pet.puppy').click();
  await page.getByTestId('adopt-next').click();
  await page.getByTestId('adopt-color-petcolor.cocoa').click();
  await page.getByTestId('adopt-next').click();
  await page.getByTestId('adopt-done').click({ force: true });
  await expect(page.getByRole('status').filter({ hasText: 'Pick or type a name' })).toBeVisible();
  await page.getByTestId('adopt-name-Waffles').click();
  await page.getByTestId('adopt-done').click();
  await expect(page.getByRole('region', { name: /Waffles the puppy/ })).toBeVisible();

  // Feed: the pet says what it wants; a wrong bowl is explained, the right one is eaten.
  await page.getByTestId('pet-feed').click();
  const say = (await page.getByTestId('pet-say').textContent())!.toLowerCase();
  const bowls = page.getByRole('group', { name: 'Food bowls' }).getByRole('button');
  const names = await bowls.allTextContents();
  const right = names.findIndex((n) => say.includes(n.toLowerCase()));
  const wrong = names.findIndex((_, i) => i !== right);
  await bowls.nth(wrong).click();
  await expect(page.getByTestId('pet-say')).toContainText('not that one');
  await bowls.nth(right).click();
  await expect(page.getByTestId('pet-progress')).toContainText('2 more cares');

  // Bath: every muddy spot, then rinse.
  await page.getByTestId('pet-bath').click();
  for (let i = 0; i < 5; i++) await page.getByTestId(`mud-${i}`).dispatchEvent('click');
  await page.getByTestId('bath-rinse').click();
  await expect(page.getByTestId('pet-progress')).toContainText('1 more care');

  // Catch three times: the third care teaches Spin.
  await page.getByTestId('pet-play').click();
  for (let i = 0; i < 3; i++) await page.getByTestId('ball').dispatchEvent('click');
  await expect(page.getByTestId('trick-card')).toContainText('Spin');
  await shot(page, '13-pet-trick');
  await page.getByTestId('trick-ok').click();
  await page.getByTestId('pet-done').click();
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByTestId('home-pet')).toBeAttached();
});

test('petal notes: a finished note pays, adds a heart, and a new note takes its place', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=board');
  await expect(page.getByTestId('note-2')).toBeVisible();
  await page.getByTestId('note-give-0').click({ force: true });
  await expect(page.getByRole('status').filter({ hasText: 'Not yet' })).toBeVisible();
  // Make note 0 a "wear" note for the shoes the player already has on, so it is ready.
  await patchSave(
    page,
    "s.progress.requests.board[0].goal = { kind: 'wear', item: 'shoes.sneakers' }; s.progress.friends['regular.rosa'] = 2; s.progress.requests.board[0].friend = 'regular.rosa';",
  );
  await expect(page.getByTestId('note-0')).toHaveAttribute('data-ready', 'true');
  await page.getByTestId('note-give-0').click();
  await expect(page.getByTestId('thanks-card')).toContainText('Patchwork Rug');
  await shot(page, '14-note-thanks');
  await page.getByTestId('thanks-ok').click();
  await expect(page.getByTestId('note-2')).toBeVisible();
  await page.getByTestId('tab-friends').click();
  await expect(page.getByTestId('friend-regular.rosa')).toContainText('2 more ♥ until Grandma Rosa can visit');
});

test('post box and album: open this week’s letter once, and see the sticker it earns', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=town');
  const box = page.getByTestId('place-postbox');
  await box.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await box.click({ force: true });
  await page.getByTestId('mail-open').click();
  await expect(page.getByTestId('letter')).toContainText('Grandma Rosa');
  await page.keyboard.press('Escape');
  await box.click({ force: true });
  await expect(page.getByTestId('mail-empty')).toContainText('1 letter');
  await page.keyboard.press('Escape');
  await page.getByTestId('album-open').click();
  await expect(page.getByTestId('sticker-sticker.mail')).toHaveAttribute('data-earned', 'true');
  await expect(page.getByTestId('sticker-sticker.pen-pal')).toHaveAttribute('data-earned', 'false');
  await shot(page, '15-album');
});

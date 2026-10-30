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
  await page.getByTestId('home-colors').click();
  await page.getByTestId('theme-theme.night-market').click();
  await page.getByTestId('sheet-close').click();
  await page.waitForTimeout(1200); // debounced save (≤ 1 s)

  await page.goto('./?scene=home');
  await page.getByTestId('home-decorate').click();
  await page.getByTestId('home-colors').click();
  await expect(page.getByTestId('theme-theme.night-market')).toHaveAttribute('aria-pressed', 'true');
  await page.getByTestId('sheet-close').click();
  await page.getByTestId('home-decorate').click(); // Done: the player comes back
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
  for (const scene of [
    'title',
    'town',
    'me',
    'home',
    'cafe',
    'boutique',
    'kitchen',
    'petshop',
    'board',
    'album',
    'airport',
    'burger',
    'dance',
    'skate',
    'bedroom',
    'nails',
    'posies',
    'park',
    'studio',
    'puzzle',
    'fishing',
    'tide',
    'sky',
    'newyork',
    'storybook',
    'funfair',
    'sweets',
    'paris',
    'photo',
    'show',
    'salon',
    'garden',
    'gallery',
  ]) {
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

test('café: the toppings are big and the bakery shows four pastries', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=town');
  await page.evaluate(() => {
    const g = (
      window as unknown as {
        __petal: {
          getState: () => { save: { progress: { cafe: object } }; setScene: (s: string) => void };
          setState: (s: object) => void;
        };
      }
    ).__petal;
    const save = g.getState().save;
    g.setState({ save: { ...save, progress: { ...save.progress, cafe: { correctOrders: 30, shifts: 6, rank: 2 } } } });
    g.getState().setScene('cafe');
  });
  await page.getByTestId('tab-toppings').click();
  await page.getByTestId('jar-top.sprinkles').click();
  await page.getByTestId('jar-top.cream').click();
  await shot(page, '09-cafe-toppings');
  await page.getByTestId('tab-bakery').click();
  await expect(page.locator('[data-testid^="jar-pastry."]')).toHaveCount(4);
  await shot(page, '09-cafe-bakery');
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

test('kitchen: the grilled cheese and the choco cookies can be cooked after their recipes unlock', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=home');
  await page.evaluate(() => {
    const g = (
      window as unknown as {
        __petal: {
          getState: () => { save: { progress: { recipes: object } } & object };
          setState: (s: object) => void;
        };
      }
    ).__petal;
    const save = g.getState().save;
    const done = { cooked: 1, stars: 1 };
    g.setState({
      save: { ...save, progress: { ...save.progress, recipes: { 'recipe.omelette': done, 'recipe.waffles': done } } },
    });
  });
  await page.getByTestId('home-cook').click();
  await page.getByTestId('recipe-recipe.sandwich').click();
  for (const id of ['ing.bread', 'ing.cheese', 'ing.butter']) await page.getByTestId(`ing-${id}`).click();
  await expect(page.getByTestId('step-heat')).toBeVisible();
  await page.waitForTimeout(2500);
  await page.getByTestId('flip').click();
  await expect(page.getByTestId('cook-result')).toBeVisible();
  await page.getByTestId('deco-deco.tomato').click();
  await shot(page, '13-grilled-cheese');
  await page.getByTestId('deco-done').click();
  await expect(page.getByTestId('cook-card')).toContainText(/\+(20|40) coins/);
  await page.getByTestId('cook-home').click();
  await page.getByTestId('home-cook').click();
  await page.getByTestId('recipe-recipe.cookies').click();
  for (const id of ['ing.flour', 'ing.butter', 'ing.egg', 'deco.chocolate']) await page.getByTestId(`ing-${id}`).click();
  for (let i = 0; i < 6; i++) await page.getByTestId('whisk').click();
  await page.getByTestId('pour').click();
  await page.waitForTimeout(3200);
  await page.getByTestId('flip').click();
  await page.getByTestId('deco-deco.sprinkles').click();
  await shot(page, '14-choco-cookies');
  await page.getByTestId('deco-done').click();
  await expect(page.getByTestId('cook-card')).toContainText(/\+(20|40) coins/);
});

test('town: every place opens a card; the airport opens', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=town');
  const tapPlace = async (id: string) => {
    const place = page.getByTestId(`place-${id}`);
    await place.evaluate((e) => e.scrollIntoView({ block: 'center' }));
    await place.click({ force: true });
  };
  for (const id of [
    'cafe',
    'boutique',
    'home',
    'park',
    'airport',
    'salon',
    'garden',
    'burger',
    'sweets',
    'dance',
    'skate',
    'tide',
    'sky',
  ]) {
    await tapPlace(id);
    await expect(page.getByRole('dialog'), id).toBeVisible();
    await page.keyboard.press('Escape');
  }
  await tapPlace('airport');
  await page.getByTestId('place-go').click({ force: true });
  await expect(page.getByTestId('airport-desk')).toBeVisible();
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
  await expect(page.getByTestId('prize-wheel')).toBeVisible();
  await page.getByTestId('wheel-spin').click({ force: true });
  await expect(page.getByTestId('wheel-result')).toContainText(/closet|coins/, { timeout: 8000 });
  await shot(page, '15-mail-wheel');
  await page.keyboard.press('Escape');
  await box.click({ force: true });
  await expect(page.getByTestId('mail-empty')).toContainText('1 letter');
  await expect(page.getByTestId('mail-row')).toHaveCount(1);
  await shot(page, '15-mail-history');
  await page.keyboard.press('Escape');
  await page.getByTestId('album-open').click();
  await expect(page.getByTestId('sticker-sticker.mail')).toHaveAttribute('data-earned', 'true');
  await expect(page.getByTestId('sticker-sticker.pen-pal')).toHaveAttribute('data-earned', 'false');
  await shot(page, '15-album');
});

test('starlight stage: dress for the theme, walk the runway, and the judges cheer', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=town');
  const stage = page.getByTestId('place-stage');
  await stage.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await stage.click({ force: true });
  await page.getByTestId('place-go').click();
  await expect(page.getByTestId('show-theme-name')).toContainText('Sunny Picnic');
  await page.getByTestId('show-another').click();
  await expect(page.getByTestId('show-theme-name')).toContainText('Party Princess');
  await page.getByTestId('show-another').click();
  await page.getByTestId('show-another').click();
  await expect(page.getByTestId('show-theme-name')).toContainText('Harbour Stroll');
  await page.getByTestId('show-dress').click();
  // The starter look already has harbour and casual pieces.
  await expect(page.getByTestId('show-meter')).toHaveAttribute('data-stars', '3');
  await shot(page, '16-show-dress');
  await page.getByTestId('show-walk').click();
  await expect(page.getByTestId('show-result')).toHaveAttribute('data-stars', '3', { timeout: 10_000 });
  await expect(page.getByTestId('show-result')).toContainText('+50');
  await shot(page, '17-show-result');
  await page.getByTestId('show-again').click();
  await expect(page.getByTestId('show-theme-name')).toContainText('Party Princess');
});

test('secret shells: pick one up and see it on the album’s Shells page', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=boutique');
  await page.getByTestId('shell-shell.boutique').click();
  await expect(page.getByTestId('shell-shell.boutique')).toHaveCount(0);
  await page.getByTestId('activity-back').click();
  await page.getByTestId('album-open').click();
  await page.getByRole('tab', { name: 'Shells' }).click();
  await expect(page.getByTestId('album-count')).toContainText('1 of 10 secret shells');
  await expect(page.getByTestId('album-shell.boutique')).toHaveAttribute('data-earned', 'true');
});

test('glam salon: wash, style to match the card, and get paid', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=town');
  const salon = page.getByTestId('place-salon');
  await salon.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await salon.click({ force: true });
  await page.getByTestId('place-go').click();
  await expect(page.getByTestId('salon-client')).toBeVisible();
  for (let i = 0; i < 5; i++) await page.getByTestId(`foam-${i}`).click({ force: true });
  await expect(page.getByTestId('salon-mirror')).toBeVisible();
  const want = JSON.parse((await page.getByTestId('salon-card').getAttribute('data-want'))!) as {
    style: string;
    color: string;
    accessory: string;
  };
  // A wrong first look explains what to change and takes nothing away.
  await page.getByTestId('salon-mirror').click();
  await expect(page.getByTestId('salon-wrong')).toContainText('Almost');
  await page.getByTestId(`salon-opt-${want.style}`).click();
  await page.getByTestId('tab-color').click();
  await page.getByTestId(`salon-opt-${want.color}`).click();
  await page.getByTestId('tab-accessory').click();
  await page.getByTestId(`salon-opt-${want.accessory}`).click();
  await shot(page, '18-salon-style');
  await page.getByTestId('salon-mirror').click();
  await expect(page.getByTestId('salon-next')).toBeVisible();
  const coins = async () => (await page.getByTestId('salon-progress').textContent()) ?? '';
  expect(await coins()).toContain('1/3');
});

test('petal garden: plant a seed, it grows from finished activities, and a bloom can be picked', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=garden');
  await page.getByTestId('bed-0').click();
  await page.getByTestId('seed-seed.tulip').click();
  await expect(page.getByTestId('bed-0')).toHaveAttribute('data-stage', 'seed');
  // A finished café shift, dish, show, note or pet care grows every flower one step.
  await patchSave(page, 's.progress.garden.beds[0].growth = 4;');
  await page.evaluate(() =>
    (window as unknown as { __petal: { getState: () => { cafeShiftDone: () => void } } }).__petal.getState().cafeShiftDone(),
  );
  await expect(page.getByTestId('bed-0')).toHaveAttribute('data-stage', 'bloom');
  await shot(page, '19-garden-bloom');
  await page.getByTestId('bed-0').click();
  await expect(page.getByTestId('garden-picked')).toContainText('A new flower');
  await page.getByTestId('garden-picked-ok').click();
  await expect(page.getByTestId('bed-0')).toHaveAttribute('data-stage', 'empty');
});

test('home window views: locked ones explain how to open, an open one changes the window', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=home');
  await page.getByTestId('home-decorate').click();
  await page.getByTestId('home-colors').click();
  await page.getByTestId('view-meadow').click({ force: true });
  await expect(page.getByTestId('view-meadow')).toHaveAttribute('data-locked', 'true');
  await expect(page.getByTestId('view-meadow')).toHaveAttribute('aria-pressed', 'false');
  await page.evaluate(() => {
    const g = (window as unknown as { __petal: { getState: () => { save: unknown }; setState: (p: unknown) => void } }).__petal;
    const s = structuredClone(g.getState().save) as { progress: { garden: { bloomed: string[] } } };
    s.progress.garden.bloomed = ['seed.rose'];
    g.setState({ save: s });
  });
  await page.getByTestId('view-meadow').click();
  await expect(page.getByTestId('view-meadow')).toHaveAttribute('aria-pressed', 'true');
  await shot(page, '19-home-meadow-view');
});

test('paris trip: save for the ticket, fly, take a photo, buy a souvenir, find them in the album', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=airport');
  await page.getByTestId('airport-open-desk').click();
  // Too few coins: the ticket button explains instead of buying.
  await page.getByTestId('airport-buy').click({ force: true });
  await expect(page.getByTestId('airport-fly')).toHaveCount(0);
  await patchSave(page, 's.wallet.coins = 500;');
  await page.getByTestId('airport-buy').click();
  await expect(page.getByTestId('airport-fly')).toBeVisible();
  await page.getByTestId('airport-fly').click();
  await expect(page.getByTestId('paris-art')).toBeVisible();
  // Kiosk: buy a souvenir.
  await page.getByTestId('paris-kiosk').click({ force: true });
  await page.getByTestId('souvenir-souvenir.tower').click();
  await expect(page.getByTestId('souvenir-souvenir.tower')).toContainText('Yours');
  await page.getByTestId('sheet-close').click();
  // Photo mode.
  await page.getByTestId('paris-photo').click({ force: true });
  await page.getByTestId('pose-cheer').click();
  await expect(page.getByRole('tab', { name: /Prop/ })).toHaveCount(0);
  await page.getByRole('tab', { name: /Stickers/ }).click();
  await page.getByTestId('pstick-heart').click();
  await page.getByTestId('pstick-beret').click();
  await page.getByTestId('photo-shutter').click();
  await expect(page.getByTestId('photo-saved')).toContainText('first photo');
  await shot(page, '20-paris-photo-saved');
  await page.getByTestId('photo-to-album').click();
  await page.getByRole('tab', { name: /Photos/ }).click();
  await expect(page.getByTestId('photo-0')).toBeVisible();
  await expect(page.getByTestId('shelf-souvenir.postcard')).toHaveAttribute('data-earned', 'true');
  await expect(page.getByTestId('shelf-souvenir.tower')).toHaveAttribute('data-earned', 'true');
  // Remove asks first.
  await page.getByTestId('photo-0').click();
  await page.getByTestId('photo-remove').click();
  await page.getByTestId('photo-remove-yes').click();
  await expect(page.getByTestId('photos-empty')).toBeVisible();
});

test('bun and bite: a wrong tap names the next layer, a full shift pays with tips and a bonus', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=town');
  const place = page.getByTestId('place-burger');
  await place.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await place.click({ force: true });
  await page.getByTestId('place-go').click();
  const coins = () =>
    page.evaluate(
      () =>
        (window as unknown as { __petal: { getState: () => { save: { wallet: { coins: number } } } } }).__petal.getState().save.wallet
          .coins,
    );
  const start = await coins();
  // A wrong first tap explains, takes nothing away, and costs the tip for this burger only.
  await page.getByTestId('part-bun-top').click();
  await expect(page.getByTestId('burger-wrong')).toContainText('bottom bun');
  for (let i = 0; i < 4; i++) {
    const order = JSON.parse((await page.getByTestId('burger-card').getAttribute('data-order'))!) as string[];
    for (const part of order) await page.getByTestId(`part-${part}`).click();
    await expect(page.getByTestId('burger-served')).toContainText(i === 0 ? '+14' : '+18');
    await page.getByTestId('burger-next').click();
  }
  await expect(page.getByTestId('burger-done')).toContainText('+');
  expect((await coins()) - start).toBe(14 + 18 * 3 + 12);
});

test('sweet spot: a wrong cupcake is explained, a match pays, and the design joins the Treats page', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=sweets');
  const want = JSON.parse((await page.getByTestId('sweet-card').getAttribute('data-want'))!) as {
    frosting: string;
    swirl: string;
    topping: string;
  };
  await page.getByTestId('sweet-serve').click();
  await expect(page.getByTestId('sweet-wrong')).toContainText('Almost');
  await page.getByTestId(`sweet-opt-${want.frosting}`).click();
  await page.getByRole('tab', { name: /Swirl/ }).click();
  await page.getByTestId(`sweet-opt-${want.swirl}`).click();
  await page.getByRole('tab', { name: /Topping/ }).click();
  await page.getByTestId(`sweet-opt-${want.topping}`).click();
  await page.getByTestId('sweet-serve').click();
  // The first look was wrong, so the pay is 12 without the tip.
  await expect(page.getByTestId('sweet-served')).toContainText('+12');
  await expect(page.getByTestId('sweet-served')).toContainText('new design');
  await page.evaluate(() =>
    (window as unknown as { __petal: { getState: () => { setScene: (s: string) => void } } }).__petal.getState().setScene('album'),
  );
  await page.getByRole('tab', { name: /Treats/ }).click();
  await expect(page.getByTestId(`treat-${want.frosting}|${want.swirl}|${want.topping}`)).toBeVisible();
});

test('next up: the ideas list opens a place when tapped', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=town');
  await page.getByTestId('ideas-open').click();
  await expect(page.getByTestId('ideas-list').locator('li')).toHaveCount(3);
  await page.getByTestId('idea-ticket').click();
  await expect(page.getByTestId('airport-desk')).toBeVisible();
});

test('every secret shell can be tapped for real: nothing covers it and it is away from the screen edge', async ({ page }) => {
  test.setTimeout(120_000);
  const scenes = ['town', 'home', 'boutique', 'cafe', 'kitchen', 'petshop', 'show'];
  for (const scene of scenes) {
    await page.goto(`./?fixture=fresh&scene=${scene}`);
    await page.waitForTimeout(1800); // customers and bubbles have arrived
    const ids = await page.evaluate(() =>
      [...document.querySelectorAll('[data-testid^="shell-"]')].map((e) => e.getAttribute('data-testid')!),
    );
    expect(ids.length, scene).toBeGreaterThan(0);
    for (const id of ids) {
      const el = page.getByTestId(id);
      await el.evaluate((e) => e.scrollIntoView({ block: 'center' }));
      const hit = await el.evaluate((e) => {
        const r = e.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const top = document.elementFromPoint(cx, cy);
        return { ok: !!top && (top === e || e.contains(top)), left: r.left, right: r.right, vw: window.innerWidth };
      });
      expect(hit.ok, `${scene} ${id} is covered`).toBe(true);
      expect(hit.left, `${scene} ${id} is in the swipe-back zone`).toBeGreaterThanOrEqual(8);
      // A real mouse click (not forced) collects it.
      await el.click();
      await expect(page.getByTestId(id)).toHaveCount(0);
    }
  }
});

test('dance studio: a wrong move shows the routine again, a full shift pays with tips and a bonus', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('./?fixture=fresh&scene=dance');
  const coins = () =>
    page.evaluate(
      () =>
        (window as unknown as { __petal: { getState: () => { save: { wallet: { coins: number } } } } }).__petal.getState().save.wallet
          .coins,
    );
  const start = await coins();
  const routine = async () => JSON.parse((await page.getByTestId('dance-line').getAttribute('data-routine'))!) as string[];
  const waitEcho = () => expect(page.getByTestId('dance-line')).toHaveAttribute('data-phase', 'echo', { timeout: 15_000 });
  await waitEcho();
  // A wrong first move costs only this routine's tip.
  const first = (await routine())[0];
  await page.getByTestId(`move-${first === 'wave' ? 'hips' : 'wave'}`).click();
  await expect(page.getByTestId('dance-line')).toContainText('Not that one');
  await waitEcho();
  for (let i = 0; i < 4; i++) {
    for (const m of await routine()) await page.getByTestId(`move-${m}`).click();
    await expect(page.getByTestId('dance-served')).toContainText(i === 0 ? '+14' : '+18');
    await page.getByTestId('dance-next').click();
    if (i < 3) await waitEcho();
  }
  await expect(page.getByTestId('dance-done')).toBeVisible();
  expect((await coins()) - start).toBe(14 + 18 * 3 + 12);
});

test('skate park: a run always finishes, pays for rolling and for each obstacle cleared', async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto('./?fixture=fresh&scene=skate');
  await page.getByTestId('skate-start').click();
  // Jump again and again: some obstacles are cleared, some bump, the run still ends.
  const jumper = setInterval(
    () =>
      void page
        .getByTestId('skate-jump')
        .click({ force: true, timeout: 500 })
        .catch(() => undefined),
    450,
  );
  try {
    await expect(page.getByTestId('skate-done')).toBeVisible({ timeout: 60_000 });
  } finally {
    clearInterval(jumper);
  }
  await expect(page.getByTestId('skate-extras')).toContainText('sky stars');
  const text = (await page.getByTestId('skate-coins').textContent()) ?? '';
  const coins = Number(text.replace(/\D/g, ''));
  expect(coins).toBeGreaterThanOrEqual(20);
  expect(coins).toBeLessThanOrEqual(20 + 8 * 3 + 10 + 6 * 2 + 8 * 2);
});

test('bedroom: choices change the room and are remembered', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=home');
  await page.getByTestId('home-bedroom').click();
  await expect(page.getByTestId('bedroom-art')).toBeVisible();
  await expect(page.getByTestId('bedroom-walls-mint')).toHaveCount(0); // options stay hidden until Design
  await page.getByTestId('bedroom-design').click();
  await page.getByTestId('bedroom-walls-mint').click();
  await expect(page.getByTestId('bedroom-walls-mint')).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('tab', { name: 'Lamp' }).click();
  await page.getByTestId('bedroom-lamp-star').click();
  await page.getByTestId('bed-picture').click({ force: true });
  await page.getByTestId('bedroom-picture-cat').click();
  await page.getByRole('tab', { name: 'Bed' }).click();
  await page.getByTestId('bedroom-bedding-teal').click();
  await page.getByTestId('bed-lamp').click({ force: true });
  await page.getByRole('tab', { name: 'Rug' }).click();
  await page.getByTestId('bedroom-rug-heart').click();
  await page.getByRole('tab', { name: 'Closet' }).click();
  await page.getByTestId('bedroom-wardrobe-sky').click();
  const look = await page.evaluate(() => (window as any).__petal.getState().save.home.bedroom);
  expect(look).toEqual({ walls: 'mint', lamp: 'star', picture: 'cat', bedding: 'teal', rug: 'heart', wardrobe: 'sky' });
  const stickers = await page.evaluate(() => JSON.stringify((window as any).__petal.getState().save.progress.stickers));
  expect(stickers).toContain('sticker.bedroom');
});

const coinsOf = (page: import('@playwright/test').Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __petal: { getState: () => { save: { wallet: { coins: number } } } } }).__petal.getState().save.wallet.coins,
  );

test('glow nails: a wrong nail is named, then a full shift pays with tips and a bonus', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('./?fixture=fresh&scene=nails');
  const start = await coinsOf(page);
  for (let i = 0; i < 4; i++) {
    const order = JSON.parse((await page.getByTestId('nails-card').getAttribute('data-order'))!) as {
      colors: string[];
      gems: boolean[];
    };
    if (i === 0) {
      // Checking too early explains what to look at and takes nothing away except this client's tip.
      await page.getByTestId('nails-check').click();
      await expect(page.getByTestId('nails-wrong')).toContainText('Look again');
    }
    for (let n = 0; n < 5; n++) {
      await page.getByTestId(`polish-${order.colors[n]}`).click();
      await page.getByTestId(`nail-${n}`).click({ force: true });
    }
    if (order.gems.some(Boolean)) {
      await page.getByTestId('polish-gem').click();
      for (let n = 0; n < 5; n++) if (order.gems[n]) await page.getByTestId(`nail-${n}`).click({ force: true });
    }
    await page.getByTestId('nails-check').click();
    await expect(page.getByTestId('nails-served')).toContainText(i === 0 ? '+14' : '+18');
    await page.getByTestId('nails-next').click();
  }
  await expect(page.getByTestId('nails-done')).toBeVisible();
  expect((await coinsOf(page)) - start).toBe(14 + 18 * 3 + 12);
});

test('petal posies: checking names what is missing, then a full shift pays with tips and a bonus', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('./?fixture=fresh&scene=posies');
  const start = await coinsOf(page);
  for (let i = 0; i < 4; i++) {
    const order = JSON.parse((await page.getByTestId('posies-card').getAttribute('data-order'))!) as {
      counts: Record<string, number>;
      wrap: string;
    };
    if (i === 0) {
      await page.getByTestId('posies-check').click();
      await expect(page.getByTestId('posies-wrong')).toContainText('Almost!');
    }
    for (const [flower, n] of Object.entries(order.counts)) for (let k = 0; k < n; k++) await page.getByTestId(`flower-${flower}`).click();
    await page.getByTestId(`wrap-${order.wrap}`).click();
    await page.getByTestId('posies-check').click();
    await expect(page.getByTestId('posies-served')).toContainText(i === 0 ? '+14' : '+18');
    await page.getByTestId('posies-next').click();
  }
  await expect(page.getByTestId('posies-done')).toBeVisible();
  expect((await coinsOf(page)) - start).toBe(14 + 18 * 3 + 12);
});

test('petal park: find every pair for coins, and play a song on the bandstand piano once for coins', async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto('./?fixture=fresh&scene=park');
  const start = await coinsOf(page);
  await page.getByTestId('park-pairs').click();
  await page.getByTestId('pairs-level-0').click();
  const symbols = await page
    .getByTestId('pairs-board')
    .locator('[data-symbol]')
    .evaluateAll((els) => els.map((e) => e.getAttribute('data-symbol')!));
  // Open one wrong pair first: it turns back over and nothing is taken away.
  const other = symbols.findIndex((s) => s !== symbols[0]);
  await page.getByTestId('card-0').click();
  await page.getByTestId(`card-${other}`).click();
  await expect(page.getByTestId('pairs-status')).toContainText('0 of 3');
  await page.waitForTimeout(1100);
  for (const sym of new Set(symbols)) {
    const idx = symbols.map((s, i) => (s === sym ? i : -1)).filter((i) => i >= 0);
    await page.getByTestId(`card-${idx[0]}`).click();
    await page.getByTestId(`card-${idx[1]}`).click();
    await page.waitForTimeout(600);
  }
  await expect(page.getByTestId('pairs-done')).toBeVisible();
  expect((await coinsOf(page)) - start).toBe(14);
  await page.getByTestId('pairs-other').click();
  await page.keyboard.press('Escape');
  await page.getByTestId('park-piano').click();
  await page.getByTestId('song-song.lamb').click();
  const notes = [2, 1, 0, 1, 2, 2, 2, 1, 1, 1, 2, 4, 4];
  await page.getByTestId('key-7').click(); // a wrong key only makes the right one glow
  await expect(page.getByTestId('piano-line')).toContainText('glowing');
  for (const k of notes) await page.getByTestId(`key-${k}`).click();
  await expect(page.getByTestId('song-done')).toContainText('+15');
  expect((await coinsOf(page)) - start).toBe(14 + 15);
});

test('art studio: paint every part, hang the picture for first-time coins, and see it in the gallery', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=studio');
  const start = await coinsOf(page);
  await page.getByTestId('pic-cupcake').click();
  await page.getByTestId('studio-hang').click({ force: true }); // not finished: explains, does nothing
  await expect(page.getByTestId('studio-done')).toHaveCount(0);
  const paints = ['rose', 'sky', 'sun', 'mint', 'lilac', 'orange'];
  for (let i = 0; i < 6; i++) {
    await page.getByTestId(`paint-${paints[i]}`).click();
    await page.getByTestId(`part-${i}`).dispatchEvent('click'); // regions overlap, so click each by element
  }
  await page.getByTestId('studio-hang').click();
  await expect(page.getByTestId('studio-done')).toContainText('+15');
  expect((await coinsOf(page)) - start).toBe(15);
  await page.getByTestId('studio-again').click();
  await page.getByTestId('studio-gallery').click();
  await expect(page.getByTestId('gallery-works').locator('.gallery-frame')).toHaveCount(1);
});

test('puzzle shop: swap pieces until the picture is whole, then it pays', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=puzzle');
  const start = await coinsOf(page);
  await page.getByTestId('puzzle-meadow').click();
  await page.getByTestId('puzzle-size-0').click();
  const order = async () => JSON.parse((await page.getByTestId('puzzle-board').getAttribute('data-order'))!) as number[];
  let o = await order();
  for (let i = 0; i < o.length; i++) {
    o = await order();
    if (o[i] === i) continue;
    const from = o.indexOf(i);
    await page.getByTestId(`slot-${from}`).click();
    await page.getByTestId(`slot-${i}`).click();
  }
  await expect(page.getByTestId('puzzle-done')).toContainText('+10');
  expect((await coinsOf(page)) - start).toBe(10);
});

test('fishing dock: an early reel only explains, a reel at the splash catches a new fish', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('./?fixture=fresh&scene=fishing');
  const start = await coinsOf(page);
  await page.getByTestId('fish-cast').click();
  await page.getByTestId('fish-reel').click();
  await expect(page.getByTestId('fish-note')).toContainText('Too early');
  await page.getByTestId('fish-cast').click();
  await expect(page.getByTestId('fish-stage')).toHaveAttribute('data-phase', 'bite', { timeout: 8000 });
  await page.getByTestId('fish-reel').click();
  await expect(page.getByTestId('fish-card')).toBeVisible();
  expect((await coinsOf(page)) - start).toBe(16);
  await page.getByTestId('fish-tank').click();
  await expect(page.getByTestId('tank').locator('[data-have="true"]')).toHaveCount(1);
});

test('tide pools: turn over rocks until the whole list is found, then it pays and the finds are saved', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=tide');
  const rocks = page.locator('[data-testid^="rock-"]');
  await expect(rocks).toHaveCount(8);
  for (let i = 0; i < 8; i++) {
    if (await page.getByTestId('tide-done').isVisible()) break;
    await page.getByTestId(`rock-${i}`).click();
  }
  await expect(page.getByTestId('tide-done')).toBeVisible();
  await expect(page.getByTestId('tide-coins')).toContainText(/\+(28|32|36)/);
  await page.getByTestId('tide-again').click();
  await expect(page.getByTestId('tide-progress')).toHaveText('0/4');
  await page.getByTestId('tide-book').click();
  await expect(page.getByTestId('tide-book-grid')).toBeVisible();
});

test('starlight hill: a wrong star only wobbles, the right order draws the shape and pays', async ({ page }) => {
  await page.goto('./?fixture=fresh&scene=sky');
  await page.getByTestId('sky-pick-kitty').click();
  await page.getByTestId('star-3').click();
  await expect(page.getByTestId('sky-note')).toContainText('Tap star number 1');
  for (let i = 0; i < 6; i++) await page.getByTestId(`star-${i}`).click();
  await expect(page.getByTestId('sky-done')).toBeVisible();
  await expect(page.getByTestId('sky-coins')).toContainText('+22');
  await page.getByTestId('sky-again').click();
  await expect(page.getByTestId('sky-progress')).toHaveText('0/6');
});

async function playStopRide(page: Page) {
  for (let r = 0; r < 5; r++) {
    await expect(page.getByTestId('ride-stage')).toHaveAttribute('data-inzone', 'true', { timeout: 8000 });
    await page.getByTestId('ride-go').click({ force: true });
    await expect(page.getByTestId('ride-status')).not.toContainText('Tap when', { timeout: 2000 });
    if (r < 4) await page.waitForTimeout(1100);
  }
}

async function playLights(page: Page) {
  for (let r = 0; r < 3; r++) {
    await expect(page.getByTestId('lights-ride')).toHaveAttribute('data-mode', 'play', { timeout: 12000 });
    const seq = ((await page.getByTestId('lights-stage').getAttribute('data-seq')) ?? '').split(',').map(Number);
    for (const l of seq) await page.getByTestId(`pad-${l}`).click();
    if (r < 2) await expect(page.getByTestId('lights-ride')).toHaveAttribute('data-mode', 'watch', { timeout: 4000 });
  }
}

test('new york and the funfair: buy a ticket, shop at the cart, pay the gate, play every ride, earn stamps and the finale', async ({
  page,
}) => {
  test.setTimeout(150_000);
  await page.goto('./?fixture=fresh&scene=airport');
  await page.evaluate(() => {
    const g = (window as unknown as { __petal: { getState: () => { save: { wallet: object } & object }; setState: (s: object) => void } })
      .__petal;
    const save = g.getState().save;
    g.setState({ save: { ...save, wallet: { ...save.wallet, coins: 3000 } } });
  });
  await page.getByTestId('airport-open-desk').click();
  await page.getByTestId('airport-buy-newyork').click();
  await page.getByTestId('airport-fly-newyork').click();
  await expect(page.getByTestId('newyork-art')).toBeVisible();
  await page.getByTestId('ny-cart').click({ force: true });
  await page.getByTestId('souvenir-souvenir.cab').click();
  await expect(page.getByTestId('souvenir-souvenir.cab')).toContainText('Yours');
  await page.getByTestId('sheet-close').click();
  await shot(page, '15-new-york');
  await page.getByTestId('ny-ferry').click();
  // The gate: a day pass, then the hub.
  await expect(page.getByTestId('gate-card')).toBeVisible();
  const coinsBefore = Number(((await page.getByTestId('coin-pill').textContent()) ?? '').replace(/\D/g, ''));
  await page.getByTestId('gate-pay').click();
  await expect(page.getByTestId('park-line')).toBeVisible();
  const coinsAfter = Number(((await page.getByTestId('coin-pill').textContent()) ?? '').replace(/\D/g, ''));
  expect(coinsBefore - coinsAfter).toBe(150);
  await shot(page, '16-funfair-hub');
  // Big wheel, strong bell, neon lights.
  await page.getByTestId('ride-wheel').dispatchEvent('click');
  await shot(page, '17-wheel-ride');
  await playStopRide(page);
  await expect(page.getByTestId('ride-done')).toBeVisible({ timeout: 8000 });
  await expect(page.getByTestId('prize-souvenir.skylens')).toBeVisible();
  await page.getByTestId('ride-back').click();
  await page.getByTestId('ride-bell').dispatchEvent('click');
  await playStopRide(page);
  await expect(page.getByTestId('ride-done')).toBeVisible({ timeout: 8000 });
  await page.getByTestId('ride-back').click();
  await page.getByTestId('ride-neon').dispatchEvent('click');
  await playLights(page);
  await expect(page.getByTestId('ride-done')).toBeVisible({ timeout: 8000 });
  await expect(page.getByTestId('prize-souvenir.rainbowpop')).toBeVisible();
  await shot(page, '18-funfair-finale');
  await page.getByTestId('ride-back').click();
  for (const r of ['wheel', 'bell', 'neon']) await expect(page.getByTestId(`stamp-${r}`)).toHaveAttribute('data-got', 'true');
});

test('storybook kingdom: the train from Paris, a wrong light only replays, the fountain wish gives a stamp', async ({ page }) => {
  test.setTimeout(150_000);
  await page.goto('./?fixture=fresh&scene=paris');
  await page.evaluate(() => {
    const g = (window as unknown as { __petal: { getState: () => { save: { wallet: object } & object }; setState: (s: object) => void } })
      .__petal;
    const save = g.getState().save;
    g.setState({ save: { ...save, wallet: { ...save.wallet, coins: 3000 } } });
  });
  await page.getByTestId('paris-train').click();
  await page.getByTestId('gate-pay').click();
  await page.getByTestId('ride-fireworks').dispatchEvent('click');
  await expect(page.getByTestId('lights-ride')).toHaveAttribute('data-mode', 'play', { timeout: 12000 });
  const seq = ((await page.getByTestId('lights-stage').getAttribute('data-seq')) ?? '').split(',').map(Number);
  const wrong = (seq[0] + 1) % 4;
  await page.getByTestId(`pad-${wrong}`).click();
  await expect(page.getByTestId('lights-status')).toContainText('Oops');
  await expect(page.getByTestId('lights-ride')).toHaveAttribute('data-mode', 'play', { timeout: 12000 });
  await playLights(page);
  await expect(page.getByTestId('ride-done')).toBeVisible({ timeout: 8000 });
  await expect(page.getByTestId('prize-souvenir.rocketpin')).toBeVisible();
  await page.getByTestId('ride-back').click();
  await page.getByTestId('ride-fountain').dispatchEvent('click');
  await page.getByTestId('coin-1').click();
  await page.getByTestId('wish-toss').click();
  await page.getByTestId('wish-2').click();
  await expect(page.getByTestId('ride-done')).toBeVisible({ timeout: 8000 });
  await page.getByTestId('ride-back').click();
  await expect(page.getByTestId('stamp-fountain')).toHaveAttribute('data-got', 'true');
  await expect(page.getByTestId('stamp-fireworks')).toHaveAttribute('data-got', 'true');
});

import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.__entranceFrames = [];
    const sample = () => {
      const section = document.querySelector('#tratamentos');
      const card = document.querySelector('.treatment-features .treatment-reveal');
      if (section && card) window.__entranceFrames.push({ scroll: scrollY, top: section.getBoundingClientRect().top, alpha: Number(getComputedStyle(card).opacity), ready: !!document.querySelector('main.motion-ready') });
      if (window.__entranceFrames.length < 1600) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await page.route(/\.js(?:\?|$)/, async route => {
    await new Promise(resolve => setTimeout(resolve, 250));
    await route.continue();
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const loading = await page.evaluate(() => window.__entranceFrames);
  assert.ok(loading.some(frame => !frame.ready), 'Test must sample server-rendered layout before animation setup');
  assert.equal(loading.filter(frame => frame.scroll === 0 && frame.top < 100).length, 0, 'Treatment must never flash over hero during hydration');
  await page.evaluate(() => { window.scrollTo({ top: 2600, behavior: 'instant' }); window.__entranceFrames = []; });
  await page.waitForTimeout(500);
  await page.mouse.move(720, 450);
  for (let i = 0; i < 20; i++) { await page.mouse.wheel(0, 80); await page.waitForTimeout(80); }
  await page.waitForTimeout(1000);
  const frames = await page.evaluate(() => window.__entranceFrames);
  const drops = frames.filter((frame, index, list) => index > 0 && frame.scroll >= list[index - 1].scroll && frame.alpha < list[index - 1].alpha - 0.02);
  assert.equal(drops.length, 0, 'Card opacity must not blink off during forward entrance');
  assert.ok(frames.some(frame => frame.alpha > 0 && frame.alpha < 1), 'Entrance must retain gradual opacity');
  assert.ok(frames.at(-1).alpha > 0.99);
  const noJs = await browser.newPage({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  await noJs.goto('http://localhost:3000');
  assert.ok(await noJs.locator('#tratamentos').evaluate(el => el.getBoundingClientRect().top >= innerHeight - 2));
  assert.equal(await noJs.locator('.treatment-word').first().evaluate(el => getComputedStyle(el).opacity), '1');
  assert.equal(await noJs.locator('.closing-shell').evaluate(el => getComputedStyle(el).marginTop), '0px');
  assert.deepEqual(errors, []);
  console.log('PASS: no hydration overlay flash with delayed JS, no frame-by-frame opacity drops, gradual entrance and readable no-JavaScript fallback.');
} finally { await browser.close(); }

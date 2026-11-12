import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1828, height: 919 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo({ top: innerHeight * 4 + 100, behavior: 'instant' }));
  await page.waitForTimeout(2200);
  assert.equal(await page.locator('.care-steps li').count(), 3);
  assert.equal(await page.locator('.treatment-button-primary').count(), 1);
  const wordGap = await page.locator('.treatment-title-line').first().evaluate(el => {
    const words = el.querySelectorAll('.treatment-word');
    return words[1].getBoundingClientRect().left - words[0].getBoundingClientRect().right;
  });
  assert.ok(wordGap > 3, 'Animated title must preserve visible spaces between words');
  const card = page.locator('.spotlight-card').first();
  await card.hover();
  await page.waitForTimeout(400);
  assert.equal(await card.getAttribute('data-spotlight'), 'on');
  assert.ok(Number(await card.locator('.spotlight-glow').evaluate(el => getComputedStyle(el).opacity)) > 0.95);
  await page.screenshot({ path: 'artifacts/treatments-refined-desktop.png' });
  await page.mouse.move(0, 0);
  await page.waitForTimeout(400);
  assert.equal(await card.getAttribute('data-spotlight'), 'off');
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.locator('#tratamentos').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1600);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}px`);
    if (width === 390) await page.screenshot({ path: 'artifacts/treatments-refined-mobile.png' });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.spotlight-glow').first().evaluate(el => getComputedStyle(el).display), 'none');
  assert.equal(await page.locator('.treatment-word').first().evaluate(el => getComputedStyle(el).opacity), '1');
  assert.deepEqual(errors, []);
  console.log('PASS: title spacing, spotlight hover/leave, three care steps, primary CTA, desktop and 320/390/768px layouts, reduced motion.');
} finally { await browser.close(); }

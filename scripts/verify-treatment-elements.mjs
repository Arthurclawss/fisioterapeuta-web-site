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
  const size = await card.boundingBox();
  await card.hover({ position: { x: size.width * 0.8, y: size.height * 0.25 } });
  await page.waitForTimeout(700);
  const tilt = await card.evaluate(el => {
    const matrix = new DOMMatrix(getComputedStyle(el).transform);
    return { xDepth: matrix.m13, yDepth: matrix.m23, scale: Math.hypot(matrix.m11, matrix.m12, matrix.m13) };
  });
  assert.ok(tilt.xDepth < -0.01, 'Right side under pointer must recede');
  assert.ok(tilt.yDepth > 0.01, 'Upper side under pointer must recede');
  assert.ok(tilt.scale > 1.01 && tilt.scale < 1.03, 'Scale must stay subtle');
  await page.screenshot({ path: 'artifacts/treatments-refined-desktop.png' });
  await page.screenshot({ path: 'artifacts/treatments-card-tilt.png' });
  await card.hover({ position: { x: size.width * 0.2, y: size.height * 0.75 } });
  await page.waitForTimeout(700);
  assert.ok(await card.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m13 > 0.01), 'Opposite cursor position must reverse tilt');
  await page.mouse.move(0, 0);
  await page.waitForTimeout(900);
  assert.equal(await card.getAttribute('data-spotlight'), 'off');
  assert.ok(await card.evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).m13) < 0.001), 'Tilt must reset after pointer leaves');
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
  console.log('PASS: 3D tilt direction, subtle scale, reset, spotlight, title, care steps, CTA, responsive layouts and reduced motion.');
} finally { await browser.close(); }

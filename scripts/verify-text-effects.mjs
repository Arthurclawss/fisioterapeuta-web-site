import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  assert.equal(await page.locator('.hero-copy .fold-piece').count(), 6);
  assert.equal(await page.locator('.hero-copy .fold-piece').first().evaluate(el => getComputedStyle(el).opacity), '1');
  assert.ok(await page.locator('#help-title .split-text-word').count() > 4);
  const labels = await page.locator('#help-title').getAttribute('aria-label');
  assert.ok(labels.includes('Mais espaço') && labels.includes('se mover.'));
  await page.locator('.hero-actions .text-link').click();
  await page.waitForTimeout(1600);
  assert.ok(await page.locator('#help-title .split-text-word').evaluateAll(words => words.every(el => Number(getComputedStyle(el).opacity) > 0.99)));
  await page.locator('.help-panel .text-link').click();
  await page.waitForTimeout(1600);
  assert.ok(await page.locator('.contact-intro .fold-piece').evaluateAll(words => words.every(el => Number(getComputedStyle(el).opacity) > 0.99)));
  await page.screenshot({ path: 'artifacts/text-effects-contact.png' });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Text must wrap without overflow at ${width}px`);
    await page.locator('#cuidado').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    assert.ok(await page.locator('#help-title .split-text-word').evaluateAll(words => words.every(el => Number(getComputedStyle(el).opacity) > 0.99)));
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(500);
  assert.equal(await page.locator('.split-text-word').count(), 0, 'Reduced motion must restore unsplit, accessible headings');
  assert.equal(await page.locator('.hero-copy .fold-piece').first().evaluate(el => getComputedStyle(el).opacity), '1');
  assert.deepEqual(errors, []);
  console.log('PASS: fold title, split words, accessible heading, pinned navigation, final contact fold, mobile wrapping and reduced-motion cleanup.');
} finally { await browser.close(); }

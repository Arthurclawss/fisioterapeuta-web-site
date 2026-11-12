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
  assert.ok(await page.locator('#treatment-title .split-text-char').count() > 10);
  assert.equal(await page.locator('#treatment-title .fold-piece').count(), 4);
  assert.equal(await page.locator('#patient-title .fold-piece').count(), 2);
  assert.equal(await page.locator('.faq-column h2 .fold-piece').count(), 2);
  assert.ok(await page.locator('.treatment-summary .split-text-word').count() > 4);
  const labels = await page.locator('#help-title').getAttribute('aria-label');
  assert.ok(labels.includes('Mais espaço') && labels.includes('se mover.'));
  await page.evaluate(() => scrollTo({ top: 3150, behavior: 'instant' }));
  await page.waitForTimeout(1000);
  const foldDuringArrival = await page.locator('#treatment-title .fold-piece').first().evaluate(el => ({ transform: getComputedStyle(el).transform, opacity: Number(getComputedStyle(el).opacity) }));
  assert.ok(foldDuringArrival.opacity > 0 && foldDuringArrival.opacity < 1, 'Treatment fold must be visibly in progress during section arrival');
  assert.ok(foldDuringArrival.transform.startsWith('matrix3d'), 'Treatment must use a perspective fold');
  await page.screenshot({ path: 'artifacts/treatment-fold-in-progress.png' });
  await page.evaluate(() => scrollTo({ top: 3600, behavior: 'instant' }));
  await page.waitForTimeout(1000);
  assert.ok(await page.locator('#treatment-title .fold-piece').evaluateAll(words => words.every(el => Number(getComputedStyle(el).opacity) > 0.99)));
  const patientTop = await page.locator('.patient-stage').evaluate(el => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), patientTop - 500);
  await page.waitForTimeout(1000);
  for (const selector of ['#patient-title .fold-piece', '.faq-column h2 .fold-piece']) {
    const opacity = await page.locator(selector).last().evaluate(el => Number(getComputedStyle(el).opacity));
    assert.ok(opacity > 0 && opacity < 0.99, `Fold must still be visible during arrival: ${selector}`);
  }
  await page.screenshot({ path: 'artifacts/patient-faq-fold-in-progress.png' });
  await page.locator('a[aria-label="Rudy Mollick, início"]').evaluate(el => el.click());
  await page.waitForTimeout(1300);
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

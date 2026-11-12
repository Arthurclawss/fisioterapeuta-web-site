import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [];
try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  desktop.on('pageerror', error => errors.push(error.message));
  const response = await desktop.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  await desktop.waitForTimeout(1800);
  await desktop.screenshot({ path: 'artifacts/hero-desktop.png' });
  assert.equal(await desktop.locator('h1').innerText(), 'Seu corpo.\nSeu movimento.\nSua liberdade.');
  assert.equal(await desktop.locator('.pin-spacer').count(), 1);
  const before = await desktop.locator('.portrait-scroll').evaluate(el => getComputedStyle(el).transform);
  await desktop.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
  await desktop.waitForTimeout(1500);
  const after = await desktop.locator('.portrait-scroll').evaluate(el => getComputedStyle(el).transform);
  assert.notEqual(before, after, 'Portrait must move with scroll');
  await desktop.screenshot({ path: 'artifacts/hero-scroll.png' });
  await desktop.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await desktop.waitForTimeout(1500);
  assert.ok(Number(await desktop.locator('.hero-copy').evaluate(el => getComputedStyle(el).opacity)) > 0.95);
  await desktop.locator('.hero-actions .primary-button').click();
  await desktop.waitForTimeout(1500);
  assert.equal(new URL(desktop.url()).hash, '#contato');
  assert.ok(await desktop.locator('#contato').evaluate(el => el.getBoundingClientRect().top < innerHeight));

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  mobile.on('pageerror', error => errors.push(error.message));
  await mobile.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(1800);
  assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.equal(await mobile.locator('.pin-spacer').count(), 0);
  await mobile.screenshot({ path: 'artifacts/hero-mobile.png' });
  await mobile.getByRole('button', { name: 'Abrir menu' }).click();
  await mobile.locator('#mobile-menu').getByRole('link', { name: 'O cuidado' }).click();
  await mobile.waitForTimeout(600);
  assert.equal(await mobile.locator('#mobile-menu').count(), 0);
  assert.equal(new URL(mobile.url()).hash, '#cuidado');
  await mobile.waitForTimeout(1200);
  assert.ok(Number(await mobile.locator('.care-grid h2').evaluate(el => getComputedStyle(el).opacity)) > 0.95);
  await mobile.screenshot({ path: 'artifacts/care-mobile.png' });

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await reduced.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  assert.equal(await reduced.locator('.pin-spacer').count(), 0);
  assert.equal(await reduced.locator('.title-line').first().evaluate(el => getComputedStyle(el).opacity), '1');
  assert.deepEqual(errors, []);
  console.log('PASS: desktop, scroll parallax, scroll reversal, CTA, mobile, menu, reduced motion, no runtime errors.');
} finally { await browser.close(); }

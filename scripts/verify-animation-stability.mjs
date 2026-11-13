import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const jump = async top => {
    await page.mouse.wheel(0, top - await page.evaluate(() => scrollY));
    await page.waitForTimeout(1300);
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - top) < 3, 'Start each sample after smooth scrolling settles');
  };
  const record = async selectors => page.evaluate(selectors => {
    window.stabilityFrames = [];
    window.recordStability = true;
    const sample = () => {
      const alpha = selectors.map(selector => {
        let result = 1;
        for (let node = document.querySelector(selector); node && node.tagName !== 'MAIN'; node = node.parentElement) {
          const style = getComputedStyle(node);
          result *= style.visibility === 'hidden' ? 0 : Number(style.opacity);
        }
        return result;
      });
      window.stabilityFrames.push({ y: scrollY, alpha, shade: Number(getComputedStyle(document.querySelector('.scene-reading-shade')).opacity) });
      if (window.recordStability) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }, selectors);
  const stop = () => page.evaluate(() => { window.recordStability = false; return window.stabilityFrames; });

  for (const direction of [1, -1]) {
    await jump(direction === 1 ? 1450 : 2500);
    await record(['#help-title .split-text-word', '#about-title .split-text-word']);
    for (let index = 0; index < 12; index++) {
      await page.mouse.wheel(0, direction * 85);
      await page.waitForTimeout(65);
    }
    await page.waitForTimeout(600);
    const frames = await stop();
    assert.ok(frames.every(frame => frame.shade > 0.99), 'Reading background must stay constant between chapters in both directions');
    assert.equal(await page.locator('#cuidado').evaluate(el => getComputedStyle(el, '::before').content), 'none', 'No independently toggled background behind section 2');
    assert.equal(await page.locator('#sobre').evaluate(el => getComputedStyle(el, '::before').content), 'none');
  }

  const patientTop = await page.locator('.patient-stage').evaluate(el => el.getBoundingClientRect().top + scrollY);
  for (const [name, start, distance, selectors] of [
    ['help', 650, 650, ['#help-title .split-text-word']],
    ['about', 1850, 650, ['#about-title .split-text-word']],
    ['treatment', 3000, 750, ['#treatment-title .split-text-char', '#treatment-title .fold-piece', '.care-steps li:last-child']],
    ['patients', patientTop - 880, 930, ['#patient-title .fold-piece', '.faq-column h2 .fold-piece']],
  ]) {
    await jump(start);
    await record(selectors);
    for (let index = 0; index < 12; index++) {
      await page.mouse.wheel(0, distance / 12);
      await page.waitForTimeout(65);
    }
    await page.waitForTimeout(700);
    const frames = await stop();
    const drops = frames.filter((frame, index) => index > 0 && frame.y >= frames[index - 1].y && frame.alpha.some((alpha, i) => alpha < frames[index - 1].alpha[i] - 0.03));
    assert.equal(drops.length, 0, `${name}: text must never disappear for a frame during forward entrance`);
    assert.ok(frames.at(-1).alpha.every(alpha => alpha > 0.99), `${name}: all text must remain visible after arrival`);
    await record(selectors);
    await page.evaluate(() => dispatchEvent(new Event('resize')));
    await page.waitForTimeout(700);
    assert.ok((await stop()).every(frame => frame.alpha.every(alpha => alpha > 0.99)), `${name}: refresh must not reset finished text`);
  }
  await record(['#patient-title .fold-piece', '.faq-column h2 .fold-piece']);
  await page.getByRole('button', { name: /Quais são as formas de pagamento/ }).click();
  await page.waitForTimeout(800);
  assert.ok((await stop()).every(frame => frame.alpha.every(alpha => alpha > 0.99)), 'FAQ layout refresh must preserve visible titles');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.locator('#cuidado').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await jump(0);
  assert.ok(await page.locator('#help-title .split-text-word').evaluateAll(words => words.every(word => Number(getComputedStyle(word).opacity) > 0.99)), 'Mobile text must not restart when crossing a trigger again');
  assert.deepEqual(errors, []);
  console.log('PASS: no background pulse, no frame-by-frame text drops, stable refreshes, FAQ layout changes and mobile trigger re-entry.');
} finally { await browser.close(); }

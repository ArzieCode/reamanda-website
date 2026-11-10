import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');

test('group and catering use distinct marks from the new client profile', () => {
  for (const file of ['group-monogram-gold.png', 'catering-logo.png', 'catering-mark.png']) {
    assert.ok(existsSync(new URL(`../public/${file}`, import.meta.url)), `${file} is missing`);
  }
  const header = read('components/layout/Header.tsx');
  assert.match(header, /isKatering \? '\/catering-mark\.png'/);
  assert.match(header, /: '\/group-monogram-gold\.png'/);
  const home = read('pages/HomePage.tsx');
  assert.match(home, /logo: '\/catering-logo\.png'/);
  const catering = read('pages/KateringPage.tsx');
  assert.match(catering, /src="\/catering-logo\.png"/);
});

test('catering hero logo sits directly on the dark panel without a rectangular badge', () => {
  const catering = read('pages/KateringPage.tsx');
  const logoRegion = catering.match(/<div className="flex flex-col justify-center px-6[\s\S]*?<span className="label-editorial text-\[#DEC893\]/);
  assert.ok(logoRegion, 'hero logo region not found');
  assert.doesNotMatch(logoRegion[0], /bg-\[#faf7ef\]|rounded-\[2px\]/);
  assert.match(logoRegion[0], /<img src="\/catering-logo\.png"[^>]*brightness-0 invert/);
});

test('home hero centers the gold reversed R mark within the dark right panel', () => {
  const home = read('pages/HomePage.tsx');
  const panel = home.match(/bg-charcoal text-white overflow-hidden[\s\S]*?<\/section>/);
  assert.ok(panel, 'right-hand hero panel not found');
  assert.match(panel[0], /flex-1 items-center justify-center[\s\S]*?<img src="\/group-monogram-gold\.png"/);
  assert.doesNotMatch(panel[0], /brightness-0 invert/);
});

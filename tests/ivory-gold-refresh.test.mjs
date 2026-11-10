import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const read = (path) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');

test('desktop business-line rail has the three routes and mobile keeps its top tabs', () => {
  const rail = read('components/layout/BusinessLineRail.tsx');
  const layout = read('components/layout/Layout.tsx');
  const tabs = read('components/layout/BrandTabStrip.tsx');
  for (const path of ['/busana', '/kost-wanita', '/katering']) assert.ok(rail.includes(path));
  assert.match(rail, /sticky top-\[72px\]/);
  assert.match(layout, /!isAdmin && <BusinessLineRail \/>/);
  assert.match(tabs, /min-\[1280px\]:hidden/);
});

test('catering categories link to real galleries, not unconfirmed prices', () => {
  const page = read('pages/KateringPage.tsx');
  for (const anchor of ['paket', 'foto-katering', 'nasi-box', 'snack-box', 'cara-pesan']) {
    assert.match(page, new RegExp(`id="${anchor}"`));
  }
  assert.match(page, /useImageSrc\(mealPhotos\[0\]\?\.src\)/);
  assert.match(page, /useImageSrc\(snackPhotos\[0\]\?\.src\)/);
  assert.match(page, /Galeri menampilkan dokumentasi sajian, bukan daftar paket/);
  assert.doesNotMatch(page, /\['Fresh & Balanced'/);
});

test('the palette uses an olive dark surface, ivory background, and restrained gold accent', () => {
  const tokens = read('styles/tokens.css');
  assert.match(tokens, /--charcoal: #2C3429/);
  assert.match(tokens, /--surface: #F7F3EA/);
  assert.match(tokens, /--caramel: #AE8845/);
});

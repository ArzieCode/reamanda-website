import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const source = (path) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');

test('catering logo sits on the same white surface as its card, not a colored square', () => {
  const css = source('styles/globals.css');
  assert.match(css, /\.home-line-visual--katering\s*\{\s*background-color:\s*(?:white|#fff|transparent);/);
  assert.match(source('pages/HomePage.tsx'), /logo: '\/catering-logo\.png'/);
});

test('business-line numbering is absent from the home and three line pages', () => {
  for (const path of ['pages/HomePage.tsx', 'pages/KostWanitaPage.tsx', 'pages/BusanaPage.tsx', 'pages/KateringPage.tsx']) {
    const page = source(path);
    assert.doesNotMatch(page, /(?:Rheamanda \/ 01—03|0[123] \/ 03)/, path);
  }
});

test('kost hero features a real client accommodation photo and links to its existing gallery', () => {
  const page = source('pages/KostWanitaPage.tsx');
  const hero = page.split('id="foto-akomodasi"')[0];
  assert.match(hero, /\/client-photos\/polished\/kost\/kost-23\.webp/);
  assert.ok(existsSync(new URL('../public/client-photos/polished/kost/kost-23.webp', import.meta.url)));
  assert.match(hero, /href="#foto-akomodasi"/);
  assert.match(source('components/layout/Header.tsx'), /Galeri Foto.*\/kost-wanita#foto-akomodasi/);
  assert.match(page, /<ClientPhotoGallery photos=\{clientPhotos\}/);
});

import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const source = (path) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');

test('the accommodation page renders a client-photo gallery separately from unverified room listings', () => {
  const page = source('pages/KostWanitaPage.tsx');
  assert.match(page, /clientGalleryService\.getPhotos\('kost'\)/);
  assert.match(page, /<ClientPhotoGallery/);
  assert.match(page, /Foto Akomodasi/);
});

test('the catering page renders the supplied lunch and snack photos without treating them as priced menu items', () => {
  const page = source('pages/KateringPage.tsx');
  assert.match(page, /clientGalleryService\.getPhotos\('lunchBox'\)/);
  assert.match(page, /clientGalleryService\.getPhotos\('snackBox'\)/);
  assert.match(page, /<ClientPhotoGallery/);
});

test('every client photo in the manifest has a local web-served asset', () => {
  const manifest = source('data/client-photos.ts');
  const paths = [...manifest.matchAll(/src: '(\/client-photos\/[^']+)'/g)].map((match) => match[1]);
  assert.ok(paths.length > 0);
  for (const path of paths) {
    assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), `Missing image ${path}`);
  }
});

test('the accommodation hero uses an authentic modern room and shows the D’Rhea mark', () => {
  const page = source('pages/KostWanitaPage.tsx');
  assert.match(page, /src="\/d-rhea-syariah-mark\.png"/);
  assert.match(page, /src="\/client-photos\/polished\/kost\/kost-23\.webp"/);
  assert.doesNotMatch(page, /src="\/client-photos\/kost\/kost-04\.webp"/);
  assert.match(page, /object-\[24%_center\]/);
});

test('the accommodation hero photo has no client-documentation overlay caption', () => {
  const page = source('pages/KostWanitaPage.tsx');
  assert.doesNotMatch(page, /Dokumentasi akomodasi dari klien/);
});

test('the curated Drive photo manifest points to polished originals for both business lines', () => {
  const manifest = source('data/client-photos.ts');
  const paths = [...manifest.matchAll(/src: '(\/client-photos\/[^']+)'/g)].map((match) => match[1]);
  assert.equal(paths.length, 36);
  assert.ok(paths.every((path) => path.startsWith('/client-photos/polished/')));
  for (const path of paths) assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), `Missing polished photo ${path}`);
});

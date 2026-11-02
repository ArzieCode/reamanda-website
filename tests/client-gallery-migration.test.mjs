import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const transpile = (relativePath) => ts.transpileModule(
  readFileSync(new URL(relativePath, import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } },
).outputText;
const manifestUrl = `data:text/javascript;base64,${Buffer.from(transpile('../src/data/client-photos.ts')).toString('base64')}`;
const serviceSource = transpile('../src/services/client-gallery.ts')
  .replace("from '../data/client-photos'", `from '${manifestUrl}'`);
const { clientGalleryService, polishedClientPhotoSrc } = await import(`data:text/javascript;base64,${Buffer.from(serviceSource).toString('base64')}`);

const key = 'reamanda:client-gallery:kost';

test('previously saved room-card photos use polished files but other images are unchanged', () => {
  assert.equal(polishedClientPhotoSrc('/client-photos/kost/kost-01.webp'), '/client-photos/polished/kost/kost-01.webp');
  assert.equal(polishedClientPhotoSrc('/client-photos/polished/kost/kost-01.webp'), '/client-photos/polished/kost/kost-01.webp');
  assert.equal(polishedClientPhotoSrc('img-uploaded'), 'img-uploaded');
  assert.equal(polishedClientPhotoSrc('/client-photos/kost/unknown.webp'), '/client-photos/kost/unknown.webp');
});

test('existing admin-edited gallery photos use polished versions without losing edits or uploads', () => {
  const saved = [
    { src: '/client-photos/kost/kost-23.webp', alt: 'Keterangan dari admin' },
    { src: 'img-uploaded', alt: 'Unggahan admin' },
    { src: '/client-photos/kost/unknown.webp', alt: 'Foto lain' },
  ];
  const stored = JSON.stringify(saved);
  globalThis.localStorage = { getItem: (name) => name === key ? stored : null };
  assert.deepEqual(clientGalleryService.getPhotos('kost'), [
    { ...saved[0], src: '/client-photos/polished/kost/kost-23.webp' },
    saved[1],
    saved[2],
  ]);
  assert.equal(stored, JSON.stringify(saved));
});

test('an intentionally emptied gallery remains empty and an unset gallery receives polished defaults', () => {
  globalThis.localStorage = { getItem: (name) => name === key ? '[]' : null };
  assert.deepEqual(clientGalleryService.getPhotos('kost'), []);
  assert.ok(clientGalleryService.getPhotos('lunchBox').every((photo) => photo.src.startsWith('/client-photos/polished/')));
});

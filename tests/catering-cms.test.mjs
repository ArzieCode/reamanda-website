import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const source = (path) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');

test('catering gallery uses editable persisted photo metadata instead of only the static manifest', () => {
  const page = source('pages/KateringPage.tsx');
  const admin = source('pages/AdminPage.tsx');
  const service = source('services/client-gallery.ts');
  assert.match(page, /clientGalleryService\.getPhotos\('lunchBox'\)/);
  assert.match(page, /clientGalleryService\.getPhotos\('snackBox'\)/);
  assert.match(admin, /CateringGalleryManagementView/);
  assert.match(service, /CLIENT_PHOTOS\[kind\]/);
  assert.match(service, /localStorage\.setItem/);
});

test('catering posts can be created and edited in CMS and only visible posts render on the page', () => {
  assert.match(source('types/content.ts'), /'catering_post'/);
  assert.match(source('components/admin/ContentManagementView.tsx'), /setActiveTab\('catering_post'\)/);
  assert.match(source('pages/KateringPage.tsx'), /getSections\('catering_post'\).*filter\(.*isVisible/);
  assert.match(source('components/admin/ContentManagementView.tsx'), /isVisible: editingItem \? editingItem\.isVisible : true/);
});

test('uploaded photos resolve IndexedDB image IDs on public site including lightbox', () => {
  const gallery = source('components/ui/ClientPhotoGallery.tsx');
  assert.match(gallery, /useImageSrc/);
  assert.match(gallery, /onSelect\(\{ \.\.\.photo, src: resolvedSrc \}\)/);
  assert.match(source('hooks/useImageSrc.ts'), /getImageUrl/);
});

test('the admin gallery also supports accommodation photos', () => {
  assert.match(source('services/client-gallery.ts'), /'kost' \| 'lunchBox' \| 'snackBox'/);
  assert.match(source('components/admin/CateringGalleryManagementView.tsx'), /\['kost', 'lunchBox', 'snackBox'\]/);
  assert.match(source('pages/KostWanitaPage.tsx'), /clientGalleryService\.getPhotos\('kost'\)/);
});

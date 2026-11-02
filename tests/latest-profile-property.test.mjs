import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');

test('published accommodation data follows the new PDF instead of invented properties', () => {
  const seed = read('services/seed.ts');
  const propertyBlock = seed.split('export const INITIAL_PROPERTIES: Property[] = ')[1]?.split('export const INITIAL_KATERING_PACKAGES')[0] ?? '';
  assert.match(propertyBlock, /Standard/);
  assert.match(propertyBlock, /Deluxe/);
  assert.match(propertyBlock, /2500000/);
  assert.match(propertyBlock, /3000000/);
  assert.match(propertyBlock, /Jl\. Jatipadang Utara No\. 63/);
  assert.doesNotMatch(propertyBlock, /Senopati|Gandaria|Cikajang|Paviliun Melati|Ruang Serbaguna/);
});

test('accommodation page explains the PDF-backed daily rate and facilities without promising availability', () => {
  const page = read('pages/KostWanitaPage.tsx');
  assert.match(page, /300\.000/);
  assert.match(page, /Kamar mandi dalam/);
  assert.match(page, /Listrik token/);
  assert.match(page, /ketersediaan.*konfirmasi/i);
});

test('admin can preserve and edit an unconfirmed availability status', () => {
  const admin = read('components/admin/PropertyManagementView.tsx');
  assert.match(admin, /<option value="belum_dikonfirmasi">/);
  assert.match(admin, /p\.status === 'belum_dikonfirmasi'/);
});

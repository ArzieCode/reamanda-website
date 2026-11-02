import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { migrateLegacyProperties } from '../src/services/legacy-properties.ts';

const defaults = [{ id: 'prop-pdf-standard', name: 'Standard' }, { id: 'prop-pdf-deluxe', name: 'Deluxe' }];
const oldDemo = {
  id: 'prop-1',
  name: 'D’Rhea Syariah Guest House — Kamar Suite Marwah',
  location: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
  images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop'],
};

test('replaces only an unchanged old sample with PDF-backed rooms', () => {
  const custom = { id: 'custom-1', name: 'Edited by admin' };
  const result = migrateLegacyProperties([oldDemo, custom], defaults);
  assert.deepEqual(result, [...defaults, custom]);
});

test('does not remove an admin-edited sample or resurrect deliberately emptied listings', () => {
  const edited = { ...oldDemo, location: 'Custom location' };
  assert.deepEqual(migrateLegacyProperties([edited], defaults), [edited]);
  assert.deepEqual(migrateLegacyProperties([], defaults), []);
});

test('property service migrates saved samples before returning them to visitors', () => {
  const service = readFileSync(new URL('../src/services/properti.ts', import.meta.url), 'utf8');
  assert.match(service, /migrateLegacyProperties\(list, INITIAL_PROPERTIES\)/);
  assert.match(service, /localStorage\.setItem\(STORAGE_KEY_PROPERTIES, JSON\.stringify\(migrated\)\)/);
});

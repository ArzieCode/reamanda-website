import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const read = (name) => readFileSync(new URL(`../src/${name}`, import.meta.url), 'utf8');

test('company page covers the PDF chronology, mission, values, pillars, and address as accommodation', () => {
  const about = read('pages/TentangKamiPage.tsx');
  for (const phrase of ['Rheamanda Group', '2019', '2022', '2024', 'Visi', 'Misi', 'Amanah', 'Kualitas', 'Kenyamanan', 'Adaptif', 'Kebermanfaatan', 'Properti & Akomodasi Syariah', 'Fashion Muslim & Mukena', 'Catering & Produk Kuliner', 'Jl. Jatipadang Utara No. 63', '14 kamar', '3 lantai', 'nasi box', 'frozen food', 'snack box']) {
    assert.ok(about.includes(phrase), `Missing PDF fact: ${phrase}`);
  }
  assert.doesNotMatch(about, /songket Pandai Sikek|Dimulai dari Sketsa Teduh/);
});

test('site entry points lead with the group story and PDF-backed business lines', () => {
  const home = read('pages/HomePage.tsx');
  assert.match(home, /Building Better/);
  assert.match(home, /Living/);
  assert.match(home, /Berawal dari hunian syariah/);
  assert.match(home, /Properti & Akomodasi Syariah/);
  assert.match(home, /Fashion Muslim & Mukena/);
  assert.match(home, /Catering & Produk Kuliner/);
});

test('contact page does not present an invented headquarters or phone', () => {
  const contact = read('pages/KontakPage.tsx');
  assert.doesNotMatch(contact, /Kantor Pusat|butik Senopati|720-2009/);
  assert.match(contact, /Jl. Jatipadang Utara No. 63/);
  assert.match(contact, /alamat akomodasi/i);
});

test('announcement uses a fresh profile key so a cached legacy promotion cannot override the new copy', () => {
  const announcement = read('components/layout/AnnouncementBar.tsx');
  assert.match(announcement, /contentKey="announcement\.group\.text"/);
  assert.doesNotMatch(announcement, /KOLEKSI RAYA BERSAMA 2025/);
});

test('document title and description identify the company group', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<title>Rheamanda Group<\/title>/);
  assert.match(html, /Berawal dari hunian syariah/);
});

test('group wordmark, tagline, and founding year follow the profile', () => {
  const brand = read('config/brand.ts');
  assert.match(brand, /wordmark: "Rheamanda Group"/);
  assert.match(brand, /tagline: "Building Better Living"/);
  assert.match(brand, /foundedYear: 2019/);
});

test('catering does not show a WhatsApp contact button for an unconfirmed number', () => {
  const catering = read('pages/KateringPage.tsx');
  assert.match(catering, /hasConfirmedWhatsapp && <div/);
  assert.match(catering, /settings\.whatsappNumber !== '6281234567890'/);
});

test('confirmation modals do not offer WhatsApp links without an official number', () => {
  for (const modal of ['CheckoutModal', 'KateringInquiryModal', 'PropertyInquiryModal']) {
    const source = read(`components/modals/${modal}.tsx`);
    assert.match(source, /hasConfirmedWhatsapp && <a/, `${modal} must guard its link`);
  }
});

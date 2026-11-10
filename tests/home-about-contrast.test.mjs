import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const home = readFileSync(new URL('../src/pages/HomePage.tsx', import.meta.url), 'utf8');

test('both paragraphs in the dark about section explicitly use a light text color', () => {
  const about = home.split('<section className="bg-charcoal py-16 lg:py-20">')[1]?.split('</section>')[0];
  assert.ok(about, 'dark about section must exist');
  const paragraphs = [...about.matchAll(/<p className="([^"]+)">/g)].map((match) => match[1]);
  assert.equal(paragraphs.length, 2);
  for (const classes of paragraphs) {
    assert.match(classes, /(?:^|\s)text-white(?:\s|$)/, 'paragraph color must have a generated white utility');
  }
});

test('paragraphs on dark hero sections use a generated light color', () => {
  for (const page of ['BusanaPage', 'KateringPage', 'PropertiPage']) {
    const source = readFileSync(new URL(`../src/pages/${page}.tsx`, import.meta.url), 'utf8');
    const marker = page === 'KateringPage'
      ? 'className="flex flex-col justify-center px-6'
      : 'className="site-container relative z-10 text-white';
    const hero = source.split(marker)[1]?.split('</section>')[0];
    assert.ok(hero, `${page} dark hero should exist`);
    const paragraph = hero.match(/<p className="([^"]+)"/);
    assert.ok(paragraph, `${page} hero paragraph should exist`);
    assert.match(paragraph[1], /(?:^|\s)text-white(?:\s|$)/, `${page} paragraph must have a generated white utility`);
  }
});

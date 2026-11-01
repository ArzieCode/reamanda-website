import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const dashboard = readFileSync(new URL('../src/components/admin/SalesDashboardView.tsx', import.meta.url), 'utf8');

test('all four summary numbers use the same sans-serif UI font', () => {
  const summary = dashboard.split('{/* Row of 4 KPI Cards */}')[1]?.split('{/* Chart 1:')[0];
  assert.ok(summary, 'summary cards should be present');
  const numberClasses = [...summary.matchAll(/<div className="([^"]+)">\s*\{(?:isOwner|metrics\.)/g)]
    .map((match) => match[1]);
  assert.equal(numberClasses.length, 4, 'all four numbers must be covered');
  for (const classes of numberClasses) {
    assert.match(classes, /\bfont-sans\b/);
    assert.doesNotMatch(classes, /\bfont-serif\b/);
  }
});

test('business-line values and recent order totals use the UI font too', () => {
  for (const expression of ['formatRupiahCompact(line.value)', 'formatRupiahCompact(o.total)']) {
    const valueClass = dashboard.match(new RegExp(`<[^>]+className="([^"]+)"[^>]*>\\s*\\{${expression.replace(/[().]/g, '\\$&')}\\}`))?.[1];
    assert.ok(valueClass, `${expression} should be rendered`);
    assert.match(valueClass, /\bfont-sans\b/);
    assert.doesNotMatch(valueClass, /\bfont-serif\b/);
  }
});

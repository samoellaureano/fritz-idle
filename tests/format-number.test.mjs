import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCompactNumber } from '../lib/format-number.js';

test('resource counts use consistent compact Portuguese units across the game', () => {
  for (const [value, expected] of [
    [0, '0'], [0.2, '0,2'], [42, '42'], [999, '999'],
    [1000, '1 mil'], [25420, '25,42 mil'], [1500000, '1,5 mi'],
    [500000000, '500 mi'], [2500000000, '2,5 bi'], [1200000000000, '1,2 tri'],
    [999999, '1 mi'], [999999999, '1 bi'],
  ]) {
    assert.equal(formatCompactNumber(value), expected);
  }
});

test('counts above trillions remain compact through named units and scientific notation', () => {
  for (const [value, expected] of [
    [1e15, '1 quad'], [2.5e18, '2,5 quint'], [1e21, '1 sext'],
    [1e24, '1 sept'], [1e27, '1 oct'], [1e30, '1 non'], [1e33, '1 dec'],
    [999999999999999, '1 quad'], [1e36, '1e36'],
    [9.99999e35, '1e36'], [1.234e100, '1,23e100'],
    [Number.MAX_VALUE, '1,8e308'],
  ]) {
    const formatted = formatCompactNumber(value);
    assert.equal(formatted, expected);
    assert.ok(formatted.length <= 12, `${value} must fit in a compact counter`);
  }
});

test('non-finite display values preserve the existing empty-counter behavior', () => {
  for (const value of [undefined, null, NaN, Infinity, -Infinity]) {
    assert.equal(formatCompactNumber(value), '0');
  }
});

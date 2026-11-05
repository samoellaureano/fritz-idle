import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import sharp from 'sharp';
import { SYMBOL_ART, PORTRAIT_ART, MUSEUM_ART, JOURNEY_ICON_ART, iconSource } from '../lib/icon-art.js';
import { GENERATORS, UPGRADES, CHARACTERS, ACHIEVEMENTS } from '../lib/game.js';
import { STORY_CHAPTERS } from '../lib/story.js';
import { CITY_CHAPTERS, JOURNEYS } from '../lib/journeys.js';
import { MUSEUM_ITEMS } from '../lib/progression.js';
import { AVATARS } from '../lib/community.js';

test('illustrated icons cover every saved game symbol, portrait, museum item and journey', () => {
  const items = [...GENERATORS, ...UPGRADES, ...CHARACTERS, ...ACHIEVEMENTS,
    ...STORY_CHAPTERS, ...CITY_CHAPTERS, ...JOURNEYS, ...MUSEUM_ITEMS];
  for (const item of items) assert.ok(iconSource(item.icon), item.id);
  for (const item of [...AVATARS, ...CHARACTERS]) assert.ok(PORTRAIT_ART[item.id], item.id);
  assert.deepEqual(Object.keys(MUSEUM_ART).sort(), MUSEUM_ITEMS.map(item => item.id).sort());
  assert.deepEqual(Object.keys(JOURNEY_ICON_ART).sort(), JOURNEYS.map(item => item.id).sort());
  assert.throws(() => iconSource('not-an-icon'), /não cadastrada/);
});

test('all 52 original icons are square optimized WebP files within the total size budget', async () => {
  const directory = new URL('../public/icons/', import.meta.url);
  const files = await readdir(directory);
  assert.equal(files.length, 52);
  const used = new Set([...Object.values(SYMBOL_ART), ...Object.values(PORTRAIT_ART),
    ...Object.values(MUSEUM_ART), ...Object.values(JOURNEY_ICON_ART)]);
  assert.deepEqual(files.sort(), [...used].map(name => `${name}.webp`).sort());
  let total = 0;
  for (const file of files) {
    const data = await readFile(new URL(file, directory));
    const { width, height, format } = await sharp(data).metadata();
    assert.deepEqual([width, height, format], [256, 256, 'webp'], file);
    assert.ok(data.length < 50 * 1024, `${file} exceeds thumbnail budget`);
    total += data.length;
  }
  assert.ok(total < 1024 * 1024, `Icon collection is ${total} bytes`);
  for (const [file, size] of [['fritz-icon.png', 64], ['fritz-apple-icon.png', 180]]) {
    const asset = new URL(`../public/${file}`, import.meta.url);
    const metadata = await sharp(await readFile(asset)).metadata();
    assert.deepEqual([metadata.width, metadata.height, metadata.format], [size, size, 'png']);
    assert.ok((await stat(asset)).size < 100 * 1024);
  }
});

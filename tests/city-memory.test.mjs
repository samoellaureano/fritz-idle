import test from 'node:test';
import assert from 'node:assert/strict';
import { BICYCLE_MEMORY, INDUSTRIAL_MEMORIES } from '../lib/city-memory.js';
import { STORY_CHAPTERS } from '../lib/story.js';
import { GENERATORS, newPlayer, runGameAction } from '../lib/game.js';
import { CITY_CHAPTERS } from '../lib/journeys.js';

test('bicycle and industry journeys keep their recreated chapters and historical sources', () => {
  assert.equal(BICYCLE_MEMORY.sources.length, 2);
  assert.deepEqual(INDUSTRIAL_MEMORIES.map(({ name, year }) => [name, year]), [
    ['Döhler', 1881], ['Wetzel', 1932], ['Tupy', 1938], ['Consul', 1950], ['Ciser', 1959],
  ]);
  assert.equal(new Set(INDUSTRIAL_MEMORIES.map((company) => company.id)).size, INDUSTRIAL_MEMORIES.length);
  const allowedHosts = new Set(['www.joinville.sc.gov.br', 'www.dohler.com.br', 'wetzel.com.br', 'ri.tupy.com.br', 'www.consul.com.br', 'www.ciser.com.br']);
  const sources = [...BICYCLE_MEMORY.sources, ...INDUSTRIAL_MEMORIES.map((company) => company.source)];
  for (const source of sources) {
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(allowedHosts.has(url.hostname));
    assert.ok(source.label);
  }
  for (const company of INDUSTRIAL_MEMORIES) {
    assert.ok(company.fact.includes(String(company.year)));
  }

  const bicycleChapters = CITY_CHAPTERS.filter((chapter) => chapter.journey === 'bicicletas');
  assert.equal(bicycleChapters.length, 3);
  assert.deepEqual(bicycleChapters.map(({ title }) => title), [
    'A campainha da manhã', 'O portão e a multidão de rodas', 'Duas cidades num só caminho',
  ]);
  for (const chapter of bicycleChapters) {
    assert.ok(chapter.fact && chapter.paragraphs.length > 0 && chapter.keepsake);
    assert.deepEqual(chapter.sources, BICYCLE_MEMORY.sources);
  }

  const industryChapters = CITY_CHAPTERS.filter((chapter) => chapter.journey === 'industria');
  assert.equal(industryChapters.length, INDUSTRIAL_MEMORIES.length);
  for (const [index, chapter] of industryChapters.entries()) {
    assert.equal(chapter.id, `oficio-${INDUSTRIAL_MEMORIES[index].id}`);
    assert.equal(chapter.place, `${INDUSTRIAL_MEMORIES[index].name} · memória desde ${INDUSTRIAL_MEMORIES[index].year}`);
    assert.ok(chapter.fact && chapter.paragraphs.length > 0 && chapter.keepsake);
    assert.equal(chapter.paragraphs.length, 2);
    assert.deepEqual(chapter.sources, [INDUSTRIAL_MEMORIES[index].source]);
  }
});

test('new trails extend the eight flower chapters and keep the Station economy', () => {
  const now = 1800000000000;
  const player = newPlayer(now);
  player.lifetime = 2000000;
  player.memories = STORY_CHAPTERS.map((chapter) => chapter.id);
  const { state, player: saved } = runGameAction(player, 'game', {}, now);
  assert.equal(state.storyChapters.length, STORY_CHAPTERS.length + CITY_CHAPTERS.length);
  assert.equal(state.storyMemoryCount, 8);
  assert.equal(state.storyProductionBonus, .16);
  assert.deepEqual(saved.memories, player.memories);
  assert.deepEqual(saved.generators, player.generators);
  for (const chapterId of ['cidade-das-bicicletas', 'memoria-industrial', ...INDUSTRIAL_MEMORIES.map((company) => company.id)]) {
    assert.match(runGameAction(player, 'story', { chapterId }, now).error, /inválido/);
  }
  assert.equal(GENERATORS.length, 13);
  const station = GENERATORS.find((generator) => generator.id === 'fritz-lab');
  assert.deepEqual([station.baseCost, station.cps], [12000, 47]);
  assert.match(station.place, /Memorial da Bicicleta/);
});

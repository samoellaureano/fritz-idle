import test from 'node:test';
import assert from 'node:assert/strict';
import { STORY_CHAPTERS } from '../lib/story.js';
import { CITY_CHAPTERS, JOURNEYS } from '../lib/journeys.js';

const chaptersFor = (id) => id === 'flores'
  ? STORY_CHAPTERS : CITY_CHAPTERS.filter((chapter) => chapter.journey === id);

test('every journey keeps a concrete story thread across all its chapters', () => {
  const threads = {
    flores: /espaço|lembranças|mapa/,
    bicicletas: /ponte|mapa/,
    industria: /carrinho|cesta|cestinha/,
    'palmeiras-imigracao': /bolsinho/,
    catedral: /quebra-cabeça/,
    'mercado-publico': /lista/,
    'monumento-barca': /barco|barquinho/,
    sambaqui: /aba/,
    'escola-bolshoi': /fita/,
    'o-farol': /lampadinha/,
    'empadas-jerke': /guardanapo/,
    'instituto-juarez': /borboleta/,
    'museu-arte': /moldura/,
    'cemiterio-imigrantes': /cartão/,
    'harmonia-lyra': /notinha/,
    'deutsche-schule': /ponte/,
    'opa-jerke': /pontinho/,
  };
  assert.deepEqual(Object.keys(threads).sort(), JOURNEYS.map(({ id }) => id).sort());
  for (const [journey, thread] of Object.entries(threads)) {
    for (const chapter of chaptersFor(journey)) {
      assert.match(chapter.paragraphs.join(' '), thread, `${chapter.id} must carry the journey's story forward`);
    }
  }
});

test('all 58 chapters separate sourced context from short child-friendly adventure paragraphs', () => {
  const chapters = [...STORY_CHAPTERS, ...CITY_CHAPTERS];
  assert.equal(chapters.length, 58);
  for (const chapter of chapters) {
    assert.ok(chapter.fact && chapter.sources.length > 0, `${chapter.id} needs sourced historical context`);
    for (const paragraph of chapter.paragraphs) {
      const words = paragraph.trim().split(/\s+/).length;
      assert.ok(words >= 20 && words <= 100, `${chapter.id}: ${words} words in one paragraph`);
    }
  }
});

test('the flower adventure hands each clue to the next chapter and resolves its opening quest', () => {
  const handoffs = [
    /carta/, /outro Fritz/, /Instituto Juarez Machado/, /Luiz Henrique Schwanke/,
    /escutada/, /Morro da Boa Vista/, /Festa das Flores/,
  ];
  handoffs.forEach((clue, index) => {
    assert.match(STORY_CHAPTERS[index].paragraphs.at(-1), clue);
  });
  assert.match(STORY_CHAPTERS[0].paragraphs.join(' '), /oito espaços/);
  assert.match(STORY_CHAPTERS.at(-1).paragraphs.join(' '), /oito lembranças se ligaram/);
});

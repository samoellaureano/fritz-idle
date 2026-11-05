import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { cloudEnabled, cloudFixture } from './helpers/cloud.mjs';
import { ENCOURAGEMENTS } from '../lib/community.js';
import { BICYCLE_MEMORY, INDUSTRIAL_MEMORIES } from '../lib/city-memory.js';
import { MUSEUM_ITEMS } from '../lib/progression.js';
import { STORY_CHAPTERS } from '../lib/story.js';
import { CITY_CHAPTERS, JOURNEYS } from '../lib/journeys.js';

const enabled = cloudEnabled && process.env.FRITZ_BROWSER_TESTS === '1';

test('browser trails, managers, max buying, museum profile and share export', { skip: !enabled }, async () => {
  const fixture = await cloudFixture();
  let browser;
  try {
    const { chromium } = createRequire(import.meta.url)(process.env.FRITZ_PLAYWRIGHT_MODULE);
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext();
    const actor = await fixture.user();
    await fixture.profile(actor, `Trilha_${fixture.suffix}`);
    await fixture.seed(actor, { coins: 600000000, lifetime: 600000000, cycle_petals: 600000000,
      seeds: 30, porticos: 1.5, museum: ['bicicleta'] });
    await context.addCookies(actor.browserCookies);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(fixture.origin);
    await page.getByRole('button', { name: 'Personagens', exact: true }).click();
    await page.getByRole('button', { name: 'Adquirir · 500 mi 🌸', exact: true }).click();
    await page.getByRole('button', { name: 'Viveiro ativo', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Contratar · 5 🌱', exact: true }).click();
    await page.getByRole('button', { name: 'Gestor ativo ✓', exact: true }).nth(1).waitFor();
    await page.getByRole('button', { name: 'A jornada', exact: true }).click();
    await page.getByRole('button', { name: 'Comprar o máximo de Rua das Palmeiras', exact: true }).click();
    await page.goto(`${fixture.origin}/historia?jornada=bicicletas`);
    await page.getByRole('button', { name: 'Guardar esta lembrança', exact: true }).click();
    await page.locator('.memory-saved').waitFor();
    assert.equal(await page.locator('.chapter-nav-item').count(), 3);
    assert.equal(await page.locator('.chapter-art').getAttribute('src'), CITY_CHAPTERS[0].art);
    await page.goto(`${fixture.origin}/historia?jornada=industria`);
    await page.locator('.chapter-nav-item').first().waitFor();
    assert.equal(await page.locator('.chapter-nav-item').count(), 5);
    for (const journey of JOURNEYS.filter((item) => item.category === 'lugares')) {
      await page.goto(`${fixture.origin}/historia?jornada=${journey.id}`);
      await page.locator('.chapter-nav-item').first().waitFor();
      assert.equal(await page.locator('.chapter-nav-item').count(), 3);
      assert.equal(await page.locator('.chapter-nav-item:disabled').count(), 2);
      assert.equal(await page.locator('#trilhas-dos-lugares').getAttribute('open'), '');
      const chapters = CITY_CHAPTERS.filter((item) => item.journey === journey.id);
      assert.equal(await page.locator('.chapter-art').getAttribute('src'), chapters[0].art);
      for (const [index, chapter] of chapters.entries()) {
        await page.getByRole('button', { name: 'Guardar esta lembrança', exact: true }).click();
        await page.locator('.memory-saved').waitFor();
        assert.equal(await page.locator('.chapter-heading h2').innerText(), chapter.title);
        if (index < chapters.length - 1) await page.getByRole('button', { name: 'Próximo capítulo →', exact: true }).click();
      }
      assert.ok((await page.locator('.landmark-picker .journey-choice.active').innerText()).includes('Trilha completa'));
      assert.equal(await page.locator('.trail-complete').count(), 1);
      assert.equal(await page.getByRole('link', { name: 'Escolher outra trilha →', exact: true }).getAttribute('href'), '#trilhas-dos-lugares');
    }
    await page.goto(`${fixture.origin}/perfil`);
    await page.locator('.profile-collection .museum-badge').waitFor();
    assert.ok(await page.locator('.profile-collection .achievement-unlocked').count() > 0);
    await page.goto(`${fixture.origin}/mural`);
    await page.locator('.progress-card-preview').waitFor();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Baixar arte para as redes', exact: true }).click(),
    ]);
    assert.equal(download.suggestedFilename(), 'minha-jornada-com-fritz.png');
    await page.getByText('Próximo bônus:', { exact: false }).waitFor();
    assert.equal((await fixture.api(actor, '/api/game')).data.share.ready, false);
    assert.deepEqual(errors, []);
  } finally {
    if (browser) await browser.close();
    await fixture.cleanup();
  }
});

test('browser onboarding, personalized game and diary, community messages and mobile layouts', { skip: !enabled }, async () => {
  const fixture = await cloudFixture();
  let browser;
  let page;
  try {
    if (!process.env.FRITZ_PLAYWRIGHT_MODULE) throw new Error('Set FRITZ_PLAYWRIGHT_MODULE to an installed Playwright module.');
    const { chromium } = createRequire(import.meta.url)(process.env.FRITZ_PLAYWRIGHT_MODULE);
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext();
    page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto(`${fixture.origin}/mural`);
    await page.waitForURL('**/login');
    assert.equal(await page.getByRole('button', { name: 'Entrar com Google' }).count(), 1);
    const actor = await fixture.user();
    await context.addCookies(actor.browserCookies);
    await page.goto(fixture.origin);
    await page.waitForURL('**/perfil');
    const nickname = `Jardim_${fixture.suffix}`;
    await page.getByRole('textbox', { name: 'Seu apelido em Joinville' }).fill(nickname);
    await page.getByRole('radio', { name: /Fritz Alt/ }).check();
    await page.getByRole('button', { name: 'Começar minha jornada com Fritz' }).click();
    await page.waitForURL(`${fixture.origin}/`);
    await page.getByText(`${nickname} · editar perfil`, { exact: true }).waitFor();
    const initial = await fixture.api(actor, '/api/game');
    assert.equal(initial.data.profile.avatarId, 'fritz-alt');
    assert.equal(initial.data.totalClicks, 0);
    await Promise.all([
      page.waitForResponse((response) => response.url().endsWith('/api/click') && response.status() === 200),
      page.getByRole('button', { name: /Recolher pétalas/ }).click(),
    ]);
    assert.equal((await fixture.api(actor, '/api/game')).data.totalClicks, 1);
    await page.getByRole('link', { name: 'Cidade das Bicicletas', exact: true }).click();
    await page.locator('.reader-dedication').waitFor();
    assert.ok((await page.locator('.reader-dedication').innerText()).includes(nickname));
    await page.waitForFunction(() => {
      const top = document.getElementById('cidade-das-bicicletas')?.getBoundingClientRect().top;
      return top !== undefined && top >= 0 && top < 100;
    }, null, { timeout: 5000 });
    assert.equal(await page.locator('.chapter-nav-item').count(), 8);
    const notebook = page.locator('#caderno-da-cidade');
    assert.ok((await notebook.innerText()).includes(nickname));
    for (const source of [...BICYCLE_MEMORY.sources, ...INDUSTRIAL_MEMORIES.map((company) => company.source)]) {
      assert.equal(await notebook.getByRole('link', { name: `${source.label} ↗`, exact: true }).getAttribute('href'), source.url);
    }
    await page.getByRole('link', { name: '🏭 Memória industrial', exact: true }).click();
    await page.waitForFunction(() => {
      const top = document.getElementById('memoria-industrial')?.getBoundingClientRect().top;
      return top !== undefined && top >= 0 && top < 100;
    }, null, { timeout: 5000 });
    for (const company of INDUSTRIAL_MEMORIES) {
      assert.ok((await page.locator(`#memoria-${company.id}`).innerText()).includes(company.fact));
    }
    const unchanged = await fixture.api(actor, '/api/game');
    assert.equal(unchanged.data.storyMemoryCount, 0);
    assert.equal(unchanged.data.totalClicks, 1);
    await page.reload();
    await page.waitForFunction(() => {
      const top = document.getElementById('memoria-industrial')?.getBoundingClientRect().top;
      return top !== undefined && top >= 0 && top < 100;
    }, null, { timeout: 5000 });
    await Promise.all([
      page.waitForResponse((response) => response.url().endsWith('/api/story') && response.status() === 200),
      page.getByRole('button', { name: /Guardar esta lembrança/ }).click(),
    ]);
    await page.locator('.memory-saved').waitFor();
    await page.getByRole('link', { name: 'Mural da cidade', exact: true }).click();
    await page.getByRole('heading', { name: `${nickname}, ninguém floresce sozinho.` }).waitFor();
    assert.ok((await page.locator('.own-ranking').innerText()).includes('1 histórias'));
    await page.getByRole('button', { name: ENCOURAGEMENTS[0].text, exact: true }).click();
    await page.getByRole('button', { name: 'Espalhar um incentivo', exact: true }).click();
    await page.locator('.message-card').filter({ hasText: ENCOURAGEMENTS[0].text }).waitFor();
    assert.ok(await page.getByRole('button', { name: /Novo incentivo em/ }).isDisabled());
    const { error } = await fixture.admin.from('player_profiles')
      .update({ last_message_at: new Date(Date.now() - 61000).toISOString() }).eq('user_id', actor.id);
    if (error) throw error;
    await page.reload();
    await page.getByRole('heading', { name: 'Correio das flores' }).waitFor();
    const custom = '<script>window.__muralXss=true</script>';
    await page.getByRole('textbox', { name: 'Ou escreva com suas palavras' }).fill(custom);
    await page.getByRole('button', { name: 'Espalhar um incentivo', exact: true }).click();
    const message = page.locator('.message-card').filter({ hasText: custom });
    await message.waitFor();
    assert.equal(await message.locator('script').count(), 0);
    assert.equal(await page.evaluate(() => typeof window.__muralXss), 'undefined');
    await message.getByRole('button', { name: 'Excluir minha mensagem', exact: true }).click();
    await message.waitFor({ state: 'detached' });
    for (const route of ['/perfil', '/mural', '/historia', '/']) {
      await page.goto(`${fixture.origin}${route}`);
      if (route === '/perfil') await page.getByRole('button', { name: 'Salvar minha identidade' }).waitFor();
      else if (route === '/mural') await page.getByRole('heading', { name: 'Correio das flores' }).waitFor();
      else if (route === '/historia') await page.locator('.reader-dedication').waitFor();
      else await page.locator('.player-identity').waitFor();
      for (const width of [320, 375, 430, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        const dimensions = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth,
        }));
        assert.ok(dimensions.content <= dimensions.viewport, `${route} overflows at ${width}: ${JSON.stringify(dimensions)}`);
      }
    }
    await page.goto(`${fixture.origin}/perfil`);
    await page.getByRole('textbox', { name: 'Seu apelido em Joinville' }).fill(`Novo_${fixture.suffix}`);
    await page.getByRole('radio', { name: /Schwanke/ }).check();
    await page.getByRole('button', { name: 'Salvar minha identidade' }).click();
    await page.waitForURL(`${fixture.origin}/`);
    await page.getByText(`Novo_${fixture.suffix} · editar perfil`, { exact: true }).waitFor();
    assert.equal((await fixture.api(actor, '/api/game')).data.totalClicks, 1);
    assert.deepEqual(pageErrors, []);
  } catch (error) {
    if (page && process.env.FRITZ_BROWSER_FAILURE_SCREENSHOT) {
      await page.screenshot({ path: process.env.FRITZ_BROWSER_FAILURE_SCREENSHOT, fullPage: true });
    }
    throw error;
  } finally {
    if (browser) await browser.close();
    await fixture.cleanup();
  }
});

test('browser museum spending, explicit reset confirmation, celebration, badges and preserved progress', { skip: !enabled }, async () => {
  const fixture = await cloudFixture();
  let browser;
  try {
    const { chromium } = createRequire(import.meta.url)(process.env.FRITZ_PLAYWRIGHT_MODULE);
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const actor = await fixture.user();
    const nickname = `Memoria_${fixture.suffix}`;
    await fixture.profile(actor, nickname);
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    await context.addCookies(actor.browserCookies);
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto(fixture.origin);
    await page.getByRole('button', { name: 'Museu e eras', exact: true }).click();
    assert.ok(await page.getByRole('button', { name: 'Abrir uma nova era', exact: true }).isDisabled());
    await fixture.seed(actor, {
      seeds: 50, porticos: 1, lifetime: 1e12, cycle_petals: 1e12,
      cycle_purchases: 50, memories: STORY_CHAPTERS.map((item) => item.id),
    });
    await page.reload();
    await page.getByRole('button', { name: 'Museu e eras', exact: true }).click();
    assert.equal(await page.locator('.museum-item').count(), MUSEUM_ITEMS.length);
    await page.getByRole('button', { name: 'Adquirir Bicicleta das flores · 1 Pórticos', exact: true }).click();
    await page.getByRole('button', { name: 'Guardada no museu ✓', exact: true }).waitFor();
    await page.setViewportSize({ width: 320, height: 740 });
    await page.getByRole('button', { name: 'Abrir uma nova era', exact: true }).click();
    const confirmation = page.getByRole('dialog', { name: 'Levar a memória, recomeçar a economia?' });
    await confirmation.waitFor();
    assert.ok(await confirmation.evaluate((node) => node.scrollWidth <= node.clientWidth), 'reset confirmation must fit mobile');
    assert.ok(await confirmation.getByRole('button', { name: 'Confirmar redefinição' }).isEnabled());
    assert.equal(await confirmation.getByRole('textbox').count(), 0);
    await confirmation.getByRole('button', { name: 'Continuar esta jornada' }).click();
    assert.equal((await fixture.api(actor, '/api/game')).data.rebirth.count, 0);
    await page.getByRole('button', { name: 'Abrir uma nova era', exact: true }).click();
    await confirmation.getByRole('button', { name: 'Confirmar redefinição' }).click();
    const celebration = page.getByRole('dialog', { name: 'A gente leva o que ama.' });
    await celebration.waitFor();
    assert.ok(await celebration.evaluate((node) => node.scrollWidth <= node.clientWidth), 'celebration must fit mobile');
    assert.ok((await celebration.innerText()).includes(nickname));
    assert.equal(await celebration.locator('.fritz-rider').evaluate((node) => getComputedStyle(node).animationName), 'none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    assert.equal(await celebration.locator('.fritz-rider').evaluate((node) => getComputedStyle(node).animationName), 'fritz-pedals');
    await celebration.getByRole('button', { name: 'Atravessar para a próxima aventura' }).click();
    const restored = await fixture.api(actor, '/api/game');
    assert.equal(restored.data.rebirth.count, 1);
    assert.equal(restored.data.seeds, 0);
    assert.ok(restored.data.museum.find((item) => item.id === 'bicicleta').owned);
    const expected = restored.data.rebirth.points;
    await page.reload();
    await page.locator('.account-bar .era-portal-badge').waitFor();
    assert.ok((await page.locator('.account-bar .era-portal-badge').getAttribute('aria-label')).includes(`${expected.toLocaleString('pt-BR')} Pórticos`));
    await page.getByRole('button', { name: 'Museu e eras', exact: true }).click();
    await page.getByRole('button', { name: 'Guardada no museu ✓', exact: true }).waitFor();
    assert.ok(await page.getByRole('button', { name: 'Abrir uma nova era', exact: true }).isDisabled());
    for (const width of [320, 375, 430, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `museum overflow at ${width}`);
    }
    await fixture.api(actor, '/api/community/messages', 'POST', { text: 'Pedalando para uma nova era!' });
    for (const route of ['/historia', '/perfil', '/mural']) {
      await page.goto(`${fixture.origin}${route}`);
      if (route === '/historia') {
        await page.locator('.reader-dedication').waitFor();
        assert.equal(await page.locator('.chapter-nav-item.finished').count(), 8);
      } else if (route === '/perfil') {
        await page.getByRole('button', { name: 'Salvar minha identidade' }).waitFor();
      } else {
        await page.getByRole('heading', { name: 'Correio das flores' }).waitFor();
        await page.locator('.own-ranking .era-portal-badge').waitFor();
        await page.locator('.message-card').filter({ hasText: 'Pedalando para uma nova era!' }).locator('.era-portal-badge').waitFor();
      }
      assert.ok(await page.locator('.era-portal-badge').count() > 0, `missing badge on ${route}`);
      for (const width of [320, 375, 430, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${route} rebirth overflow at ${width}`);
      }
    }
    assert.deepEqual(pageErrors, []);
  } finally {
    if (browser) await browser.close();
    await fixture.cleanup();
  }
});

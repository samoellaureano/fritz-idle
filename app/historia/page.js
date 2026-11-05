'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { STORY_CHAPTERS } from '@/lib/story';

function format(value) {
  if (!Number.isFinite(value)) return '0';
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}

async function request(path, options) {
  const response = await fetch(path, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Não foi possível carregar as histórias.');
  return data;
}

export default function StoryPage() {
  const [gameState, setGameState] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rewardMessage, setRewardMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const state = await request('/api/game');
      setGameState(state);
      const chapterId = new URLSearchParams(window.location.search).get('capitulo');
      const requestedIndex = STORY_CHAPTERS.findIndex((chapter) => chapter.id === chapterId);
      if (requestedIndex >= 0 && state.storyChapters[requestedIndex]?.unlocked) {
        setSelectedIndex(requestedIndex);
      }
    } catch (cause) {
      setError(cause.message);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const intervalId = setInterval(refresh, 15000);
    return () => clearInterval(intervalId);
  }, [refresh]);

  const chapterProgress = useMemo(
    () => gameState?.storyChapters ?? [],
    [gameState]
  );
  const chapter = STORY_CHAPTERS[selectedIndex];
  const progress = chapterProgress[selectedIndex];
  const completedCount = chapterProgress.filter((item) => item.completed).length;
  const unlockedCount = chapterProgress.filter((item) => item.unlocked).length;
  const previousIndex = selectedIndex - 1;
  const nextIndex = STORY_CHAPTERS.findIndex((item, index) => index > selectedIndex && chapterProgress[index]?.unlocked);
  const collected = progress?.completed ?? false;

  function chooseChapter(index) {
    if (!chapterProgress[index]?.unlocked) return;
    setSelectedIndex(index);
    setRewardMessage('');
    setError('');
    window.history.replaceState(null, '', `/historia?capitulo=${STORY_CHAPTERS[index].id}`);
  }

  async function keepMemory() {
    setBusy(true);
    setError('');
    setRewardMessage('');
    try {
      const updatedState = await request('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: chapter.id }),
      });
      setGameState(updatedState);
      setRewardMessage(`Uma lembrança virou raiz: +${format(updatedState.memoryReward)} pétalas e +2% de produção permanente.`);
    } catch (cause) {
      setError(cause.message);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!gameState) {
    return (
      <main className="story-page">
        <div className="story-loading"><span>🐊</span><p>{error || 'Abrindo o diário de Fritz...'}</p>{error && <a className="story-button secondary" href="/">Voltar ao jogo</a>}</div>
      </main>
    );
  }

  return (
    <main className="story-page">
      <header className="story-topbar">
        <a className="story-brand" href="/" aria-label="Voltar ao jogo Fritz em Joinville">
          <span aria-hidden="true">🐊</span>
          <span>Fritz <span>em Joinville</span></span>
        </a>
        <div className="story-nav-actions">
          <span className="story-save"><span aria-hidden="true">🌸</span> {format(gameState.coins)} pétalas</span>
          <a className="back-to-game" href="/"><span>↖</span> Voltar a jogar</a>
        </div>
      </header>

      <section className="story-intro">
        <span className="story-eyebrow"><span className="story-eyebrow-dot" /> UM DIÁRIO DE JOINVILLE</span>
        <h1>Há coisas que a cidade <span>não esquece.</span></h1>
        <p>Uma aventura para ler sem pressa — entre um punhado de pétalas e o próximo lugar onde Fritz vai precisar de você.</p>
        <div className="story-progress-summary">
          <span>📖 {completedCount} de {STORY_CHAPTERS.length} lembranças guardadas</span>
          <span className="story-progress-track"><span style={{ width: `${(completedCount / STORY_CHAPTERS.length) * 100}%` }} /></span>
          <span>🌱 +{Math.round(completedCount * 2)}% produção permanente</span>
        </div>
      </section>

      <div className="story-layout">
        <nav className="chapter-list" aria-label="Capítulos da jornada">
          <span className="chapter-list-title">A JORNADA DAS FLORES</span>
          {STORY_CHAPTERS.map((item, index) => {
            const chapterState = chapterProgress[index];
            const locked = !chapterState?.unlocked;
            return (
              <button
                key={item.id}
                className={`chapter-nav-item ${index === selectedIndex ? 'active' : ''} ${chapterState?.completed ? 'finished' : ''}`}
                disabled={locked}
                onClick={() => chooseChapter(index)}
                aria-current={index === selectedIndex ? 'step' : undefined}
                title={locked ? `Desbloqueie ao recuperar ${format(item.at)} pétalas.` : `Ler capítulo ${item.number}: ${item.title}`}
              >
                <span className="chapter-number">{locked ? '🔒' : chapterState?.completed ? '✓' : String(item.number).padStart(2, '0')}</span>
                <span className="chapter-nav-copy"><strong>{item.title}</strong><small>{locked ? `${format(item.at)} pétalas para descobrir` : item.place}</small></span>
              </button>
            );
          })}
          <div className="chapter-list-note"><span>✨</span><p>Cada história guardada aumenta em 2% a produção da sua cidade — e rende pétalas para a próxima aventura.</p></div>
        </nav>

        <article className="story-chapter" aria-live="polite">
          <div className="chapter-art-wrap">
            <img className="chapter-art" src={chapter.art} alt={chapter.artAlt} />
            <div className="chapter-art-overlay" />
            <div className="chapter-art-label"><span>CAPÍTULO {String(chapter.number).padStart(2, '0')}</span><span>{chapter.icon} {chapter.place}</span></div>
          </div>

          <div className="chapter-reading">
            <div className="chapter-heading">
              <span className="chapter-overline">UMA HISTÓRIA DE {chapter.character.toLocaleUpperCase('pt-BR')}</span>
              <h2>{chapter.title}</h2>
              <span className="chapter-place">📍 {chapter.place}</span>
            </div>

            <div className="story-prose">
              {chapter.paragraphs.map((paragraph, index) => <p key={`${chapter.id}-${index}`}>{paragraph}</p>)}
            </div>

            <div className="keepsake-card">
              <span className="keepsake-flower" aria-hidden="true">🌼</span>
              <div><span>LEVE ESTA LEMBRANÇA</span><strong>“{chapter.keepsake}.”</strong></div>
              <span className="keepsake-character" aria-hidden="true">🐊</span>
            </div>

            <aside className="chapter-sources">
              <div className="sources-heading"><span aria-hidden="true">📚</span><div><strong>História imaginada, memória verdadeira</strong><p>Os diálogos e encontros são ficção. Estas fontes documentam os lugares e as pessoas que inspiraram o capítulo.</p></div></div>
              <ul>
                {chapter.sources.map((source) => (
                  <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<span aria-hidden="true"> ↗</span></a></li>
                ))}
              </ul>
            </aside>

            {rewardMessage && <div className="story-reward" role="status"><span>🌱</span>{rewardMessage}</div>}
            {error && <div className="story-error" role="alert">{error}</div>}

            <div className="chapter-actions">
              <button className="story-button secondary" disabled={previousIndex < 0} onClick={() => chooseChapter(previousIndex)}>← <span>Capítulo anterior</span></button>
              {!collected ? (
                <button className="story-button primary" disabled={busy} onClick={keepMemory}><span>Guardar esta lembrança</span><span aria-hidden="true">🌱</span></button>
              ) : (
                <span className="memory-saved"><span aria-hidden="true">✓</span> Lembrança guardada</span>
              )}
              {nextIndex >= 0 ? (
                <button className="story-button next" disabled={!collected} onClick={() => chooseChapter(nextIndex)}><span>Próximo capítulo</span> →</button>
              ) : (
                <a className="story-button next" href="/"><span>Voltar à aventura</span> →</a>
              )}
            </div>
            {!collected && <p className="save-hint">Guarde a lembrança para receber pétalas e continuar a jornada. Você não perde seu progresso ao voltar para o jogo.</p>}
            {collected && nextIndex < 0 && unlockedCount < STORY_CHAPTERS.length && <p className="save-hint">Mais histórias aparecem conforme a cidade floresce. Sua partida segue ativa!</p>}
          </div>
        </article>
      </div>

      <section className="story-truth-note"><span>💚</span><p><strong>Feito com carinho por Joinville.</strong> Esta é uma obra de ficção interativa. Retratos e cenas são ilustrações originais; encontros, falas e acontecimentos narrativos não são fatos biográficos.</p></section>
      <footer className="story-footer"><a href="/">← Fritz e a jornada das flores</a><span>Leia uma história. Guarde uma lembrança. Continue jogando.</span></footer>
    </main>
  );
}

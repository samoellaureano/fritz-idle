'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { STORY_CHAPTERS } from '@/lib/story';
import { CITY_CHAPTERS, JOURNEYS } from '@/lib/journeys';
import { gameRequest as request } from '@/lib/client-request';
import Avatar from '@/app/components/Avatar';
import CityNotebook from '@/app/components/CityNotebook';
import EraPortal from '@/app/components/EraPortal';

const ALL_CHAPTERS = [...STORY_CHAPTERS.map((chapter) => ({ ...chapter, journey: 'flores' })), ...CITY_CHAPTERS];

function format(value) {
  if (!Number.isFinite(value)) return '0';
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}

function JourneyChoice({ journey, chapters, selected, onChoose }) {
  const completed = chapters.filter((chapter) => chapter.completed).length;
  return (
    <button className={`journey-choice ${selected ? 'active' : ''}`} onClick={() => onChoose(journey.id)} aria-pressed={selected}>
      {journey.art && <img className="journey-thumbnail" src={journey.art} alt="" loading="lazy" />}
      <span className="journey-symbol" aria-hidden="true">{journey.icon}</span><strong>{journey.name}</strong><small>{journey.description}</small>
      <span>{completed}/{chapters.length} lembranças{completed === chapters.length ? ' · Trilha completa ✓' : ''}</span>
    </button>
  );
}

export default function StoryPage() {
  const [gameState, setGameState] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [journeyId, setJourneyId] = useState('flores');
  const [rewardMessage, setRewardMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const versionRef = useRef(-1);
  const hasGameState = gameState !== null;

  const applyState = useCallback((state) => {
    if (state.saveVersion < versionRef.current) return;
    versionRef.current = state.saveVersion;
    setGameState(state);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const state = await request('/api/game');
      applyState(state);
      const params = new URLSearchParams(window.location.search);
      const chapterId = params.get('capitulo');
      const requestedChapter = ALL_CHAPTERS.find((chapter) => chapter.id === chapterId);
      const requestedJourney = requestedChapter?.journey ?? params.get('jornada') ?? 'flores';
      const validJourney = JOURNEYS.some((journey) => journey.id === requestedJourney) ? requestedJourney : 'flores';
      setJourneyId(validJourney);
      const requestedIndex = ALL_CHAPTERS.filter((chapter) => chapter.journey === validJourney).findIndex((chapter) => chapter.id === chapterId);
      setSelectedIndex(requestedIndex >= 0 && state.storyChapters.find((chapter) => chapter.id === chapterId)?.unlocked ? requestedIndex : 0);
    } catch (cause) {
      setError(cause.message);
    }
  }, [applyState]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const intervalId = setInterval(refresh, 15000);
    return () => clearInterval(intervalId);
  }, [refresh]);

  useEffect(() => {
    if (!hasGameState || !window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (target?.closest('.city-notebook') || target?.id === 'trilhas-dos-lugares') target.scrollIntoView({ behavior: 'instant' });
  }, [hasGameState]);

  const chapters = useMemo(() => ALL_CHAPTERS.filter((chapter) => chapter.journey === journeyId), [journeyId]);
  const chapterProgress = useMemo(() => chapters.map((chapter) => gameState?.storyChapters.find((item) => item.id === chapter.id)), [gameState, chapters]);
  const chapter = chapters[selectedIndex];
  const progress = chapterProgress[selectedIndex];
  const completedCount = chapterProgress.filter((item) => item?.completed).length;
  const unlockedCount = chapterProgress.filter((item) => item?.unlocked).length;
  const previousIndex = selectedIndex - 1;
  const nextIndex = chapters.findIndex((item, index) => index > selectedIndex && chapterProgress[index]?.unlocked);
  const collected = progress?.completed ?? false;
  const journeyComplete = completedCount === chapters.length;
  const previousRequired = chapter.previousId && !gameState?.storyChapters.find((item) => item.id === chapter.previousId)?.completed;
  const lockMessage = previousRequired
    ? 'Guarde a lembrança do capítulo anterior para seguir esta trilha.'
    : `Recupere ${format(chapter.at)} pétalas no total para descobrir este capítulo.`;

  function chooseChapter(index) {
    if (!chapterProgress[index]?.unlocked) return;
    setSelectedIndex(index);
    setRewardMessage('');
    setError('');
    window.history.replaceState(null, '', `/historia?jornada=${journeyId}&capitulo=${chapters[index].id}`);
  }

  function chooseJourney(id) {
    setJourneyId(id);
    setSelectedIndex(0);
    setRewardMessage('');
    setError('');
    window.history.replaceState(null, '', `/historia?jornada=${id}`);
    requestAnimationFrame(() => document.getElementById('trilha-atual')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    }));
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
      applyState(updatedState);
      setRewardMessage(`${updatedState.profile.nickname}, uma lembrança sua virou raiz: +${format(updatedState.memoryReward)} pétalas e +2% de produção permanente.`);
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
          <span aria-hidden="true"><img src="/fritz-logo.svg" alt="" width="40" height="40" /></span>
          <span>Fritz <span>em Joinville</span></span>
        </a>
        <div className="story-nav-actions">
          <a className="player-identity" href="/perfil"><Avatar id={gameState.profile.avatarId} decorative /><EraPortal points={gameState.rebirth.points} count={gameState.rebirth.count} /><span>{gameState.profile.nickname}</span></a>
          <a className="back-to-game" href="/mural">Mural da cidade</a>
          <span className="story-save"><span aria-hidden="true">🌸</span> {format(gameState.coins)} pétalas</span>
          <a className="back-to-game" href="/"><span>↖</span> Voltar a jogar</a>
        </div>
      </header>

      <section className="story-intro">
        <span className="story-eyebrow"><span className="story-eyebrow-dot" /> UM DIÁRIO DE JOINVILLE</span>
        <h1>Há coisas que a cidade <span>não esquece.</span></h1>
        <p>{gameState.profile.nickname}, este diário também é seu. Uma aventura para ler sem pressa — entre um punhado de pétalas e o próximo lugar onde Fritz vai precisar de você.</p>
        <nav className="journey-catalog" aria-label="Trilhas do diário">
          <div className="journey-picker">
            {JOURNEYS.filter((journey) => journey.category !== 'lugares').map((journey) => (
              <JourneyChoice key={journey.id} journey={journey} selected={journeyId === journey.id} onChoose={chooseJourney}
                chapters={gameState.storyChapters.filter((item) => item.journey === journey.id)} />
            ))}
          </div>
          <details className="landmark-trails" id="trilhas-dos-lugares" open={JOURNEYS.find((journey) => journey.id === journeyId)?.category === 'lugares' || undefined}>
            <summary><strong>🗺️ Trilhas pelos lugares de Joinville</strong><span>14 jornadas · 42 novas lembranças · escolha seu caminho</span></summary>
            <p>Cada lugar guarda uma história em três passos. Recupere pétalas e guarde cada lembrança para abrir a próxima. Siga uma trilha por vez, no seu ritmo.</p>
            <div className="journey-picker landmark-picker">
              {JOURNEYS.filter((journey) => journey.category === 'lugares').map((journey) => (
                <JourneyChoice key={journey.id} journey={journey} selected={journeyId === journey.id} onChoose={chooseJourney}
                  chapters={gameState.storyChapters.filter((item) => item.journey === journey.id)} />
              ))}
            </div>
          </details>
        </nav>
        <div className="story-progress-summary">
          <span>📖 {completedCount} de {chapters.length} lembranças nesta trilha · nível {gameState.rebirth.level}</span>
          <span className="story-progress-track"><span style={{ width: `${(completedCount / chapters.length) * 100}%` }} /></span>
          <span>🌱 +{Math.round(completedCount * 2)}% produção permanente</span>
        </div>
      </section>

      <div className="story-layout" id="trilha-atual">
        <nav className="chapter-list" aria-label="Capítulos da jornada">
          <span className="chapter-list-title">{JOURNEYS.find((journey) => journey.id === journeyId).name.toLocaleUpperCase('pt-BR')}</span>
          {chapters.map((item, index) => {
            const chapterState = chapterProgress[index];
            const locked = !chapterState?.unlocked;
            const needsPrevious = item.previousId && !gameState.storyChapters.find((entry) => entry.id === item.previousId)?.completed;
            const unlockHint = needsPrevious ? 'Guarde a lembrança anterior' : `${format(item.at)} pétalas para descobrir`;
            return (
              <button
                key={item.id}
                className={`chapter-nav-item ${index === selectedIndex ? 'active' : ''} ${chapterState?.completed ? 'finished' : ''}`}
                disabled={locked}
                onClick={() => chooseChapter(index)}
                aria-current={index === selectedIndex ? 'step' : undefined}
                data-tooltip={locked ? unlockHint : `Ler capítulo ${item.number}: ${item.title}`}
              >
                <span className="chapter-number">{locked ? '🔒' : chapterState?.completed ? '✓' : String(item.number).padStart(2, '0')}</span>
                <span className="chapter-nav-copy"><strong>{item.title}</strong><small>{locked ? unlockHint : item.place}</small></span>
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

            {progress?.unlocked ? <>
            <div className="story-prose">
              <p className="reader-dedication">{gameState.profile.nickname}, Fritz abre o diário ao seu lado. Esta lembrança de {chapter.place} espera um lugar na sua jornada.</p>
              {chapter.paragraphs.map((paragraph, index) => <p key={`${chapter.id}-${index}`}>{paragraph}</p>)}
            </div>

            <div className="keepsake-card">
              <span className="keepsake-flower" aria-hidden="true">🌼</span>
              <div><span>LEVE ESTA LEMBRANÇA</span><strong>“{chapter.keepsake}.”</strong></div>
              <span className="keepsake-character" aria-hidden="true">🐊</span>
            </div>
            </> : <div className="chapter-locked" role="status"><span aria-hidden="true">🔒</span><p>{lockMessage}</p><a href="/">Continuar recuperando pétalas →</a></div>}

            <aside className="chapter-sources">
              <div className="sources-heading"><span aria-hidden="true">📚</span><div><strong>História imaginada, memória verdadeira</strong><p>Os diálogos e encontros são ficção. Estas fontes documentam os lugares e as pessoas que inspiraram o capítulo.</p></div></div>
              {chapter.fact && <p className="chapter-fact">{chapter.fact}</p>}
              <ul>
                {chapter.sources.map((source) => (
                  <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<span aria-hidden="true"> ↗</span></a></li>
                ))}
              </ul>
            </aside>

            {rewardMessage && <div className="story-reward" role="status"><span>🌱</span>{rewardMessage}</div>}
            {error && <div className="story-error" role="alert">{error}</div>}
            {journeyComplete && <div className="trail-complete" role="status"><strong>🌸 Uma trilha inteira virou lembrança.</strong><p>Você guardou todos os capítulos deste caminho. Essas histórias e seus bônus seguem com você, mesmo nas próximas eras.</p><a href="#trilhas-dos-lugares">Encontrar uma nova história no mapa →</a></div>}

            <div className="chapter-actions">
              <button className="story-button secondary" disabled={previousIndex < 0} onClick={() => chooseChapter(previousIndex)}>← <span>Capítulo anterior</span></button>
              {!collected ? (
                <button className="story-button primary" disabled={busy || !progress?.unlocked} onClick={keepMemory}><span>{progress?.unlocked ? 'Guardar esta lembrança' : 'Lembrança ainda não descoberta'}</span><span aria-hidden="true">📖</span></button>
              ) : (
                <span className="memory-saved"><span aria-hidden="true">✓</span> Lembrança guardada</span>
              )}
              {nextIndex >= 0 ? (
                <button className="story-button next" disabled={!collected} onClick={() => chooseChapter(nextIndex)}><span>Próximo capítulo</span> →</button>
              ) : journeyComplete ? (
                <a className="story-button next" href="#trilhas-dos-lugares"><span>Escolher outra trilha</span> →</a>
              ) : (
                <a className="story-button next" href="/"><span>Voltar à aventura</span> →</a>
              )}
            </div>
            {!collected && <p className="save-hint">Guarde a lembrança para receber pétalas e continuar a jornada. Você não perde seu progresso ao voltar para o jogo.</p>}
            {collected && nextIndex < 0 && unlockedCount < chapters.length && <p className="save-hint">Mais histórias aparecem conforme a cidade floresce. Sua partida segue ativa!</p>}
          </div>
        </article>
      </div>

      <CityNotebook nickname={gameState.profile.nickname} />
      <section className="story-truth-note"><span>💚</span><p><strong>Feito com carinho por Joinville.</strong> Esta é uma obra de ficção interativa. Retratos e cenas são ilustrações originais; encontros, falas e acontecimentos narrativos não são fatos biográficos.</p></section>
      <footer className="story-footer"><a href="/">← Fritz e a jornada das flores</a><span>Leia uma história. Guarde uma lembrança. Continue jogando.</span></footer>
    </main>
  );
}

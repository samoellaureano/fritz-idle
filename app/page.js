'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gameRequest as request } from '@/lib/client-request';
import Avatar from '@/app/components/Avatar';

function format(value) {
  if (!Number.isFinite(value)) return '0';
  if (value < 1000) return value.toLocaleString('pt-BR', { maximumFractionDigits: value < 10 ? 1 : 0 });
  const units = ['mil', 'mi', 'bi', 'tri'];
  let unitIndex = -1;
  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ${units[unitIndex]}`;
}

export default function Home() {
  const [state, setState] = useState(null);
  const [display, setDisplay] = useState(0);
  const [offlineMsg, setOfflineMsg] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState('jornada');
  const syncRef = useRef({ coins: 0, cps: 0, at: Date.now() });
  const versionRef = useRef(-1);

  const applyState = useCallback((nextState) => {
    if (nextState.saveVersion < versionRef.current) return;
    versionRef.current = nextState.saveVersion;
    setState(nextState);
    syncRef.current = { coins: nextState.coins, cps: nextState.cps, at: Date.now() };
  }, []);

  useEffect(() => {
    request('/api/game')
      .then((nextState) => {
        applyState(nextState);
        if (nextState.lastEarned > 1 && nextState.lastElapsed > 10) {
          setOfflineMsg(`${nextState.profile.nickname}, que bom ter você de volta! Enquanto esteve fora, a cidade floresceu e rendeu ${format(nextState.lastEarned)} pétalas.`);
        }
      })
      .catch((cause) => setError(cause.message));
  }, [applyState]);

  useEffect(() => {
    const id = setInterval(() => {
      const { coins, cps, at } = syncRef.current;
      setDisplay(coins + ((Date.now() - at) / 1000) * cps);
    }, 100);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      request('/api/game').then(applyState).catch((cause) => setError(cause.message));
    }, 15000);
    return () => clearInterval(id);
  }, [applyState]);

  async function perform(action) {
    setBusy(true);
    setError(null);
    try {
      applyState(await action());
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleBuy(generatorId) {
    await perform(() => request('/api/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generatorId }),
    }));
  }

  async function handleUpgrade(upgradeId) {
    await perform(() => request('/api/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ upgradeId }),
    }));
  }

  async function handlePrestige() {
    if (!window.confirm('Recomeçar a jornada? Seus lugares e melhorias reiniciam, mas você ganha Sementes da Cidade e mantém seus personagens e conquistas.')) return;
    await perform(() => request('/api/prestige', { method: 'POST' }));
  }

  if (!state) {
    return (
      <main className="loading-screen">
        <div className="loading-card">
          <span className="loading-mascot" aria-hidden="true">🐊</span>
          <p>{error ? 'A jornada não pôde começar.' : 'Preparando a próxima aventura...'}</p>
          {error && <div className="error-banner" role="alert">{error}</div>}
        </div>
      </main>
    );
  }

  const unlockedCharacters = state.characters.filter((character) => character.unlocked);
  const chapterProgress = state.nextChapter
    ? Math.min(100, (state.lifetime / state.nextChapter.at) * 100)
    : 100;

  return (
    <main className="game-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Fritz em Joinville — início">
          <span className="brand-mark" aria-hidden="true">🐊</span>
          <span>Fritz <span className="brand-muted">em Joinville</span></span>
        </a>
        <nav className="main-nav" aria-label="Navegação do jogo">
          {[
            ['jornada', 'A jornada'],
            ['personagens', 'Personagens'],
            ['colecao', 'Coleção'],
          ].map(([id, label]) => (
            <button key={id} className={`nav-link ${tab === id ? 'selected' : ''}`} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="seed-pill" title="Sementes permanentes: aumentam sua produção">
          <span aria-hidden="true">🌱</span> {state.seeds} <span className="seed-word">sementes</span>
        </div>
      </header>

      <div className="account-bar">
        <a className="player-identity" href="/perfil"><Avatar id={state.profile.avatarId} decorative /><span>{state.profile.nickname} · editar perfil</span></a>
        <a className="community-profile-link" href="/mural">🌷 Mural-ranking e mensagens</a>
        <form action="/auth/logout" method="post"><button type="submit">Sair da conta</button></form>
      </div>

      <section className="hero" id="inicio">
        <div className="hero-art">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> UMA AVENTURA FEITA EM JOINVILLE</span>
            <h1>A cidade vai <span>florescer</span> de novo.</h1>
            <p>{state.profile.nickname}, uma ventania espalhou as pétalas mágicas. Fritz conta com você para percorrer Joinville, reencontrar velhos amigos e trazer a cor de volta para casa.</p>
            <div className="hero-signature"><span>🐊</span> Fritz e a jornada das flores <span className="signature-line" /></div>
            <a className="hero-story-link" href="/historia">Ler as histórias ilustradas <span aria-hidden="true">→</span></a>
          </div>
          <div className="hero-image-credit">Joinville, onde toda aventura cria raízes</div>
        </div>

        <div className="stats-strip">
          <div className="petal-stat">
            <span className="stat-label">SUA CESTA DE PÉTALAS</span>
            <strong className="coins-value">{format(display)} <span>🌸</span></strong>
            <span className="stat-footnote">Cada pétala devolve um pouco de cor à cidade.</span>
          </div>
          <div className="stat-divider" />
          <div className="small-stat">
            <span className="stat-label">FLORESCENDO</span>
            <strong>{format(state.cps)} <span>pétalas/s</span></strong>
            <span className="stat-footnote">{state.multipliers.production.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}× produção total</span>
          </div>
          <div className="stat-divider" />
          <div className="small-stat">
            <span className="stat-label">PÉTALAS RECUPERADAS</span>
            <strong>{format(state.lifetime)}</strong>
            <span className="stat-footnote">A jornada fica guardada para sempre.</span>
          </div>
          <button
            className="collect-button"
            disabled={busy}
            onClick={() => perform(() => request('/api/click', { method: 'POST' }))}
          >
            <span className="collect-flower" aria-hidden="true">🌼</span>
            <span>Recolher pétalas</span>
            <span className="collect-hint">+{format(state.clickValue)} por toque</span>
          </button>
        </div>
      </section>

      {offlineMsg && <div className="notice-banner" role="status"><span>☀️</span><p>{offlineMsg}</p><button aria-label="Fechar mensagem" onClick={() => setOfflineMsg(null)}>×</button></div>}
      {error && <div className="error-banner" role="alert"><span>Ops:</span> {error} <button aria-label="Fechar aviso" onClick={() => setError(null)}>×</button></div>}

      <div className="content-grid">
        <section className="main-column">
          {tab === 'jornada' && (
            <>
              <section className="section-block story-block">
                <div className="section-heading">
                  <div><span className="section-kicker">CAPÍTULO {String(unlockedCharacters.length).padStart(2, '0')} · SUA HISTÓRIA</span><h2>O próximo capítulo</h2></div>
                  <span className="chapter-counter">{unlockedCharacters.length} / {state.characters.length} encontros</span>
                </div>
                {state.nextChapter ? (
                  <div className="next-chapter">
                    <div className={`character-medallion ${state.nextChapter.color}`}>{state.nextChapter.icon}</div>
                    <div className="chapter-copy">
                      <span className="chapter-label">PRÓXIMO ENCONTRO</span>
                      <h3>{state.nextChapter.name}</h3>
                      <p>{state.nextChapter.story}</p>
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${chapterProgress}%` }} /></div>
                      <span className="progress-copy">{format(state.lifetime)} / {format(state.nextChapter.at)} pétalas recuperadas</span>
                      <a className="chapter-story-link" href="/historia">Abrir diário ilustrado <span aria-hidden="true">→</span></a>
                    </div>
                    <span className={`chapter-preview ${state.nextChapter.color}`} aria-hidden="true">{state.nextChapter.icon}</span>
                  </div>
                ) : (
                  <div className="complete-chapter"><span>🌷</span><div><h3>{state.profile.nickname}, Joinville floresceu outra vez!</h3><p>Todos os amigos estão juntos. Plante novas raízes com a Semente da Cidade e continue a aventura.</p></div></div>
                )}
              </section>

              <section className="section-block places-block">
                <div className="section-heading">
                  <div><span className="section-kicker">CADA CANTO CONTA</span><h2>Ative os lugares da cidade</h2></div>
                  <span className="section-aside">Pontos de Joinville que fazem história</span>
                </div>
                <div className="places-list">
                  {state.generators.map((generator, index) => {
                    const affordable = display >= generator.cost;
                    return (
                      <article className={`place-card ${affordable ? 'affordable' : ''}`} key={generator.id}>
                        <div className={`place-icon place-tone-${index % 5}`}>{generator.icon}</div>
                        <div className="place-copy"><h3>{generator.name}</h3><p>{generator.place}</p><span className="place-rate">✦ +{format(generator.cps)} pétalas/s cada</span></div>
                        <div className="place-owned"><strong>{generator.owned}</strong><span>ativos</span></div>
                        <button className="buy-button" disabled={!affordable || busy} onClick={() => handleBuy(generator.id)}>
                          <span>{format(generator.cost)}</span><small>🌸</small>
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="section-block upgrades-block">
                <div className="section-heading">
                  <div><span className="section-kicker">UM CARINHO A MAIS</span><h2>Melhorias para Fritz</h2></div>
                  <span className="section-aside">Até 5 níveis por melhoria</span>
                </div>
                <div className="upgrade-grid">
                  {state.upgrades.map((upgrade, index) => (
                    <article className="upgrade-card" key={upgrade.id}>
                      <div className={`upgrade-icon upgrade-tone-${index}`}>{upgrade.icon}</div>
                      <div className="upgrade-copy"><h3>{upgrade.name}</h3><p>{upgrade.description}</p></div>
                      <div className="upgrade-bottom"><span>NÍVEL {upgrade.owned}/{upgrade.maxOwned}</span><button disabled={display < upgrade.cost || upgrade.owned >= upgrade.maxOwned || busy} onClick={() => handleUpgrade(upgrade.id)}>{upgrade.owned >= upgrade.maxOwned ? 'Completa' : `${format(upgrade.cost)} 🌸`}</button></div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

          {tab === 'personagens' && (
            <section className="section-block full-tab">
              <div className="section-heading"><div><span className="section-kicker">GENTE QUE FAZ A CIDADE</span><h2>Amigos pelo caminho</h2></div><span className="chapter-counter">{unlockedCharacters.length} / {state.characters.length} reunidos</span></div>
              <p className="section-intro">Ao longo da jornada, figuras ligadas à história e à cultura de Joinville ajudam a inspirar Fritz. Cada novo encontro aumenta sua produção em 5%.</p>
              <div className="character-grid">
                {state.characters.map((character) => (
                  <article key={character.id} className={`character-card ${character.unlocked ? 'character-unlocked' : 'character-locked'}`}>
                    <div className={`character-medallion ${character.color}`}>{character.unlocked ? character.icon : '🔒'}</div>
                    <div><span className="character-status">{character.unlocked ? 'ENCONTRO REALIZADO' : `A PARTIR DE ${format(character.at)} PÉTALAS`}</span><h3>{character.name}</h3><p className="character-role">{character.role}</p><p className="character-story">{character.unlocked ? character.story : 'Recupere pétalas para encontrar esta pessoa na jornada.'}</p></div>
                    {character.unlocked && character.id !== 'fritz' && <span className="friend-bonus">+5% produção</span>}
                  </article>
                ))}
              </div>
              <div className="history-note"><span>📚</span><p>Releituras lúdicas de personagens e da memória local. <a href="https://ndmais.com.br/cidadania/quem-e-a-maior-celebridade-de-joinville-veja-fotos-e-vote/" target="_blank" rel="noreferrer">Conheça nomes da história cultural de Joinville ↗</a></p></div>
            </section>
          )}

          {tab === 'colecao' && (
            <section className="section-block full-tab">
              <div className="section-heading"><div><span className="section-kicker">PEQUENAS GRANDES VITÓRIAS</span><h2>Memórias que ficam</h2></div><span className="chapter-counter">{state.achievements.filter((item) => item.unlocked).length} / {state.achievements.length} lembranças</span></div>
              <p className="section-intro">Cada conquista registra um pedacinho da aventura. Progresso e personagens sobrevivem até quando você planta novas raízes.</p>
              <div className="achievement-list">
                {state.achievements.map((achievement) => (
                  <article className={`achievement-card ${achievement.unlocked ? 'achievement-unlocked' : ''}`} key={achievement.id}>
                    <span className="achievement-icon">{achievement.unlocked ? achievement.icon : '🔒'}</span>
                    <div><h3>{achievement.name}</h3><p>{achievement.description}</p></div>
                    <span className="achievement-status">{achievement.unlocked ? 'CONQUISTADA' : 'A DESCOBRIR'}</span>
                  </article>
                ))}
              </div>
              <div className="daily-card">
                <div className="daily-illustration">🎁</div>
                <div className="daily-copy"><span className="section-kicker">UMA SURPRESA POR DIA</span><h3>Presente da Cidade</h3><p>{state.dailyAvailable ? `Abra seu presente e receba ${format(state.dailyReward)} pétalas para a jornada.` : 'Seu presente já foi resgatado. Uma nova surpresa estará disponível em até 24 horas.'}</p></div>
                <button className="daily-button" disabled={!state.dailyAvailable || busy} onClick={() => perform(() => request('/api/daily', { method: 'POST' }))}>{state.dailyAvailable ? 'Abrir presente' : 'Até amanhã'} <span>→</span></button>
              </div>
            </section>
          )}
        </section>

        <aside className="side-column">
          <section className="side-card objective-card">
            <div className="side-card-heading"><span className="side-icon">🧭</span><div><span className="section-kicker">OBJETIVO DA JORNADA</span><h2>{state.nextChapter ? `Encontrar ${state.nextChapter.name}` : 'A cidade voltou a florescer'}</h2></div></div>
            {state.nextChapter ? <><div className="progress-track objective-track"><div className="progress-fill" style={{ width: `${chapterProgress}%` }} /></div><p>{format(Math.max(0, state.nextChapter.at - state.lifetime))} pétalas até o próximo encontro.</p></> : <p>Todos os personagens se reuniram. A aventura pode recomeçar com novas raízes!</p>}
            <button className="side-action" onClick={() => setTab('personagens')}>Ver a história <span>↗</span></button>
            <a className="side-story-link" href="/historia">Ler a aventura completa <span aria-hidden="true">→</span></a>
          </section>

          <section className="side-card roots-card">
            <div className="side-card-heading"><span className="side-icon">🌱</span><div><span className="section-kicker">NOVAS RAÍZES</span><h2>Sementes da Cidade</h2></div></div>
            <p>Quando juntar {format(state.prestigeRequirement)} pétalas, comece outra jornada. Seus encontros ficam; cada semente aumenta em 25% a produção permanente.</p>
            <button className="prestige-button" disabled={!state.prestigeReady || busy} onClick={handlePrestige}>{state.prestigeReady ? 'Plantar novas raízes' : `${format(state.prestigeRequirement - display)} pétalas para florescer`}</button>
            <span className="roots-footnote">{state.seeds} {state.seeds === 1 ? 'semente plantada' : 'sementes plantadas'} · +{state.seeds * 25}% produção</span>
          </section>

          <section className="side-card return-card">
            <span className="return-icon">☀️</span><div><span className="section-kicker">A CIDADE SEGUE VIVA</span><h2>Até na sua ausência</h2></div>
            <p>Seus lugares continuam trazendo pétalas por até {state.multipliers.offlineHours} horas enquanto você descansa.</p>
          </section>

          <div className="city-note"><span>🌷</span><p><strong>Joinville, Cidade das Flores.</strong><br />Uma jornada de carinho pela cidade e por quem a constrói.</p></div>
        </aside>
      </div>

      <footer className="game-footer"><span>Uma homenagem à cultura, à natureza e às pessoas de Joinville.</span><span>Feito com carinho para <span aria-label="Joinville">💚</span></span></footer>
    </main>
  );
}

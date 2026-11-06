'use client';

import GameIcon from '@/app/components/GameIcon';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gameRequest as request } from '@/lib/client-request';
import Avatar from '@/app/components/Avatar';
import EraPortal from '@/app/components/EraPortal';
import CityMuseum from '@/app/components/CityMuseum';
import { generatorPurchase } from '@/lib/purchases';
import { formatCompactNumber as format } from '@/lib/format-number';
import { PORTRAIT_ART } from '@/lib/icon-art';

export default function Home() {
  const [state, setState] = useState(null);
  const [display, setDisplay] = useState(0);
  const [offlineMsg, setOfflineMsg] = useState(null);
  const [error, setError] = useState(null);
  const [onlineCount, setOnlineCount] = useState(null);
  const [presenceUnavailable, setPresenceUnavailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState('jornada');
  const syncRef = useRef({ coins: 0, cps: 0, at: Date.now() });
  const versionRef = useRef(-1);

  const applyState = useCallback((nextState) => {
    if (nextState.saveVersion < versionRef.current) return;
    versionRef.current = nextState.saveVersion;
    setState(nextState);
    setDisplay(nextState.coins);
    syncRef.current = { coins: nextState.coins, cps: nextState.cps, at: Date.now() };
  }, []);

  useEffect(() => {
    request('/api/game?resume=1')
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
      if (document.visibilityState === 'visible') {
        const returning = Date.now() - syncRef.current.at > 90000;
        request(`/api/game${returning ? '?resume=1' : ''}`).then(applyState).catch((cause) => setError(cause.message));
      }
    }, 15000);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        request('/api/game?resume=1').then(applyState).catch((cause) => setError(cause.message));
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [applyState]);

  useEffect(() => {
    let active = true;
    const pulse = () => {
      if (document.visibilityState !== 'visible') return;
      request('/api/presence', { method: 'POST' })
        .then((result) => {
          if (!active) return;
          setOnlineCount(result.onlineCount);
          setPresenceUnavailable(false);
        })
        .catch(() => {
          if (!active) return;
          setOnlineCount(null);
          setPresenceUnavailable(true);
        });
    };
    pulse();
    const id = setInterval(pulse, 60000);
    document.addEventListener('visibilitychange', pulse);
    return () => {
      active = false;
      clearInterval(id);
      document.removeEventListener('visibilitychange', pulse);
    };
  }, []);

  async function perform(action) {
    setBusy(true);
    setError(null);
    try {
      const nextState = await action();
      applyState(nextState);
      return nextState;
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleBuy(generatorId, quantity) {
    await perform(() => request('/api/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generatorId, ...(quantity ? { quantity } : {}) }),
    }));
  }

  async function handleUpgrade(upgradeId) {
    await perform(() => request('/api/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ upgradeId }),
    }));
  }

  if (!state) {
    return (
      <main className="loading-screen">
        <div className="loading-card">
          <span className="loading-mascot" aria-hidden="true"><GameIcon symbol="🐊" /></span>
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
          <span className="brand-mark" aria-hidden="true"><img src="/icons/fritz.webp" alt="" width="40" height="40" /></span>
          <span>Fritz <span className="brand-muted">em Joinville</span></span>
        </a>
        <nav className="main-nav" aria-label="Navegação do jogo">
          {[
            ['jornada', 'A jornada'],
            ['personagens', 'Personagens'],
            ['colecao', 'Coleção'],
            ['museu', 'Museu e eras'],
          ].map(([id, label]) => (
            <button key={id} className={`nav-link ${tab === id ? 'selected' : ''}`} disabled={busy} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="seed-pill" tabIndex={0} data-tooltip="Pórticos disponíveis para adquirir insígnias permanentes no museu">
          <span aria-hidden="true"><GameIcon symbol="🏰" /></span> {format(state.rebirth.points)} <span className="seed-word">Pórticos</span>
        </div>
        <div className={`online-pill ${presenceUnavailable ? 'presence-unavailable' : ''}`} title="Contagem aproximada de contas ativas nos últimos dois minutos; sem exibir nomes.">
          <span className="online-dot" aria-hidden="true" />
          {presenceUnavailable ? 'Presença indisponível' : onlineCount === null ? 'Conectando...' : `${onlineCount} ${onlineCount === 1 ? 'pessoa' : 'pessoas'} por aqui`}
        </div>
      </header>

      <div className="account-bar">
        <a className="player-identity" href="/perfil"><Avatar id={state.profile.avatarId} decorative /><EraPortal points={state.rebirth.points} count={state.rebirth.count} /><span>{state.profile.nickname} · editar perfil</span></a>
        <a className="community-profile-link" href="/mural"><GameIcon symbol="🌷" /> Mural-ranking e mensagens</a>
        <form action="/auth/logout" method="post"><button type="submit">Sair da conta</button></form>
      </div>
      <div className="resource-dock" aria-label="Recursos da jornada">
        <strong tabIndex={0} data-tooltip="Pétalas disponíveis"><GameIcon symbol="🌸" /> {format(display)}</strong>
        <span tabIndex={0} data-tooltip="Sementes disponíveis"><GameIcon symbol="🌱" /> {format(state.seeds)} · {format(state.seedsPerSecond)}/s</span>
        <span>Nível {state.rebirth.level} · Era {state.rebirth.count + 1}</span>
        <span className="offline-budget" title="O limite renova à meia-noite UTC. Melhorias aumentam o tempo disponível.">
          Até {Math.floor(state.offlineBudget.remainingSeconds / 3600)}h{Math.floor((state.offlineBudget.remainingSeconds % 3600) / 60) ? ` ${Math.floor((state.offlineBudget.remainingSeconds % 3600) / 60)}min` : ''} de progresso offline hoje
        </span>
        {state.share.until > Date.now() && <span><GameIcon symbol="✨" /> +20% até {new Date(state.share.until).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>}
      </div>

      <section className="hero" id="inicio">
        <div className="hero-art">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> UMA AVENTURA FEITA EM JOINVILLE</span>
            <h1>A cidade vai <span>florescer</span> de novo.</h1>
            <p>{state.profile.nickname}, uma ventania espalhou as pétalas mágicas. Fritz conta com você para percorrer Joinville, reencontrar velhos amigos e trazer a cor de volta para casa.</p>
            <div className="hero-signature"><span><GameIcon symbol="🐊" /></span> Fritz e a jornada das flores <span className="signature-line" /></div>
            <a className="hero-story-link" href="/historia">Ler as histórias ilustradas <span aria-hidden="true">→</span></a>
          </div>
          <div className="hero-image-credit">Joinville, onde toda aventura cria raízes</div>
        </div>

        <div className="stats-strip">
          <div className="petal-stat">
            <span className="stat-label">SUA CESTA DE PÉTALAS</span>
            <strong className="coins-value">{format(display)} <span><GameIcon symbol="🌸" /></span></strong>
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
            <span className="collect-flower" aria-hidden="true"><GameIcon symbol="🌼" /></span>
            <span>Recolher pétalas</span>
            <span className="collect-hint">+{format(state.clickValue)} por toque</span>
          </button>
        </div>
      </section>

      {offlineMsg && <div className="notice-banner" role="status"><span><GameIcon symbol="☀️" /></span><p>{offlineMsg}</p><button aria-label="Fechar mensagem" onClick={() => setOfflineMsg(null)}>×</button></div>}
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
                    <div className={`character-medallion ${state.nextChapter.color}`}><GameIcon name={PORTRAIT_ART[state.nextChapter.id]} /></div>
                    <div className="chapter-copy">
                      <span className="chapter-label">PRÓXIMO ENCONTRO</span>
                      <h3>{state.nextChapter.name}</h3>
                      <p>{state.nextChapter.story}</p>
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${chapterProgress}%` }} /></div>
                      <span className="progress-copy">{format(state.lifetime)} / {format(state.nextChapter.at)} pétalas recuperadas</span>
                      <a className="chapter-story-link" href="/historia">Abrir diário ilustrado <span aria-hidden="true">→</span></a>
                    </div>
                    <span className={`chapter-preview ${state.nextChapter.color}`} aria-hidden="true"><GameIcon name={PORTRAIT_ART[state.nextChapter.id]} /></span>
                  </div>
                ) : (
                  <div className="complete-chapter"><span><GameIcon symbol="🌷" /></span><div><h3>{state.profile.nickname}, Joinville floresceu outra vez!</h3><p>Todos os amigos estão juntos. <a href="/historia#trilhas-dos-lugares">Explore as 14 trilhas dos lugares de Joinville</a>, as bicicletas e os ofícios, ou atravesse o Pórtico no nível 20.</p></div></div>
                )}
              </section>

              <section className="section-block places-block">
                <div className="section-heading">
                  <div><span className="section-kicker">CADA CANTO CONTA</span><h2>Ative os lugares da cidade</h2></div>
                  <span className="section-aside">Pontos de Joinville que fazem história</span>
                </div>
                <p className="section-intro">Bicicletas e memórias das indústrias também fazem a cidade florescer. Geradores são fantasia, não produção real das empresas. <a href="/historia#trilhas-dos-lugares">Descubra também 14 trilhas de histórias pelos lugares de Joinville.</a></p>
                {state.journeys.filter((journey) => state.generators.some((generator) => generator.journey === journey.id)).map((journey) => <section className="places-journey" key={journey.id}>
                <h3><GameIcon symbol={journey.icon} /> {journey.name}</h3><p>{journey.description} <a href={`/historia?jornada=${journey.id}`}>Seguir esta trilha →</a></p>
                <div className="places-list">
                  {state.generators.filter((generator) => generator.journey === journey.id).map((generator, index) => {
                    const affordable = display >= generator.cost;
                    const maxQuantity = generatorPurchase(generator, generator.owned, display).quantity;
                    const maxDescription = `${maxQuantity.toLocaleString('pt-BR')} unidades com as pétalas disponíveis. O total é confirmado pelo servidor na compra.`;
                    return (
                      <article className={`place-card ${affordable ? 'affordable' : ''}`} key={generator.id}>
                        <div className={`place-icon place-tone-${index % 5}`}><GameIcon symbol={generator.icon} /></div>
                        <div className="place-copy"><h3>{generator.name}</h3><p>{generator.place}</p><span className="place-rate" tabIndex={0} data-tooltip="Rendimento por unidade com melhorias e bônus ativos; não inclui os toques automáticos dos gestores.">✦ +{generator.effectiveCps < 1000 ? generator.effectiveCps.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) : format(generator.effectiveCps)} pétalas/s cada</span></div>
                        <div className="place-owned"><strong>{generator.owned}</strong><span>ativos</span></div>
                        <button className="buy-button" disabled={!affordable || busy} onClick={() => handleBuy(generator.id)}>
                          <span>{format(generator.cost)}</span><small><GameIcon symbol="🌸" /></small>
                        </button>
                        <button className="max-button" aria-label={`Comprar o máximo de ${generator.name}`} aria-description={maxDescription} data-tooltip={maxDescription} disabled={!maxQuantity || busy} onClick={() => handleBuy(generator.id, 'max')}><span>max</span><strong>x{maxQuantity.toLocaleString('pt-BR')}</strong></button>
                      </article>
                    );
                  })}
                </div>
                </section>)}
              </section>

              <section className="section-block upgrades-block">
                <div className="section-heading">
                  <div><span className="section-kicker">UM CARINHO A MAIS</span><h2>Melhorias para Fritz</h2></div>
                  <span className="section-aside">Até 5 níveis por melhoria</span>
                </div>
                <div className="upgrade-grid">
                  {state.upgrades.map((upgrade, index) => (
                    <article className="upgrade-card" key={upgrade.id}>
                      <div className={`upgrade-icon upgrade-tone-${index % 4}`}><GameIcon symbol={upgrade.icon} /></div>
                      <div className="upgrade-copy"><h3>{upgrade.name}</h3><p>{upgrade.description}</p></div>
                      <div className="upgrade-bottom"><span>NÍVEL {upgrade.owned}/{upgrade.maxOwned}</span><button disabled={display < upgrade.cost || upgrade.owned >= upgrade.maxOwned || busy} onClick={() => handleUpgrade(upgrade.id)}>{upgrade.owned >= upgrade.maxOwned ? 'Completa' : <>{format(upgrade.cost)} <GameIcon symbol="🌸" /></>}</button></div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

          {tab === 'personagens' && (
            <section className="section-block full-tab">
              <div className="section-heading"><div><span className="section-kicker">GENTE QUE FAZ A CIDADE</span><h2>Amigos pelo caminho</h2></div><span className="chapter-counter">{unlockedCharacters.length} / {state.characters.length} reunidos</span></div>
              <p className="section-intro">Encontrar amigos mantém o bônus de +5%. Depois de adquirir o gerador de sementes, contrate-os com sementes como gestores: eles produzem sementes, melhoram os lugares e automatizam a coleta. São releituras fictícias, não atividades das pessoas reais.</p>
              <div className="daily-card">
                <span className="daily-illustration"><GameIcon symbol="🌱" /></span>
                <div><h3>Viveiro dos gestores</h3><p>Libera após recuperar 500 mi de pétalas nesta era. Custa 500 mi de pétalas; Fritz inicia a produção de 1 semente por minuto.</p><p>{format(state.seedGenerator.progress)} / 500 mi recuperadas · {format(state.seeds)} sementes disponíveis</p></div>
                <button className="story-button primary" disabled={busy || state.seedGenerator.owned || !state.seedGenerator.ready || display < state.seedGenerator.cost} onClick={() => perform(() => request('/api/seed-generator', { method: 'POST' }))}>{state.seedGenerator.owned ? 'Viveiro ativo' : <>Adquirir · 500 mi <GameIcon symbol="🌸" /></>}</button>
              </div>
              <div className="character-grid">
                {state.characters.map((character) => (
                  <article key={character.id} className={`character-card ${character.unlocked ? 'character-unlocked' : 'character-locked'}`}>
                    <div className={`character-medallion ${character.color}`}>{character.unlocked ? <GameIcon name={PORTRAIT_ART[character.id]} /> : <GameIcon symbol="🔒" />}</div>
                    <div><span className="character-status">{character.unlocked ? 'ENCONTRO REALIZADO' : `A PARTIR DE ${format(character.at)} PÉTALAS`}</span><h3>{character.name}</h3><p className="character-role">{character.role}</p><p className="character-story">{character.unlocked ? character.story : 'Recupere pétalas para encontrar esta pessoa na jornada.'}</p></div>
                    <div className="manager-actions">
                      <p><GameIcon symbol="🌱" /> {format(character.seedsPerSecond * 60)}/min · +{Math.round(character.productionBonus * 100)}% pétalas · {format(character.autoClicks)} toques/s automáticos</p>
                      <button className="story-button secondary" disabled={busy || character.hired || !character.unlocked || !state.seedGenerator.owned || state.seeds < character.seedCost}
                        onClick={() => perform(() => request('/api/manager', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ characterId: character.id }) }))}>
                        {character.hired ? 'Gestor ativo ✓' : character.id === 'fritz' ? 'Incluído no viveiro' : <>Contratar · {character.seedCost} <GameIcon symbol="🌱" /></>}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="history-note"><span><GameIcon symbol="📚" /></span><p>Releituras lúdicas de personagens e da memória local. <a href="https://ndmais.com.br/cidadania/quem-e-a-maior-celebridade-de-joinville-veja-fotos-e-vote/" target="_blank" rel="noreferrer">Conheça nomes da história cultural de Joinville ↗</a></p></div>
            </section>
          )}

          {tab === 'colecao' && (
            <section className="section-block full-tab">
              <div className="section-heading"><div><span className="section-kicker">PEQUENAS GRANDES VITÓRIAS</span><h2>Conquistas da jornada</h2></div><span className="chapter-counter">{state.achievements.filter((item) => item.unlocked).length} / {state.achievements.length} conquistas</span></div>
              <p className="section-intro">Complete capítulos e jornadas: 8 histórias das flores, 3 de bicicletas, 5 de ofícios e 14 trilhas dos lugares. As conquistas ficam guardadas quando você planta novas raízes.</p>
              <div className="achievement-list">
                {state.achievements.map((achievement) => (
                  <article className={`achievement-card ${achievement.unlocked ? 'achievement-unlocked' : ''}`} key={achievement.id}>
                    <span className="achievement-icon">{achievement.unlocked ? <GameIcon symbol={achievement.icon} /> : <GameIcon symbol="🔒" />}</span>
                    <div><h3>{achievement.name}</h3><p>{achievement.description}</p></div>
                    <span className="achievement-status">{achievement.unlocked ? 'CONQUISTADA' : 'A DESCOBRIR'}</span>
                  </article>
                ))}
              </div>
              <div className="daily-card">
                <div className="daily-illustration"><GameIcon symbol="🎁" /></div>
                <div className="daily-copy"><span className="section-kicker">UMA SURPRESA POR DIA</span><h3>Presente da Cidade</h3><p>{state.dailyAvailable ? `Abra seu presente e receba ${format(state.dailyReward)} pétalas para a jornada.` : 'Seu presente já foi resgatado. Uma nova surpresa estará disponível em até 24 horas.'}</p></div>
                <button className="daily-button" disabled={!state.dailyAvailable || busy} onClick={() => perform(() => request('/api/daily', { method: 'POST' }))}>{state.dailyAvailable ? 'Abrir presente' : 'Até amanhã'} <span>→</span></button>
              </div>
            </section>
          )}
          {tab === 'museu' && <CityMuseum state={state} busy={busy} error={error}
            onPurchase={(itemId) => perform(() => request('/api/museum', {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId }),
            }))}
            onRebirth={(expectedCycle) => perform(() => request('/api/rebirth', {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expectedCycle }),
            }))} />}
        </section>

        <aside className="side-column">
          <section className="side-card objective-card">
            <div className="side-card-heading"><span className="side-icon"><GameIcon symbol="🧭" /></span><div><span className="section-kicker">OBJETIVO DA JORNADA</span><h2>{state.nextChapter ? `Encontrar ${state.nextChapter.name}` : 'A cidade voltou a florescer'}</h2></div></div>
            {state.nextChapter ? <><div className="progress-track objective-track"><div className="progress-fill" style={{ width: `${chapterProgress}%` }} /></div><p>{format(Math.max(0, state.nextChapter.at - state.lifetime))} pétalas até o próximo encontro.</p></> : <p>Todos os personagens se reuniram. A aventura pode recomeçar com novas raízes!</p>}
            <button className="side-action" onClick={() => setTab('personagens')}>Ver a história <span>↗</span></button>
            <a className="side-story-link" href="/historia">Ler a aventura completa <span aria-hidden="true">→</span></a>
          </section>

          <section className="side-card roots-card">
            <div className="side-card-heading"><span className="side-icon"><GameIcon symbol="🏰" /></span><div><span className="section-kicker">PRÓXIMA ERA</span><h2>Pórtico de Joinville</h2></div></div>
            <p>Pétalas, histórias, lugares e melhorias fazem seu nível crescer. No nível 20, abra uma era e receba Pórticos para o museu.</p>
            <strong>Nível {state.rebirth.level} · {format(state.rebirth.reward)} Pórticos na troca</strong>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${state.rebirth.nextLevelProgress * 100}%` }} /></div>
            <button className="side-action" onClick={() => setTab('museu')}>Museu e Pórtico de Joinville <span>→</span></button>
            <button className="side-action" onClick={() => setTab('personagens')}>Gestores · {format(state.seeds)} sementes <span>→</span></button>
          </section>

          <section className="side-card return-card">
            <span className="return-icon"><GameIcon symbol="☀️" /></span><div><span className="section-kicker">A CIDADE SEGUE VIVA</span><h2>Até na sua ausência</h2></div>
            <p>Seus lugares continuam trazendo pétalas por até {state.multipliers.offlineHours} horas enquanto você descansa.</p>
          </section>

          <div className="city-note"><span><GameIcon symbol="🌷" /></span><p><strong>Joinville, Cidade das Flores e das Bicicletas.</strong><br />Uma jornada de carinho pela cidade e por quem a constrói.</p></div>
        </aside>
      </div>

      <footer className="game-footer"><span>Uma homenagem à cultura, à natureza e às pessoas de Joinville.</span><span>Feito com carinho para <span aria-label="Joinville"><GameIcon symbol="💚" /></span></span></footer>
    </main>
  );
}

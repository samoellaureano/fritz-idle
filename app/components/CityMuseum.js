'use client';

import { useEffect, useRef, useState } from 'react';
import { PortalArt } from './EraPortal';

const number = (value) => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

function KeepsakeArt({ id }) {
  return (
    <svg className="museum-art" viewBox="0 0 240 140" aria-hidden="true">
      <defs><linearGradient id={`shelf-${id}`} x2="0" y2="1"><stop stopColor="#2d4b37" /><stop offset="1" stopColor="#13251d" /></linearGradient></defs>
      <rect x="4" y="4" width="232" height="132" rx="18" fill={`url(#shelf-${id})`} />
      <ellipse cx="120" cy="118" rx="82" ry="8" fill="#0b1815" />
      <g fill="none" stroke="#f3cb78" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {id === 'bicicleta' && <><circle cx="64" cy="90" r="26" /><circle cx="174" cy="90" r="26" /><path d="M64 90l32-45 26 45H64m32-45h61l-35 45m52 0-24-61h18M86 37h23" /><path d="M153 40h30v18h-24" stroke="#b7d884" /></>}
        {id === 'dohler' && <><path d="M64 115V30h112v85M55 115h130M75 48h90M75 96h90" /><path d="M82 50v43m15-43v43m15-43v43m15-43v43m15-43v43m15-43v43" stroke="#b7d884" /><path d="M78 64h83M78 78h83" stroke="#e48a72" /></>}
        {id === 'wetzel' && <><path d="M103 28h34l4 15 15 8 15-3 16 28-11 11v17l-15 9-15-5-26 8-20-8-15 5-15-26 11-13V57l15-9z" /><circle cx="120" cy="74" r="20" stroke="#b7d884" /></>}
        {id === 'tupy' && <><path d="M62 112V30q30-8 58 7 28-15 58-7v82q-30-8-58 7-28-15-58-7zM120 37v82" /><path d="M76 53h29M76 68h29M76 83h29m31-30h28m-28 15h28m-28 15h28" stroke="#b7d884" /></>}
        {id === 'consul' && <><rect x="86" y="22" width="68" height="96" rx="9" /><path d="M86 55h68M98 37v8m0 23v17" /><path d="M125 78v23m0-14q-15-12-19-2 8 12 19 2m0-8q14-13 19-4-7 11-19 4" stroke="#b7d884" /></>}
        {id === 'ciser' && <><path d="M60 43l18-18 25 25-18 18zM94 61l62 57 16-17-62-57M111 67l14-14m-1 27 14-14m-1 27 14-14m-1 27 14-14" /><path d="M157 30l21-10 20 12v24l-21 11-20-12z" /><circle cx="177" cy="43" r="9" stroke="#b7d884" /></>}
        {id === 'roda-da-memoria' && <><circle cx="120" cy="68" r="42" /><circle cx="120" cy="68" r="8" /><path d="M120 26v84M78 68h84M90 38l60 60M90 98l60-60M108 108l-12 16m36-16l12 16" /></>}
      </g>
      <circle cx="210" cy="24" r="3" fill="#f3cb78" /><path d="M28 34h12m-6-6v12" stroke="#b7d884" strokeWidth="2" />
    </svg>
  );
}

export default function CityMuseum({ state, busy, error, onPurchase, onRebirth }) {
  const [celebration, setCelebration] = useState(null);
  const confirmRef = useRef(null);
  const celebrateRef = useRef(null);
  const rebirth = state.rebirth;

  useEffect(() => {
    if (celebration) celebrateRef.current.showModal();
  }, [celebration]);

  async function reset() {
    const result = await onRebirth(rebirth.count);
    if (!result) return;
    confirmRef.current.close();
    setCelebration(result.rebirthAward);
  }

  return (
    <section className="section-block full-tab museum-section" aria-labelledby="museum-heading">
      <div className="section-heading"><div><span className="section-kicker">O QUE A CIDADE GUARDA EM VOCÊ</span><h2 id="museum-heading">Museu das pequenas memórias</h2></div><span className="chapter-counter">{state.museum.filter((item) => item.owned).length}/{state.museum.length} peças</span></div>
      <p className="section-intro">{state.profile.nickname}, seus Pórticos podem virar insígnias para sempre. Os lugares trazem pétalas; os gestores produzem sementes; o museu protege as memórias. A Roda da Memória agora é uma peça do acervo, não uma moeda de era.</p>
      <p className="community-note">Miniaturas fictícias originais, inspiradas na história local — não são peças reais de acervos, produtos oficiais ou patrocínios. Cada insígnia adquirida com Pórticos melhora sua produção e seus toques permanentemente e acompanha seu nome no mural.</p>
      <div className="museum-grid">
        {state.museum.map((item) => (
          <article className={`museum-item ${item.owned ? 'museum-owned' : ''}`} key={item.id}>
            <KeepsakeArt id={item.id} />
            <h3>{item.name}</h3><p>{item.description}</p>
            <p className="museum-bonus">+{number(item.productionBonus * 100)}% produção · +{item.clickFlat} por toque, permanentes</p>
            <a href={item.source.url} target="_blank" rel="noreferrer">Inspiração histórica ↗</a>
            <button className="story-button secondary" disabled={busy || item.owned || state.rebirth.points < item.cost} onClick={() => onPurchase(item.id)}>
              {item.owned ? 'Guardada no museu ✓' : `Adquirir ${item.name} · ${number(item.cost)} Pórticos`}
            </button>
          </article>
        ))}
      </div>
      <section className="rebirth-card" aria-labelledby="rebirth-heading">
        <PortalArt /><span className="section-kicker">UM NOVO CAMINHO SE ABRE</span><h2 id="rebirth-heading">Pórtico de Joinville</h2>
        <p>Uma miniatura imaginária da entrada de Joinville celebra sua coragem de recomeçar. Fritz atravessa com os amigos, o diário e o museu. A economia recomeça; o carinho fica.</p>
        <p><strong>{number(rebirth.points)} Pórticos · {rebirth.count} novas eras · +{number(rebirth.productionBonus * 100)}% produção permanente</strong></p>
        <p>Nível {rebirth.level} de jornada · nível {rebirth.requiredLevel} para abrir uma era.</p>
        <progress value={Math.min(rebirth.requiredLevel, rebirth.level)} max={rebirth.requiredLevel} aria-label="Nível para abrir uma nova era" />
        <h3>Prévia: {number(rebirth.reward)} Pórticos de Joinville</h3>
        <ul className="rebirth-breakdown">{rebirth.breakdown.map((part) => <li key={part.id}><span>{part.label}</span><strong>{number(part.points)} XP</strong></li>)}</ul>
        <p className="museum-formula">Nível = 1 + parte inteira do XP acima. A troca é nível ÷ 20: 20 = 1 Pórtico, 30 = 1,5 e 40 = 2. Cada Pórtico disponível soma +10% de produção; as insígnias compradas têm bônus próprios permanentes. O XP da era reinicia, sem repetir recompensas de histórias já guardadas.</p>
        <p>O XP equilibra a cidade: pétalas sustentam o avanço e cada gestor soma 0,75 XP. Histórias, compras, melhorias, toques e insígnias têm limites de contribuição para não antecipar demais a troca. As histórias continuam dando pétalas e bônus permanentes mesmo após o limite de XP.</p>
        <p>Antes de recomeçar, experimente o viveiro e seus gestores. O nível 20 abre uma escolha, não encerra a jornada: desenvolver a automação e seguir explorando aumenta os Pórticos da troca.</p>
        <button className="story-button primary" disabled={!rebirth.ready || busy} onClick={() => confirmRef.current.showModal()}>Abrir uma nova era</button>
        {!rebirth.ready && <p>Explore, leia e melhore a cidade até o nível {rebirth.requiredLevel}.</p>}
      </section>
      <dialog className="memory-dialog" ref={confirmRef} aria-labelledby="reset-title" onCancel={(event) => { if (busy) event.preventDefault(); }}>
        <h2 id="reset-title">Levar a memória, recomeçar a economia?</h2>
        <p>Você recebe <strong>{number(rebirth.reward)} Pórticos</strong> pelo progresso atual. A produção pode aumentar esse valor até a confirmação.</p>
        <p><strong>Zeram:</strong> saldo de pétalas, sementes, lugares, melhorias, contratação de gestores, gerador de sementes e XP desta era.</p>
        <p><strong>Ficam:</strong> pétalas históricas, personagens encontrados, histórias e seus bônus, conquistas, museu, Pórticos, apelido, avatar e mensagens. Presente diário e bônus de compartilhamento mantêm seus intervalos.</p>
        <p>Não é possível desfazer. Os gestores poderão ser contratados novamente na próxima era.</p>
        {error && <p className="story-error" role="alert">{error}</p>}
        <div className="memory-dialog-actions">
          <button className="story-button secondary" disabled={busy} onClick={() => confirmRef.current.close()}>Continuar esta jornada</button>
          <button className="story-button primary" disabled={busy} onClick={reset}>{busy ? 'Preparando a cestinha...' : 'Confirmar redefinição'}</button>
        </div>
      </dialog>
      <dialog className="memory-dialog memory-celebration" ref={celebrateRef} aria-labelledby="celebration-title" onClose={() => setCelebration(null)}>
        <div className="fritz-new-era" aria-hidden="true"><span>🌸</span><span className="fritz-rider">🐊</span><PortalArt /><span>🌱</span></div>
        <h2 id="celebration-title">A gente leva o que ama.</h2>
        <p>{state.profile.nickname}, Fritz ajeita as lembranças na cestinha e sorri: “A cidade pode florescer outra vez. Você vem comigo?”</p>
        <p role="status"><strong>+{number(celebration ?? 0)} Pórticos de Joinville!</strong> Sua nova era já acompanha seu avatar no mural.</p>
        <button className="story-button primary" onClick={() => celebrateRef.current.close()}>Atravessar para a próxima aventura</button>
      </dialog>
    </section>
  );
}

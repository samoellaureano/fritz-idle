'use client';

import GameIcon from '@/app/components/GameIcon';
import { useEffect, useRef, useState } from 'react';
import { PortalArt } from './EraPortal';
import { MUSEUM_ART } from '@/lib/icon-art';

const number = (value) => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

function KeepsakeArt({ id }) {
  return <GameIcon name={MUSEUM_ART[id]} className="museum-art" />;
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
      <p className="section-intro">{state.profile.nickname}, seus Pórticos podem virar insígnias para sempre. Os lugares trazem pétalas; os personagens produzem sementes; o museu protege as memórias. A Roda da Memória agora é uma peça do acervo, não uma moeda de era.</p>
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
        <p>O XP equilibra a cidade: pétalas sustentam o avanço e cada personagem contratado soma 0,75 XP. Histórias, compras, melhorias, toques e insígnias têm limites de contribuição para não antecipar demais a troca. As histórias continuam dando pétalas e bônus permanentes mesmo após o limite de XP.</p>
        <p>Antes de recomeçar, experimente o viveiro e seus personagens. O nível 20 abre uma escolha, não encerra a jornada: desenvolver a automação e seguir explorando aumenta os Pórticos da troca.</p>
        <button className="story-button primary" disabled={!rebirth.ready || busy} onClick={() => confirmRef.current.showModal()}>Abrir uma nova era</button>
        {!rebirth.ready && <p>Explore, leia e melhore a cidade até o nível {rebirth.requiredLevel}.</p>}
      </section>
      <dialog className="memory-dialog" ref={confirmRef} aria-labelledby="reset-title" onCancel={(event) => { if (busy) event.preventDefault(); }}>
        <h2 id="reset-title">Levar a memória, recomeçar a economia?</h2>
        <p>Você recebe <strong>{number(rebirth.reward)} Pórticos</strong> pelo progresso atual. A produção pode aumentar esse valor até a confirmação.</p>
        <p><strong>Zeram:</strong> saldo de pétalas, sementes, lugares, melhorias, contratação de personagens, gerador de sementes e XP desta era.</p>
        <p><strong>Ficam:</strong> pétalas históricas, personagens encontrados, histórias e seus bônus, conquistas, museu, Pórticos, apelido, avatar e mensagens. Presente diário e bônus de compartilhamento mantêm seus intervalos.</p>
        <p>Não é possível desfazer. Os personagens poderão ser contratados novamente na próxima era.</p>
        {error && <p className="story-error" role="alert">{error}</p>}
        <div className="memory-dialog-actions">
          <button className="story-button secondary" disabled={busy} onClick={() => confirmRef.current.close()}>Continuar esta jornada</button>
          <button className="story-button primary" disabled={busy} onClick={reset}>{busy ? 'Preparando a cestinha...' : 'Confirmar redefinição'}</button>
        </div>
      </dialog>
      <dialog className="memory-dialog memory-celebration" ref={celebrateRef} aria-labelledby="celebration-title" onClose={() => setCelebration(null)}>
        <div className="fritz-new-era" aria-hidden="true"><span><GameIcon symbol="🌸" /></span><span className="fritz-rider"><GameIcon symbol="🐊" /></span><PortalArt /><span><GameIcon symbol="🌱" /></span></div>
        <h2 id="celebration-title">A gente leva o que ama.</h2>
        <p>{state.profile.nickname}, Fritz ajeita as lembranças na cestinha e sorri: “A cidade pode florescer outra vez. Você vem comigo?”</p>
        <p role="status"><strong>+{number(celebration ?? 0)} Pórticos de Joinville!</strong> Sua nova era já acompanha seu avatar no mural.</p>
        <button className="story-button primary" onClick={() => celebrateRef.current.close()}>Atravessar para a próxima aventura</button>
      </dialog>
    </section>
  );
}

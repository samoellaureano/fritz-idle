'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ENCOURAGEMENTS, MESSAGE_COOLDOWN_SECONDS, MESSAGE_MAX_LENGTH } from '@/lib/community';
import { gameRequest as request } from '@/lib/client-request';
import Avatar from '@/app/components/Avatar';
import EraPortal from '@/app/components/EraPortal';
import MuseumBadges from '@/app/components/MuseumBadges';
import ProgressShare from '@/app/components/ProgressShare';

const number = (value) => Number(value).toLocaleString('pt-BR', { notation: 'compact', maximumFractionDigits: 2 });
const time = (value) => new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

function RankingEntry({ entry, own }) {
  return (
    <li className={`ranking-entry ${own ? 'own-ranking' : ''}`}>
      <span className="ranking-place">#{entry.rank}</span>
      <Avatar id={entry.avatar_id} decorative />
      <EraPortal points={Number(entry.porticos)} count={Number(entry.rebirths)} />
      <div className="ranking-copy"><strong>{entry.nickname}{own && <small> você</small>} <MuseumBadges items={entry.museum} /></strong>
        <div className="ranking-stats"><span>🌱 {number(entry.seeds)} sementes</span><span>📖 {number(entry.memories)} histórias</span><span>🌸 {number(entry.lifetime)} pétalas</span></div>
      </div>
    </li>
  );
}

export default function CommunityPage() {
  const [board, setBoard] = useState(null);
  const [game, setGame] = useState(null);
  const [text, setText] = useState('');
  const [presetId, setPresetId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const untilRef = useRef(0);
  const requestRef = useRef(0);
  const applyGame = useCallback((next) => setGame((previous) => previous && previous.saveVersion > next.saveVersion ? previous : next), []);

  const refresh = useCallback(async () => {
    const sequence = ++requestRef.current;
    // Tick only the viewer's save; visiting the mural must not advance other players.
    const progress = await request('/api/game');
    const data = await request('/api/community');
    if (sequence !== requestRef.current) return;
    setBoard(data);
    applyGame(progress);
    untilRef.current = data.profile.lastMessageAt
      ? new Date(data.profile.lastMessageAt).getTime() + MESSAGE_COOLDOWN_SECONDS * 1000 : 0;
    setRemaining(Math.max(0, Math.ceil((untilRef.current - Date.now()) / 1000)));
  }, [applyGame]);

  useEffect(() => {
    refresh().catch((cause) => setError(cause.message));
    const interval = setInterval(() => refresh().catch((cause) => setError(cause.message)), 30000);
    return () => { clearInterval(interval); requestRef.current++; };
  }, [refresh]);

  useEffect(() => {
    const timer = setInterval(() => setRemaining(Math.max(0, Math.ceil((untilRef.current - Date.now()) / 1000))), 1000);
    return () => clearInterval(timer);
  }, []);

  async function publish(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await request('/api/community/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(presetId ? { presetId } : { text }),
      });
      untilRef.current = Date.now() + MESSAGE_COOLDOWN_SECONDS * 1000;
      setRemaining(MESSAGE_COOLDOWN_SECONDS);
      setText('');
      setPresetId('');
      setNotice(`${board.profile.nickname}, seu incentivo já está florescendo no mural!`);
      await refresh();
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(messageId) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await request('/api/community/messages', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messageId }),
      });
      setNotice('Sua mensagem foi retirada do mural.');
      await refresh();
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="story-page community-page">
      <header className="story-topbar">
        <a className="story-brand" href="/"><span aria-hidden="true"><img src="/fritz-logo.svg" alt="" width="40" height="40" /></span><span>Fritz <span>em Joinville</span></span></a>
        <nav className="story-nav-actions" aria-label="Navegação da comunidade"><a className="back-to-game" href="/historia">Diário ilustrado</a><a className="back-to-game" href="/">← Voltar a jogar</a></nav>
      </header>
      <section className="community-hero mural-hero">
        <span className="story-eyebrow">O JARDIM DAS JORNADAS</span>
        <h1>{board ? `${board.profile.nickname}, ninguém floresce sozinho.` : 'Ninguém floresce sozinho.'}</h1>
        <p>Cada Pórtico abre um caminho. Cada história protege uma memória. Deixe uma palavra boa para quem caminha com Fritz ao seu lado.</p>
        {board && <a className="community-profile-link" href="/perfil"><Avatar id={board.profile.avatarId} decorative /><EraPortal points={Number(board.me.porticos)} count={Number(board.me.rebirths)} /><span>{board.profile.nickname} <MuseumBadges items={board.me.museum} /> · editar apelido e avatar →</span></a>}
      </section>
      {game && <ProgressShare state={game} onUpdate={applyGame} />}
      {error && <div className="story-error" role="alert">{error} <button className="story-button secondary" disabled={busy} onClick={() => { setError(''); refresh().catch((cause) => setError(cause.message)); }}>Atualizar mural</button></div>}
      {notice && <p className="story-reward" role="status">{notice}</p>}
      {!board ? <p className="community-loading">{error ? 'O mural está indisponível neste momento.' : 'Reunindo as jornadas da cidade...'}</p> : (
        <div className="community-layout">
          <section className="community-card ranking-card" aria-labelledby="ranking-title">
            <span className="story-eyebrow">RAÍZES QUE INSPIRAM</span><h2 id="ranking-title">Mural-ranking</h2>
            <p>As 50 primeiras jornadas, por Pórticos de Joinville, depois sementes disponíveis, histórias concluídas e pétalas históricas. Em empate, o perfil mais antigo vem primeiro.</p>
            <p className="community-note">O progresso é atualizado quando cada jogador joga ou abre o mural. As pétalas históricas continuam guardadas após a troca de era.</p>
            <ol className="ranking-list">{board.ranking.map((entry) => <RankingEntry key={entry.profile_id} entry={entry} own={entry.profile_id === board.profile.id} />)}</ol>
            {Number(board.me.rank) > 50 && <><h3>Sua posição na cidade</h3><ol className="ranking-list"><RankingEntry entry={board.me} own /></ol></>}
          </section>
          <section className="community-card feed-card" aria-labelledby="feed-title">
            <span className="story-eyebrow">PALAVRAS TAMBÉM SÃO SEMENTES</span><h2 id="feed-title">Correio das flores</h2>
            <form className="message-form" onSubmit={publish}>
              <fieldset disabled={busy}>
                <legend>Escolha um incentivo pronto</legend>
                <div className="encouragement-options">
                  {ENCOURAGEMENTS.map((item) => <button type="button" className={presetId === item.id ? 'selected' : ''} key={item.id}
                    aria-pressed={presetId === item.id} onClick={() => { setPresetId(presetId === item.id ? '' : item.id); }}>{item.text}</button>)}
                </div>
                <label htmlFor="encouragement">Ou escreva com suas palavras</label>
                <textarea id="encouragement" rows={3} value={text} maxLength={MESSAGE_MAX_LENGTH * 2}
                  onChange={(event) => { setText(event.target.value); setPresetId(''); }} aria-describedby="message-hint"
                  aria-invalid={[...text.trim().normalize('NFC')].length > MESSAGE_MAX_LENGTH} />
                <p id="message-hint">{[...text].length}/{MESSAGE_MAX_LENGTH} · Uma mensagem por minuto. Gentileza sempre; não publique dados pessoais.</p>
              </fieldset>
              <button className="story-button primary" type="submit" disabled={busy || remaining > 0
                || (!presetId && (!text.trim() || [...text.trim().normalize('NFC')].length > MESSAGE_MAX_LENGTH))}>
                {busy ? 'Cuidando do mural...' : remaining > 0 ? `Novo incentivo em ${remaining}s` : 'Espalhar um incentivo'}
              </button>
            </form>
            <h3>As 50 mensagens mais recentes</h3>
            {!board.messages.length && <p>O primeiro bilhete pode ser seu. Que tal plantar uma palavra boa?</p>}
            <ol className="message-list">{board.messages.map((message) => (
              <li className="message-card" key={message.id}>
                <div className="message-author"><Avatar id={message.player_profiles.avatar_id} decorative /><EraPortal points={Number(message.progress.porticos)} count={Number(message.progress.rebirths)} /><div><strong>{message.player_profiles.nickname} <MuseumBadges items={message.progress.museum} /></strong><time dateTime={message.created_at}>{time(message.created_at)}</time></div></div>
                <p>{message.text}</p>
                {message.profile_id === board.profile.id && <button className="story-button secondary" disabled={busy} onClick={() => remove(message.id)}>Excluir minha mensagem</button>}
              </li>
            ))}</ol>
          </section>
        </div>
      )}
      <footer className="story-footer"><a href="/">← Sua jornada continua</a><span>Joinville floresce quando a gente cuida junto.</span></footer>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { AVATARS, avatarFor } from '@/lib/community';
import { gameRequest as request } from '@/lib/client-request';
import Avatar from '@/app/components/Avatar';
import MemoryWheel from '@/app/components/MemoryWheel';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [nickname, setNickname] = useState('');
  const [avatarId, setAvatarId] = useState('fritz');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    request('/api/profile').then(({ profile: saved, progress: savedProgress }) => {
      setProfile(saved);
      setProgress(savedProgress);
      if (saved) {
        setNickname(saved.nickname);
        setAvatarId(saved.avatarId);
      }
      setLoaded(true);
    }).catch((cause) => setError(cause.message));
  }, []);

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await request('/api/profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, avatarId }),
      });
      window.location.assign('/');
    } catch (cause) {
      setError(cause.message);
      setBusy(false);
    }
  }

  return (
    <main className="story-page community-page">
      <header className="story-topbar">
        <a className="story-brand" href="/"><span aria-hidden="true">🐊</span><span>Fritz <span>em Joinville</span></span></a>
        {profile && <a className="back-to-game" href="/">← Voltar a jogar</a>}
      </header>
      <section className="community-hero profile-hero" style={{ backgroundImage: `linear-gradient(90deg, #10211df2, #10211d80), url("${avatarFor(avatarId).art}")` }}>
        <span className="story-eyebrow">SEU NOME TAMBÉM FAZ PARTE DA HISTÓRIA</span>
        <h1>{profile ? `${profile.nickname}, suas raízes estão aqui.` : 'Como Fritz pode chamar você?'}</h1>
        <p>Há uma cidade inteira esperando pela sua próxima pétala. Escolha um apelido e uma companhia inspirada na memória de Joinville.</p>
      </section>
      {!loaded ? (
        <div className="community-card"><p>{error ? 'Não foi possível abrir seu perfil.' : 'Preparando seu lugar na jornada...'}</p>{error && <><p className="story-error" role="alert">{error}</p><button className="story-button secondary" onClick={() => window.location.reload()}>Tentar novamente</button></>}</div>
      ) : (
        <form className="community-card profile-form" onSubmit={save}>
          <div className="profile-name-row">
            <Avatar id={avatarId} />
            {progress && <MemoryWheel points={Number(progress.wheels)} count={Number(progress.rebirths)} />}
            <div className="profile-name-input">
              <label htmlFor="nickname">Seu apelido em Joinville</label>
              <input id="nickname" name="nickname" value={nickname} onChange={(event) => setNickname(event.target.value)}
                required minLength={3} maxLength={24} autoComplete="nickname" aria-describedby="nickname-hint" />
              <p id="nickname-hint">De 3 a 24 letras ou números, sem espaços. Pode usar - e _. O apelido é único, sem diferenciar maiúsculas de minúsculas.</p>
            </div>
          </div>
          <fieldset className="avatar-fieldset">
            <legend>Escolha seu avatar</legend>
            <p>Retratos lúdicos originais, não fotografias ou perfis das personalidades reais. Fritz é nosso guardião fictício. Conheça as referências no <a href="/historia">diário ilustrado</a>.</p>
            <div className="avatar-options">
              {AVATARS.map((avatar) => (
                <label key={avatar.id} className={`avatar-option ${avatarId === avatar.id ? 'chosen' : ''}`}>
                  <input type="radio" name="avatar" value={avatar.id} checked={avatarId === avatar.id}
                    onChange={() => setAvatarId(avatar.id)} />
                  <Avatar id={avatar.id} decorative />
                  <strong>{avatar.name}</strong><small>{avatar.role}</small>
                </label>
              ))}
            </div>
          </fieldset>
          <aside className="community-note">Ao salvar, seu apelido, avatar e progresso entram no ranking visível aos demais jogadores autenticados. Seu nome Google e e-mail não aparecem. Evite dados pessoais no apelido e nas mensagens.</aside>
          {error && <p className="story-error" role="alert">{error}</p>}
          <button className="story-button primary" type="submit" disabled={busy}>{busy ? 'Criando raízes...' : profile ? 'Salvar minha identidade' : 'Começar minha jornada com Fritz'}</button>
        </form>
      )}
    </main>
  );
}

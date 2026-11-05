'use client';

import { useEffect, useRef, useState } from 'react';
import { gameRequest as request } from '@/lib/client-request';
import { formatCompactNumber as number } from '@/lib/format-number';
import { MUSEUM_ART } from '@/lib/icon-art';

const SHARE_URL = 'https://fritzidle.com.br';

async function loadCardArt(state) {
  const names = ['background', 'fritz', ...state.museum.filter(item => item.owned).map(item => MUSEUM_ART[item.id])];
  return Object.fromEntries(await Promise.all(names.map(name => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve([name, image]);
    image.onerror = () => reject(new Error('Não foi possível carregar a ilustração do cartão. Atualize o mural para tentar novamente.'));
    image.src = name === 'background' ? '/historia-palmeiras.jpg' : `/icons/${name}.webp`;
  }))));
}

export function drawProgressCard(canvas, state, art) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Seu navegador não conseguiu preparar o cartão.');
  canvas.width = 1080;
  canvas.height = 1080;
  const side = Math.min(art.background.width, art.background.height);
  ctx.drawImage(art.background, (art.background.width - side) / 2, (art.background.height - side) / 2,
    side, side, 0, 0, 1080, 1080);
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
  gradient.addColorStop(0, '#10211df5');
  gradient.addColorStop(.4, '#10211dd9');
  gradient.addColorStop(.65, '#10211d33');
  gradient.addColorStop(1, '#10211df5');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.save();
  ctx.beginPath(); ctx.arc(110, 82, 42, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(art.fritz, 68, 40, 84, 84);
  ctx.restore();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f5dfa5';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('FRITZ EM JOINVILLE', 540, 85);
  ctx.fillStyle = '#fff5dc';
  ctx.font = 'bold 57px sans-serif';
  ctx.fillText('Ninguém floresce sozinho.', 540, 175);
  ctx.font = '32px sans-serif';
  ctx.fillText('Uma pétala. Uma história. Um novo começo.', 540, 235);
  ctx.font = 'bold 39px sans-serif';
  ctx.fillText(state.profile.nickname, 540, 320);
  ctx.font = '28px sans-serif';
  ctx.fillText(`Nível ${state.rebirth.level} · Era ${state.rebirth.count + 1} · ${number(state.lifetime)} pétalas`, 540, 375);
  const badges = state.museum.filter((item) => item.owned);
  ctx.fillText(`${state.storyMemoryCount} histórias · ${badges.length} ${badges.length === 1 ? 'insígnia' : 'insígnias'} · ${number(state.rebirth.points)} Pórticos`, 540, 423);
  badges.forEach((item, index) => ctx.drawImage(art[MUSEUM_ART[item.id]], 512 + (index - (badges.length - 1) / 2) * 65, 787, 56, 56));
  ctx.fillStyle = '#102f2c';
  ctx.beginPath(); ctx.roundRect(65, 878, 950, 155, 25); ctx.fill();
  ctx.fillStyle = '#fff5dc';
  ctx.font = '27px sans-serif';
  ctx.fillText('Um jogo idle sobre flores, bicicletas e memórias de Joinville.', 540, 926);
  ctx.fillText('Venha cuidar da cidade com Fritz. Seu caminho também importa.', 540, 970);
  ctx.fillStyle = '#c8dfa4'; ctx.font = '22px sans-serif';
  ctx.fillText(SHARE_URL, 540, 1010, 880);
}

export default function ProgressShare({ state, onUpdate }) {
  const canvasRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [ready, setReady] = useState(false);
  const badgeCount = state.museum.filter((item) => item.owned).length;
  const description = `Em Fritz em Joinville, cada pétala devolve cor à cidade e cada história vira memória. Cheguei ao nível ${state.rebirth.level}, com ${state.storyMemoryCount} histórias e ${badgeCount} ${badgeCount === 1 ? 'insígnia' : 'insígnias'}! Um jogo idle de flores, bicicletas, encontros e novos começos. Ninguém floresce sozinho: venha trilhar seu caminho com Fritz!`;

  useEffect(() => {
    let disposed = false;
    setReady(false);
    loadCardArt(state).then(art => {
      if (disposed) return;
      drawProgressCard(canvasRef.current, state, art);
      setReady(true);
    }).catch(cause => { if (!disposed) setError(cause.message); });
    return () => { disposed = true; };
  }, [state]);

  async function share(exportOnly = false) {
    setBusy(true); setError(''); setNotice('');
    try {
      const text = `${description} ${SHARE_URL}`;
      const blob = await new Promise((resolve, reject) => canvasRef.current.toBlob((result) => result ? resolve(result) : reject(new Error('Não foi possível exportar a arte.')), 'image/png'));
      const file = new File([blob], 'minha-jornada-com-fritz.png', { type: 'image/png' });
      if (!exportOnly && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Ninguém floresce sozinho — Fritz em Joinville', text, files: [file] });
      } else {
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl; link.download = file.name; link.click();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        setNotice('Cartão exportado! Copie a mensagem abaixo para publicar na sua rede favorita.');
      }
      if (state.share.ready) {
        const updated = await request('/api/share', { method: 'POST' });
        onUpdate(updated);
        setNotice('Sua jornada pode inspirar alguém! +20% de pétalas e sementes por 30 minutos. Cartão e mensagem prontos para compartilhar.');
      }
    } catch (cause) {
      if (cause.name === 'AbortError') setNotice('Compartilhamento cancelado; nenhum bônus foi solicitado.');
      else setError(cause.message);
    } finally { setBusy(false); }
  }

  return <section className="community-card progress-share" aria-labelledby="share-title">
    <div>
      <span className="story-eyebrow">SEU CAMINHO PODE INSPIRAR OUTRO</span>
      <h2 id="share-title">Espalhe a vontade de florescer.</h2>
      <p>Compartilhe seu cartão com arte e progresso. Na primeira vez a cada 24 horas, compartilhar ou exportar concede +20% de pétalas e sementes por 30 minutos.</p>
      <p className="community-note">O bônus celebra a ação de compartilhar/exportar; não verifica a publicação em redes sociais. Nenhum dado da sua conta Google entra no cartão.</p>
      <div className="share-actions">
        <button className="story-button primary" disabled={busy || !ready} onClick={() => share()}>Compartilhar jornada</button>
        <button className="story-button secondary" disabled={busy || !ready} onClick={() => share(true)}>Baixar arte para as redes</button>
      </div>
      <p className="share-description">{description}</p>
      <button className="story-button secondary" disabled={busy} onClick={async () => {
        try { await navigator.clipboard.writeText(`${description} ${SHARE_URL}`); setNotice('Descrição copiada para compartilhar!'); }
        catch (cause) { setError(`Não foi possível copiar: ${cause.message}. Selecione a descrição acima.`); }
      }}>Copiar descrição</button>
      {!state.share.ready && <p>Próximo bônus: {new Date(state.share.nextAt).toLocaleString('pt-BR')}.</p>}
      {notice && <p className="story-reward" role="status">{notice}</p>}
      {error && <p className="story-error" role="alert">{error}</p>}
    </div>
    <canvas ref={canvasRef} className="progress-card-preview" role="img" aria-label={`Cartão ilustrado da jornada de ${state.profile.nickname}, nível ${state.rebirth.level}`} />
  </section>;
}

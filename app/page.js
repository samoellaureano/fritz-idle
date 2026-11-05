'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

function format(n) {
  if (n < 1000) return n.toFixed(n < 10 ? 1 : 0);
  const units = ['K', 'M', 'B', 'T'];
  let i = -1;
  while (n >= 1000 && i < units.length - 1) {
    n /= 1000;
    i++;
  }
  return n.toFixed(2) + units[i];
}

export default function Home() {
  const [state, setState] = useState(null);
  const [display, setDisplay] = useState(0);
  const [offlineMsg, setOfflineMsg] = useState(null);
  const syncRef = useRef({ coins: 0, cps: 0, at: Date.now() });

  const applyState = useCallback((s) => {
    setState(s);
    syncRef.current = { coins: s.coins, cps: s.cps, at: Date.now() };
  }, []);

  // Carrega estado inicial
  useEffect(() => {
    fetch('/api/game')
      .then((r) => r.json())
      .then((s) => {
        applyState(s);
        if (s.lastEarned > 1 && s.lastElapsed > 10) {
          setOfflineMsg(
            `Enquanto você esteve fora, ganhou ${format(s.lastEarned)} moedas!`
          );
        }
      });
  }, [applyState]);

  // Animação local entre sincronizações com o servidor
  useEffect(() => {
    const id = setInterval(() => {
      const { coins, cps, at } = syncRef.current;
      setDisplay(coins + ((Date.now() - at) / 1000) * cps);
    }, 100);
    return () => clearInterval(id);
  }, []);

  // Sincroniza com o servidor periodicamente
  useEffect(() => {
    const id = setInterval(() => {
      fetch('/api/game').then((r) => r.json()).then(applyState);
    }, 15000);
    return () => clearInterval(id);
  }, [applyState]);

  async function handleClick() {
    // Otimista: soma localmente e confirma no servidor
    syncRef.current.coins += 1;
    const res = await fetch('/api/click', { method: 'POST' });
    applyState(await res.json());
  }

  async function handleBuy(generatorId) {
    const res = await fetch('/api/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generatorId }),
    });
    if (res.ok) applyState(await res.json());
  }

  if (!state) return <div className="container">Carregando...</div>;

  return (
    <main className="container">
      <h1>Jogo Idle do Fritz</h1>
      <p className="subtitle">Clique, compre Fritzes e deixe o dinheiro render.</p>

      {offlineMsg && <div className="toast">{offlineMsg}</div>}

      <section className="panel">
        <div className="coins">{format(display)} moedas</div>
        <div className="cps">{format(state.cps)} por segundo</div>
        <button className="click-btn" onClick={handleClick}>
          Clique para ganhar moedas
        </button>
      </section>

      <section className="panel">
        <h2 style={{ marginTop: 0 }}>Geradores</h2>
        {state.generators.map((g) => (
          <div className="gen" key={g.id}>
            <div>
              <div className="gen-name">
                {g.name} <span className="gen-info">(x{g.owned})</span>
              </div>
              <div className="gen-info">+{g.cps} moedas/s cada</div>
            </div>
            <button
              className="buy-btn"
              disabled={display < g.cost}
              onClick={() => handleBuy(g.id)}
            >
              Comprar · {format(g.cost)}
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}

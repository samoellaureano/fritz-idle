import GameIcon from '@/app/components/GameIcon';
import { BICYCLE_MEMORY, INDUSTRIAL_MEMORIES, INDUSTRY_STORY } from '@/lib/city-memory';

export default function CityNotebook({ nickname }) {
  return (
    <section className="city-notebook" id="caderno-da-cidade" aria-labelledby="city-notebook-title">
      <header className="city-notebook-heading">
        <span className="story-eyebrow">ALÉM DAS PÉTALAS · CADERNO DA CIDADE</span>
        <h2 id="city-notebook-title">Duas rodas, muitos fios e mãos que constroem.</h2>
        <p>{nickname}, Fritz reservou estas páginas para a Joinville das bicicletas e da memória industrial. Leia desde o início da jornada, sem gastar pétalas ou interromper sua partida.</p>
        <nav className="city-notebook-nav" aria-label="Memórias da cidade">
          <a className="story-button secondary" href="#cidade-das-bicicletas"><GameIcon symbol="🚲" /> Cidade das Bicicletas</a>
          <a className="story-button secondary" href="#memoria-industrial"><GameIcon symbol="🏭" /> Memória industrial</a>
        </nav>
      </header>

      <article className="story-chapter city-memory-chapter" id={BICYCLE_MEMORY.id} aria-labelledby="bicycle-title">
        <div className="city-memory-banner bicycle-banner">
          <span aria-hidden="true"><GameIcon symbol="🚲" /></span>
          <div><span className="chapter-overline">UMA CIDADE EM MOVIMENTO</span><h3 id="bicycle-title">{BICYCLE_MEMORY.title}</h3><p>{BICYCLE_MEMORY.place}</p></div>
        </div>
        <div className="chapter-reading">
          <span className="chapter-overline">UMA CENA IMAGINADA COM FRITZ</span>
          <div className="story-prose">{BICYCLE_MEMORY.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <aside className="city-memory-facts" aria-label="Fatos sobre as bicicletas em Joinville">
            <h4>A memória por trás da aventura</h4>
            {BICYCLE_MEMORY.facts.map((fact) => <p key={fact}>{fact}</p>)}
            <ul>{BICYCLE_MEMORY.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></li>)}</ul>
            <p className="city-memory-small">Para uma visita presencial, confira horários e condições atuais nos canais oficiais.</p>
          </aside>
        </div>
      </article>

      <article className="story-chapter city-memory-chapter" id="memoria-industrial" aria-labelledby="industry-title">
        <div className="city-memory-banner industry-banner">
          <span aria-hidden="true"><GameIcon symbol="🧵" /> <GameIcon symbol="⚙️" /></span>
          <div><span className="chapter-overline">MEMÓRIA INDUSTRIAL DE JOINVILLE</span><h3 id="industry-title">A cidade também floresce pelas mãos de quem trabalha.</h3><p>Dos teares à fundição, das pequenas peças às casas</p></div>
        </div>
        <div className="chapter-reading">
          <span className="chapter-overline">UMA CENA IMAGINADA COM FRITZ</span>
          <div className="story-prose">{INDUSTRY_STORY.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <h4 className="city-timeline-title">Marcos de uma história feita por muita gente</h4>
          <p className="city-memory-small">Uma seleção, não uma lista completa da indústria local. As datas abaixo são de fundação das empresas; não representam o início de toda a atividade industrial da cidade.</p>
          <ol className="city-industry-timeline">
            {INDUSTRIAL_MEMORIES.map((company) => (
              <li className="city-industry-card" key={company.id} id={`memoria-${company.id}`}>
                <div className="city-industry-heading"><span className="city-industry-icon" aria-hidden="true"><GameIcon symbol={company.icon} /></span><div><span className="chapter-overline">{company.year} · {company.name}</span><h5>{company.title}</h5></div></div>
                <p>{company.fact}</p>
                <blockquote>{company.keepsake}</blockquote>
                <a className="city-memory-source" href={company.source.url} target="_blank" rel="noopener noreferrer">{company.source.label} ↗</a>
              </li>
            ))}
          </ol>
          <aside className="city-memory-facts"><h4>Homenagem à memória, não publicidade</h4><p>As empresas são citadas por sua relação histórica com Joinville. Não há patrocínio, vínculo comercial ou endosso declarado por elas. As cenas de Fritz são ficção; os fatos e datas têm fontes indicadas. As referências não representam visitas abertas ao público.</p></aside>
        </div>
      </article>
      <p className="city-notebook-note">Este caderno reúne o contexto e as fontes das trilhas. Guarde as lembranças nas jornadas <a href="/historia?jornada=bicicletas">Caminhos que aproximam</a> e <a href="/historia?jornada=industria">Mãos que constroem</a>: cada novo capítulo rende pétalas, +2% de produção permanente e XP na era.</p>
      <a className="story-button next" href="/">Voltar a recolher pétalas →</a>
    </section>
  );
}

export const metadata = {
  title: 'Sobre e direitos | Fritz em Joinville',
  description: 'Identificação do desenvolvedor, direitos autorais e relação do projeto com Joinville.',
};

export default function AboutPage() {
  return (
    <main className="story-page legal-page">
      <header className="story-topbar">
        <a className="story-brand" href="/"><span aria-hidden="true"><img src="/icons/fritz.webp" alt="" width="40" height="40" /></span><span>Fritz <span>em Joinville</span></span></a>
        <a className="back-to-game" href="/">← Voltar ao jogo</a>
      </header>
      <article className="legal-content">
        <span className="story-eyebrow">IDENTIFICAÇÃO E DIREITOS</span>
        <h1>Sobre o projeto</h1>
        <p><strong>Fritz em Joinville — A Jornada das Flores</strong> é um projeto independente desenvolvido por <strong>Samoel Laureano Consultoria e Desenvolvimento de Software Ltda.</strong>, que utiliza a marca <strong>SL DEV Solutions</strong> (CNPJ 57.127.304/0001-31).</p>
        <p>Contato para assuntos sobre o projeto, direitos autorais e privacidade: <a href="mailto:samoel.laureano@sldevsolutions.com.br">samoel.laureano@sldevsolutions.com.br</a>.</p>

        <h2>Direitos autorais</h2>
        <p>© {new Date().getFullYear()} Samoel Laureano Consultoria e Desenvolvimento de Software Ltda. Todos os direitos reservados às criações originais de sua titularidade neste projeto, incluindo código, textos, personagens e artes originais, exceto quando indicado de outra forma.</p>
        <p>Bibliotecas, serviços, marcas, nomes de pessoas e de lugares de terceiros permanecem sujeitos aos direitos e às licenças de seus respectivos titulares. A menção a uma marca ou local não significa autorização, parceria ou endosso; consulte os créditos e fontes indicados no diário e no repositório.</p>

        <h2>Relação com Joinville</h2>
        <p>O jogo é uma obra independente inspirada em referências históricas e culturais de Joinville. Não é um canal, serviço ou publicação oficial do Município de Joinville e não foi apresentado aqui como aprovado, contratado, patrocinado ou endossado pela Prefeitura.</p>
        <p>A página da <a href="https://www.joinville.sc.gov.br/institucional/secom/uco/" target="_blank" rel="noreferrer">Unidade de Comunicação (SECOM.UCO)</a> descreve atribuições institucionais, mas não estabelece neste endereço um procedimento de submissão ou aprovação deste projeto. Qualquer publicação em canal municipal depende de autorização expressa da Prefeitura.</p>
      </article>
    </main>
  );
}

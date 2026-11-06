export const metadata = {
  title: 'Termos de Uso | Fritz em Joinville',
  description: 'Condições de acesso e uso do jogo Fritz em Joinville.',
};

export default function TermsPage() {
  return (
    <main className="story-page legal-page">
      <header className="story-topbar">
        <a className="story-brand" href="/"><span aria-hidden="true"><img src="/icons/fritz.webp" alt="" width="40" height="40" /></span><span>Fritz <span>em Joinville</span></span></a>
        <a className="back-to-game" href="/">← Voltar ao jogo</a>
      </header>
      <article className="legal-content">
        <span className="story-eyebrow">REGRAS DE ACESSO</span>
        <h1>Termos de Uso</h1>
        <p><strong>Última atualização: 5 de novembro de 2026.</strong> Ao acessar recursos autenticados, você declara que leu estes termos e a <a href="/privacidade">Política de Privacidade</a>.</p>

        <h2>Idade mínima</h2>
        <p>O jogo é destinado a pessoas com <strong>13 anos ou mais</strong>. Pessoas menores de 13 anos não estão autorizadas a criar conta nem a usar o login, o ranking ou o mural. O login não solicita declaração nem realiza verificação independente de idade; a idade mínima é uma condição de uso, não uma barreira técnica de acesso.</p>

        <h2>Conta e comunidade</h2>
        <p>O login é feito pelo Google. O usuário escolhe um apelido e avatar; apelido, avatar, progresso resumido e mensagens do mural ficam visíveis a outros jogadores autenticados. Você é responsável pelo conteúdo que publicar. Não publique dados pessoais seus ou de outras pessoas. É possível remover as próprias mensagens no mural; para solicitar a exclusão da conta, use o contato informado em <a href="/sobre">Sobre e direitos</a>.</p>

        <h2>Conteúdo e conduta</h2>
        <p>Use o serviço de forma lícita e respeitosa. Não tente prejudicar o funcionamento, a segurança ou a disponibilidade do jogo, nem publique conteúdo que viole direitos de terceiros. O acesso pode ser suspenso quando necessário para proteger o serviço, seus usuários ou direitos de terceiros, observadas as regras aplicáveis.</p>

        <h2>Conteúdo e propriedade intelectual</h2>
        <p>As histórias e cenas do jogo combinam ficção com referências históricas identificadas no diário. O jogo não substitui fontes oficiais, não garante a exatidão de informações externas e não representa os locais como serviços oficiais. Os direitos das criações originais de titularidade da desenvolvedora são reservados; marcas, serviços, bibliotecas e outros materiais de terceiros permanecem sujeitos às licenças e aos direitos de seus titulares.</p>

        <h2>Projeto independente e disponibilidade</h2>
        <p>Fritz em Joinville é um projeto independente de SL DEV Solutions, sem vínculo oficial, parceria, patrocínio ou endosso da Prefeitura de Joinville. A inclusão do jogo em canal municipal depende de autorização expressa do Município. O serviço pode sofrer interrupções, alterações ou encerramento; não há garantia de disponibilidade contínua nem de preservação permanente do progresso.</p>

        <h2>Contato</h2>
        <p>Para dúvidas sobre estes termos, escreva para <a href="mailto:samoel.laureano@sldevsolutions.com.br">samoel.laureano@sldevsolutions.com.br</a>.</p>
      </article>
    </main>
  );
}

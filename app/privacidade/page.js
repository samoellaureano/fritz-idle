export const metadata = {
  title: 'Privacidade | Fritz em Joinville',
  description: 'Informações sobre dados pessoais tratados pelo jogo Fritz em Joinville.',
};

export default function PrivacyPage() {
  return (
    <main className="story-page legal-page">
      <header className="story-topbar">
        <a className="story-brand" href="/"><span aria-hidden="true"><img src="/icons/fritz.webp" alt="" width="40" height="40" /></span><span>Fritz <span>em Joinville</span></span></a>
        <a className="back-to-game" href="/">← Voltar ao jogo</a>
      </header>
      <article className="legal-content">
        <span className="story-eyebrow">DADOS PESSOAIS</span>
        <h1>Política de Privacidade</h1>
        <p><strong>Última atualização: 5 de novembro de 2026.</strong> Esta página descreve os recursos atualmente implementados no jogo. Ela deve ser revisada se os recursos, fornecedores ou configurações mudarem.</p>

        <h2>Quem é responsável</h2>
        <p>Controlador informado: <strong>Samoel Laureano Consultoria e Desenvolvimento de Software Ltda.</strong> (SL DEV Solutions, CNPJ 57.127.304/0001-31). Para dúvidas, solicitações ou exercício de direitos sobre dados pessoais, escreva para <a href="mailto:samoel.laureano@sldevsolutions.com.br">samoel.laureano@sldevsolutions.com.br</a>.</p>

        <h2>Quais dados e para quê</h2>
        <ul>
          <li><strong>Autenticação:</strong> o acesso usa Google por meio do Supabase. Os identificadores e dados de conta necessários à autenticação são tratados por esses serviços; o jogo não exibe seu e-mail ou nome Google no ranking.</li>
          <li><strong>Perfil e jogo:</strong> apelido, avatar escolhido e progresso são usados para manter a partida e a identidade no jogo.</li>
          <li><strong>Comunidade:</strong> apelido, avatar, estatísticas da partida e mensagens de até 160 caracteres aparecem no ranking/mural para jogadores autenticados. Não publique nome completo, contato, escola, localização ou outra informação pessoal.</li>
          <li><strong>Presença:</strong> um identificador de conta e o horário da última atividade são usados para estimar quantas contas estão ativas; registros de presença sem atualização são removidos após um dia.</li>
          <li><strong>Cookies:</strong> cookies de sessão são necessários para autenticação e continuidade do acesso.</li>
        </ul>

        <h2>Fornecedores e armazenamento</h2>
        <p>O código integra Google para autenticação, Supabase para autenticação e armazenamento do jogo/comunidade e Render para hospedagem. Esses fornecedores podem tratar dados técnicos e de conta conforme seus serviços e contratos. A região de hospedagem, transferências internacionais e prazos de retenção de logs e cópias de segurança precisam ser confirmados nas configurações de produção e nos termos vigentes de cada fornecedor.</p>

        <h2>Retenção e exclusão</h2>
        <p>O progresso e o perfil permanecem associados à conta enquanto ela estiver ativa. Mensagens podem ser removidas pelo próprio autor; a exclusão da conta também remove os registros vinculados no banco principal. O jogo não oferece exclusão de conta por autoatendimento: solicite-a pelo e-mail de contato acima. Cópias de segurança e registros mantidos pelos fornecedores podem seguir prazos próprios.</p>

        <h2>Seus direitos</h2>
        <p>Você pode solicitar confirmação do tratamento, acesso, correção, informação, oposição ou eliminação, conforme aplicável, pelo contato indicado. Para proteger a conta, poderemos pedir informações razoáveis para confirmar a identidade do solicitante. Responderemos sobre o pedido e eventuais limites legais ou técnicos.</p>

        <h2>Idade e proteção de adolescentes</h2>
        <p>O jogo não solicita declaração de idade no login e não verifica a idade de forma independente. Os Termos de Uso destinam o serviço a pessoas com 13 anos ou mais; pessoas menores de 13 anos não devem criar conta nem usar os recursos autenticados. Adolescentes continuam protegidos por regras específicas, inclusive pelo ECA Digital. A ausência de verificação de idade não comprova conformidade jurídica, especialmente se o serviço for direcionado a crianças ou provavelmente acessado por elas.</p>

        <h2>Transparência e revisão antes da publicação</h2>
        <p>Esta descrição não substitui uma avaliação jurídica. Antes de disponibilizar o jogo ao público, o controlador deve confirmar bases legais, classificação etária, medidas adequadas para adolescentes, retenção e transferências com os fornecedores e o procedimento operacional para atender solicitações de titulares.</p>
        <p>Referências: <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm" target="_blank" rel="noreferrer">Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</a> e <a href="https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm" target="_blank" rel="noreferrer">Estatuto Digital da Criança e do Adolescente (Lei nº 15.211/2025)</a>.</p>
      </article>
    </main>
  );
}

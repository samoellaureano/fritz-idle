export default function LegalFooter() {
  return (
    <footer className="legal-footer">
      <p>Projeto independente, sem vínculo oficial, patrocínio ou endosso da Prefeitura de Joinville.</p>
      <nav aria-label="Informações legais">
        <a href="/sobre">Sobre e direitos</a>
        <a href="/privacidade">Privacidade</a>
        <a href="/termos">Termos de uso</a>
      </nav>
      <small>© {new Date().getFullYear()} SL DEV Solutions. Direitos reservados sobre as criações originais de sua titularidade.</small>
    </footer>
  );
}

import './globals.css';
import { localMemoryEnabled } from '@/lib/local-mode';
import GameTooltips from '@/app/components/GameTooltips';
import LegalFooter from '@/app/components/LegalFooter';

export const metadata = {
  title: 'Fritz em Joinville — A Jornada das Flores',
  description: 'Ajude Fritz a percorrer Joinville, encontrar seus amigos e trazer as pétalas de volta à Cidade das Flores.',
  icons: {
    icon: { url: '/fritz-icon.png', type: 'image/png', sizes: '64x64' },
    apple: { url: '/fritz-apple-icon.png', sizes: '180x180' },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{localMemoryEnabled() && <aside className="local-mode-banner" role="note">Ambiente local de teste · Dados somente em memória · Reiniciar o servidor apaga o progresso · Supabase desativado</aside>}{children}<GameTooltips /><LegalFooter /></body>
    </html>
  );
}

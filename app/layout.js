import './globals.css';

export const metadata = {
  title: 'Jogo Idle do Fritz',
  description: 'Um jogo idle feito com Next.js e SQLite',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

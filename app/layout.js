import './globals.css';

export const metadata = {
  title: 'Fritz em Joinville — A Jornada das Flores',
  description: 'Ajude Fritz a percorrer Joinville, encontrar seus amigos e trazer as pétalas de volta à Cidade das Flores.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

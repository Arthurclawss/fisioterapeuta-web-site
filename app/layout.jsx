import './globals.css';
import './closing.css';
import 'lenis/dist/lenis.css';
import SmoothScroll from './components/SmoothScroll';

export const metadata = {
  title: 'Rudy Mollick | Liberdade para se movimentar',
  description: 'Fisioterapia com Rudy Mollick. Cuidado individualizado para recuperar a liberdade de se movimentar.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('has-js');" }} />
      </head>
      <body><SmoothScroll />{children}</body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import './globals.css'
import './kairos.css'
import Navigation from './components/Navigation'
import Banner from './components/Banner'

export const metadata = {
  title: 'Kairos - Sistema de Gerenciamento de Tempo',
  description: 'Sistema prático, acessível e elegante para gerenciamento de tempo e tarefas',
  icons: {
    icon: '/icon/relogio-semfundo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navigation />
        <Banner />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}

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
import Image from 'next/image'

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
        <div className="banner-section">
          <Image 
            src="/images/banner.png" 
            alt="Banner Kairos" 
            className="banner-image"
            width={1200}
            height={300}
            priority
          />
        </div>
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}

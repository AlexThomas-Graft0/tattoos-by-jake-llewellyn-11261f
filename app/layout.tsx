import { CookieBanner } from "@/components/CookieBanner";
import type { Metadata } from 'next'
import { Oswald, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-primary',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Tattoos by Jake Llewellyn',
  description: 'At Tattoos by jakellewellyn, I offer a range of services to cater to your individual tattoo needs. I specialise in custom designs, client-specified artwork, and cover-ups (depending on the existing design). All tattoo styles are welcome, ensuring your body art is exactly as you envision it.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-black text-white font-sans antialiased min-h-screen selection:bg-neutral-800 selection:text-white">
        {children}
              <CookieBanner />
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: 'DesignVisualz - AI-Powered Cultural Event Design',
  description: 'Create stunning, culturally-aware event designs using AI that understands traditions, aesthetics, and the art of beautiful celebrations.',
  keywords: 'event design, cultural intelligence, AI design, event planning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* LineIcons CDN Links */}
        <link rel="stylesheet" href="https://pro-cdn.lineicons.com/5.0/regular/lineicons.css" />
        <link rel="stylesheet" href="https://pro-cdn.lineicons.com/5.0/solid/lineicons-solid.css" />
        <link rel="stylesheet" href="https://pro-cdn.lineicons.com/4.0/light/lineicons-light.css" />
        <link rel="stylesheet" href="https://pro-cdn.lineicons.com/4.0/fill/lineicons-fill.css" />
      </head>
      <body className="font-body antialiased">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
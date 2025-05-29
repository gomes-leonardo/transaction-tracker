import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Transaction Tracker',
  description: 'Sistema de rastreamento de transações',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={cn(
          inter.className,
          'min-h-screen bg-background antialiased'
        )}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}

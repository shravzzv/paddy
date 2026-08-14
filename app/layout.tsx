import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Paddy - Read beautifully.',
  description:
    'Paddy is an offline-first, cross-platform PDF & EPUB reader designed to make reading beautiful, comfortable, and personal.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='en' className={cn('antialiased', 'font-sans', inter.variable)}>
      <body>{children}</body>
    </html>
  )
}

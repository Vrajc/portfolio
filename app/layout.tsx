import type { Metadata } from 'next'
import './globals.css'
import 'lenis/dist/lenis.css'
import CustomCursor from '../src/components/CustomCursor'

export const metadata: Metadata = {
  title: 'Vraj Chauhan | Full Stack Developer Portfolio',
  description: 'Portfolio of Vraj Chauhan showcasing full stack, AI, and interactive web projects.',
  metadataBase: new URL('https://vraj-chauhan.tech'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Vraj Chauhan | Full Stack Developer Portfolio',
    description: 'Portfolio of Vraj Chauhan showcasing full stack, AI, and interactive web projects.',
    type: 'website',
    url: 'https://vraj-chauhan.tech/',
    siteName: 'Vraj Chauhan Portfolio',
    images: [{ url: '/vraj.png', alt: 'Vraj Chauhan portfolio preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Vrajc',
    creator: '@Vrajc',
    title: 'Vraj Chauhan | Full Stack Developer Portfolio',
    description: 'Portfolio of Vraj Chauhan showcasing full stack, AI, and interactive web projects.',
    images: ['/vraj.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}

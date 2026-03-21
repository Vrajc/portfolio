import type { Metadata, Viewport } from 'next'
import './globals.css'
import 'lenis/dist/lenis.css'
import CustomCursor from '../src/components/CustomCursor'

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim().replace(
  /^google-site-verification=/,
  ''
)

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b0d10',
}

export const metadata: Metadata = {
  title: {
    default: 'Vraj Chauhan | Full Stack Developer Portfolio',
    template: '%s | Vraj Chauhan',
  },
  description: 'Portfolio of Vraj Chauhan showcasing full stack, AI, and interactive web projects.',
  keywords: [
    'Vraj Chauhan',
    'Full Stack Developer',
    'Portfolio',
    'Next.js',
    'React',
    'AI Projects',
    'Web Development',
    'MERN Stack',
  ],
  applicationName: 'Vraj Chauhan Portfolio',
  authors: [{ name: 'Vraj Chauhan', url: 'https://vraj-chauhan.tech/' }],
  creator: 'Vraj Chauhan',
  publisher: 'Vraj Chauhan',
  category: 'technology',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vraj-chauhan.tech'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/'
    }
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Vraj Chauhan | Full Stack Developer Portfolio',
    description: 'Portfolio of Vraj Chauhan showcasing full stack, AI, and interactive web projects.',
    type: 'website',
    url: 'https://vraj-chauhan.tech/',
    siteName: 'Vraj Chauhan Portfolio',
    locale: 'en_US',
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
  verification: googleSiteVerification
    ? {
        google: googleSiteVerification,
      }
    : undefined,
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

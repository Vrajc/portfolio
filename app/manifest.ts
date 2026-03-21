import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vraj Chauhan Portfolio',
    short_name: 'Vraj Portfolio',
    description: 'Portfolio of Vraj Chauhan showcasing full stack, AI, and interactive web projects.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0d10',
    theme_color: '#0b0d10',
    lang: 'en-US',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}

import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WAVE — your door, answered without a word',
    short_name: 'WAVE',
    description:
      'An accessible front-door agent. It captions the visitor, reads their gestures, and keeps a ' +
      'written record of a conversation you never heard.',
    start_url: '/',
    display: 'standalone',
    // A hallway wall display, so it opens light rather than flashing white then
    // settling — the theme colour matches the paper the app is actually on.
    background_color: '#faf4ea',
    theme_color: '#faf4ea',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  }
}

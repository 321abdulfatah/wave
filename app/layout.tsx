import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WAVE — your door, answered without a word',
  description:
    'An accessible front-door agent built on the Ring Partner API. The chime speaks for you; the camera reads gestures back.',
}

export const viewport: Viewport = {
  themeColor: '#faf4ea',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {/* Screen-reader announcements land here. A Deaf user may well be using
            a screen reader too — low vision and deafness co-occur often enough
            that assuming otherwise would be careless. */}
        <div id="wave-live" aria-live="assertive" className="sr-only" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}

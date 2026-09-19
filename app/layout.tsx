import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wave-tan-nine.vercel.app'),
  title: {
    default: 'WAVE — your door, answered without a word',
    template: '%s · WAVE',
  },
  description:
    'An accessible front-door agent for Deaf and hard-of-hearing residents. It captions the ' +
    'visitor, reads their gestures, and keeps a written record of a conversation you never heard.',
  applicationName: 'WAVE',
  authors: [{ name: 'Abd Ulfatah Esper' }],
  keywords: [
    'accessibility',
    'Deaf',
    'hard of hearing',
    'doorbell',
    'Ring',
    'Alexa+',
    'captions',
    'gesture recognition',
  ],
  openGraph: {
    type: 'website',
    siteName: 'WAVE',
    title: 'WAVE — your door, answered without a word',
    description:
      'Every doorbell is built for someone who can hear. The AI ones now answer the door for you ' +
      'and hand you a sound file. WAVE gives you the conversation in writing, both directions.',
  },
  twitter: { card: 'summary_large_image' },
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

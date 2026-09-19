import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'WAVE — your door, answered without a word'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * The card that appears when this link is pasted into Devpost, a judge's
 * browser, or a message. It gets one look, so it carries the claim rather than
 * the brand: the ring is the product, and the line under it is the argument.
 *
 * Generated rather than a static PNG so it always matches the shipped palette —
 * including the darkened ochre that fixed the contrast failure.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FAF4EA',
          padding: '72px 80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="3.6" fill="#B8801F" />
            <circle cx="16" cy="16" r="7.6" fill="none" stroke="#B8801F" strokeOpacity="0.62" strokeWidth="2" />
            <circle cx="16" cy="16" r="11.8" fill="none" stroke="#B8801F" strokeOpacity="0.26" strokeWidth="2" />
          </svg>
          <span style={{ fontSize: 46, fontWeight: 700, color: '#2A2420', letterSpacing: '-0.02em' }}>
            WAVE
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ fontSize: 68, lineHeight: 1.1, color: '#2A2420', letterSpacing: '-0.025em' }}>
            Your door, answered
            <br />
            without a word.
          </div>
          <div style={{ fontSize: 27, lineHeight: 1.45, color: '#574C42', maxWidth: 880 }}>
            Every doorbell is built for someone who can hear. The AI ones now answer the door for
            you — and hand you a sound file.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {['Ring', 'Alexa+', '13 locales', 'Captioned'].map((tag) => (
            <div
              key={tag}
              style={{
                display: 'flex',
                fontSize: 21,
                color: '#6E6154',
                border: '1px solid #E6D9C5',
                background: '#FFFCF6',
                borderRadius: 999,
                padding: '9px 20px',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}

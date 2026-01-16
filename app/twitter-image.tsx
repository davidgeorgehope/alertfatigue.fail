import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Alert Fatigue - The 3am Problem: An interactive exploration of why your alerts aren\'t helping'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a2e',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Tired Bell Mascot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          {/* Bell SVG inline */}
          <svg
            width="180"
            height="180"
            viewBox="0 0 64 64"
            style={{ marginRight: 20 }}
          >
            {/* Bell body */}
            <path
              d="M32 8c-10 0-18 8-18 18v10c0 2-1 4-3 5h42c-2-1-3-3-3-5V26c0-10-8-18-18-18z"
              fill="#f59e0b"
            />
            {/* Bell bottom */}
            <ellipse cx="32" cy="44" rx="12" ry="3" fill="#f59e0b" />
            {/* Clapper */}
            <circle cx="32" cy="50" r="4" fill="#f59e0b" />
            {/* Tired left eye */}
            <ellipse cx="25" cy="26" rx="4" ry="2" fill="#1a1a2e" />
            <path
              d="M21 24 Q25 26 29 24"
              stroke="#1a1a2e"
              strokeWidth="2"
              fill="none"
            />
            {/* Tired right eye */}
            <ellipse cx="39" cy="26" rx="4" ry="2" fill="#1a1a2e" />
            <path
              d="M35 24 Q39 26 43 24"
              stroke="#1a1a2e"
              strokeWidth="2"
              fill="none"
            />
            {/* Tired mouth */}
            <path
              d="M28 33 Q32 31 36 33"
              stroke="#1a1a2e"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* ZZZ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginLeft: -30,
              marginTop: -60,
            }}
          >
            <span style={{ color: '#60a5fa', fontSize: 32, fontWeight: 'bold' }}>Z</span>
            <span style={{ color: '#60a5fa', fontSize: 40, fontWeight: 'bold', marginLeft: 15, marginTop: -10 }}>Z</span>
            <span style={{ color: '#60a5fa', fontSize: 48, fontWeight: 'bold', marginLeft: 30, marginTop: -10 }}>Z</span>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              color: '#f59e0b',
              fontSize: 72,
              fontWeight: 'bold',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            ALERT FATIGUE
          </h1>
          <p
            style={{
              color: '#94a3b8',
              fontSize: 36,
              margin: '10px 0 0 0',
            }}
          >
            The 3am Problem
          </p>
        </div>

        {/* Domain */}
        <p
          style={{
            color: '#64748b',
            fontSize: 24,
            position: 'absolute',
            bottom: 40,
          }}
        >
          alertfatigue.fail
        </p>
      </div>
    ),
    {
      ...size,
    }
  )
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        raised: 'var(--ink-raised)',
        card: 'var(--ink-card)',
        line: 'var(--line)',
        bright: 'var(--line-bright)',
        body: 'var(--text)',
        dim: 'var(--text-dim)',
        faint: 'var(--text-faint)',
        signal: 'var(--signal)',
        calm: 'var(--calm)',
        alert: 'var(--alert)',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI Variable', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      maxWidth: { shell: '1280px' },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        charcoal: 'var(--charcoal)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        caramel: 'var(--caramel)',
        'indigo-brand': 'var(--indigo-brand)',
        sale: 'var(--sale)',
        available: 'var(--available)',
        occupied: 'var(--occupied)',
        deposit: 'var(--deposit)',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        jost: ['Jost', 'sans-serif'],
      },
      transitionDuration: {
        400: '400ms',
      },
      letterSpacing: {
        widest2: '0.16em',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        white: 'var(--white)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        sand: 'var(--sand)',
        line: 'var(--line)',
        ink: 'var(--ink)',
        charcoal: 'var(--charcoal)',
        muted: 'var(--muted)',
        caramel: 'var(--caramel)',
        'caramel-deep': 'var(--caramel-deep)',
        indigo: 'var(--indigo)',
        sale: 'var(--sale)',
        'status-available': 'var(--status-available)',
        'status-deposit': 'var(--status-deposit)',
        'status-occupied': 'var(--status-occupied)',
        overlay: 'var(--overlay)',
        'overlay-indigo': 'var(--overlay-indigo)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '2px',
        card: '4px',
        lg: '4px',
        full: '9999px',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
        24: '96px',
        32: '128px',
      },
      maxWidth: {
        container: '1280px',
      },
      zIndex: {
        header: '40',
        drawer: '60',
        modal: '70',
        toast: '80',
      },
    },
  },
  plugins: [],
};

import type { Config } from 'tailwindcss';

// ElevenLabs-inspired dark theme: near-black surfaces, high-contrast text, soft accents.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0a0b',
          900: '#101012',
          800: '#17171a',
          700: '#1f1f23',
          600: '#2a2a30',
        },
        accent: {
          DEFAULT: '#ffffff',
          muted: '#a1a1aa',
        },
      },
      fontFamily: {
        sans: ['"Trebuchet MS"', 'Verdana', 'Geneva', 'Tahoma', 'sans-serif'],
        display: ['"Comic Sans MS"', '"Pixelify Sans"', '"Trebuchet MS"', 'cursive'],
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 30px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config;

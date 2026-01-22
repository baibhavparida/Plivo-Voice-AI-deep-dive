import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Black & White theme
        primary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#000000',
              textDecoration: 'underline',
              '&:hover': {
                color: '#333333',
              },
            },
            'h1, h2, h3, h4': {
              color: 'inherit',
              fontWeight: '600',
            },
            code: {
              color: '#000000',
              backgroundColor: '#f5f5f5',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#f5f5f5',
              color: '#1a1a1a',
            },
            blockquote: {
              borderLeftColor: '#000000',
              fontStyle: 'normal',
            },
            table: {
              fontSize: '0.875rem',
            },
            'thead th': {
              fontWeight: '600',
            },
          },
        },
        invert: {
          css: {
            a: {
              color: '#ffffff',
              '&:hover': {
                color: '#cccccc',
              },
            },
            code: {
              color: '#ffffff',
              backgroundColor: '#111111',
            },
            pre: {
              backgroundColor: '#111111',
              color: '#e5e5e5',
            },
            blockquote: {
              borderLeftColor: '#ffffff',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config

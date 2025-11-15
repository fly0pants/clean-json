/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cyberpunk Dark Theme Colors
        primary: {
          bg: '#0a0e27',
          surface: '#1a1f3a',
          elevated: '#252b47',
          sidebar: '#0f1229',
        },
        neon: {
          blue: '#00d4ff',
          'blue-hover': '#33ddff',
          'blue-active': '#00a8cc',
          pink: '#ff006e',
          'pink-hover': '#ff3389',
          'pink-active': '#cc0058',
          green: '#00ff9f',
          'green-hover': '#33ffb3',
          'green-active': '#00cc7f',
          yellow: '#ffb800',
          'yellow-hover': '#ffc633',
          'yellow-active': '#cc9300',
          red: '#ff3366',
          'red-hover': '#ff5580',
          'red-active': '#cc2952',
        },
        text: {
          primary: '#e0e6ff',
          secondary: '#8892b0',
          disabled: '#4a5578',
          placeholder: '#3a4563',
        },
        syntax: {
          key: '#00d4ff',
          string: '#00ff9f',
          number: '#ffb800',
          boolean: '#ff006e',
          null: '#ff3366',
          bracket: '#8892b0',
          comment: '#4a5578',
        },
        border: {
          default: 'rgba(0, 212, 255, 0.2)',
          hover: 'rgba(0, 212, 255, 0.5)',
          focus: 'rgba(0, 212, 255, 1)',
        },
        // Light Theme Colors
        light: {
          bg: '#f5f7ff',
          surface: '#ffffff',
          elevated: '#e8ecff',
          sidebar: '#eef1ff',
          primary: '#0066ff',
          secondary: '#ff0055',
          success: '#00c896',
          warning: '#ff8800',
          error: '#dd0000',
          text: {
            primary: '#1a1f3a',
            secondary: '#5a6580',
            disabled: '#9ea8c0',
          },
        },
      },
      fontFamily: {
        mono: [
          'Fira Code',
          'JetBrains Mono',
          'Cascadia Code',
          'Monaco',
          'Consolas',
          'Courier New',
          'monospace',
        ],
        sans: ['Inter', '-apple-system', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        display: {
          lg: '2rem', // 32px
          md: '1.5rem', // 24px
        },
        heading: {
          1: '1.25rem', // 20px
          2: '1.125rem', // 18px
        },
        body: {
          lg: '1rem', // 16px
          base: '0.875rem', // 14px
          sm: '0.75rem', // 12px
        },
        caption: '0.6875rem', // 11px
      },
      spacing: {
        xxs: '0.25rem', // 4px
        xs: '0.5rem', // 8px
        sm: '0.75rem', // 12px
        md: '1rem', // 16px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
        '2xl': '3rem', // 48px
        '3xl': '4rem', // 64px
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        pill: '999px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.3)',
        sm: '0 2px 8px rgba(0, 0, 0, 0.4)',
        md: '0 4px 16px rgba(0, 0, 0, 0.5)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.6)',
        'glow-blue':
          '0 0 10px rgba(0, 212, 255, 0.5), 0 0 20px rgba(0, 212, 255, 0.3), 0 0 30px rgba(0, 212, 255, 0.1)',
        'glow-pink':
          '0 0 10px rgba(255, 0, 110, 0.5), 0 0 20px rgba(255, 0, 110, 0.3)',
        'glow-green':
          '0 0 10px rgba(0, 255, 159, 0.5), 0 0 20px rgba(0, 255, 159, 0.3)',
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': {
            boxShadow:
              '0 0 5px var(--neon-color), 0 0 10px var(--neon-color)',
            opacity: '1',
          },
          '50%': {
            boxShadow:
              '0 0 10px var(--neon-color), 0 0 20px var(--neon-color), 0 0 30px var(--neon-color)',
            opacity: '0.8',
          },
        },
      },
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        'very-slow': '800ms',
      },
    },
  },
  plugins: [],
};

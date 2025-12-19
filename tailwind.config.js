/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cyberpunk Dark Theme Colors
        primary: {
          bg: 'var(--color-bg-primary)',
          surface: 'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
          sidebar: 'var(--color-bg-sidebar)',
          card: 'var(--color-bg-card)',
        },
        neon: {
          blue: 'var(--color-neon-blue)',
          pink: 'var(--color-neon-pink)',
          green: 'var(--color-neon-green)',
          yellow: 'var(--color-neon-yellow)',
          red: 'var(--color-neon-red)',
          purple: 'var(--color-neon-purple)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          disabled: 'var(--color-text-disabled)',
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
          default: 'var(--color-border-default)',
          hover: 'var(--color-border-hover)',
          focus: 'var(--color-border-focus)',
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

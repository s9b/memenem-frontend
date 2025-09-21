/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom theme colors
        primary: '#40CFFF', // Light blue accent
        dark: {
          bg: '#0F111A',
          text: '#E0E0E0',
          card: '#1A1D29',
          border: '#2D3748',
        },
        light: {
          bg: '#F5F8FF',
          text: '#0F111A',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%': {
            boxShadow: '0 0 20px rgba(64, 207, 255, 0.5)',
          },
          '100%': {
            boxShadow: '0 0 30px rgba(64, 207, 255, 0.8), 0 0 40px rgba(64, 207, 255, 0.3)',
          }
        },
        'bounce-gentle': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          }
        },
        'scale-in': {
          '0%': {
            transform: 'scale(0.9)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          }
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'onlyfans-blue': '#00AFF0',
        'creator-purple': {
          50: '#F6F4FF',
          100: '#EDEBFE',
          200: '#DCD7FE',
          300: '#CABFFD',
          400: '#AC94FA',
          500: '#9061F9',
          600: '#7E3AF2',
          700: '#6C2BD9',
          800: '#5521B5',
          900: '#4A1D96',
          950: '#2E1065'
        },
        'accent-pink': {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
          950: '#500724'
        }
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': '0% 0%'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': '100% 100%'
          }
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-20px)'
          }
        },
        'glow': {
          '0%': {
            boxShadow: '0 0 5px rgba(144, 97, 249, 0.2), 0 0 20px rgba(144, 97, 249, 0.2)'
          },
          '100%': {
            boxShadow: '0 0 10px rgba(144, 97, 249, 0.4), 0 0 40px rgba(144, 97, 249, 0.4)'
          }
        }
      },
      blur: {
        '4xl': '72px',
        '5xl': '96px'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'white',
            h1: {
              color: 'white',
              fontWeight: '800'
            },
            h2: {
              color: 'white',
              fontWeight: '700'
            },
            h3: {
              color: 'white',
              fontWeight: '600'
            },
            strong: {
              color: 'white'
            },
            a: {
              color: '#9061F9',
              '&:hover': {
                color: '#7E3AF2'
              }
            }
          }
        }
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
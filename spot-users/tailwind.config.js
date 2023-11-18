import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  theme: {
    extend: {
      colors: {
        'main': {
          DEFAULT:'#13B240',
        },
        'ui': {
          50:  '#F2F4F4',
          100: '#EDF0F0',
          150: '#E7EBEB',
          200: '#E2E7E7',
          250: '#DCE2E2',
          300: '#D7DEDE',
          400: '#E6EAEA',
          500: '#E0E5E5',
          600: '#DAE0E0',
          700: '#D4DBDB',
          800: '#C5CECE',
          900: '#AEBBBB',
        },
        "bm-purple": "#5267DF",     
      },
      fontFamily: {
        'title': ['Ubuntu', 'serif'],
        'main': ['Figtree', 'sans-serif'],
        'sec': ['Roboto', 'sans-serif'],
      }
    },
    container: {
      center: true,
      padding: '0.5 rem',
    }
  }
}
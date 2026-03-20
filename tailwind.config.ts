import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
      },
      fontFamily: {
        display: ['Nunito', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
      },
      colors: {
        eensa: {
          bg: '#F3F8F0',
          surface: '#FFFFFF',
          surface2: '#EBF4E6',
          surface3: '#E0F0E6',
          green: '#1A6B2E',
          'green-mid': '#2D8A47',
          'green-lt': '#A8D8B4',
          'green-xlt': '#D4EADB',
          teal: '#2BAAC7',
          'teal-lt': '#C4EAF4',
          'teal-border': '#9ED8EC',
          orange: '#F28C30',
          'orange-lt': '#FDECD8',
          'orange-border': '#F5C9A0',
          yellow: '#F5C840',
          'yellow-lt': '#FEF7DC',
          'yellow-border': '#F0DA90',
          red: '#E05530',
          'red-lt': '#FBEDE8',
          text: '#1A3A22',
          text2: '#4A7A5A',
          text3: '#7DAA8A',
          border: '#D4EADB',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(26,107,46,0.07)',
        md: '0 4px 20px rgba(26,107,46,0.11)',
        lg: '0 8px 40px rgba(26,107,46,0.16)',
      },
      spacing: {
        'safe-top': 'var(--safe-area-top)',
        'safe-right': 'var(--safe-area-right)',
        'safe-bottom': 'var(--safe-area-bottom)',
        'safe-left': 'var(--safe-area-left)',
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      const newUtilities = {
        '.pt-safe': {
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
        },
        '.pb-safe': {
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        },
        '.pl-safe': {
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        },
        '.pr-safe': {
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        },
        '.pt-safe-or-4': {
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
        },
        '.pb-safe-or-8': {
          paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;

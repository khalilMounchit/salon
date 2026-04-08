import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#F5C6D2',
        rose: '#E8457A',
        sands: '#FAF0E6',
        beige: '#F5E6D0',
        dark: '#332A29',
        mint: '#D8F3DC',
      },
      boxShadow: {
        soft: '0 20px 50px rgba(216, 164, 179, 0.16)',
      },
      animation: {
        bounceSoft: 'bounce 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;

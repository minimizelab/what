import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        what: ['var(--font-montserrat)'],
        'what-mono': ['var(--font-ibm-plex-mono)'],
      },
      colors: {
        'what-white': '#F2EFEB',
        'what-red-01': '#FF0222',
      },
      height: { 500: '500px' },
      padding: { 67: '67%', 75: '75%', 111: '111%' },
      screens: {
        content: '1792px',
      },
      cursor: {
        dot: 'url(/cursor-point.svg) 6.8 6.8, auto',
        pointer: 'url(/cursor-red-point.svg) 6.8 6.8, pointer',
      },
    },
  },
};

export default config;

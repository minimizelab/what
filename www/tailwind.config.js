module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: { space: ['Space Grotesk'] },
    extend: {
      colors: {
        'what-mushroom': '#EBEBEB',
        'what-forest': '#2C4431',
        'what-brick': '#e73c29',
      },
      height: { 500: '500px' },
      screens: {
        content: '1792px',
      },
      cursor: {
        dot: 'url(/cursor-dot.svg) 12 12, auto',
        pointer: 'url(/cursor-red-dot.svg) 12 12, pointer',
      },
    },
  },
};

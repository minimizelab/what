module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
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
        dot: 'url(/cursor-point.svg) 6.8 6.8, auto',
        pointer: 'url(/cursor-red-point.svg) 6.8 6.8, pointer',
      },
    },
  },
};

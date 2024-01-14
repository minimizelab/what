module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'what-white': '#F2EFEB',
        'what-red-01': '#FF0222',
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

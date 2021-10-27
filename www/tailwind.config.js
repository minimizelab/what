module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: { space: ['Space Grotesk'] },
    extend: {
      colors: { 'what-mushroom': '#EBEBEB', 'what-forest': '#2C4431' },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

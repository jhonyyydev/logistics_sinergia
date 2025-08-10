/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/brain/hlm-tailwind-preset')],
  content: [
    './src/**/*.{html,ts}',
    './libs/ui/**/*.{html,ts}',
    './libs/**/*.{html,ts}',
    './node_modules/@spartan-ng/**/*.{js,mjs}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

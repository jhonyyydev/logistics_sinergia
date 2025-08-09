/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/brain/hlm-tailwind-preset')],
  content: [
    './src/**/*.{html,ts}',
    './src/app/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

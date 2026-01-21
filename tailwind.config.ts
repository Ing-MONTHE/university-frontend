import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui')  // ← Utiliser require au lieu de import
  ],
  daisyui: {
    themes: ['light', 'cupcake'],
    base: true,
    styled: true,
    utils: true,
  },
} as Config
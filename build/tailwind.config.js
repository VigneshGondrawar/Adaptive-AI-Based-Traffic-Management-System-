/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      animation: {
        'fill-blue': 'fill-animation-blue 1.5s ease forwards',
        'fill-green': 'fill-animation-green 1.5s ease forwards',
      },
      keyframes: {
        'fill-animation-blue': {
          from: { strokeDashoffset: '282.74' },
          to: { strokeDashoffset: 'var(--dashoffset)' },
        },
        'fill-animation-green': {
          from: { strokeDashoffset: '282.74' },
          to: { strokeDashoffset: 'var(--dashoffset)' },
        },
      },
    },
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
}


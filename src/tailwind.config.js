/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ለዲዛይንህ የሚሆኑ ልዩ ቀለሞች እዚህ መጨመር ትችላለህ
      colors: {
        purple: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        }
      },
      // በ App.css የጻፍናቸውን አኒሜሽኖች እዚህ ብንጽፋቸው ይሻላል
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // የስክሪን መጠኖችን በደንብ ለመቆጣጠር
      screens: {
        'xs': '400px', // በጣም ለሚያንሱ ስልኮች
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
}
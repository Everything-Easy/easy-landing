/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Google Sans Flex"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        gray: {
          bg: '#f8f9fa',
          text: '#6b7280',
          border: '#e5e7eb',
          light: '#f3f4f6',
        },
      },
      borderRadius: {
        'pill': '100px',
        'card': '24px',
        'button': '100px',
      },
      boxShadow: {
        'card': '0 4px 24px -4px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 32px -4px rgba(0, 0, 0, 0.12)',
        'button': '0 4px 14px -2px rgba(0, 0, 0, 0.15)',
      },
      spacing: {
        'section': '120px',
        'section-mobile': '80px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      transitionTimingFunction: {
        'ease-smooth': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
}

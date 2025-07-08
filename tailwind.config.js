/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4CFF',
        secondary: '#FF6B6B',
        accent: '#4ECDC4',
        surface: '#FFFFFF',
        background: '#F7F9FC',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-gentle': 'bounce 1s infinite',
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'elevated': '0 8px 25px rgba(0, 0, 0, 0.1)',
        'premium': '0 20px 40px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}
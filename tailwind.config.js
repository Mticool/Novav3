/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium dark palette (Higgsfield-inspired)
        'canvas-bg': '#050505',
        'node-bg': '#0D0D0D',
        'node-border': 'rgba(255, 255, 255, 0.05)',
        // Neon accent (Higgsfield style)
        'accent-neon': '#EFFE17',
        'accent-neon-dim': '#EFFE17CC',
        // Secondary accents
        'accent-blue': '#4a9eff',
        'accent-purple': '#A855F7',
        // Glassmorphism
        'menu-bg': 'rgba(12, 12, 12, 0.85)',
        'glass-bg': 'rgba(255, 255, 255, 0.03)',
        'glass-border': 'rgba(255, 255, 255, 0.06)',
      },
      animation: {
        'in': 'fadeIn 0.2s ease-out',
        'slide-in-from-left': 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-from-top': 'slideInTop 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px) scale(0.96)', opacity: '0' },
          '100%': { transform: 'translateX(0) scale(1)', opacity: '1' },
        },
        slideInTop: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(239, 254, 23, 0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(239, 254, 23, 0.3)' },
        },
      },
      backdropBlur: {
        '2xl': '40px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
}


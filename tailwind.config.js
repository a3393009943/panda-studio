/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        display: ['Archivo', 'sans-serif'],
      },
      colors: {
        // 潘通2026年度色 - 云上舞白 (Cloud Dancer)
        // 主色系：柔和白色 + 优雅深色 + 点缀色
        primary: '#2D2D2D',        // 深灰（替代纯黑）
        secondary: '#6B6B6B',     // 中灰
        accent: '#7BA3A8',         // 雾霾绿灰（潘通配合色）
        accentWarm: '#C4A484',     // 柔和驼色
        accentBlue: '#8BA4B4',    // 雾霾蓝
        surface: '#F8F9FA',       // 云上舞白浅色
        surfaceDark: '#E8EAED',   // 深色表面
        muted: '#9CA3AF',
        // 潘通调色板扩展
        cloudDancer: '#F5F5F7',   // 云上舞白
        whisperWhite: '#FAFAFA',  // 低语白
        softGray: '#E5E5E7',      // 柔和灰
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

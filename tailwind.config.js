/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: 'var(--brand-primary)',
                    secondary: 'var(--brand-secondary)',
                    bg: 'var(--brand-bg)',
                    surface: 'var(--brand-surface)',
                    border: 'var(--brand-border)',
                },
                // Media Teal palette
                "primary": "#0D9488",
                "primary-hover": "#0F766E",
                "primary-light": "rgba(13, 148, 136, 0.1)",
                "secondary": "#4F46E5",
                "accent-sky": "#0EA5E9",
                "accent-teal": "#14B8A6",
                "background-light": "#F4F4F4",
                "background-dark": "#0C1222",
                "surface-dark": "#162032",
                "surface-elevated": "#1C2840",
                "border-dark": "rgba(255, 255, 255, 0.08)",
            },
            fontFamily: {
                "display": ["Poppins", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "0.75rem",
                "xl": "1rem",
                "2xl": "1.25rem",
                "3xl": "1.5rem",
                "full": "9999px"
            },
            backdropBlur: {
                'glass': '20px',
                'glass-lg': '40px',
            },
            keyframes: {
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
                "fade-in-up": {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                "slide-in-left": {
                    '0%': { opacity: '0', transform: 'translateX(-40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                "slide-in-right": {
                    '0%': { opacity: '0', transform: 'translateX(40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                "scale-in": {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                "count-up": {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                "glow-pulse": {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '0.8' },
                },
                "drawer-in": {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
            },
            animation: {
                shimmer: 'shimmer 2s infinite',
                "fade-in-up": 'fade-in-up 0.7s ease-out forwards',
                "slide-in-left": 'slide-in-left 0.7s ease-out forwards',
                "slide-in-right": 'slide-in-right 0.5s ease-out forwards',
                "scale-in": 'scale-in 0.5s ease-out forwards',
                "count-up": 'count-up 0.5s ease-out forwards',
                "glow-pulse": 'glow-pulse 3s ease-in-out infinite',
                "drawer-in": 'drawer-in 0.3s ease-out forwards',
            }
        },
    },
    plugins: [],
}

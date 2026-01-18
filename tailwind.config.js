/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: '#050505', // Very dark mostly black
                    secondary: '#0F0F0F', // Slightly lighter for cards/sections
                    tertiary: '#1A1A1A', // Borders or inputs
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#A1A1AA', // Zinc-400
                    muted: '#71717A', // Zinc-500
                },
                accent: {
                    DEFAULT: '#2DD4BF', // Teal-400
                    hover: '#14B8A6', // Teal-500
                    dim: 'rgba(45, 212, 191, 0.1)',
                },
                status: {
                    success: '#34D399',
                    warning: '#FBBF24',
                    error: '#F87171',
                },
                border: '#27272A', // Zinc-800
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-hero': 'var(--gradient-hero)',
                'gradient-card': 'var(--gradient-card)',
                'gradient-accent': 'var(--gradient-accent)',
                'gradient-glow': 'var(--gradient-glow)',
            },
        },
    },
    plugins: [],
}

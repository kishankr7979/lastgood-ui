/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: "hsl(var(--card))",
                border: "hsl(var(--border))",
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    hover: "hsl(175 80% 55%)",
                    dim: "hsl(var(--accent) / 0.1)",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                bg: {
                    primary: 'hsl(var(--background))',
                    secondary: 'hsl(var(--card))',
                    tertiary: 'hsl(var(--muted))',
                },
                text: {
                    primary: 'hsl(var(--foreground))',
                    secondary: 'hsl(var(--muted-foreground))',
                    muted: 'hsl(var(--muted-foreground) / 0.7)',
                },
                status: {
                    success: '#34D399',
                    warning: '#FBBF24',
                    error: '#F87171',
                },
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
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}

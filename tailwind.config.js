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
                    hover: "hsl(212 100% 68%)",
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
                    surface: '#0f0f11',
                    hover: '#18181b',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#a1a1aa',
                    muted: '#71717a',
                },
                status: {
                    success: '#10b981',
                    warning: '#f59e0b',
                    error: '#f43f5e',
                    info: '#38bdf8',
                },
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
                serif: ['Inria Serif', 'Instrument Serif', 'Georgia', 'serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            fontSize: {
                xs: '11px',      // Minimum readable size
                sm: '13px',      // Secondary/helper text
                base: '14px',    // Default body text
                lg: '15px',      // Slightly larger body
                xl: '16px',      // Subheadings
                '2xl': '18px',   // Section headings
                '3xl': '20px',   // Major section titles
                '4xl': '24px',   // Page headings
                '5xl': '28px',   // Hero headings
            },
            lineHeight: {
                tight: '1.3',
                normal: '1.5',
                relaxed: '1.65',
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

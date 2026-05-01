// tailwind.config.js
export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: {
                        primary: '#0a0a0a',
                        secondary: '#141414',
                        tertiary: '#1a1a1a',
                        elevated: '#1f1f1f',
                    },
                    border: '#2a2a2a',
                    text: {
                        primary: '#e5e5e5',
                        secondary: '#a3a3a3',
                        muted: '#6b6b6b',
                    },
                    accent: {
                        blue: '#3b82f6',
                        indigo: '#6366f1',
                    },
                },
            },
        },
    },
    plugins: [],
}
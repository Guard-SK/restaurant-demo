/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'lunar-black': '#0a0a0a',
                'lunar-dark': '#1a1a1a',
                'lunar-white': '#f5f5f5',
                'lunar-gold': '#d4af37',
                'lunar-muted': '#a0a0a0',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
        },
    },
    plugins: [],
}

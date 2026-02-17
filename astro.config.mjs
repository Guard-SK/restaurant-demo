import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";
import keystatic from '@keystatic/astro';

import vercel from '@astrojs/vercel';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
    // Placeholder URL
    site: 'https://barber-demo.netlify.app',

    integrations: [tailwind(), react(), keystatic(), vue()],
    output: 'static',

    i18n: {
        defaultLocale: "sk",
        locales: ["sk", "en"],
        routing: {
            prefixDefaultLocale: false
        }
    },

    adapter: vercel()
});
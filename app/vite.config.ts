
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico'],
            manifest: {
                name: 'DartsLive Bookin',
                short_name: 'DL Bookin',
                theme_color: '#d32f2f',
                background_color: '#ffffff',
                display: 'standalone',
                lang: 'fr',
                start_url: '/',
                icons: []
            }
        })
    ]
});


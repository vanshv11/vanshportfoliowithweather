// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    // Astro only exposes PUBLIC_* to the browser by default; the weather key uses VITE_*.
    envPrefix: ['PUBLIC_', 'VITE_'],
  }
});
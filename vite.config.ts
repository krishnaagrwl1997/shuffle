import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps asset paths relative, so the built app works from any static host
// (GitHub Pages, Netlify, a sub-folder) without extra configuration.
export default defineConfig({
  plugins: [react()],
  base: './',
});

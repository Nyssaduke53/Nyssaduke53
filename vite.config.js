import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  base: './', // relative paths for GitHub Pages
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});

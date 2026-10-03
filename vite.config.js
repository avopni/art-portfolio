import { fileURLToPath } from 'node:url';
import { catalogPlugin } from './scripts/catalog.mjs';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [catalogPlugin(fileURLToPath(new URL('./catalog/artworks.json', import.meta.url)))],
  build: {
    rollupOptions: {
      input: { home: 'index.html', collection: 'collection.html', contact: 'contact.html' }
    }
  }
});

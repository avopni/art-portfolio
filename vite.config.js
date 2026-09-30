import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: { home: 'index.html', collection: 'collection.html', contact: 'contact.html' }
    }
  }
});

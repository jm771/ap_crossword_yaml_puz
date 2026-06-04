import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ap_crossword_yaml_puz/',
  define: {
    'process.env': {},
  },
});

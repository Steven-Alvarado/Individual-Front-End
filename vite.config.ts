import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Alias '@' to the 'src' folder
    },
  },
 server: {
    open: true,  // Auto open the browser when running dev server
    port: 3000,  // Define the port you want to use
  },
});


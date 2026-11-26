import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  envPrefix: ['VITE_', 'COVEXCODE_'],
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist', 'jspdf', 'jspdf-autotable', 'lucide-react']
  }
});

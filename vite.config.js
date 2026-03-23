import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 1. Vercel ላይ 'dist' ፎልደር እንዲፈጠር ያደርጋል
  build: {
    outDir: 'dist', 
  },

  server: {
    // 2. ለ Chromebook/Linux ፋይል ለውጥን ቶሎ እንዲያነብ ይረዳዋል
    watch: {
      usePolling: true,
    },
    host: true,
    port: 5173,
    
    // 3. ከ Backend (Node.js) ጋር በቀላሉ ለመገናኘት
    proxy: {
      '/api': {
        target: 'http://localhost:10000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
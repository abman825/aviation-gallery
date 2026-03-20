import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs', // እዚህ ጋር ነው dist የነበረውን ወደ docs የምንቀይረው
    emptyOutDir: true, // አሮጌ ፋይሎች ካሉ እንዲያጠፋቸው
  },
  base: './', // ፋይሎቹ በደንብ እንዲሰሩ (Relative paths)
})
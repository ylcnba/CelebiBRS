import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // In development, use root path. In production (build), use /CelebiBRS/
  const base = command === 'serve' ? '/' : '/CelebiBRS/';
  
  return {
    plugins: [react()],
    base,
  };
})



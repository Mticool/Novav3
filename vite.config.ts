import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom'],
          // ReactFlow - largest dependency
          'vendor-reactflow': ['@xyflow/react'],
          // AI/API clients
          'vendor-ai': ['openai', '@fal-ai/serverless-client', '@gradio/client'],
          // UI utilities
          'vendor-ui': ['lucide-react', 'zustand'],
        },
      },
    },
    // Increase chunk size warning limit slightly since we've optimized
    chunkSizeWarningLimit: 300,
  },
})

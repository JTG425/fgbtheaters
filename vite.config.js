import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(css)$/.test(name ?? '')) {
            return 'assets/[name]-[hash].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: (content, loaderContext) => {
          const { filename } = loaderContext;
          if (filename.endsWith('.css')) {
            return `/* ${Date.now()} */\n${content}`;
          }
          return content;
        },
      },
    },
    optimizeDeps: {
      exclude: ['js-big-decimal']
    },
  },
});

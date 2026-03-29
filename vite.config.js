import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // /api/hotels/search → http://localhost:8080/api/v1/hotels/search
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        // Forward cookies so HttpOnly refreshToken cookie works
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'http://localhost:4000');
          });
        },
      },
    },
  },
})

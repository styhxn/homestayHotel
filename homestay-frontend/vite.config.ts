import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  // 根据环境动态设置基础路径
  // 开发环境使用 '/'，生产环境使用 '/hotel/'
  base: mode === 'production' ? '/hotel/' : '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 代理Dify公网链接
      '/api/dify/chat': {
        target: 'http://4295a4ce.r28.cpolar.top/chat',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dify\/chat/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🔴 代理错误:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 代理请求:', req.method, req.url, '→', proxyReq.path);
            console.log('📤 请求头:', proxyReq.getHeaders());
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ 代理响应:', proxyRes.statusCode, req.url);
            console.log('📥 响应头:', proxyRes.headers);
            console.log('📄 Content-Type:', proxyRes.headers['content-type']);
          });
        }
      },
      // 代理Dify后端API
      '/api/dify/v1': {
        target: 'http://4295a4ce.r28.cpolar.top/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dify\/v1/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🔴 代理错误:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 代理请求:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ 代理响应:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
}))

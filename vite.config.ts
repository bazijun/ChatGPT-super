import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig((env) => {
  // const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv
  return {
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    plugins: [
      vue(),
      VitePWA({
        injectRegister: 'auto',
        registerType: 'autoUpdate', // 开启自动更新
        includeAssets: ['favicon.svg'], // 需要缓存的其他资源
        workbox: {
          skipWaiting: true, // 新版本立即接管网站
          clientsClaim: true, // 新版本立即生效
        },
        manifest: {
          name: 'chatBPT',
          short_name: 'chatBPT',
          icons: [
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: 1002,
      open: false,
      watch: {
        usePolling: true,
      },
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  }
})

import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import postcsspxtoviewport8plugin from 'postcss-px-to-viewport-8-plugin'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const { APP_BASE } = env
  return defineConfig({
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    envPrefix: 'APP_',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      }
    },
    base: APP_BASE,
    server: {
      host: '0.0.0.0',
      port: 80,
    },
    css: {
      postcss: {
        plugins: [
          postcsspxtoviewport8plugin({
            unitToConvert: 'px',
            viewportUnit: 'vw',
            viewportWidth: 1280,
            propList: ['*'],
          }),
          autoprefixer({
            overrideBrowserslist: [
              "last 10 versions",  // 所有主流浏览器最近10个版本
            ]
          })
        ]
      }
    }
  })
}

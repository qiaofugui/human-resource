import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 自动导入vue中hook reactive ref等
import AutoImport from "unplugin-auto-import/vite"
//自动导入 ui组件
import Components from 'unplugin-vue-components/vite';
//ant-design-vue
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"

// tailwindcss
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // 组件中不用再导入ref，reactive等
      imports: ['vue', 'vue-router'],
      //ant-design-vue
      resolvers: [AntDesignVueResolver()]
    }),
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: false, resolveIcons: true })],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    },
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  server: {
    proxy: {
      '/api': {
        // target: 'http://ihrm.itheima.net',
        target: 'http://heimahr.itheima.net',
        changeOrigin: true
      }
    }
  },
})

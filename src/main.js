import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './styles/index.css'

import '@/permission'

import Icons from '@/components/Icons'

// pinia 持久化插件
import PluginState from 'pinia-plugin-persistedstate'

const app = createApp(App)

app.use(Icons)

app.use(router)

const piniaApp = createPinia()
piniaApp.use(PluginState) // 注册持久化插件
app.use(piniaApp) // 注册 pinia

app.mount('#app')

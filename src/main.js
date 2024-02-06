import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './styles/index.css'

// pinia 持久化插件
import PluginState from 'pinia-plugin-persistedstate'

const app = createApp(App)

const piniaApp = createPinia()
piniaApp.use(PluginState) // 注册持久化插件
app.use(piniaApp) // 注册 pinia

app.use(router)

app.mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@/permission'

import Icons from '@/components/Icons'

// pinia 持久化插件
import PluginState from 'pinia-plugin-persistedstate'


import VxeTable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

import './styles/index.css'

const app = createApp(App)

app.use(Icons)

app.use(router)

app.use(VxeTable)
app.use(VxeUI)

const piniaApp = createPinia()
piniaApp.use(PluginState) // 注册持久化插件
app.use(piniaApp) // 注册 pinia

app.mount('#app')

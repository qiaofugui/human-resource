<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import Lock from '@/views/Lock/index.vue'
import useLock from '@/stores/lock'

const lock = useLock()

// 设置主题色
const theme = {
  token: {
    colorPrimary: '#6226EE',
  },
}
dayjs.locale('zh-cn')
</script>

<template>
  <div class="app">
    <a-config-provider
      :theme="theme"
      :locale="zhCN"
    >
      <router-view v-if="!lock.isLock" />
      <Lock v-else />
    </a-config-provider>
  </div>
</template>
<style>
.app {
  width: 100vw;
  min-height: 100vh;
}
</style>

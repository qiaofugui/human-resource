<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 设置主题色
const theme = {
  token: {
    colorPrimary: '#6226EE',
  },
}
dayjs.locale('zh-cn')
</script>

<template>
  <a-config-provider :theme="theme" :locale="zhCN">
    <div class="app">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>
<style>
.app {
  width: 100%;
  min-height: 100vh;
}
</style>

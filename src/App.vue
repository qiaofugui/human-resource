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
      <a-space wrap>
        <a-button type="primary">Primary Button</a-button>
        <a-button>Default Button</a-button>
        <a-button type="dashed">Dashed Button</a-button>
        <a-button type="text">Text Button</a-button>
        <a-button type="link">Link Button</a-button>
      </a-space>
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

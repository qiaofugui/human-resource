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
  <div class="app">
    <a-config-provider :theme="theme" :locale="zhCN">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </a-config-provider>
  </div>
</template>
<style>
.app {
  width: 100%;
  min-height: 100vh;
}

/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

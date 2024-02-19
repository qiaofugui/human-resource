
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import useUserInfo from '@/stores/userInfo'

const userInfo = useUserInfo()

const router = useRouter()
const getMeta = (obj) => {
  // 判断当前有没有子节点
  if (obj.children && obj.children.length) {
    // 如果有子节点 就读取 子节点中第一个的meta属性
    // meta- 路由的元信息-存储信息的地方
    // 有节点
    return obj.children.find((item) => !item.hidden).meta
  }
  return obj.meta
}
  ;
</script>

<template>
  <a-menu class="side-bar" mode="inline" theme="dark" v-model:selectedKeys="router.path">
    <!-- 循环路由信息 生成左侧菜单项 -->
    <a-menu-item v-for="(item, index) in userInfo.routes" :key="item.path">
      <!-- 路由的链接 -->
      <router-link class="link-name" :to="item.path">
        <!-- Vue动态组件 component is(组件名称) -->
          <component :is="getMeta(item).icon" :style="{ fontSize: '16px' }" />
        <span :style="{ fontSize: '14px' }">{{ getMeta(item).title }}</span>
      </router-link>
    </a-menu-item>
  </a-menu>
</template>



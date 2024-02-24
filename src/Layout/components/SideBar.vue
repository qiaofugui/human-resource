
<script setup>
import { useRoute } from 'vue-router'
import useUserInfo from '@/stores/userInfo'
import { watch } from 'vue'

const userInfo = useUserInfo()
const router = useRoute()
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

const selectedKeys = ref([router.path])
watch(router, () => {
  selectedKeys.value = [router.path]
})
  ;
</script>

<template>
  <a-menu mode="inline" theme="light" style="background: rgba(98, 38, 238, 0)" v-model:selectedKeys="selectedKeys">
    <!-- 循环路由信息 生成左侧菜单项 -->
    <a-menu-item v-for="(item, index) in userInfo.routes" :key="item.path">
      <!-- 路由的链接 -->
      <router-link :to="item.path">
        <!-- Vue动态组件 component is(组件名称) -->
          <component :is="getMeta(item).icon" :style="{ fontSize: '16px' }" />
        <span :style="{ fontSize: '14px' }">{{ getMeta(item).title }}</span>
      </router-link>
    </a-menu-item>
  </a-menu>
</template>


<style lang="less" scoped>
:deep(.ant-menu-inline.ant-menu-root) {
  background: green !important;
}
</style>
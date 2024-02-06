
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()  // 获取路由实例
// 计算属性-测算需要展示的路由的信息
const routes = computed(() => {
  return router.options.routes.filter((item) => !item.hidden) // 找出所有的hidden为false的路由
})
const getMeta = (obj) => {
  // 判断当前有没有子节点
  if (obj.children && obj.children.length) {
    // 如果有子节点 就读取 子节点中第一个的meta属性
    // meta- 路由的元信息-存储信息的地方
    // 有节点
    return obj.children.find((item) => !item.hidden).meta
  }
  return obj.meta
};
</script>

<template>
  <a-menu class="side-bar" mode="inline" theme="dark">
    <!-- 循环路由信息 生成左侧菜单项 -->
    <template v-for="(item, index) in routes" :key="index">
      <!-- 菜单项 -->
      <a-menu-item>
        <!-- 路由的链接 -->
        <router-link class="link-name" :to="item.path">
          <!-- Vue动态组件 component is(组件名称) -->
          <component :is="getMeta(item).icon" />
          <!-- Circle <Circle> <Round> -->
          <span>{{ getMeta(item).title }}</span>
        </router-link>
      </a-menu-item>
    </template>
  </a-menu>
</template>



<template>
  <div class="app">
    <!-- 存放路由的容器 必须要有这个东西- 没有容器, 就没有办法展示组件 -->
    <router-view></router-view>
  </div>
</template>
<style>
.app {
  width: 100%;
  min-height: 100vh;
}
</style>

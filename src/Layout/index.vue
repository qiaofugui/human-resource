<script setup>
import SideBar from './components/SideBar.vue'
import NavBar from './components/NavBar.vue'
import useUserInfo from '@/stores/userInfo'
import { menuWidth } from '@/config/index'

const userInfo = useUserInfo()
;
</script>

<template>
  <a-layout class="app-layout" breakpoint="lg" collapsed-width="0">
    <a-layout-sider :collapsed="userInfo.collapsed" :width="menuWidth" style="background: rgba(98, 38, 238, .1)">
      <div class="logo">{{ userInfo.collapsed ? 'HR' : 'HRSASS' }}</div>
      <SideBar />
    </a-layout-sider>
    <a-layout class="right-layout">
      <a-layout-header>
        <NavBar />
      </a-layout-header>
      <a-layout-content style="padding: 15px; overflow-y: auto;">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less">
.app-layout {
  min-height: 100vh;
  display: flex;

  .ant-layout-sider {
    overflow: auto;
    overflow-x: hidden;
    height: 100vh;

    .logo {
      height: 60px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #6226ee;
      font-size: 24px;
      text-shadow: 2px 2px 4px #6226ee;
      transform: skewX(-10deg);
    }
  }

  .right-layout {
    flex: 1;
    height: 100vh;
    overflow-y: auto;
  }

  .ant-layout-header {
    background-color: #fff;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .anticon {
      font-size: 20px;
      cursor: pointer;
    }
  }
}
</style>

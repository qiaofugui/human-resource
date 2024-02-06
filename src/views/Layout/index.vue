<script setup>
import { onMounted, ref } from 'vue'
import { getUserInfoAPI } from '@/api/login'
import { Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import SideBar from './components/SideBar.vue'
import useToken from '@/stores/token'

const router = useRouter() // 得到router实例
const collapsed = ref(false)

const userInfo = ref({})
const getUserProfile = async () => {
  userInfo.value = await getUserInfoAPI()
}
onMounted(() => getUserProfile());

// 退出登录
const logout = () => {
  // 退出之前要询问一下
  Modal.confirm({
    title: "提示",
    content: "您确认要退出该系统吗？",
    onOk() {
      // 删除token
      const { removeToken } = useToken()
      removeToken()

      // 跳转到登录页
      router.push("/login")
    }
  })

};

</script>

<template>
  <a-layout class="app-layout">
    <a-layout-sider :collapsed="collapsed" collapsible :trigger="null">
      <div class="logo">{{ collapsed ? 'HR' : 'HRSASS' }}</div>
      <SideBar />
    </a-layout-sider>
    <a-layout class="right-layout">
      <a-layout-header>
        <div @click="collapsed = !collapsed">
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </div>
        <a-popover placement="bottomRight">
          <a-avatar class="my-avatar">{{ userInfo.username }}</a-avatar>
          <template #content>
            <div class="my-select">
              <p class="item">
                <PoweroffOutlined /><span> 锁定屏幕</span>
              </p>
              <p class="item" @click="logout">
                <LockOutlined /><span> 退出登录</span>
              </p>
            </div>
          </template>
        </a-popover>
      </a-layout-header>
      <a-layout-content>
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
      color: #fff;
      font-size: 24px;
      text-shadow: 2px 2px 4px #666;
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

.my-avatar {
  color: #f56a00;
  background-color: #fde3cf;
  cursor: pointer;
}

.my-select {
  margin: -6px -12px;

  .item {
    padding: 5px 20px;
    margin-bottom: 0 !important;
    color: #666;

    &:hover {
      background-color: #fafafa;
      cursor: pointer;
    }
  }
}
</style>

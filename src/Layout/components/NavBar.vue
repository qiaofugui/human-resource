<script setup>
import { ref } from 'vue'
import { Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import useToken from '@/stores/token'
import useUserInfo from '@/stores/userInfo'

const router = useRouter()

const { userInfo: user, removeUserInfo, collapsed, toggleCollapsed } = useUserInfo()

// 退出登录
const logout = () => {
  // 退出之前要询问一下
  Modal.confirm({
    title: "提示",
    content: "您确认要退出该系统吗？",
    onOk () {
      // 删除token
      const { removeToken } = useToken()
      removeToken()
      removeUserInfo()

      // 跳转到登录页
      router.push("/login")
    }
  })
}
;
</script>

<template>
  <div class="cursor-pointer" @click="()=>toggleCollapsed()">
    <MenuUnfoldOutlined v-if="collapsed" />
    <MenuFoldOutlined v-else />
  </div>
  <a-popover placement="bottomRight">
    <div class="flex justify-center items-center" v-if="user.staffPhoto">
      <a-avatar class="my-avatar" :src="user.staffPhoto"></a-avatar>
      <p>{{ user.username }}</p>
    </div>
    <div class="flex justify-center items-center" v-else>
      <a-avatar class="my-avatar">{{ user.username.charAt(0) }}</a-avatar>
      <p>{{ user.username }}</p>
    </div>
    <template #content>
      <div class="my-select">
        <p class="item">
          <LockOutlined /><span> 锁定屏幕</span>
        </p>
        <p class="item">
          <UserOutlined /><span> 个人信息</span>
        </p>
        <p class="item" @click="logout">
          <PoweroffOutlined /><span> 退出登录</span>
        </p>
      </div>
    </template>
  </a-popover>
</template>

<style lang="less" scoped>
.my-avatar {
  color: #f56a00;
  background-color: #fde3cf;
  cursor: pointer;
  margin-right: 4px;
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

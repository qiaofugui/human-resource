<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import useToken from '@/stores/token'
import useUserInfo from '@/stores/userInfo'
import Messages from './Messages.vue'
import { getMessageAPI } from '@/api/navbar'

let messagesData = ref(null)
let timer = ref(null)
const getMessages = async () => {
  const data = await getMessageAPI()
  messagesData.value = data
}
onMounted(async () => {
  await getMessages()

  timer.value = setInterval(async () => {
    // await getMessages()
  }, 3000)
})
onUnmounted(() => {
  clearInterval(timer.value)
})

const router = useRouter()

const { userInfo: user, removeUserInfo, collapsed, toggleCollapsed, toggleRefresh } = useUserInfo()

// 退出登录
const logout = () => {
  // 退出之前要询问一下
  Modal.confirm({
    title: '提示',
    content: '您确认要退出该系统吗？',
    onOk() {
      // 删除token
      const { removeToken } = useToken()
      removeToken()
      removeUserInfo()

      // 跳转到登录页
      router.push('/login')
    },
  })
}
;
</script>

<template>
  <div class="cursor-pointer">
    <MenuUnfoldOutlined v-if="collapsed" @click="() => toggleCollapsed()" />
    <MenuFoldOutlined v-else @click="() => toggleCollapsed()" />
    <a-tooltip title="刷新" placement="left" class="ml-2">
      <a-button shape="circle" size="small" @click="toggleRefresh"><RedoOutlined /></a-button>
    </a-tooltip>
  </div>
  <div class="flex items-center">
    <a-popover placement="bottom" trigger="click">
      <a-badge :count="messagesData?.unread.length" class="mr-3">
        <BellOutlined style="font-size: 22px;" class="cursor-pointer"/>
      </a-badge>
      <template #content>
        <Messages :messagesData="messagesData" @getMessages="getMessages" />
      </template>
    </a-popover>
    <a-popover placement="bottomRight" class="cursor-pointer">
      <div class="flex justify-center items-center" v-if="user.staffPhoto">
        <a-avatar class="my-avatar" :src="user.staffPhoto"></a-avatar>
        <p>{{ user.username }}</p>
      </div>
      <div class="flex justify-center items-center" v-else>
        <a-avatar class="my-avatar">{{ user.username.charAt(0) }}</a-avatar>
        <p>{{ user.username }}</p>
      </div>
      <template #content>
        <div class="my-select flex flex-col">
          <a-button type="text" class="item"><LockOutlined /><span> 锁定屏幕</span></a-button>
          <a-button type="text" class="item"><UserOutlined /><span> 个人信息</span></a-button>
          <a-button type="text" class="item" @click="logout"><PoweroffOutlined /><span> 退出登录</span></a-button>
        </div>
      </template>
    </a-popover>
  </div>
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
  }
}
</style>

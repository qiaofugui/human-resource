<script setup>
import { useRouter, useRoute } from 'vue-router'
import useLock from '@/stores/lock'
import useUserInfo from '@/stores/userInfo'
import useToken from '@/stores/token'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { onMounted, onUnmounted } from 'vue'

const route = useRoute()
const router = useRouter()
const lock = useLock()
const userInfo = useUserInfo()
const token = useToken()

const lockFormRef = ref(null)
const lockOpen = ref(false)
const lockForm = ref({
  password: ''
})
const lockRules = {
  password: [
    { required: true, message: '请输入锁屏密码', trigger: 'blur' }
  ]
}

const openLock = () => {
  lockForm.value.password = ''
  lockOpen.value = true
  nextTick(() => {
    lockFormRef.value.clearValidate()
  })

}
const lockOk = () => {
  lockFormRef.value.validate().then(() => {
    if (lockForm.value.password === lock.password) {
      lock.updateLock(false)
      document.title = 'HR - ' + route.meta.title
    } else {
      message.warning('密码错误，请检查密码！')
    }
  })
}

// 重新登录
const logout = () => {
  token.removeToken()
  userInfo.removeUserInfo()
  lock.updateLock(false)
  lock.updatePassword('')
  router.push('/login')
}

const timer = ref(null)
const date = ref(null)
const time = ref(null)
const week = ref(null)
onMounted(() => {
  date.value = dayjs(new Date()).format('YYYY-MM-DD')
  time.value = dayjs(new Date()).format('HH:mm:ss')
  week.value = dayjs(new Date()).format('dddd')
  timer.value = setInterval(() => {
    date.value = dayjs(new Date()).format('YYYY-MM-DD')
    time.value = dayjs(new Date()).format('HH:mm:ss')
    week.value = dayjs(new Date()).format('dddd')
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer.value)
})
  ;
</script>

<template>
  <div class="screen p-6 text-gray-600">
    <div class="mb-2 flex justify-center">
      <span
        @click="openLock"
        class="unlock text-2xl cursor-pointer"
      >
        <LockOutlined /> 点击解锁
      </span>
    </div>
    <div class="flex justify-between items-center">
      <a-card class="card text-gray-600">
        {{ time?.split(':')[0] }} 时
      </a-card>
      <a-card class="card text-gray-600">
        {{ time?.split(':')[1] }} 分
      </a-card>
      <a-card class="card text-gray-600">
        {{ time?.split(':')[2] }} 秒
      </a-card>
    </div>
    <div class="mt-2 flex justify-center">
      <div class="font-bold text-6xl">{{ date }} / {{ week }}</div>
    </div>
  </div>

  <a-modal
    v-model:open="lockOpen"
    title="进入系统"
    @ok="lockOk"
    :width="450"
  >
    <div class="flex flex-col justify-center items-center mb-6">
      <div class="mb-2">
        <a-avatar
          class="lock-avatar"
          v-if="userInfo.userInfo.staffPhoto"
          :src="userInfo.userInfo.staffPhoto"
        ></a-avatar>
        <a-avatar
          class="lock-avatar"
          v-else
        >{{ userInfo.userInfo.username.charAt(0) }}</a-avatar>
      </div>
      <div class="text-base">{{ userInfo.userInfo.username }}</div>
    </div>
    <a-form
      ref="lockFormRef"
      :model="lockForm"
      :rules="lockRules"
    >
      <a-form-item name="password">
        <a-input-password
          v-model:value="lockForm.password"
          placeholder="请输入密码解锁"
          has-feedback
          @keyup.enter="lockOk"
        />
        <a-button
          type="link"
          class="px-0 text-xs"
          @click="logout"
        >重新登录</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less">
.screen {
  width: 100vw;
  height: 100vh;
  background-color: rgba(111, 98, 242, 0.1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.lock-avatar {
  width: 80px;
  height: 80px;
  background-color: rgba(98, 38, 238, 0.1);
  line-height: 75px;
  font-size: 32px;
  color: #333;
}

.card {
  width: 32.4%;
  height: 70vh;
  box-shadow: 0px 0px 50px -20px rgba(98, 38, 238, 0.2);
  background-color: rgba(98, 38, 238, 0.1);
  border-radius: 20px;
  line-height: 70vh;
  text-align: center;
  font-size: 124px;
  font-weight: 700;
}
.unlock {
  padding: 15px;
  transition: color 0.3s;

  &:hover {
    color: rgba(98, 38, 238, 1);
  }
}
</style>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import useToken from '@/stores/token'
import useUserInfo from '@/stores/userInfo'
import Messages from './Messages.vue'
import { getMessageAPI } from '@/api/navbar'
import { getDepartmentAPI } from '@/api/department'
import { getEmployeeInfoAPI } from '@/api/employee'
import UserInfo from '@/views/Employee/components/UserInfo.vue'
import useLock from '@/stores/lock'
import screenfull from 'screenfull'

const lock = useLock()

let messagesData = ref(null)
let timer = ref(null)
const getMessages = async () => {
  const data = await getMessageAPI()
  messagesData.value = data
}
onMounted(async () => {
  await getMessages()

  timer.value = setInterval(async () => {
    await getMessages()
  }, 8000)
})
onUnmounted(() => {
  clearInterval(timer.value)
})

const router = useRouter()

// 解构出来失去响应式
const { userInfo: user, removeUserInfo, collapsed, toggleCollapsed, toggleRefresh } = useUserInfo()
const userInfo = useUserInfo()

// 退出登录
const logout = () => {
  // 退出之前要询问一下
  Modal.confirm({
    title: '提示',
    content: '您确认要退出该系统吗？',
    onOk () {
      // 删除token
      const { removeToken } = useToken()
      removeToken()
      removeUserInfo()
      lock.updateLock(false)
      lock.updatePassword('')

      // 跳转到登录页
      router.push('/login')
    },
  })
}

// 个人信息
const treeData = ref([])
onMounted(() => {
  getDepartment()
})
const getDepartment = async () => {
  const data = await getDepartmentAPI()
  treeData.value = listToTree(data)
}
// 处理成树形结构
const listToTree = (data) => {
  let map = Object.create(null)
  let tree = []

  // 创建一个 ID 到节点的映射
  data.forEach((item) => map[item.id] = { ...item, children: [] })

  // 构建树形结构
  data.forEach((item) => {
    let parent = map[item.pid]
    if (parent) {
      parent.children.push(map[item.id])
    } else {
      tree.push(map[item.id])
    }
  })

  return tree
}
// 编辑个人弹窗
const type = ref('')
const open = ref(false)
const formState = ref({
  username: '',
  workNumber: '',
  mobile: '',
  departmentId: null,
  formOfEmployment: 1,
  timeOfEntry: '',
  correctionTime: '',
  staffPhoto: '',
})
const openModal = async () => {
  await getEmployeeInfo(user.id)
  open.value = true
}
// 获取指定员工信息
const getEmployeeInfo = async (id) => {
  const res = await getEmployeeInfoAPI(id)
  let departmentId = findAncestorIds(treeData.value, res.departmentId)
  formState.value = { ...res, departmentId }
}
// 递归寻找祖先ID
const findAncestorIds = (data, targetId, ancestors = []) => {
  for (const item of data) {
    if (item.id === targetId) {
      // 找到目标ID，返回当前累积的祖先ID数组
      return [...ancestors, item.id]
    } else if (item.children && item.children.length) {
      // 不是目标ID，但有子节点，继续递归搜索子节点
      const result = findAncestorIds(item.children, targetId, [...ancestors, item.id])
      if (result) {
        return result
      }
    }
  }
  // 当前分支未找到目标ID，返回null
  return null
}

const cancel = () => {
  open.value = false
  formState.value = {
    username: '',
    workNumber: '',
    mobile: '',
    departmentId: null,
    formOfEmployment: 1,
    timeOfEntry: '',
    correctionTime: '',
    staffPhoto: '',
  }
}

const lockFormRef = ref(null)
const lockOpen = ref(false)
const lockForm = ref({
  password: ''
})
const lockRules = {
  password: [
    { required: true, message: '请设置锁屏密码', trigger: 'blur' },
    { min: 6, message: '长度至少为6位', trigger: 'blur' },
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
    lock.updatePassword(lockForm.value.password)
    lock.updateLock(true)
    document.title = 'HR - 锁定中'
  })
}

// 全屏
const isFullscreen = ref(false)
const changeScreenfull = () => {
  if (!screenfull.isEnabled) {
    message.warning('浏览器不支持全屏')
  } else {
    screenfull.toggle()
  }
}
const change = () => {
  if (screenfull.isEnabled) isFullscreen.value = screenfull.isFullscreen
}
onMounted(() => screenfull.isEnabled && screenfull.on('change', change))
onUnmounted(() => screenfull.isEnabled && screenfull.off('change', change))
  ;
</script>

<template>
  <div class="cursor-pointer flex items-center">
    <a-tooltip
      :title="userInfo.collapsed ? '展开' : '收起'"
      placement="left"
    >
      <MenuUnfoldOutlined
        v-if="userInfo.collapsed"
        @click="() => toggleCollapsed()"
        style="font-size: 18px;"
      />
      <MenuFoldOutlined
        v-else
        style="font-size: 18px;"
        @click="() => toggleCollapsed()"
      />
    </a-tooltip>
    <a-tooltip
      title="刷新"
      placement="right"
      class="ml-2"
    >
      <a-button
        shape="circle"
        size="small"
        @click="toggleRefresh"
      >
        <RedoOutlined />
      </a-button>
    </a-tooltip>
  </div>
  <div class="flex items-center">
    <div
      style="font-size: 22px;"
      class="mr-2 cursor-pointer"
      @click="changeScreenfull"
    >
      <a-tooltip
        :title="isFullscreen ? '退出全屏' : '全屏'"
        placement="bottom"
      >
        <FullscreenOutlined v-if="!isFullscreen" />
        <FullscreenExitOutlined v-else />
      </a-tooltip>
    </div>
    <a-popover
      placement="bottom"
      trigger="click"
    >
      <a-tooltip
        title="消息"
        placement="bottom"
      >
        <a-badge
          :count="messagesData?.unread.length"
          class="mr-3"
        >
          <BellOutlined
            style="font-size: 22px;"
            class="cursor-pointer"
          />
        </a-badge>
      </a-tooltip>
      <template #content>
        <Messages
          :messagesData="messagesData"
          @getMessages="getMessages"
        />
      </template>
    </a-popover>
    <a-popover
      placement="bottomRight"
      class="cursor-pointer"
    >
      <div
        class="flex justify-center items-center"
        v-if="user.staffPhoto"
      >
        <a-avatar
          class="my-avatar"
          :src="user.staffPhoto"
        ></a-avatar>
        <p>{{ user.username }}</p>
      </div>
      <div
        class="flex justify-center items-center"
        v-else
      >
        <a-avatar class="my-avatar">{{ user.username.charAt(0) }}</a-avatar>
        <p>{{ user.username }}</p>
      </div>
      <template #content>
        <div class="my-select flex flex-col">
          <a-button
            type="text"
            class="item"
            @click="openLock"
          >
            <LockOutlined /><span> 锁定屏幕</span>
          </a-button>
          <a-button
            type="text"
            class="item"
            @click="openModal"
          >
            <UserOutlined /><span> 个人信息</span>
          </a-button>
          <a-button
            type="text"
            class="item"
            @click="logout"
          >
            <PoweroffOutlined /><span> 退出登录</span>
          </a-button>
        </div>
      </template>
    </a-popover>

    <UserInfo
      v-model:treeData="treeData"
      v-model:type="type"
      v-model:open="open"
      v-model:formState="formState"
      @cancel="cancel"
      :navbar="true"
    />
  </div>

  <a-modal
    v-model:open="lockOpen"
    title="设置锁屏密码"
    @ok="lockOk"
    :width="450"
  >
    <div class="flex flex-col justify-center items-center mb-6">
      <div class="mb-2">
        <a-avatar
          class="lock-avatar"
          v-if="user.staffPhoto"
          :src="user.staffPhoto"
        ></a-avatar>
        <a-avatar
          class="lock-avatar"
          v-else
        >{{ user.username.charAt(0) }}</a-avatar>
      </div>
      <div class="text-base">{{ user.username }}</div>
    </div>
    <a-form
      ref="lockFormRef"
      :model="lockForm"
      :rules="lockRules"
    >
      <a-form-item name="password">
        <a-input-password
          v-model:value="lockForm.password"
          placeholder="请设置锁屏密码"
          has-feedback
          @keyup.enter="lockOk"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped>
.my-avatar {
  color: #333;
  background-color: rgba(98, 38, 238, 0.1);
  cursor: pointer;
  margin-right: 4px;
}

.my-select {
  margin: -6px -12px;

  .item {
    padding: 5px 20px;
  }
}
.lock-avatar {
  width: 80px;
  height: 80px;
  background-color: rgba(98, 38, 238, 0.1);
}
</style>

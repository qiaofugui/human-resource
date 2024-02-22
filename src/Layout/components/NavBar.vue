<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import useToken from '@/stores/token'
import useUserInfo from '@/stores/userInfo'
import Messages from './Messages.vue'
import { getMessageAPI } from '@/api/navbar'
import { getDepartmentAPI } from '@/api/department'
import { getEmployeeInfoAPI } from '@/api/employee'
import UserInfo from '@/views/Employee/components/UserInfo.vue'

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
  }, 3600)
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
    onOk () {
      // 删除token
      const { removeToken } = useToken()
      removeToken()
      removeUserInfo()

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
  ;
</script>

<template>
  <div class="cursor-pointer">
    <MenuUnfoldOutlined
      v-if="collapsed"
      @click="() => toggleCollapsed()"
    />
    <MenuFoldOutlined
      v-else
      @click="() => toggleCollapsed()"
    />
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
    <a-popover
      placement="bottom"
      trigger="click"
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
</style>

<script setup>
import { getDepartmentAPI } from '@/api/department'
import { getEmployeeAPI, sendNoticeAPI, deleteEmployeeAPI, getEmployeeInfoAPI, getRoleAPI, putRoleAPI } from '@/api/employee'
import { getUserBaseInfoAPI } from '@/api/login'
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import UserInfo from './components/UserInfo.vue'

const fieldNames = {
  title: 'name',
  children: 'children',
  key: 'id',
}
const treeData = ref([])
onMounted(() => {
  getDepartment()
})
let treeSpinning = ref(false)
const getDepartment = async () => {
  treeSpinning.value = true
  const data = await getDepartmentAPI()
  treeData.value = listToTree(data)
  treeSpinning.value = false
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

const columns = [
  { title: '头像', dataIndex: 'staffPhoto', key: 'staffPhoto', width: 80 },
  { title: '姓名', dataIndex: 'username', key: 'username', width: 120 },
  { title: '手机号', dataIndex: 'mobile', key: 'mobile', width: 120 },
  {
    title: '工号', dataIndex: 'workNumber', key: 'workNumber', width: 120,
    sorter: (a, b) => {
      return a.workNumber.slice(5) - b.workNumber.slice(5)
    }
  },
  { title: '聘用形式', dataIndex: 'formOfEmployment', key: 'formOfEmployment', width: 120 },
  { title: '部门', dataIndex: 'departmentName', key: 'departmentName' },
  {
    title: '入职时间', dataIndex: 'timeOfEntry', key: 'timeOfEntry', width: 120,
    sorter: (a, b) => {
      const a1 = a.timeOfEntry.replace(/-/g, '')
      const b1 = b.timeOfEntry.replace(/-/g, '')
      return a1 - b1
    }
  },
  {
    title: '操作',
    key: 'action',
    width: 166,
    fixed: 'right'
  },
];
const params = ref({
  keyword: '',
  page: 1,
  pagesize: 10,
  departmentId: 1
})
const employeeData = ref([])
const total = ref(0)
const spinning = ref(false)
onMounted(() => {
  onSelect()
})
const onSelect = async (selectedKeys, e) => {
  try {
    spinning.value = true
    params.value.departmentId = e?.node?.id || 1
    const res = await getEmployeeAPI(params.value)
    employeeData.value = res.rows
    total.value = res.total
    spinning.value = false
  } catch (error) {
    console.log(error)
    message.warning('接口异常!')
    spinning.value = false
  }
}
const checkRows = ref([])
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    checkRows.value = selectedRows
  },
}
const changeSize = (page, pageSize) => {
  params.page = page
  params.pagesize = pageSize
  onSelect()
}

const noticeType = [
  { label: '通知消息', value: 1 },
  { label: '提示消息', value: 2 },
  { label: '重要消息', value: 3 },
  { label: '紧急消息', value: 4 },
]
const openNoticeVisible = ref(false)
const noticeModalLoading = ref(false)
const sendFormRef = ref(null)
const openNotice = () => {
  if (checkRows.value.length === 0) {
    return message.warning('请先选择通知员工!')
  }
  openNoticeVisible.value = true
}
const sendForm = ref({
  content: '',
  type: 1,
  userIds: []
})
const sendRules = {
  content: [
    { required: true, message: '消息内容不能为空', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '消息等级不能为空', trigger: 'blur' },
  ]
}
const closeTag = (id) => {
  checkRows.value = checkRows.value.filter(item => item.id !== id)
}
const sendNotice = () => {
  sendFormRef.value.validate().then(async () => {
    noticeModalLoading.value = true
    const res = await sendNoticeAPI({ ...sendForm.value, userIds: checkRows.value.map(item => item.id) })
    message.success('通知发送成功!')
    sendFormRef.value.resetFields()
    noticeModalLoading.value = false
    openNoticeVisible.value = false
  })
}
const deleteEmployee = async (row) => {
  const res = await deleteEmployeeAPI(row.id)
  message.success('删除员工成功!')
  onSelect()
}

// 添加/编辑员工弹窗
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
const openModal = async (e, row) => {
  type.value = e
  if (e === 'update') {
    await getEmployeeInfo(row.id)
  }
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

const roleList = ref([])
const checkRoleList = ref([])
const openRoleVisible = ref(false)
const roleModalLoading = ref(false)
// 获取角色列表
const getRole = async () => {
  const res = await getRoleAPI()
  // 数据处理成 label 和 value
  roleList.value = res.map(item => ({ label: item.name, value: item.id }))
}
onMounted(() => {
  getRole()
})
const openRole = async (row) => {
  await getEmployeeInfo(row.id)
  checkRoleList.value = formState.value.roleIds
  openRoleVisible.value = true
}
const okRole = async () => {
  roleModalLoading.value = true
  const res = await putRoleAPI({ id: formState.value.id, roleIds: checkRoleList.value })
  message.success('更新角色成功!')
  openRoleVisible.value = false
  roleModalLoading.value = false
}

  ;
</script>

<template>
  <div class="flex w-full bg-white">
    <div class="left p-2">
      <a-spin :spinning="treeSpinning">
        <a-input-search
          v-model:value="params.keyword"
          placeholder="输入员工姓名搜索"
          enter-button
          @search="onSelect"
          class="mb-2"
        />
        <a-tree
          :autoExpandParent="true"
          :tree-data="treeData"
          :field-names="fieldNames"
          :defaultExpandAll="true"
          v-if="treeData.length"
          block-node
          @select="onSelect"
        >
          <template #title="{ id: key, name, managerName, code, introduce, managerId, pid, createTime }">
            {{ name }}
          </template>
        </a-tree>
      </a-spin>
    </div>
    <div class="right p-2">
      <a-spin :spinning="spinning">
        <a-space class="mb-2">
          <a-button @click="openNotice">群发通知</a-button>
          <a-button
            type="primary"
            @click="openModal('add')"
          >
            <PlusOutlined /> 添加员工
          </a-button>
        </a-space>
        <a-table
          :row-selection="rowSelection"
          :columns="columns"
          :data-source="employeeData"
          :scroll="{ x: 1100 }"
          :pagination="false"
          rowKey="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'staffPhoto'">
              <a-avatar
                class="my-avatar"
                :src="record.staffPhoto"
                v-if="record.staffPhoto"
              ></a-avatar>
              <a-avatar
                class="my-avatar"
                v-else
              >{{ record.username.charAt(0) }}</a-avatar>
            </template>

            <template v-if="column.key === 'formOfEmployment'">
              <span v-if="record.formOfEmployment === 1">正式</span>
              <span v-else="record.formOfEmployment === 2">非正式</span>
            </template>

            <template v-if="column.key === 'action'">
              <a-button
                type="link"
                size="small"
                @click="openModal('update', record)"
              >编辑</a-button>
              <a-button
                type="link"
                size="small"
                @click="openRole(record)"
              >角色</a-button>
              <a-popconfirm
                placement="bottom"
                ok-text="删除"
                cancel-text="取消"
                @confirm="deleteEmployee(record)"
              >
                <template #title>
                  <div>确定要删除 <span class="font-bold">{{ record.username }}</span> 吗?</div>
                </template>
                <a-button
                  type="link"
                  size="small"
                >删除</a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
        <div class="flex justify-end p-2">
          <a-pagination
            v-model:current="params.page"
            v-model:page-size="params.pagesize"
            show-quick-jumper
            :total="total"
            :show-total="total => `共 ${total} 条`"
            @change="changeSize"
          />
        </div>
      </a-spin>
    </div>
  </div>

  <!-- 群发通知 -->
  <a-modal
    v-model:open="openNoticeVisible"
    title="群发通知"
    @ok="sendNotice"
    @cancel="sendFormRef.resetFields()"
    :destroyOnClose="true"
    :confirm-loading="noticeModalLoading"
  >
    <a-card class="mb-2">
      <a-tag
        class="mb-2"
        :closable="checkRows.length === 1 ? false : true"
        @close="closeTag(item.id)"
        color="purple"
        v-for="item in checkRows"
        :key="item.id"
      >@{{ item.username }}</a-tag>
    </a-card>
    <a-form
      ref="sendFormRef"
      :model="sendForm"
      :rules="sendRules"
    >
      <a-form-item
        label="消息等级"
        name="type"
        has-feedback
      >
        <a-select
          v-model:value="sendForm.type"
          :options="noticeType"
        ></a-select>
      </a-form-item>
      <a-form-item
        label="通知内容"
        name="content"
        has-feedback
      >
        <a-textarea
          v-model:value="sendForm.content"
          placeholder="请输入通知内容"
          show-count
          :maxlength="100"
          :rows="3"
        />
      </a-form-item>
    </a-form>
  </a-modal>

  <UserInfo
    v-model:treeData="treeData"
    v-model:type="type"
    v-model:open="open"
    v-model:formState="formState"
    @onSelect="onSelect"
    @cancel="cancel"
  />

  <!-- 角色 -->
  <a-modal
    v-model:open="openRoleVisible"
    title="分配角色"
    @ok="okRole"
    :destroyOnClose="true"
    :confirm-loading="roleModalLoading"
  >
    <a-checkbox-group
      v-model:value="checkRoleList"
      :options="roleList"
    />
  </a-modal>
</template>

<style lang="less" scoped>
.left {
  width: 24%;
  border-right: 1px solid #f5f5f5;
}
.right {
  width: 76%;
  border-left: 1px solid #f5f5f5;
}
.my-avatar {
  color: #333;
  background-color: rgba(98, 38, 238, 0.1);
  cursor: pointer;
  margin-right: 4px;
}
</style>

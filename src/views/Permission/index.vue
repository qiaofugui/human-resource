<script setup>
import { onMounted, ref } from "vue"
import { getPermissionAPI, postPermissionAPI, deletePermissionAPI, getPermissionByIdAPI, putPermissionAPI } from '@/api/permission'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: '名称',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '标识',
    key: 'code',
    dataIndex: 'code',
  },
  {
    title: '描述',
    key: 'description',
    dataIndex: 'description',
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 180
  },
]
const loading = ref(false)
const data = ref([])
onMounted(() => {
  getPermission()
})
const getPermission = async () => {
  loading.value = true
  const res = await getPermissionAPI()
  data.value = listToTree(res)
  loading.value = false
}
// 转换成树形结构
const listToTree = (list) => {
  const map = {}

  // 构建映射
  list.forEach(item => map[item.id] = { ...item, children: [] })

  // 构建树状结构
  const tree = []
  list.forEach(item => {
    const parent = map[item.pid]
    if (parent) {
      parent.children.push(map[item.id])
    } else {
      tree.push(map[item.id])
    }
  });

  // 移除没有子节点的children属性
  function cleanChildren (node) {
    if (node.children.length === 0) {
      node.children = null
    } else {
      node.children.forEach(child => cleanChildren(child))
    }
  }

  tree.forEach(root => cleanChildren(root))

  return tree
}

// 添加/编辑权限
const open = ref(false)
const modalLoading = ref(false)
const type = ref('')
const formRef = ref(null)
const formState = ref({
  name: '',
  code: '',
  description: '',
  enVisible: false,
  pid: '',
  type: '',
})
const rules = {
  name: { required: true, message: '请输入权限名称', trigger: 'blur' },
  code: { required: true, message: '请输入权限标识', trigger: 'blur' }
}
// 添加权限
const addPermission = async () => {
  modalLoading.value = true
  formState.value.type = 1
  formState.value.pid = 0
  formState.value.enVisible = formState.value.enVisible ? '1' : '0'
  const res = await postPermissionAPI(formState.value)
  modalLoading.value = false
  message.success('添加成功!')
  cancel()
  open.value = false
  getPermission()
}
// 删除权限
const deletePermission = async (row) => {
  await deletePermissionAPI(row.id)
  message.success('删除成功!')
  getPermission()
}
// 获取某个权限
const getPermissionById = async (row) => {
  const res = await getPermissionByIdAPI(row.id)
  formState.value = { ...res, enVisible: res.enVisible === '1' ? true : false }
  openModal('update')
}
// 更新权限
const updatePermissionById = async () => {
  modalLoading.value = true
  const res = await putPermissionAPI(formState.value.id, formState.value)
  modalLoading.value = false
  message.success('更新成功!')
  cancel()
  open.value = false
  getPermission()
}
// 添加子权限
const addSubPermission = async () => {
  modalLoading.value = true
  formState.value.enVisible = formState.value.enVisible ? '1' : '0'
  const res = await postPermissionAPI(formState.value)
  modalLoading.value = false
  message.success('添加成功!')
  cancel()
  open.value = false
  getPermission()
}
const openModal = async (okType, row) => {
  type.value = okType
  if (okType === 'addSub') {
    formState.value.type = 2
    formState.value.pid = row.id
  }
  open.value = true
}
const ok = () => {
  formRef.value.validate().then(() => {
    if (type.value === 'add') {
      addPermission()
    }
    if (type.value === 'update') {
      updatePermissionById()
    }
    if (type.value === 'addSub') {
      addSubPermission()
    }
  })
}
const cancel = () => {
  formRef.value.resetFields()
  formState.value = {
    name: '',
    code: '',
    description: '',
    enVisible: false,
  }
}
  ;
</script>

<template>
  <div>
    <div class="bg-white p-2">
      <a-button
        type="primary"
        class="mb-2"
        @click="openModal('add')"
      >添加权限</a-button>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :loading="loading"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">

          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              size="small"
              @click="getPermissionById(record)"
            >编辑</a-button>
            <a-button
              type="link"
              size="small"
              :disabled="record.type === 2"
              @click="openModal('addSub', record)"
            >添加</a-button>
            <a-popconfirm
              placement="bottom"
              ok-text="删除"
              cancel-text="取消"
              @confirm="deletePermission(record)"
            >
              <template #title>
                <div>确定要删除 <span class="font-bold">{{ record.name }}</span> 吗?</div>
              </template>
              <a-button
                type="link"
                size="small"
              >删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 添加/编辑权限 -->
    <a-modal
      v-model:open="open"
      :title="type === 'add' ? '添加权限点' : '编辑权限点'"
      @ok="ok"
      @cancel="cancel"
      :destroyOnClose="true"
      :confirm-loading="modalLoading"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="{ style: { width: '80px' } }"
      >
        <a-form-item
          label="权限名称"
          name="name"
          has-feedback
        >
          <a-input
            v-model:value="formState.name"
            placeholder="请输入权限名称"
          />
        </a-form-item>
        <a-form-item
          label="权限标识"
          name="code"
          has-feedback
        >
          <a-input
            v-model:value="formState.code"
            placeholder="请输入权限标识"
          />
        </a-form-item>
        <a-form-item
          label="权限描述"
          name="description"
          has-feedback
        >
          <a-textarea
            v-model:value="formState.description"
            placeholder="请输入权限描述"
            show-count
            :maxlength="100"
            :rows="3"
          />
        </a-form-item>
        <a-form-item
          label="权限开关"
          name="enVisible"
        >
          <a-switch v-model:checked="formState.enVisible" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
</style>

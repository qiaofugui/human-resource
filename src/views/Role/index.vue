<script setup>
import { getRoleAPI, postRoleAPI, deleteRoleAPI, putRoleAPI, getRolePermissionAPI, getRoleHavePermissionAPI, putRolePermissionAPI } from '@/api/role'
import { onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'

const columns = [
  {
    name: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 60,
  },
  {
    title: '角色',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    width: 100,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    width: 240,
  },
]
onMounted(() => {
  getRole()
  getRolePermission()
})
const spinning = ref(false)
const params = ref({
  page: 1,
  pagesize: 10
})
const roleData = ref([])
const total = ref(0)
const getRole = async () => {
  spinning.value = true
  const data = await getRoleAPI(params)
  roleData.value = data.rows.map(item => ({ ...item, state: item.state === 1 ? true : false, isEdit: false }))
  total.value = data.total
  spinning.value = false
}
const changeSize = (page, pageSize) => {
  params.page = page
  params.pagesize = pageSize
  getRole()
}

const openAddVisible = ref(false)
const addFormRef = ref(null)
const addModalLoading = ref(false)
const addForm = ref({
  name: '',
  state: 0,
  description: ''
})
const addRules = {
  name: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' },
  ],
  state: [
    { required: true, message: '', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '角色描述不能为空', trigger: 'blur' },
  ]
}
const openAdd = () => {
  addForm.value = {
    name: '',
    state: 0,
    description: ''
  }
  openAddVisible.value = true
}
const addRole = () => {
  addFormRef.value.validate().then(async () => {
    try {
      addModalLoading.value = true
      const res = await postRoleAPI({ ...addForm.value, state: addForm.value.state ? 1 : 0 })
      message.success('角色添加成功!')
      addModalLoading.value = false
      getRole()
      openAddVisible.value = false
    } catch (error) {
      addModalLoading.value = false
    }
  })
}
const updateRole = async (row) => {
  const res = await putRoleAPI({ ...row, state: row.state ? 1 : 0 }, row.id)
  message.success('角色更新成功!')
  getRole()
}

const deleteRole = async (row) => {
  const res = await deleteRoleAPI(row.id)
  message.success('角色删除成功!')
  getRole()
}

const fieldNames = {
  title: 'name',
  children: 'children',
  key: 'id'
}
const roleTree = ref([])
// 已拥有权限
const roleHavePermission = ref([])
// 获取权限列表
const getRolePermission = async () => {
  const res = await getRolePermissionAPI()
  roleTree.value = buildTree(res)
}
// 处理成树形结构
const buildTree = (items) => {
  let tree = []
  let childrenOf = {}
  items.forEach((item) => {
    let id = item.id
    let pid = item.pid
    childrenOf[id] = childrenOf[id] || [] // 初始化子节点数组
    item.children = childrenOf[id] // 将子节点数组分配给当前项的children属性
    if (pid === 0) {
      tree.push(item) // 如果没有父节点，则作为顶层节点
    } else {
      childrenOf[pid] = childrenOf[pid] || [] // 如果还没有为pid创建孩子数组，则创建
      childrenOf[pid].push(item) // 将当前项添加到其父项的children数组中
    }
  })
  return tree
}

const openAllocationVisible = ref(false)
const allocationModalLoading = ref(false)
const checkedKeys = ref([])
const treeRef = ref(null)
const roleId = ref('')
const openAllocation = async (row) => {
  roleId.value = row.id
  const res = await getRoleHavePermissionAPI(row.id)
  checkedKeys.value = res.permIds
  openAllocationVisible.value = true
}
const updateRolePermission = async () => {
  allocationModalLoading.value = true
  let params = {
    id: roleId.value,
    permIds: checkedKeys.value.checked || checkedKeys.value
  }
  const res = await putRolePermissionAPI(params)
  message.success('角色权限更新成功!')
  openAllocation({ id: roleId.value })
  allocationModalLoading.value = false
}
  ;
</script>

<template>
  <div class="bg-white p-2 h-full">
    <a-spin :spinning="spinning">
      <a-button
        type="primary"
        @click="openAdd"
        class="mb-2"
      >
        <PlusOutlined /> 添加角色
      </a-button>
      <a-table
        :columns="columns"
        :data-source="roleData"
        :pagination="false"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'id'">
            ID
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div v-if="record.isEdit">
              <a-input
                v-model:value="record.name"
                placeholder="请输入角色名称"
                size="small"
              />
            </div>
            <div v-else>{{ record.name }}</div>
          </template>
          <template v-else-if="column.key === 'state'">
            <div v-if="record.isEdit">
              <a-switch v-model:checked="record.state" />
            </div>
            <div v-else>{{ record.state ? '已启用' : '未启用' }}</div>
          </template>
          <template v-else-if="column.key === 'description'">
            <div v-if="record.isEdit">
              <a-input
                v-model:value="record.description"
                placeholder="请输入角色描述"
                show-count
                :maxlength="100"
                :rows="1"
                size="small"
              />
            </div>
            <div v-else>{{ record.description }}</div>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space v-if="!record.isEdit">
              <a-button
                type="primary"
                size="small"
                @click="openAllocation(record)"
              >分配权限</a-button>
              <a-button
                type="primary"
                size="small"
                @click="() => record.isEdit = true"
              >编辑</a-button>
              <a-popconfirm
                placement="bottom"
                ok-text="删除"
                cancel-text="取消"
                @confirm="deleteRole(record)"
              >
                <template #title>
                  <div>确定要删除 <span class="font-bold">{{ record.name }}</span> 吗?</div>
                </template>
                <a-button
                  type="primary"
                  size="small"
                >删除</a-button>
              </a-popconfirm>
            </a-space>
            <a-space v-else>
              <a-button
                type="primary"
                size="small"
                @click="updateRole(record)"
              >完成</a-button>
              <a-button
                type="primary"
                size="small"
                @click="() => record.isEdit = false"
              >取消</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
      <div class="flex justify-end p-2">
        <a-pagination
          v-model:current="params.page"
          v-model:page-size="params.pageSize"
          show-quick-jumper
          :total="total"
          :show-total="total => `共 ${total} 条`"
          @change="changeSize"
        />
      </div>
    </a-spin>
  </div>

  <!-- 添加角色 -->
  <a-modal
    v-model:open="openAddVisible"
    title="添加角色"
    @ok="addRole"
    @cancel="addFormRef.resetFields()"
    :destroyOnClose="true"
    :confirm-loading="addModalLoading"
  >
    <a-form
      ref="addFormRef"
      :model="addForm"
      :rules="addRules"
      :label-col="{ style: { width: '100px' } }"
    >
      <a-form-item
        label="角色名称"
        name="name"
        has-feedback
      >
        <a-input
          v-model:value="addForm.name"
          placeholder="请输入角色名称"
        />
      </a-form-item>
      <a-form-item
        label="启用状态"
        name="state"
        has-feedback
      >
        <a-switch v-model:checked="addForm.state" />
      </a-form-item>
      <a-form-item
        label="角色描述"
        name="description"
        has-feedback
      >
        <a-textarea
          v-model:value="addForm.description"
          placeholder="请输入角色描述"
          show-count
          :maxlength="100"
          :rows="3"
        />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 分配权限 -->
  <a-modal
    v-model:open="openAllocationVisible"
    title="分配权限"
    @ok="updateRolePermission"
    :destroyOnClose="true"
    :confirm-loading="allocationModalLoading"
  >
    <a-tree
      v-model:checkedKeys="checkedKeys"
      checkable
      autoExpandParent
      checkStrictly
      :tree-data="roleTree"
      :field-names="fieldNames"
      ref="treeRef"
    >
      <template #title="{ name, id }">
        {{ name }}
      </template>
    </a-tree>
  </a-modal>
</template>

<style lang="less" scoped>
</style>

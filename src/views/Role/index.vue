<script setup>
import { getRoleAPI, postRoleAPI, deleteRoleAPI, putRoleAPI, getRolePermissionAPI, getRoleHavePermissionAPI, putRolePermissionAPI } from '@/api/role'
import { onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import readFile from '@/utils/readFile'
import * as xlsx from 'xlsx'

onMounted(() => {
  getRole()
  getRolePermission()
})

const toolbarRef = ref(null)
const tableRef = ref(null)
onMounted(() => {
  const $table = tableRef.value
  const $toolbar = toolbarRef.value
  if ($table && $toolbar) {
    $table.connect($toolbar)
  }
})
const isActiveStatus = (row) => {
  const $table = tableRef.value
  if ($table) {
    return $table.isEditByRow(row)
  }
}
const editRowEvent = (row) => {
  const $table = tableRef.value
  if ($table) {
    $table.setEditRow(row)
  }
}
const cancelRowEvent = async (row) => {
  const $table = tableRef.value
  if ($table) {
    await $table.clearEdit()
    // 还原数据
    await $table.revertData(row)
  }
}
const rowValidRules = {
  name: [
    { required: true, message: '角色名称不能为空' },
  ],
  description: [
    { required: true, message: '角色描述不能为空' }
  ]
}
const importMethod = async ({ file, options  }) => {
  let dataBinary = await readFile(file)
  let workBook = xlsx.read(dataBinary, { type: "binary", cellDates: true })
  let workSheet = workBook.Sheets[workBook.SheetNames[0]]
  const excelData = xlsx.utils.sheet_to_json(workSheet, { header: 1 })

  for (let index = 1; index < excelData.length; index++) {
    const element = excelData[index]
      const addForm = {
        name: element[1],
        state: element[2] === '已启用' ? true : false,
        description: element[3]
      }
    await importRole(addForm)
  }

  params.value.page = Math.ceil((total.value + excelData.length -1)  / params.value.pagesize)
  getRole()
}
const importRole = async (addForm) => {
  await postRoleAPI({ ...addForm, state: addForm.state ? 1 : 0 })
}

const spinning = ref(false)
const params = ref({
  page: 1,
  pagesize: 10
})
const roleData = ref([])
const total = ref(0)
const getRole = async () => {
  spinning.value = true
  const data = await getRoleAPI(params.value)
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
  const $table = tableRef.value
  if ($table) {
    const errMap = await $table.validate()
    if (errMap) {
      message.error('请检查修改数据是否正确!')
    } else {
      const res = await putRoleAPI({ ...row, state: row.state ? 1 : 0 }, row.id)
      message.success('角色更新成功!')
      getRole()
    }
  }

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
  <div class="role-container">
    <div class="bg-white p-2 h-full">
      <a-spin :spinning="spinning">
        <vxe-toolbar ref="toolbarRef" print import export custom>
          <template #buttons>
            <a-button
              type="primary"
              @click="openAdd"
              class="mb-2"
            >
              <PlusOutlined /> 添加角色
            </a-button>
          </template>
        </vxe-toolbar>
        <vxe-table id="roleTable" ref="tableRef" keep-source :custom-config="{ allowFixed: false, storage: true }"
          :print-config="{}" :import-config="{ types: ['csv'], remote: true, importMethod, mode: ['covering'] }" :export-config="{ types: ['csv'] }" :data="roleData"
          :row-config="{ isHover: true, isCurrent: true }" :column-config="{ resizable: true }" :edit-config="{ trigger: 'manual', autoClear: false, mode: 'row', showStatus: true }" :edit-rules="rowValidRules">
          <vxe-column field="id" title="ID" width="60"></vxe-column>
          <vxe-column field="name" title="角色" width="120" :edit-render="{}">
            <template #edit="params">
              <a-input
                v-model:value="params.row.name"
                placeholder="请输入角色名称"
                size="small"
              />
            </template>
          </vxe-column>
          <vxe-column field="state" title="状态" width="80" :formatter="({ cellValue }) => cellValue ? '已启用' : '未启用'" :edit-render="{}">
            <template #edit="params">
              <a-switch v-model:checked="params.row.state" size="small" />
            </template>
          </vxe-column>
          <vxe-column field="description" title="描述" :edit-render="{}">
            <template #edit="params">
              <a-input
                v-model:value="params.row.description"
                placeholder="请输入描述"
                size="small"
              />
            </template>
          </vxe-column>
          <vxe-column title="操作" width="180" fixed="right" header-align="center" align="center">
            <template #default="{ row }">
              <template v-if="isActiveStatus(row)">
                <a-button
                  type="link"
                  size="small"
                  @click="updateRole(row)"
                >完成</a-button>
                <a-button
                  type="link"
                  size="small"
                  @click="cancelRowEvent(row)"
                >取消</a-button>
              </template>
              <template v-else>
                <a-button
                  type="link"
                  size="small"
                  @click="openAllocation(row)"
                >分配权限</a-button>
                <a-button
                  type="link"
                  size="small"
                  @click="editRowEvent(row)"
                >编辑</a-button>
                <a-popconfirm
                  placement="bottomRight"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="deleteRole(row)"
                >
                  <template #title>
                    <div>确定要删除 <span class="font-bold">{{ row.name }}</span> 吗?</div>
                  </template>
                  <a-button
                    type="link"
                    size="small"
                  >删除</a-button>
                </a-popconfirm>
              </template>
            </template>
          </vxe-column>
        </vxe-table>
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
        v-if="roleTree.length"
        v-model:checkedKeys="checkedKeys"
        checkable
        autoExpandParent
        checkStrictly
        :tree-data="roleTree"
        :field-names="fieldNames"
        ref="treeRef"
        defaultExpandAll
      >
        <template #title="{ name, id }">
          {{ name }}
        </template>
      </a-tree>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
</style>

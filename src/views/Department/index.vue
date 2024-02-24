<script setup>
import { menuWidth } from '@/config/index'
import { getDepartmentAPI, getDepartmentLeaderAPI, postDepartmentAPI, putDepartmentAPI, deleteDepartmentAPI } from '@/api/department'
import { nextTick, onMounted } from 'vue'
import { message } from 'ant-design-vue'

const fieldNames = {
  title: 'name',
  children: 'children',
  key: 'id',
}
const treeData = ref([])
onMounted(() => {
  getDepartment()
  getDepartmentLeader()
})
let spinning = ref(false)
const getDepartment = async () => {
  spinning.value = true
  const data = await getDepartmentAPI()
  treeData.value = listToTree(data)
  spinning.value = false
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

const open = ref(false)
const modalLoading = ref(false)
const type = ref('add')
const formRef = ref(null)
const formState = ref({
  name: '',
  code: '',
  managerId: null,
  introduce: '',
  pid: ''
})
const rules = {
  name: [
    { required: true, message: '部门名称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '部门名称的长度为2-10个字符', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '部门编码不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '部门编码的长度为2-10个字符', trigger: 'blur' },
  ],
  managerId: [
    { required: true, message: '部门负责人不能为空', trigger: 'blur' }
  ],
  introduce: [
    { required: true, message: '部门介绍不能为空', trigger: 'blur' },
    { min: 1, max: 100, message: '部门介绍的长度为1-100个字符', trigger: 'blur' }
  ]
}

const departmentLeaderList = ref([])
const getDepartmentLeader = async () => {
  const data = await getDepartmentLeaderAPI()
  departmentLeaderList.value = data
}

// 部门操作
const departmentHandle = (propsType, data) => {
  type.value = propsType
  switch (propsType) {
    case 'add':
      formState.value = {
        name: '',
        code: '',
        managerId: null,
        introduce: '',
        pid: data.pid
      }
      open.value = true
      break
    case 'update':
      formState.value = { ...formState.value, ...data }
      open.value = true
      break
    case 'delete':
      formState.value = { ...formState.value, id: data.id }
      ok(propsType)
      break
  }
}
const ok = (propsType) => {
  switch (propsType) {
    case 'add':
      addDepartment(formState.value)
      break
    case 'update':
      updateDepartment(formState.value)
      break
    case 'delete':
      deleteDepartment(formState.value.id)
      break
  }
}
// 添加部门
const addDepartment = (data) => {
  formRef.value.validate().then(async () => {
    modalLoading.value = true
    const res = await postDepartmentAPI(data)
    message.success('部门添加成功!')
    modalLoading.value = false
    getDepartment()
    open.value = false
  })
}
// 更新部门
const updateDepartment = async (data) => {
  formRef.value.validate().then(async () => {
    modalLoading.value = true
    const res = await putDepartmentAPI(data, data.id)
    message.success('部门更新成功!')
    modalLoading.value = false
    getDepartment()
    open.value = false
  })
}
// 删除部门
const deleteDepartment = async (id) => {
  const res = await deleteDepartmentAPI(id)
  message.success('部门删除成功!')
  getDepartment()
  open.value = false
}
  ;
</script>

<template>
  <div>
    <div class="bg-white p-5">
      <a-spin :spinning="spinning">
        <a-tree
          :autoExpandParent="true"
          :tree-data="treeData"
          block-node
          :field-names="fieldNames"
          :defaultExpandAll="true"
          v-if="treeData.length"
        >
          <template #title="{ id: treeKey, name, managerName, code, introduce, managerId, pid, createTime }">
            <a-dropdown :trigger="['contextmenu']">
              <div class="flex justify-between items-center">
                <div class="mr-2">{{ name }}</div>
                <div class="flex items-center text-sm">
                  <div class="mr-2">{{ managerName }}</div>
                  <a-popover
                    trigger="hover"
                    placement="bottom"
                  >
                    <template #content>
                      <div class="popover flex flex-col">
                        <a-button
                          type="text"
                          class="item"
                          @click="departmentHandle('add', { name, code, managerId, introduce, pid })"
                        >添加子部门</a-button>
                        <a-button
                          type="text"
                          class="item"
                          @click="departmentHandle('update', { name, code, managerId, introduce, pid, createTime, id: treeKey })"
                        >编辑部门</a-button>
                        <a-popconfirm
                          placement="left"
                          ok-text="删除"
                          cancel-text="取消"
                          @confirm="departmentHandle('delete', { name, code, managerId, introduce, pid, id: treeKey })"
                        >
                          <template #title>
                            <div>确定要删除 <span class="font-bold">{{ name }}</span> 吗?</div>
                          </template>
                          <a-button
                            type="text"
                            class="item"
                          >删除</a-button>
                        </a-popconfirm>
                      </div>
                    </template>
                    <a-button type="link">操作
                      <DownOutlined class="text-xs" />
                    </a-button>
                  </a-popover>
                </div>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item
                    class="text-center"
                    key="add"
                    @click="departmentHandle('add', { name, code, managerId, introduce, pid, createTime })"
                  >添加子部门</a-menu-item>
                  <a-menu-item
                    class="text-center"
                    key="update"
                    @click="departmentHandle('update', { name, code, managerId, introduce, pid, createTime, id: treeKey })"
                  >编辑部门</a-menu-item>
                  <a-menu-item
                    class="text-center"
                    key="delete"
                    @click="departmentHandle('delete', { name, code, managerId, introduce, pid, id: treeKey })"
                  >删除</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </a-tree>
      </a-spin>
    </div>

    <a-modal
      v-model:open="open"
      :title="type === 'add' ? '添加部门' : '编辑部门'"
      @ok="ok(type, formState)"
      @cancel="formRef.resetFields()"
      :destroyOnClose="true"
      :confirm-loading="modalLoading"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="{ style: { width: '100px' } }"
      >
        <a-form-item
          label="部门名称"
          name="name"
          has-feedback
        >
          <a-input
            v-model:value="formState.name"
            placeholder="请输入2-10个字符"
          />
        </a-form-item>
        <a-form-item
          label="部门编码"
          name="code"
          has-feedback
        >
          <a-input
            v-model:value="formState.code"
            placeholder="请输入2-10个字符"
          />
        </a-form-item>
        <a-form-item
          label="部门负责人"
          name="managerId"
          has-feedback
        >
          <a-select
            v-model:value="formState.managerId"
            placeholder="请选择负责人"
          >
            <a-select-option
              :value="item.id"
              v-for="item in departmentLeaderList"
            >{{ item.username }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="部门介绍"
          name="introduce"
          has-feedback
        >
          <a-textarea
            v-model:value="formState.introduce"
            placeholder="1-100个字符"
            show-count
            :maxlength="100"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.popover {
  margin: -6px -12px;

  .item {
    padding: 5px 20px;
  }
}
</style>

<script setup>
import { postEmployeeAPI, putEmployeeAPI } from '@/api/employee'
import { getUserBaseInfoAPI } from '@/api/login'
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { putAvatarAPI } from '@/api/navbar'
import useUserInfo from '@/stores/userInfo'

const userInfo = useUserInfo()

// 添加/编辑员工
const emit = defineEmits(['update:open', 'update:type', 'update:formState', 'cancel'])
const props = defineProps({
  treeData: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: ''
  },
  open: {
    type: Boolean,
    default: false
  },
  formState: {
    type: Object,
    default: () => { }
  },
  navbar: {
    type: Boolean,
    default: false
  }
})
const modalLoading = ref(false)
const formRef = ref(null)
// 自定义校验规则 rule是当前的规则 value是当前的值
const validatorMobile = (rule, value) => {
  const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
  if (!reg.test(value)) {
    return Promise.reject(new Error('请输入正确的手机号'))
  } else {
    return Promise.resolve()
  }
}
const validatorCorrectionTime = (rule, value) => {
  const timeOfEntry = props.formState.timeOfEntry.replace(/-/g, '')
  const correctionTime = props.formState.correctionTime.replace(/-/g, '')
  if (!props.formState.timeOfEntry) {
    emit('update:formState', { ...props.formState, timeOfEntry: null })
    return Promise.reject(new Error('请先选择转正时间!'))
  } else if (timeOfEntry > correctionTime) {
    props.formState.correctionTime = null
    return Promise.reject(new Error('转正时间不能早于入职时间!'))
  } else {
    return Promise.resolve()
  }
}
const validatorUsername = (rule, value) => {
  if (!/[\u4E00-\u9FA5]/g.test(value)) {
    return Promise.reject(new Error('请输入中文姓名!'))
  } else {
    return Promise.resolve()
  }
}
const rules = {
  username: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
    { min: 1, max: 4, message: '姓名的长度为1-4个字符', trigger: 'blur' },
    { validator: validatorUsername, trigger: 'change' },
  ],
  mobile: [
    { validator: validatorMobile, trigger: 'change' },
  ],
  departmentId: [
    { required: true, message: '部门不能为空', trigger: 'blur' },
  ],
  formOfEmployment: [
    { required: true, message: '聘用形式不能为空', trigger: 'blur' },
  ],
  timeOfEntry: [
    { required: true, message: '入职时间不能为空', trigger: 'blur' },
  ],
  correctionTime: [
    { required: true, message: '转正时间不能为空', trigger: 'blur' },
    { validator: validatorCorrectionTime, trigger: 'change' },
  ]
}
// 头像
const fileList = ref([])
const uploadLoading = ref(false)
const imageUrl = ref('')
const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
const uploadChange = info => {
  // if (info.file.status === 'uploading') {
  //   uploadLoading.value = true;
  //   return
  // }
  // if (info.file.status === 'done') {
  //   getBase64(info.file.originFileObj, base64Url => {
  //     imageUrl.value = base64Url
  //     uploadLoading.value = false
  //   })
  // }
  // if (info.file.status === 'error') {
  //   uploadLoading.value = false
  //   message.error('upload error')
  // }
}
const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    return message.error('请上传正确的图像文件!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    return message.error('图像必须小于2MB!')
  }
  getBase64(file, base64Url => {
    imageUrl.value = base64Url
    console.log('上传成功')
  })
  // return isJpgOrPng && isLt2M
  return false
}

const cancel = () => {
  emit('cancel')
}
// 添加员工
const addEmployee = async () => {
  try {
    const departmentId = props.formState.departmentId[props.formState.departmentId.length - 1]
    modalLoading.value = true
    const res = await postEmployeeAPI({ ...props.formState, departmentId })
    message.success('添加员工成功!')
    modalLoading.value = false
    emit('update:open', false)
    formRef.value.resetFields()
    emit('onSelect')
  } catch (error) {
    modalLoading.value = false
  }
}
// 更新员工
const updateEmployee = async () => {
  try {
    const departmentId = props.formState.departmentId[props.formState.departmentId.length - 1]
    modalLoading.value = true
    const res = await putEmployeeAPI({ ...props.formState, staffPhoto: '', departmentId }, props.formState.id)
    if (props.navbar || userInfo.userInfo.id === props.formState.id) {
      await putAvatarAPI({ staffPhoto: imageUrl.value })
      userInfo.updateUserInfoSingle('staffPhoto', imageUrl.value)
    }
    message.success('更新成功!')
    modalLoading.value = false
    emit('update:open', false)
    formRef.value.resetFields()
    emit('onSelect')
  } catch (error) {
    modalLoading.value = false
  }
}
const ok = () => {
  formRef.value.validate().then(async () => {
    if (props.type === 'add') {
      addEmployee()
    }
    if (props.type === 'update') {
      updateEmployee()
    }
    if (props.navbar) {
      updateEmployee()
    }
  })
}
  ;
</script>

<template>
  <a-modal
    :open="props.open"
    :title="props.navbar ? '个人信息' : props.type === 'add' ? '添加员工' : '编辑员工'"
    @ok="ok"
    @cancel="cancel"
    :destroyOnClose="true"
    :confirm-loading="modalLoading"
  >
    <a-form
      ref="formRef"
      :model="props.formState"
      :rules="rules"
      :label-col="{ style: { width: '80px' } }"
    >
      <a-form-item
        label="姓名"
        name="username"
        has-feedback
      >
        <a-input
          v-model:value="props.formState.username"
          placeholder="请输入1-4个字符"
        />
      </a-form-item>
      <a-form-item
        label="工号"
        name="workNumber"
        has-feedback
      >
        <a-input
          v-model:value="props.formState.workNumber"
          placeholder="工号自动生成，无需填写"
          disabled
        />
      </a-form-item>
      <a-form-item
        label="手机"
        name="mobile"
        has-feedback
      >
        <a-input
          v-model:value="props.formState.mobile"
          placeholder="请输入手机号"
          :disabled="props.type === 'add' ? false : true"
        />
      </a-form-item>
      <a-form-item
        label="部门"
        name="departmentId"
      >
        <a-cascader
          v-model:value="props.formState.departmentId"
          :options="treeData"
          expand-trigger="hover"
          placeholder="请选择部门"
          :field-names="{ label: 'name', value: 'id', children: 'children' }"
        />
      </a-form-item>
      <a-form-item
        label="聘用形式"
        name="formOfEmployment"
        has-feedback
      >
        <a-select
          v-model:value="props.formState.formOfEmployment"
          placeholder="请选择聘用形式"
        >
          <a-select-option :value="1">正式</a-select-option>
          <a-select-option :value="2">非正式</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="入职时间"
        name="timeOfEntry"
        has-feedback
      >
        <a-date-picker
          class="w-full"
          v-model:value="props.formState.timeOfEntry"
          valueFormat="YYYY-MM-DD"
        />
      </a-form-item>
      <a-form-item
        label="转正时间"
        name="correctionTime"
        has-feedback
      >
        <a-date-picker
          class="w-full"
          v-model:value="props.formState.correctionTime"
          valueFormat="YYYY-MM-DD"
        />
      </a-form-item>
      <a-form-item name="staffPhoto">
        <template #label>
          <a-tooltip
            placement="bottom"
            v-if="!props.navbar"
          >
            <template #title>
              <span>这里接口不可用，只能修改自己登录账号的头像！</span>
            </template>
            员工头像 <ExclamationCircleOutlined />
          </a-tooltip>
          <template v-else>
            个人头像
          </template>
        </template>
        <a-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          @change="uploadChange"
        >
          <a-image
            v-if="imageUrl || props.formState.staffPhoto"
            :preview="false"
            :src="imageUrl || props.formState.staffPhoto"
            :height="100"
          />
          <div v-else>
            <LoadingOutlined v-if="uploadLoading"></LoadingOutlined>
            <PlusOutlined v-else></PlusOutlined>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped>
</style>

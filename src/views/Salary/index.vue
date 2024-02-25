<script setup>
import { getDepartmentAPI } from '@/api/department'
import { onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { getSalaryListAPI, getSalaryAdjustDetailAPI, postSalaryAdjustAPI } from '@/api/salary'
import SalarySetting from './components/SalarySetting.vue'

// 级联选择框数据
const options = ref([])
const checkOptions = ref([])
const checkEmployment = ref([])
onMounted(() => {
  getDepartment()
})
const getDepartment = async () => {
  const res = await getDepartmentAPI()
  options.value = res
}
const filter = (inputValue, path) => {
  return path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
}
const changeFilter = () => {
  getSalaryList()
}

const columns = [
  {
    name: '序号',
    dataIndex: 'id',
    key: 'id',
    width: 60,
  },
  {
    title: '姓名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '手机',
    dataIndex: 'mobile',
    key: 'mobile',
    width: 130,
  },
  {
    title: '工号',
    dataIndex: 'workNumber',
    key: 'workNumber',
    width: 120,
    sorter: (a, b) => {
      return a.workNumber.slice(5) - b.workNumber.slice(5)
    }
  },
  {
    title: '聘用形式',
    dataIndex: 'formOfEmployment',
    key: 'formOfEmployment',
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
  },
  {
    title: '入职时间',
    dataIndex: 'timeOfEntry',
    key: 'timeOfEntry',
  },
  {
    title: '工资基数',
    dataIndex: 'currentBasicSalary',
    key: 'currentBasicSalary',
    sorter: (a, b) => {
      return a.currentBasicSalary - b.currentBasicSalary
    }
  },
  {
    title: '津贴方案',
    dataIndex: 'subsidyName',
    key: 'subsidyName',
    sorter: (a, b) => {
      return a.subsidyName - b.subsidyName
    }
  },
  {
    title: '操作',
    key: 'action',
    width: 160,
    fixed: 'right'
  },
]
const params = ref({
  page: 1,
  pagesize: 10,
  // 聘用形式
  approvalsTypeChecks: '',
  departmentChecks: '',
})
const data = ref([])
const loading = ref(false)
// 获取薪水列表
const getSalaryList = async () => {
  loading.value = true
  const res = await getSalaryListAPI({ ...params.value, approvalsTypeChecks: checkEmployment.value.flat().join(','), departmentChecks: checkOptions.value.flat().join(',') })
  data.value = res
  loading.value = false
}
onMounted(() => {
  getSalaryList()
})
const changeSize = (page, pageSize) => {
  params.page = page
  params.pagesize = pageSize
  getSalaryList()
}

// 调整薪水
const adjustSalary = ref({})
const adjustSalaryFormRef = ref(null)
const adjustSalaryVisible = ref(false)
const currentSalary = ref({})
const getSalaryAdjustDetail = async (row) => {
  currentSalary.value = row
  const res = await getSalaryAdjustDetailAPI(row.id)
  adjustSalary.value = res
  adjustSalaryVisible.value = true
}
const adjustSalaryForm = ref({
  userId: '',
  currentBasicSalary: '',
  currentPostWage: ''
})
const adjustSalaryRules = {
  currentBasicSalary: [
    { required: true, message: '请输入基本工资', trigger: 'blur' },
  ],
  currentPostWage: [
    { required: true, message: '请输入岗位工资', trigger: 'blur' },
  ]
}
// 计算属性
const summation = computed(() => {
  // 当前基本工资 + 岗位工资
  let currentTotal = Number(adjustSalary.value.currentBasicSalary) + Number(adjustSalary.value.currentPostWage)
  // 调整后
  let afterTotal = Number(adjustSalaryForm.value.currentBasicSalary) + Number(adjustSalaryForm.value.currentPostWage)
  // 调整幅度
  let adjustRange = (afterTotal - currentTotal).toFixed(2)

  return {
    currentTotal,
    afterTotal,
    adjustRange
  }
})

const adjustSalaryCancel = () => {
  adjustSalaryForm.value = {
    currentBasicSalary: '',
    currentPostWage: ''
  }
  adjustSalaryFormRef.value.resetFields()
  adjustSalaryVisible.value = false
}
const adjustSalaryOk = async () => {
  adjustSalaryFormRef.value.validate().then(async () => {
    await postSalaryAdjustAPI(adjustSalary.value.userId, { ...adjustSalaryForm.value, userId: adjustSalary.value.userId })
    message.success('调整成功!')
    adjustSalaryVisible.value = false
    adjustSalaryForm.value = {
      currentBasicSalary: '',
      currentPostWage: ''
    }
  })
}

// 工资设置
// 设置
const salarySettingOpen = ref(false)
const resetSalary = ref(true)
const cancel = () => {
  resetSalary.value = false
  salarySettingOpen.value = false
  nextTick(() => {
    resetSalary.value = true
  })
}

  ;
</script>

<template>
  <div>
    <div class="bg-white p-2">
      <a-button
        type="primary"
        @click="salarySettingOpen = true"
      >设置</a-button>
      <div class="mt-2 flex items-center">
        <div class="flex items-center">
          <span
            class="text-base"
            style="width: 80px"
          >聘用形式：</span>
          <a-cascader
            v-model:value="checkEmployment"
            style="width: 300px"
            multiple
            :options="[{ name: '正式', id: 1 }, { name: '非正式', id: 2 }]"
            placeholder="请选择聘用形式筛选项"
            :show-search="{ filter }"
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
            max-tag-count="responsive"
            @change="changeFilter"
          ></a-cascader>
        </div>
        <div class="flex items-center">
          <span
            class="text-base text-right"
            style="width: 80px"
          >部门：</span>
          <a-cascader
            v-model:value="checkOptions"
            style="width: 300px"
            multiple
            :options="options"
            placeholder="请选择部门筛选项"
            :show-search="{ filter }"
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
            max-tag-count="responsive"
            @change="changeFilter"
          ></a-cascader>
        </div>
      </div>
    </div>

    <div class="mt-4 p-2 bg-white">
      <a-table
        :columns="columns"
        rowKey="id"
        :data-source="data.rows"
        :pagination="false"
        :loading="loading"
        :scroll="{ x: 1100 }"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'id'">
            ID
          </template>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'id'">
            {{ index + 1 }}
          </template>
          <template v-if="column.key === 'formOfEmployment'">
            {{ record.formOfEmployment == 1 ? '正式' : '非正式' }}
          </template>
          <template v-if="column.key === 'action'">
            <!-- <a-button
            type="link"
            @click=""
          >详情</a-button> -->
            <a-button
              type="link"
              @click="getSalaryAdjustDetail(record)"
            >调薪</a-button>
          </template>
        </template>
      </a-table>
      <div class="flex justify-end p-2 bg-white">
        <a-pagination
          v-model:current="params.page"
          v-model:page-size="params.pagesize"
          show-quick-jumper
          :total="data?.total"
          :show-total="total => `共 ${total} 条`"
          @change="changeSize"
        />
      </div>
    </div>

    <!-- 调整薪水 -->
    <a-modal
      v-model:open="adjustSalaryVisible"
      title="调整薪水"
      @ok="adjustSalaryOk"
      :destroyOnClose="true"
      @cancel="adjustSalaryCancel"
    >
      <a-card title="基本信息">
        <a-row>
          <a-col :span="12"><span
              class="inline-block text-right leading-snug"
              style="width: 70px;"
            >姓名：</span>{{ currentSalary.username }}</a-col>
          <a-col :span="12"><span
              class="inline-block text-right leading-snug"
              style="width: 70px;"
            >部门：</span>{{ currentSalary.departmentName }}</a-col>
          <a-col :span="12"><span
              class="inline-block text-right leading-snug"
              style="width: 70px;"
            >手机号：</span>{{ currentSalary.mobile }}</a-col>
          <a-col :span="12"><span
              class="inline-block text-right leading-snug"
              style="width: 70px;"
            >入职时间：</span>{{ currentSalary.timeOfEntry }}</a-col>
        </a-row>
      </a-card>

      <a-divider />

      <a-form
        ref="adjustSalaryFormRef"
        :model="adjustSalaryForm"
        :rules="adjustSalaryRules"
        :label-col="{ style: { width: '110px' } }"
      >
        <a-form-item
          label="调整基本工资"
          name="currentBasicSalary"
        >
          <div class="flex items-center">
            <a-form-item-rest>
              <a-input
                :value="adjustSalary.currentBasicSalary"
                disabled
                style="width: 40%"
              />
            </a-form-item-rest>
            <div
              style="width: 10%;"
              class="text-center"
            > {{ '-->' }}</div>
            <a-input
              v-model:value="adjustSalaryForm.currentBasicSalary"
              type="number"
              style="width: 40%;"
              placeholder="调整后基本工资"
            />
          </div>
        </a-form-item>
        <a-form-item
          label="调整岗位工资"
          name="currentPostWage"
        >
          <div class="flex items-center">
            <a-form-item-rest>
              <a-input
                :value="adjustSalary.currentPostWage"
                disabled
                style="width: 40%"
              />
            </a-form-item-rest>
            <div
              style="width: 10%;"
              class="text-center"
            > {{ '-->' }}</div>
            <a-input
              v-model:value="adjustSalaryForm.currentPostWage"
              type="number"
              style="width: 40%;"
              placeholder="调整后岗位工资"
            />
          </div>
        </a-form-item>
        <a-form-item label="工资合计">
          <div class="flex items-center">
            <a-input
              :value="summation.currentTotal"
              disabled
              style="width: 40%"
            />
            <div
              style="width: 10%;"
              class="text-center"
            > {{ '-->' }}</div>
            <a-input
              :value="summation.afterTotal"
              type="number"
              style="width: 40%;"
              disabled
              placeholder="工资合计"
            />
          </div>
        </a-form-item>
        <a-form-item label="调整幅度">
          <a-input
            :value="summation.adjustRange"
            style="width: 90%;"
            disabled
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 工资设置 -->
    <SalarySetting
      v-if="resetSalary"
      v-model:open="salarySettingOpen"
      @cancel="cancel"
    />
  </div>
</template>

<style lang="less" scoped>
</style>

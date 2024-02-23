<script setup>
import { getDepartmentAPI } from '@/api/department'
import { getAttendancesAPI, getAttendancesListAPI, putAttendancesAPI } from '@/api/attendances'
import { nextTick, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import AttendanceSetting from './components/AttendanceSetting.vue'

// 级联选择框数据
const options = ref([])
const checkOptions = ref([])
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
  getAttendances()
}

const params = ref({
  page: 1,
  pagesize: 15,
  deptID: '',
  stateID: ''
})
const spinning = ref(false)
const tableData = ref([])
const month = ref(0)
const changeSize = (page, pageSize) => {
  params.page = page
  params.pagesize = pageSize
  getAttendances()
}
// 获取考勤数据
const getAttendances = async () => {
  spinning.value = true
  const res = await getAttendancesAPI({ ...params.value, deptID: checkOptions.value.flat().join(',') })
  tableData.value = res

  let date = new Date()
  let year = date.getFullYear()
  let d = new Date(year, tableData.value.monthOfReport, 0) // 获取月份
  month.value = d.getDate() // 获取日期
  spinning.value = false
}
onMounted(() => {
  getAttendances()
})
const vacationType = [
  {
    id: '1',
    name: '正常'
  }, {
    id: '2',
    name: '旷工'
  }, {
    id: '3',
    name: '迟到'
  }, {
    id: '4',
    name: '早退'
  }, {
    id: '5',
    name: '外出'
  }, {
    id: '6',
    name: '出差'
  }, {
    id: '7',
    name: '年假'
  }, {
    id: '8',
    name: '事假'
  }, {
    id: '9',
    name: '病假'
  }, {
    id: '10',
    name: '婚假'
  }, {
    id: '11',
    name: '丧假'
  }, {
    id: '12',
    name: '产假'
  }, {
    id: '13',
    name: '奖励产假'
  }, {
    id: '14',
    name: '陪产假'
  }, {
    id: '15',
    name: '探亲假'
  }, {
    id: '16',
    name: '工伤假'
  }, {
    id: '17',
    name: '调休'
  }, {
    id: '18',
    name: '产检假'
  }, {
    id: '19',
    name: '流产假'
  }, {
    id: '20',
    name: '长期病假'
  }, {
    id: '21',
    name: '补签'
  }, {
    id: '22',
    name: '休息'
  }
]
// 计算属性 计算出类型
const getVacationType = (id) => {
  const status = vacationType.find(status => status.id == id)
  return status ? status.name : '-'
}

const attendanceOpen = ref(false)
const attendanceModalLoading = ref(false)
const attendanceObj = ref({})
const attendanceValue = ref(1)
const attendanceChangeType = ref([])
const showChangeDialog = async (item, id, it) => {
  await getAttendancesList(item.userId)
  attendanceValue.value = it.adtStatu + ''
  attendanceObj.value = it
  attendanceOpen.value = true
}
const getAttendancesList = async (userId) => {
  const res = await getAttendancesListAPI({ userId })
  attendanceChangeType.value = res.map(item => {
    const value = Object.keys(item)[0]
    return { label: item[value], value }
  })
}
const attendanceOk = async () => {
  attendanceModalLoading.value = true
  const { userId, department, day } = attendanceObj.value
  const res = await putAttendancesAPI(userId, { adtStatu: attendanceValue.value, userId, department, day })
  message.success('考勤状态修改成功!')
  getAttendances()
  attendanceModalLoading.value = false
  attendanceOpen.value = false
}

// 设置
const attendanceSettingOpen = ref(false)
const resetAttendance = ref(true)
const cancel = () => {
  resetAttendance.value = false
  attendanceSettingOpen.value = false
  nextTick(() => {
    resetAttendance.value = true
  })
}
  ;
</script>

<template>
  <div class="bg-white p-2">
    <a-button
      type="primary"
      @click="()=>attendanceSettingOpen = true"
    >设置</a-button>
    <div class="mt-2 flex items-center">
      <span class="text-base">部门：</span>
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
  <a-spin :spinning="spinning">
    <div class="bg-white p-2 mt-4 w-full relative overflow-x-auto overflow-y-hidden">
      <div style="width: 3000px;">
        <table
          border="0"
          align="center"
          cellpadding="0"
          cellspacing="0"
          class="tableInfo"
        >
          <tr>
            <th width="30">序号</th>
            <th width="100">姓名</th>
            <th width="100">工号</th>
            <th width="200">部门</th>
            <th width="100">手机</th>
            <th
              v-for="(it, ind) in month"
              :key="ind"
              width="110"
            >{{ tableData.monthOfReport }}/{{ ind + 1 }}</th>
          </tr>
          <tr
            v-for="(item, index) in tableData?.data?.rows"
            :key="item.id"
          >
            <td width="50">{{ index + 1 }}</td>
            <td width="100">{{ item.username }}</td>
            <td width="100">{{ item.workNumber }}</td>
            <td width="200">{{ item.departmentName }}</td>
            <td width="100">{{ item.mobile }}</td>
            <td
              v-for="(it,ind) in item.attendanceRecord"
              :key="ind"
              width="110"
              @click="showChangeDialog(item,ind,it)"
              class="cursor-pointer"
              :class="{
                'bg-green-500': it.adtStatu === 1,
                'bg-red-500': it.adtStatu === 2,
                'bg-yellow-500': it.adtStatu === 3,
                'bg-yellow-400': it.adtStatu === 4,
                'bg-blue-500': it.adtStatu === 5,
                'bg-blue-400': it.adtStatu === 6,
                'bg-blue-300': it.adtStatu === 7,
                'bg-purple-500':it.adtStatu === 8 || it.adtStatu === 9 || it.adtStatu === 10 || it.adtStatu === 11 || it.adtStatu === 12 || it.adtStatu === 13 || it.adtStatu === 14 || it.adtStatu === 15 || it.adtStatu === 16 || it.adtStatu === 18 || it.adtStatu === 19 || it.adtStatu === 20,
                'bg-gray-500': it.adtStatu === 17,
                'bg-gray-400': it.adtStatu === 21,
                'bg-gray-300': it.adtStatu === 22,
              }"
            >
              <a-popover placement="top">
                <template #title>
                  <div
                    class="flex justify-between"
                    style="width: 260px"
                  >
                    <span>{{ item.username + '-' + it.day + '-考勤记录' }}</span>
                    <span>
                      <a-tag
                        color="green"
                        v-if="it.adtStatu === 1"
                      >{{ getVacationType(it.adtStatu) }}</a-tag>
                      <a-tag
                        color="red"
                        v-else-if="it.adtStatu === 2"
                      >{{ getVacationType(it.adtStatu) }}</a-tag>
                      <a-tag
                        color="orange"
                        v-else-if="it.adtStatu === 3 || it.adtStatu === 4"
                      >{{ getVacationType(it.adtStatu) }}</a-tag>
                      <a-tag
                        color="blue"
                        v-else-if="it.adtStatu === 5 || it.adtStatu === 6 || it.adtStatu === 7"
                      >{{ getVacationType(it.adtStatu) }}</a-tag>
                      <a-tag
                        color="purple"
                        v-else-if="it.adtStatu === 8 || it.adtStatu === 9 || it.adtStatu === 10 || it.adtStatu === 11 || it.adtStatu === 12 || it.adtStatu === 13 || it.adtStatu === 14 || it.adtStatu === 15 || it.adtStatu === 16 || it.adtStatu === 18 || it.adtStatu === 19 || it.adtStatu === 20"
                      >{{ getVacationType(it.adtStatu) }}</a-tag>
                      <a-tag v-else-if="it.adtStatu === 17 || it.adtStatu === 21 || it.adtStatu === 22">{{ getVacationType(it.adtStatu) }}</a-tag>
                    </span>
                  </div>
                </template>
                <template #content>
                  <p>上班打卡时间：{{ it.adtInTime || '-' }}</p>
                  <p>上班打卡地点：{{ '-' }}</p>
                  <p>下班打卡时间：{{ it.adtOutTime || '-' }}</p>
                  <p>下班打卡地点：{{ '-' }}</p>
                </template>
                <span class="py-2 px-5">{{ getVacationType(it.adtStatu) }}</span>
              </a-popover>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="flex justify-end p-2 bg-white">
      <a-pagination
        v-model:current="params.page"
        v-model:page-size="params.pagesize"
        show-quick-jumper
        :total="tableData?.data?.total"
        :show-total="total => `共 ${total} 条`"
        @change="changeSize"
      />
    </div>
  </a-spin>

  <!-- 更改考勤记录弹窗 -->
  <a-modal
    v-model:open="attendanceOpen"
    @ok="attendanceOk"
    :destroyOnClose="true"
    :confirm-loading="attendanceModalLoading"
  >
    <template #title>
      {{ attendanceObj.day }}（实际工作日考勤方案）
    </template>
    <a-radio-group
      v-model:value="attendanceValue"
      :options="attendanceChangeType"
    />
  </a-modal>

  <!-- 考勤设置 -->
  <AttendanceSetting
    v-if="options.length && resetAttendance"
    v-model:open="attendanceSettingOpen"
    :department="options"
    @cancel="cancel"
  />
</template>

<style lang="less" scoped>
.tableInfo {
  line-height: 36px;
  border: solid 1px #ebeef5;
  border-right: 0 none;
  border-bottom: 0 none;
  tr {
    th {
      line-height: 50px;
      text-align: center;
      border-right: solid 1px #ebeef5;
      border-bottom: solid 1px #ebeef5;
      background: #fafafa;
      font-weight: 700;
      min-width: 100px;
    }
    td {
      height: 36px;
      text-align: center;
      border-right: solid 1px #ebeef5;
      border-bottom: solid 1px #ebeef5;
    }
  }
}
</style>

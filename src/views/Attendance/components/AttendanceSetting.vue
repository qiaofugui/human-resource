<script setup>
import { message } from 'ant-design-vue'
import { getAttendancesByDeptAPI, putAttendancesByDeptAPI, getAttendancesByDeptHolidaysAPI, postAttendancesByDeptHolidaysAPI, getAttendancesByDeptDeductionsAPI, postAttendancesByDeptDeductionsAPI, getAttendancesByDeptOvertimeAPI, putAttendancesByDeptOvertimeAPI } from '@/api/attendances'
import { ref, onMounted } from 'vue'
import useUserInfo from '@/stores/userInfo'

const userInfo = useUserInfo()

const emit = defineEmits(['cancel'])
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  department: {
    type: Object,
    default: () => []
  }
})
const activeKey = ref('attendance')

const modalLoading = ref(false)

// 出勤设置
const attendanceFormRef = ref(null)
const attendanceForm = ref({
  afternoonEndTime: '',
  afternoonStartTime: '',
  companyId: userInfo.userInfo.profile.companyId,
  departmentId: props.department[0].id,
  morningEndTime: '',
  morningStartTime: ''
})
const morningTime = ref([])
const afternoonTime = ref([])
const validatorTime = (rule, value) => {
  if (morningTime.value?.length > 0 && afternoonTime.value?.length > 0) {
    return Promise.resolve()
  } else {
    return Promise.reject(new Error('请选择时间'))
  }
}
const changeTime2 = () => {
  attendanceFormRef.value.validateFields('time')
}
const attendanceRules = {
  departmentId: [
    { required: true, message: '部门不能为空', trigger: 'change' },
  ],
  time: [
    { required: true, validator: validatorTime },
  ],
}

// 获取某个部门的出勤时间
const getAttendancesByDept = async () => {
  const res = await getAttendancesByDeptAPI({ departmentId: attendanceForm.value.departmentId })
  morningTime.value = [res.morningStartTime, res.morningEndTime]
  afternoonTime.value = [res.afternoonStartTime, res.afternoonEndTime]
}
onMounted(() => {
  getAttendancesByDept()
})

// 请假设置
const vacateFormRef = ref(null)
const vacateForm = ref({
  departmentId: props.department[0].id,
})
const vacateRules = {
  departmentId: [
    { required: true, message: '部门不能为空', trigger: 'change' },
  ]
}

// 静态假期
const holidayType = [
  {
    leaveType: '60000',
    name: '年假',
  },
  {
    leaveType: '60100',
    name: '事假',
  },
  {
    leaveType: '60200',
    name: '病假',
  },
  {
    leaveType: '60300',
    name: '婚假',
  },
  {
    leaveType: '60400',
    name: '丧假',
  },
  {
    leaveType: '60500',
    name: '产假',
  },
  {
    leaveType: '60600',
    name: '奖励产假',
  },
  {
    leaveType: '60700',
    name: '陪产假',
  },
  {
    leaveType: '60800',
    name: '探亲假',
  },
  {
    leaveType: '60900',
    name: '工伤假',
  },
  {
    leaveType: '61000',
    name: '调休假',
  },
  {
    leaveType: '61100',
    name: '产检假',
  },
  {
    leaveType: '61200',
    name: '流产假',
  },
  {
    leaveType: '61300',
    name: '长期病假',
  },
  {
    leaveType: '61400',
    name: '其它',
  }
]
const holidayList = ref([])
const vacateColumns = [
  {
    title: '假期类型',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '是否可用',
    key: 'isEnable',
    dataIndex: 'isEnable',
  }
]
// 获取某个部门的假期列表
const getAttendancesByVacate = async () => {
  const res = await getAttendancesByDeptHolidaysAPI({ departmentId: vacateForm.value.departmentId })
  const mergedRecords = res.map(record => {
    const holiday = holidayType.find(h => h.leaveType == record.leaveType)
    return {
      ...record,
      name: holiday ? holiday.name : '未知假期',
      isEnable: record.isEnable == 1 ? true : false
    }
  })
  holidayList.value = mergedRecords
}
onMounted(() => {
  getAttendancesByVacate()
})

// 扣款设置
const chargeFormRef = ref(null)
const chargeForm = ref({
  departmentId: props.department[0].id,
})
const chargeRules = {
  departmentId: [
    { required: true, message: '部门不能为空', trigger: 'change' },
  ]
}
const dedType = [
  {
    dedTypeCode: '51000',
    name: '迟到扣款'
  },
  {
    dedTypeCode: '52000',
    name: '早退扣款'
  },
  {
    dedTypeCode: '53000',
    name: '旷工扣款'
  },
]
const chargeData = ref([])
// 获取某个部门的扣款设置
const getAttendancesByCharge = async () => {
  const res = await getAttendancesByDeptDeductionsAPI({ departmentId: chargeForm.value.departmentId })
  const mergedRecords = res.map(record => {
    const charge = dedType.find(h => h.dedTypeCode == record.dedTypeCode)
    return {
      ...record,
      name: charge ? charge.name : '未知扣款',
      isEnable: record.isEnable == 1 ? true : false
    }
  })
  chargeData.value = mergedRecords
}
onMounted(() => {
  getAttendancesByCharge()
})

// 加班设置
const overtimeFormRef = ref(null)
const overtimeForm = ref({
  departmentId: props.department[0].id,
  isClock: '',
  isCompensationint: '',
  latestEffectDate: '',
  rules: [],
  unit: ''
})
const validatorLatestEffectDate = (rule, value) => {
  if (overtimeForm.value.latestEffectDate && overtimeForm.value.unit) {
    return Promise.resolve()
  } else {
    return Promise.reject(new Error('请输入调休假'))
  }
}
const changeUnit = () => {
  overtimeFormRef.value.validateFields('latestEffectDate')
}
const overtimeRules = {
  departmentId: [
    { required: true, message: '部门不能为空', trigger: 'change' },
  ],
  latestEffectDate: [
    { required: true, validator: validatorLatestEffectDate },
  ]
}

// 获取某个部门的加班设置
const getAttendancesByOvertime = async () => {
  const res = await getAttendancesByDeptOvertimeAPI({ departmentId: overtimeForm.value.departmentId })
  const extraDutyRuleList = res.extraDutyRuleList.map(record => {
    return {
      ...record,
      isEnable: record.isEnable == 1 ? true : false,
      isTimeOff: record.isEnable == 1 ? true : false,
      ruleTime: [record.ruleStartTime, record.ruleEndTime]
    }
  })
  overtimeForm.value = {
    departmentId: Number(res.extraDutyConfig.departmentId),
    isClock: res.extraDutyConfig.isClock == 1 ? true : false,
    isCompensationint: res.extraDutyConfig.isCompensationint == 1 ? true : false,
    latestEffectDate: res.dayOffConfigs.latestEffectDate,
    rules: extraDutyRuleList,
    unit: res.dayOffConfigs.unit
  }
}
onMounted(() => {
  getAttendancesByOvertime()
})

const cancel = () => {
  emit('cancel')
}
const ok = async () => {
  if (activeKey.value === 'attendance') {
    attendanceForm.value.afternoonStartTime = morningTime.value[0]
    attendanceForm.value.afternoonEndTime = morningTime.value[1]
    attendanceForm.value.morningStartTime = afternoonTime.value[0]
    attendanceForm.value.morningEndTime = afternoonTime.value[0]
    modalLoading.value = true
    await putAttendancesByDeptAPI(attendanceForm.value)
    getAttendancesByDept()
    message.success('出勤设置更新成功!')
    modalLoading.value = false
  }

  if (activeKey.value === 'vacate') {
    let params = holidayList.value.map(item => {
      return {
        ...item,
        isEnable: item.isEnable ? 1 : 0
      }
    })
    modalLoading.value = true
    await postAttendancesByDeptHolidaysAPI(params)
    getAttendancesByVacate()
    message.success('请假设置更新成功!')
    modalLoading.value = false
  }

  if (activeKey.value === 'charge') {
    let params = chargeData.value.map(item => {
      return {
        ...item,
        isEnable: item.isEnable ? 1 : 0
      }
    })
    modalLoading.value = true
    await postAttendancesByDeptDeductionsAPI(params)
    getAttendancesByVacate()
    message.success('扣款设置更新成功!')
    modalLoading.value = false
  }

  if (activeKey.value === 'overtime') {
    const extraDutyRuleList = overtimeForm.value.rules.map(record => {
      return {
        ...record,
        isEnable: record.isEnable ? 1 : 0,
        isTimeOff: record.isEnable ? 1 : 0,
        ruleEndTime: record.ruleTime[0],
        ruleStartTime: record.ruleTime[1]
      }
    })
    let params = {
      ...overtimeForm.value,
      isClock: overtimeForm.value.isClock ? 1 : 0,
      isCompensationint: overtimeForm.value.isCompensationint ? 1 : 0,
      rules: extraDutyRuleList
    }
    modalLoading.value = true
    await putAttendancesByDeptOvertimeAPI(params)
    getAttendancesByOvertime()
    message.success('加班设置更新成功!')
    modalLoading.value = false
  }
}

  ;
</script>

<template>
  <a-modal
    :open="props.open"
    title="设置"
    @ok="ok"
    @cancel="cancel"
    :destroyOnClose="true"
    :confirm-loading="modalLoading"
    :width="580"
  >
    <div style="max-height: 600px; overflow-y: auto">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane
          key="attendance"
          tab="出勤设置"
        >
          <a-form
            ref="attendanceFormRef"
            :model="attendanceForm"
            :rules="attendanceRules"
            :label-col="{ style: { width: '100px' } }"
          >
            <a-form-item
              label="部门"
              name="departmentId"
            >
              <a-select
                v-model:value="attendanceForm.departmentId"
                placeholder="请选择部门"
                @change="getAttendancesByDept"
              >
                <a-select-option
                  :value="item.id"
                  v-for="item in department"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              label="出勤时间"
              name="time"
            >
              <div>
                上午：
                <a-time-range-picker
                  v-model:value="morningTime"
                  format="HH:mm"
                  valueFormat="HH:mm"
                  class="mb-2"
                />
              </div>
              <div>
                <a-form-item-rest>
                  下午：
                  <a-time-range-picker
                    v-model:value="afternoonTime"
                    format="HH:mm"
                    valueFormat="HH:mm"
                    @change="changeTime2"
                  />
                </a-form-item-rest>
              </div>

            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane
          key="vacate"
          tab="请假设置"
        >
          <a-form
            ref="vacateFormRef"
            :model="vacateForm"
            :rules="vacateRules"
            :label-col="{ style: { width: '100px' } }"
          >
            <a-form-item
              label="部门"
              name="departmentId"
            >
              <a-select
                v-model:value="vacateForm.departmentId"
                placeholder="请选择部门"
                @change="getAttendancesByVacate"
              >
                <a-select-option
                  :value="item.id"
                  v-for="item in department"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="假期设置">
              <a-table
                :columns="vacateColumns"
                :data-source="holidayList"
                :pagination="false"
                rowKey="id"
              >
                <template #bodyCell="{ column, record }">

                  <template v-if="column.key === 'isEnable'">
                    <a-switch
                      v-model:checked="record.isEnable"
                      size="small"
                    />
                  </template>
                </template>
              </a-table>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane
          key="charge"
          tab="扣款设置"
        >
          <a-form
            ref="chargeFormRef"
            :model="chargeForm"
            :rules="chargeRules"
            :label-col="{ style: { width: '100px' } }"
          >
            <a-form-item
              label="部门"
              name="departmentId"
            >
              <a-select
                v-model:value="chargeForm.departmentId"
                placeholder="请选择部门"
                @change="getAttendancesByCharge"
              >
                <a-select-option
                  :value="item.id"
                  v-for="item in department"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="扣款项">
              <div v-for="item in chargeData">
                <template v-if="item.dedTypeCode == '51000'">
                  <div class="mb-6">
                    <div
                      class="pl-2 mt-2 mb-2"
                      style="margin-top: 5px;"
                    >
                      {{ item.name }}
                      <a-switch
                        v-model:checked="item.isEnable"
                        size="small"
                      />
                    </div>
                    <div class="pl-4">
                      <p class="mb-2">
                        迟到≤ <a-input
                          v-model:value="item.periodUpperLimit"
                          style="width: 60px;"
                          type="number"
                        /> 分钟
                      </p>
                      <div class="pl-6">
                        <p class="mb-2">
                          迟到≤ <a-input
                            v-model:value="item.timesUpperLimit"
                            style="width: 60px;"
                            type="number"
                          /> 次，每次扣款 <a-input
                            v-model:value="item.dedAmonutUpperLimit"
                            style="width: 60px;"
                            type="number"
                          /> 元
                        </p>
                        <p class="mb-2">
                          迟到> <a-input
                            v-model:value="item.timesLowerLimit"
                            style="width: 60px;"
                            type="number"
                            disabled
                          /> 次，每次扣款 <a-input
                            v-model:value="item.dedAmonutLowerLimit"
                            style="width: 60px;"
                            type="number"
                          /> 元
                        </p>
                      </div>
                      <div>
                        <p class="mb-2">
                          迟到> <a-input
                            v-model:value="item.periodLowerLimit"
                            style="width: 60px;"
                            type="number"
                            disabled
                          /> 分钟
                        </p>
                        <div class="pl-6">
                          <p class="mb-2">
                            迟到≤ <a-input
                              v-model:value="item.isAbsenteeism"
                              style="width: 60px;"
                              type="number"
                              disabled
                            /> 次，每次旷工 <a-input
                              v-model:value="item.absenceDays"
                              style="width: 60px;"
                              type="number"
                            /> 天
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-if="item.dedTypeCode == '52000'">
                  <div class="mb-6">
                    <div
                      class="pl-2 mb-2"
                      style="margin-top: 5px;"
                    >
                      {{ item.name }}
                      <a-switch
                        v-model:checked="item.isEnable"
                        size="small"
                      />
                    </div>
                    <div class="pl-4">
                      <p class="mb-2">
                        早退≤ <a-input
                          v-model:value="item.periodUpperLimit"
                          type="number"
                          style="width: 50px;"
                        /> 分钟
                      </p>
                      <div class="pl-6">
                        <p class="mb-2">
                          早退≤ <a-input
                            v-model:value="item.timesUpperLimit"
                            type="number"
                            style="width: 50px;"
                          /> 次，每次扣款 <a-input
                            v-model:value="item.dedAmonutUpperLimit"
                            type="number"
                            style="width: 50px;"
                          /> 元
                        </p>
                        <p class="mb-2">
                          早退> <a-input
                            v-model:value="item.timesLowerLimit"
                            style="width: 50px;"
                            type="number"
                            disabled
                          /> 次，每次扣款 <a-input
                            v-model:value="item.dedAmonutLowerLimit"
                            style="width: 50px;"
                            type="number"
                          /> 元
                        </p>
                      </div>
                      <div>
                        <p class="mb-2">
                          早退> <a-input
                            v-model:value="item.periodLowerLimit"
                            style="width: 50px;"
                            disabled
                            type="number"
                          /> 分钟
                        </p>
                        <div class="pl-6">
                          <p class="mb-2">
                            早退≤ <a-input
                              v-model:value="item.isAbsenteeism"
                              style="width: 50px;"
                              type="number"
                              disabled
                            /> 次，每次旷工 <a-input
                              v-model:value="item.absenceDays"
                              style="width: 50px;"
                              type="number"
                            /> 天
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-if="item.dedTypeCode == '53000'">
                  <div class="mb-6">
                    <div
                      class="pl-2 mb-2"
                      style="margin-top: 5px;"
                    >
                      {{ item.name }}
                      <a-switch
                        v-model:checked="item.isEnable"
                        size="small"
                      />
                    </div>
                    <div class="pl-4">
                      <p class="mb-2">
                        旷工按 <a-input
                          v-model:value="item.fineSalaryMultiples"
                          style="width: 50px;"
                          type="number"
                        /> 倍工资处罚
                      </p>
                    </div>
                  </div>
                </template>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane
          key="overtime"
          tab="加班设置"
        >
          <a-form
            ref="overtimeFormRef"
            :model="overtimeForm"
            :rules="overtimeRules"
            :label-col="{ style: { width: '100px' } }"
          >
            <a-form-item
              label="部门"
              name="departmentId"
            >
              <a-select
                v-model:value="overtimeForm.departmentId"
                placeholder="请选择部门"
                @change="getAttendancesByOvertime"
              >
                <a-select-option
                  :value="item.id"
                  v-for="item in department"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="加班规则">
              <div v-for="item in overtimeForm.rules">
                <div class="flex mb-2 justify-between items-center">
                  <div><a-switch
                      size="small"
                      v-model:checked="item.isEnable"
                    /> &nbsp; {{ item.rule }}</div>
                  <div>
                    <a-checkbox v-model:checked="item.isTimeOff">调休假</a-checkbox>
                    <a-time-range-picker
                      v-model:value="item.ruleTime"
                      format="HH:mm"
                      valueFormat="HH:mm"
                      style="width: 150px;"
                    />
                  </div>
                </div>
              </div>
            </a-form-item>
            <a-form-item label="打卡验证">
              <a-switch
                size="small"
                v-model:checked="overtimeForm.isClock"
              /> 加班需要有打卡记录
            </a-form-item>
            <a-form-item label="开启补偿">
              <a-switch
                size="small"
                v-model:checked="overtimeForm.isCompensationint"
              />
            </a-form-item>
            <a-form-item
              label="调休假设置"
              name="latestEffectDate"
            >
              最晚有效期 次年 <a-date-picker
                v-model:value="overtimeForm.latestEffectDate"
                format="MM-DD"
                valueFormat="MM-DD"
              />
              <div
                class="mt-2"
                style="padding-left: 18px;"
              >
                <a-form-item-rest>
                  请假最小单位 <a-input
                    v-model:value="overtimeForm.unit"
                    style="width: 50px;"
                    type="number"
                    @change="changeUnit"
                  /> 天
                </a-form-item-rest>
              </div>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<style lang="less" scoped>
</style>

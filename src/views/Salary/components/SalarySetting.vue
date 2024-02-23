<script setup>
import { message } from 'ant-design-vue'
import { ref, onMounted } from 'vue'
import { getSalarySettingsAPI, postSalarySettingsAPI } from '@/api/salary'

const emit = defineEmits(['cancel'])
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
})
const activeKey = ref('piecework')

// 获取设置
const settingsData = ref({})
const getSalarySettings = async () => {
  const res = await getSalarySettingsAPI()
  settingsData.value = res

  allowanceForm.value = { ...allowanceForm.value, ...res }
}
onMounted(() => {
  getSalarySettings()
})

const modalLoading = ref(false)
const pieceworkFormRef = ref(null)
const pieceworkForm = ref({
  socialSecurityType: 1,
})
const pieceworkRules = {
  socialSecurityType: [
    { required: true, message: '请选择社保自然月', trigger: 'change' }
  ]
}

// 津贴设置
const allowanceFormRef = ref(null)
const allowanceForm = ref({
  // 通用方案
  generalPlan: '',
  // 备注
  remark: '',
  // 交通补贴
  transportationSubsidyScheme: 1,
  transportationSubsidyAmount: '',
  // 通讯补贴
  communicationSubsidyScheme: 1,
  communicationSubsidyAmount: '',
  // 餐补
  lunchAllowanceScheme: 2,
  lunchAllowanceAmount: '',
  // 住房补贴
  housingSubsidyScheme: 2,
  housingSubsidyAmount: '',

  // 计税方式
  taxCalculationType: 1,
})
const allowanceRules = {
  socialSecurityType: [
    { required: true, message: '请选择社保自然月', trigger: 'change' }
  ]
}

const cancel = () => {
  emit('cancel')
}
const ok = async () => {
  modalLoading.value = true
  await postSalarySettingsAPI(allowanceForm.value)
  modalLoading.value = false
  message.success('更新设置成功!')
  emit('cancel')
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
  >
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane
        key="piecework"
        tab="计薪设置"
      >
        <a-form
          ref="pieceworkFormRef"
          :model="pieceworkForm"
          :rules="pieceworkRules"
          :label-col="{ style: { width: '150px' } }"
        >
          <a-form-item
            label="对应社保自然月"
            name="socialSecurityType"
          >
            <a-select
              v-model:value="pieceworkForm.socialSecurityType"
              style="width: 80%"
            >
              <a-select-option :value="1">当月</a-select-option>
              <a-select-option :value="2">次月</a-select-option>
            </a-select>
            <a-tooltip placement="right">
              <template #title>
                <span>如果201806月工资中扣除2018年6月自然月的社保公积金，请选择当月；如果扣除2018年7月自然月的社保公积金，请选择次月。</span>
              </template>
              <QuestionCircleOutlined style="font-size: 16px; margin-left: 10px" />
            </a-tooltip>
          </a-form-item>
          <a-form-item label="社保数据来源">
            <a-input
              disabled
              value="社保模块"
              style="width: 80%"
            />
            <a-tooltip placement="right">
              <template #title>
                <span>计算工资时的五险一金金额将取自社保报表。</span>
              </template>
              <QuestionCircleOutlined style="font-size: 16px; margin-left: 10px" />
            </a-tooltip>
          </a-form-item>
          <a-form-item label="考勤数据来源">
            <a-input
              disabled
              value="考勤模块"
              style="width: 80%"
            />
            <a-tooltip placement="right">
              <template #title>
                <span>计算工资时的考勤数据将取自考勤统计表。</span>
              </template>
              <QuestionCircleOutlined style="font-size: 16px; margin-left: 10px" />
            </a-tooltip>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane
        key="allowance"
        tab="津贴设置"
      >
        <a-form
          ref="allowanceFormRef"
          :model="allowanceForm"
          :rules="allowanceRules"
          :label-col="{ style: { width: '110px' } }"
        >
          <a-form-item label="通用方案">
            <a-input
              v-model:value="allowanceForm.generalPlan"
              placeholder="请输入通用方案"
            ></a-input>
          </a-form-item>
          <a-form-item label="备注">
            <a-input
              v-model:value="allowanceForm.remark"
              placeholder="请输入通用备注"
              show-count
              :maxlength="100"
            ></a-input>
          </a-form-item>
          <a-form-item label="津贴名称">
            <div class="flex items-center">
              <a-input v-model:value="allowanceForm.transportationSubsidyAmount">
                <template #addonBefore>
                  交通补贴
                </template>
                <template #addonAfter>
                  <a-select
                    v-model:value="allowanceForm.transportationSubsidyScheme"
                    style="width: 100px"
                  >
                    <a-select-option :value="1">每出勤日</a-select-option>
                    <a-select-option :value="2">每月固定</a-select-option>
                  </a-select>
                </template>
              </a-input>
              <a-tooltip placement="right">
                <template #title>
                  <span>每出勤日：金额*实际出勤天数； 每计薪日：金额*计薪天数； 每月固定：固定金额； 每月（按出勤日）：金额*实际出勤天数/应出勤工作日； 每月（按计薪日）：金额*计薪天数/计薪标准（如21.75）；</span>
                </template>
                <QuestionCircleOutlined style="font-size: 16px; margin-left: 10px" />
              </a-tooltip>
            </div>
            <div class="mt-2 flex items-center">
              <a-input v-model:value="allowanceForm.communicationSubsidyAmount">
                <template #addonBefore>
                  交通补贴
                </template>
                <template #addonAfter>
                  <a-select
                    v-model:value="allowanceForm.communicationSubsidyScheme"
                    style="width: 100px"
                  >
                    <a-select-option :value="1">每出勤日</a-select-option>
                    <a-select-option :value="2">每月固定</a-select-option>
                  </a-select>
                </template>
              </a-input>
              <a-tooltip placement="right">
                <template #title>
                  <span>每出勤日：金额*实际出勤天数； 每计薪日：金额*计薪天数； 每月固定：固定金额； 每月（按出勤日）：金额*实际出勤天数/应出勤工作日； 每月（按计薪日）：金额*计薪天数/计薪标准（如21.75）；</span>
                </template>
                <QuestionCircleOutlined style="font-size: 16px; margin-left: 10px" />
              </a-tooltip>
            </div>
            <div class="mt-2 flex items-center">
              <a-input v-model:value="allowanceForm.lunchAllowanceAmount">
                <template #addonBefore>
                  午餐补贴
                </template>
                <template #addonAfter>
                  <a-select
                    v-model:value="allowanceForm.lunchAllowanceScheme"
                    style="width: 100px"
                  >
                    <a-select-option :value="1">每出勤日</a-select-option>
                    <a-select-option :value="2">每月固定</a-select-option>
                  </a-select>
                </template>
              </a-input>
              <a-tooltip placement="right">
                <template #title>
                  <span>每出勤日：金额*实际出勤天数； 每计薪日：金额*计薪天数； 每月固定：固定金额； 每月（按出勤日）：金额*实际出勤天数/应出勤工作日； 每月（按计薪日）：金额*计薪天数/计薪标准（如21.75）；</span>
                </template>
                <QuestionCircleOutlined style="font-size: 16px; margin-left: 10px" />
              </a-tooltip>
            </div>
            <div class="mt-2 flex items-center">
              <a-input v-model:value="allowanceForm.housingSubsidyAmount">
                <template #addonBefore>
                  住房补贴
                </template>
                <template #addonAfter>
                  <a-select
                    v-model:value="allowanceForm.housingSubsidyScheme"
                    style="width: 100px"
                  >
                    <a-select-option :value="1">每出勤日</a-select-option>
                    <a-select-option :value="2">每月固定</a-select-option>
                  </a-select>
                </template>
              </a-input>
              <a-tooltip placement="right">
                <template #title>
                  <span>每出勤日：金额*实际出勤天数； 每计薪日：金额*计薪天数； 每月固定：固定金额； 每月（按出勤日）：金额*实际出勤天数/应出勤工作日； 每月（按计薪日）：金额*计薪天数/计薪标准（如21.75）；</span>
                </template>
                <QuestionCircleOutlined style="font-size: 16px; margin-left: 10px" />
              </a-tooltip>
            </div>
          </a-form-item>
          <a-form-item
            label="适用计税方式"
            name="taxCalculationType"
          >
            <a-radio-group
              v-model:value="allowanceForm.taxCalculationType"
              :options="[{ label: '税前', value: 1 }, { label: '税后', value: 2 }]"
            />
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<style lang="less" scoped>
</style>

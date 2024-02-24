<script setup>
import { getApprovalDataAPI, getApprovalDetailAPI, getApprovalTaskAPI } from '@/api/approval'
import { onMounted, ref } from 'vue'

const columns = [
  {
    name: 'ID',
    dataIndex: 'processId',
    key: 'processId',
    width: 60,
  },
  {
    title: '审批类型',
    dataIndex: 'processName',
    key: 'processName',
    filters: [
      {
        text: '请假',
        value: '请假',
      },
      {
        text: '加班',
        value: '加班',
      },
      {
        text: '离职',
        value: '离职',
      },
    ],
    onFilter: (value, record) => {
      return record.processName.indexOf(value) === 0
    },
  },
  {
    title: '申请人',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '当前审批人',
    dataIndex: 'procCurrNodeUserName',
    key: 'procCurrNodeUserName',
  },
  {
    title: '审批时间',
    dataIndex: 'procApplyTime',
    key: 'procApplyTime',
  },
  {
    title: '审批状态',
    dataIndex: 'processState',
    key: 'processState',
    filters: [
      {
        text: '已提交',
        value: '0',
      },
      {
        text: '审批中',
        value: '1',
      },
      {
        text: '审批通过',
        value: '2',
      },
      {
        text: '审批驳回',
        value: '3',
      },
      {
        text: '撤销',
        value: '4',
      },
    ],
    onFilter: (value, record) => {
      return record.processState == value
    },
  },
  {
    title: '操作',
    key: 'action',
  },
]
const data = ref([])
const loading = ref(false)
onMounted(() => {
  getApprovalData()
})
const getApprovalData = async () => {
  loading.value = true
  const res = await getApprovalDataAPI()
  data.value = res
  loading.value = false
}
// 审批状态机
const processState = (state) => {
  switch (state) {
    case 0:
      return '已提交'
    case 1:
      return '审批中'
    case 2:
      return '审批通过'
    case 3:
      return '审批驳回'
    case 4:
      return '撤销'
    default:
      return '未知'
  }
}

// 详情
const open = ref(false)
const detail = ref({})
const task = ref([])
// 审批详情
const getApprovalDetail = async (row) => {
  const res = await getApprovalDetailAPI(row.processId)
  let data = {
    ...res,
    procData: JSON.parse(res.procData)
  }
  detail.value = data
}
// 审批任务
const getApprovalTask = async (row) => {
  const res = await getApprovalTaskAPI(row.processId)
  task.value = res
}
const openDrawer = async (row) => {
  await getApprovalDetail(row)
  await getApprovalTask(row)
  open.value = true
}
  ;
</script>

<template>
  <div>
    <div class="bg-white p-2 flex">
      <a-card
        hoverable
        style="width: 180px"
        class="mr-4"
      >
        <a-statistic
          title="当前审批中"
          :value="data.currApproveCount"
        />
      </a-card>
      <a-card
        hoverable
        style="width: 180px"
        class="mr-4"
      >
        <a-statistic
          title="本月审批通过"
          :value="data.approveCount"
        />
      </a-card>
      <a-card
        hoverable
        style="width: 180px"
      >
        <a-statistic
          title="本月审批驳回"
          :value="data.rejectionCount"
        />
      </a-card>
    </div>

    <div class="bg-white p-2 mt-4">
      <a-table
        :columns="columns"
        rowKey="id"
        :data-source="data.rows"
        :pagination="false"
        :loading="loading"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'processId'">
            ID
          </template>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'processState'">
            <a-tag
              color="yellow"
              v-if="record.processState == 0"
            >{{ processState(record.processState) }}</a-tag>
            <a-tag
              color="purple"
              v-if="record.processState == 1"
            >{{ processState(record.processState) }}</a-tag>
            <a-tag
              color="green"
              v-else-if="record.processState == 2"
            >{{ processState(record.processState) }}</a-tag>
            <a-tag
              color="red"
              v-else-if="record.processState == 3 || record.processState == 4"
            >{{ processState(record.processState) }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              @click="openDrawer(record)"
            >详情</a-button>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 详情抽屉 -->
    <a-drawer
      v-model:open="open"
      title="审批详情"
      placement="right"
      width="75%"
    >
      <div class="flex">
        <div class="left pr-6">
          <h1 class="text-base">申请人信息</h1>
          <a-row class="my-6">
            <a-col :span="12">
              <span
                class="text-gray-500"
                style="padding-left: 27px;"
              >姓名：</span> {{ detail.username }}
            </a-col>
            <a-col :span="12">
              <span class="text-gray-500">部门：</span> {{ detail.departmentName }}
            </a-col>
            <a-col
              :span="12"
              class="mt-4"
            >
              <span class="text-gray-500">入职时间：</span> {{ detail.timeOfEntry }}
            </a-col>
          </a-row>

          <a-divider />

          <h1 class="text-base">请假申请</h1>
          <a-row class="my-6">
            <a-col :span="12">
              <span class="text-gray-500">审批类型：</span> {{ detail.processName }}
            </a-col>
            <a-col :span="12">
              <span class="text-gray-500">开始时间：</span> {{ detail.procData.startTime || '-' }}
            </a-col>
            <a-col
              :span="12"
              class="mt-4"
            >
              <span class="text-gray-500">休假类别：</span> {{ detail.procData.processName || '-' }}
            </a-col>
            <a-col
              :span="12"
              class="mt-4"
            >
              <span class="text-gray-500">结束时间：</span> {{ detail.procData.endTime || '-' }}
            </a-col>
            <a-col
              :span="12"
              class="mt-4"
            >
              <span class="text-gray-500">请假时长：</span> {{ detail.procData.duration || '-' }}
            </a-col>
            <a-col
              :span="12"
              class="mt-4"
            >
              <span class="text-gray-500">申请单位：</span> {{ detail.procData.applyUnit || '-' }}
            </a-col>
            <a-col
              :span="12"
              class="mt-4"
            >
              <span class="text-gray-500">申请事由：</span> {{ detail.procData.reason || '-' }}
            </a-col>
            <a-col
              :span="12"
              class="mt-4"
            >
              <span class="text-gray-500">审批状态：</span> 审批通过
              <!-- {{ detail.procData.holidayType }} -->
            </a-col>
          </a-row>

        </div>
        <div class="right">
          <a-timeline>
            <a-timeline-item v-for="item in task">
              <div class="text-base">
                {{ item.handleUserName }} - {{ item.handleOpinion }}
              </div>
              <p class="text-xs text-gray-500">{{ item.handleTime }}</p>
            </a-timeline-item>
          </a-timeline>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<style lang="less" scoped>
.left {
  flex: 6.5;
}
.right {
  flex: 3.5;
}
</style>

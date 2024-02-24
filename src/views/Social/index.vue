<script setup>
import { getDepartmentAPI } from '@/api/department'
import { getSocialListAPI, getCityAPI, getSocialDetailAPI, getSocialBaseAPI, putSocialAPI } from '@/api/social'
import { onMounted } from 'vue'
import { message } from 'ant-design-vue'

// 级联选择框数据
const options = ref([])
const city = ref([])
onMounted(() => {
  getDepartment()
  getCity()
})
const getDepartment = async () => {
  const res = await getDepartmentAPI()
  options.value = res
}
const getCity = async () => {
  const res = await getCityAPI()
  city.value = res
}
const filter = (inputValue, path) => {
  return path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
}
const changeFilter = () => {
  getSocialList()
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
    width: 120,
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
    title: '离职时间',
    dataIndex: 'leaveTime',
    key: 'leaveTime',
  },
  {
    title: '社保城市',
    dataIndex: 'participatingInTheCity',
    key: 'participatingInTheCity',
  },
  {
    title: '公积金城市',
    dataIndex: 'providentFundCity',
    key: 'providentFundCity',
  },
  {
    title: '社保基数',
    dataIndex: 'socialSecurityBase',
    key: 'socialSecurityBase',
    sorter: (a, b) => {
      return a.socialSecurityBase - b.socialSecurityBase
    }
  },
  {
    title: '公积金基数',
    dataIndex: 'providentFundBase',
    key: 'providentFundBase',
    sorter: (a, b) => {
      return a.providentFundBase - b.providentFundBase
    }
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    algin: 'center',
    fixed: 'right',
  },
]
const params = ref({
  page: 1,
  pageSize: 10,
  departmentChecks: [],
  providentFundChecks: [],
  socialSecurityChecks: [],
})
const data = ref([])
const loading = ref(false)
// 获取社保列表
const getSocialList = async () => {
  loading.value = true
  const res = await getSocialListAPI({ ...params.value, departmentChecks: params.value.departmentChecks.flat(), providentFundChecks: params.value.providentFundChecks.flat(), socialSecurityChecks: params.value.socialSecurityChecks.flat() })
  data.value = res
  loading.value = false
}
onMounted(() => {
  getSocialList()
})
const changeSize = (page, pageSize) => {
  params.page = page
  params.pageSize = pageSize
  getSocialList()
}

// 详情抽屉
const open = ref(false)
const detail = ref({})
const socialBase = ref([])
const socialBaseColumns = [
  {
    name: '缴费项目',
    dataIndex: 'name',
    key: 'name',
  },
  {
    name: '企业比例',
    dataIndex: 'scaleCompany',
    key: 'scaleCompany',
  },
  {
    name: '个人比例',
    dataIndex: 'scalePersonal',
    key: 'scalePersonal',
  },
]
const openDetail = async (row) => {
  const res1 = await getSocialDetailAPI(row.id)
  const res2 = await getSocialBaseAPI(row.participatingInTheCityId)
  detail.value = {
    ...res1,
    userSocialSecurity: {
      ...res1.userSocialSecurity,
      enterprisesPaySocialSecurityThisMonth: res1.userSocialSecurity.enterprisesPaySocialSecurityThisMonth == 1 ? true : false,
      enterprisesPayTheProvidentFundThisMonth: res1.userSocialSecurity.enterprisesPayTheProvidentFundThisMonth == 1 ? true : false,
    }
  }
  socialBase.value = res2
  open.value = true
}
const formRef = ref(null)
const formRules = {
  participatingInTheCity: [
    { required: true, message: '请选择社保城市' },
  ],
  socialSecurityType: [
    { required: true, message: '请选择社保类型' },
  ],
  householdRegistrationType: [
    { required: true, message: '请选择户籍类型' },
  ],
  socialSecurityBase: [
    { required: true, message: '请输入社保基数' },
  ],
  industrialInjuryRatio: [
    { required: true, message: '请输入工伤比例' },
  ],
  providentFundCity: [
    { required: true, message: '请选择公积金城市' },
  ],
  providentFundBase: [
    { required: true, message: '请输入公积金基数' },
  ],
  enterpriseProportion: [
    { required: true, message: '请输入企业比例' },
  ],
  personalProportion: [
    { required: true, message: '请输入个人比例' },
  ],
  personalProvidentFundPayment: [
    { required: true, message: '请输入个人公积金比例' },
  ],
  enterpriseProvidentFundPayment: [
    { required: true, message: '请输入企业公积金比例' },
  ]
}

// 保存
const putSocial = () => {
  formRef.value.validate().then(async () => {
    await putSocialAPI(detail.value.user.id, {
      ...detail.value.userSocialSecurity,
      enterprisesPaySocialSecurityThisMonth: detail.value.userSocialSecurity.enterprisesPaySocialSecurityThisMonth ? 1 : 0,
      enterprisesPayTheProvidentFundThisMonth: detail.value.userSocialSecurity.enterprisesPayTheProvidentFundThisMonth ? 1 : 0
    })
    message.success('保存成功')
  })
}

  ;
</script>

<template>
  <div>
    <div class="bg-white p-2">
      <div class="flex items-center">
        <div class="flex items-center">
          <span
            class="text-base text-right"
            style="width: 50px"
          >部门：</span>
          <a-cascader
            v-model:value="params.departmentChecks"
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
        <div class="flex items-center">
          <span
            class="text-base text-right"
            style="width: 100px"
          >社保城市：</span>
          <a-cascader
            v-model:value="params.socialSecurityChecks"
            style="width: 300px"
            multiple
            :options="city"
            placeholder="请选择社保城市筛选项"
            :show-search="{ filter }"
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
            max-tag-count="responsive"
            @change="changeFilter"
          ></a-cascader>
        </div>
        <div class="flex items-center">
          <span
            class="text-base text-right"
            style="width: 115px"
          >公积金城市：</span>
          <a-cascader
            v-model:value="params.providentFundChecks"
            style="width: 300px"
            multiple
            :options="city"
            placeholder="请选择公积金城市筛选项"
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
        :scroll="{ x: 1400 }"
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
          <template v-if="column.key === 'leaveTime'">
            {{ record.leaveTime || '-' }}
          </template>
          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              @click="openDetail(record)"
            >详情</a-button>
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

    <!-- 详情抽屉 -->
    <a-drawer
      v-model:open="open"
      title="社保详情"
      placement="right"
      width="75%"
    >
      <div class="top mb-6 flex">
        <div>
          <a-avatar
            v-if="detail.user.staffPhoto"
            class="my-avatar"
            :src="detail.user.staffPhoto"
          ></a-avatar>
          <a-avatar
            v-else
            class="my-avatar"
          >{{ detail.user.username.charAt(0) }}</a-avatar>
        </div>
        <div class="ml-6 flex flex-col justify-center leading-7">
          <div>
            <span class="text-base bold">{{ detail.user.username }}</span> &nbsp;
            <a-tag
              :bordered="false"
              v-if="detail.user.inServiceStatus == 1"
              color="green"
            >在职</a-tag>
            <a-tag
              :bordered="false"
              v-else
              color="error"
            >离职</a-tag>
          </div>
          <div class="flex">
            <p>入职时间：{{ detail.user.timeOfEntry }}</p>
            <p class="ml-6">联系电话：{{ detail.user.mobile }}</p>
          </div>
          <div class="flex">
            <p>
              本月不缴纳社保
              <a-switch
                v-model:checked="detail.userSocialSecurity.enterprisesPaySocialSecurityThisMonth"
                size="small"
              />
            </p>
            <p class="ml-6">
              本月不缴纳公积金
              <a-switch
                v-model:checked="detail.userSocialSecurity.enterprisesPayTheProvidentFundThisMonth"
                size="small"
              />
            </p>
          </div>
        </div>
      </div>

      <a-form
        ref="formRef"
        :model="detail.userSocialSecurity"
        :rules="formRules"
        :label-col="{ style: { width: '120px' } }"
      >
        <a-form-item
          label="参保城市"
          name="participatingInTheCity"
        >
          <a-select
            v-model:value="detail.userSocialSecurity.participatingInTheCity"
            placeholder="请选择参保城市"
            style="width: 350px;"
          >
            <a-select-option
              :value="item.id"
              v-for="item in city"
            >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="社保类型"
          name="socialSecurityType"
        >
          <a-select
            v-model:value="detail.userSocialSecurity.socialSecurityType"
            placeholder="请选择社保类型"
            style="width: 350px;"
          >
            <a-select-option :value="1">首次开户</a-select-option>
            <a-select-option :value="2">非首次开户</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="户籍类型"
          name="householdRegistrationType"
        >
          <a-select
            v-model:value="detail.userSocialSecurity.householdRegistrationType"
            placeholder="请选择户籍类型"
            style="width: 350px;"
          >
            <a-select-option :value="1">本市城镇</a-select-option>
            <a-select-option :value="2">本市农村</a-select-option>
            <a-select-option :value="3">外阜城镇</a-select-option>
            <a-select-option :value="4">外阜农村</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="社保基数"
          name="socialSecurityBase"
        >
          <div class="flex items-center">
            <a-input-number
              v-model:value="detail.userSocialSecurity.socialSecurityBase"
              :min="3387"
              :max="25401"
              style="width: 350px;"
            /> （基数范围是3387 ~ 25401）
          </div>
        </a-form-item>
        <a-form-item
          label="工伤比例"
          name="industrialInjuryRatio"
        >
          <div class="flex items-center">
            <a-input-number
              v-model:value="detail.userSocialSecurity.industrialInjuryRatio"
              style="width: 350px;"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
              :min="0.2"
              :max="3"
            /> （比例范围是0.2％ ~ 3％，推荐0.2％）
          </div>
        </a-form-item>
        <a-form-item label="社保缴纳">
          <a-table
            :columns="socialBaseColumns"
            :data-source="socialBase"
            :pagination="false"
            rowKey="id"
            style="width: 350px;"
          >
            <template #headerCell="{ column }">
              <template v-if="column.key === 'name'">
                缴费项目
              </template>
              <template v-if="column.key === 'scaleCompany'">
                企业比例
              </template>
              <template v-if="column.key === 'scalePersonal'">
                个人比例
              </template>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'scaleCompany'">
                {{ record.scaleCompany }}%
              </template>
              <template v-if="column.key === 'scalePersonal'">
                {{ record.scalePersonal }}%
              </template>
            </template>
          </a-table>
        </a-form-item>
        <a-form-item label="社保备注">
          <a-textarea
            v-model:value="detail.userSocialSecurity.socialSecurityNotes"
            placeholder="1-100个字符"
            show-count
            :maxlength="100"
            :rows="3"
            style="width: 350px;"
          />
        </a-form-item>
        <a-form-item
          label="公积金城市"
          name="providentFundCity"
        >
          <a-select
            v-model:value="detail.userSocialSecurity.providentFundCity"
            placeholder="请选择公积金城市"
            style="width: 350px;"
          >
            <a-select-option
              :value="item.id"
              v-for="item in city"
            >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="公积金基数"
          name="providentFundBase"
        >
          <a-input-number
            v-model:value="detail.userSocialSecurity.providentFundBase"
            :min="3387"
            :max="25401"
            style="width: 350px;"
          /> （基数范围是3387 ~ 25401）
        </a-form-item>
        <a-form-item
          label="企业比例"
          name="enterpriseProportion"
        >
          <a-input-number
            v-model:value="detail.userSocialSecurity.enterpriseProportion"
            style="width: 350px;"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :min="5"
            :max="12"
          /> （比例范围是5％ ~ 12％，推荐12％）
        </a-form-item>
        <a-form-item
          label="个人比例"
          name="personalProportion"
        >
          <a-input-number
            v-model:value="detail.userSocialSecurity.personalProportion"
            style="width: 350px;"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :min="5"
            :max="12"
          /> （比例范围是5％ ~ 12％，推荐12％）
        </a-form-item>
        <a-form-item
          label="个人缴纳公积金"
          name="personalProvidentFundPayment"
        >
          <a-input-number
            v-model:value="detail.userSocialSecurity.personalProvidentFundPayment"
            style="width: 350px;"
          /> （基数范围是3387 ~ 25401）
        </a-form-item>
        <a-form-item
          label="公司缴纳公积金"
          name="enterpriseProvidentFundPayment"
        >
          <a-input-number
            v-model:value="detail.userSocialSecurity.enterpriseProvidentFundPayment"
            style="width: 350px;"
          /> （基数范围是3387 ~ 25401）
        </a-form-item>
        <a-form-item label="公积金备注">
          <a-textarea
            v-model:value="detail.userSocialSecurity.providentFundNotes"
            placeholder="1-100个字符"
            show-count
            :maxlength="100"
            :rows="3"
            style="width: 350px;"
          />
        </a-form-item>
      </a-form>

      <div class="footer">
        <a-space>
          <a-button
            type="primary"
            @click="putSocial"
          >保存</a-button>
          <a-button @click="open = false">取消</a-button>
        </a-space>
      </div>
    </a-drawer>
  </div>
</template>

<style lang="less" scoped>
.my-avatar {
  width: 80px;
  height: 80px;
  line-height: 75px;
  font-size: 32px;
  color: #333;
  background-color: rgba(98, 38, 238, 0.1);
  margin-right: 4px;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background-color: #fff;
}
</style>

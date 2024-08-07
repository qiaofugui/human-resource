<script setup>
import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import { getHomeDataAPI, getNoticeAPI } from '@/api/dashboard'
import useUserInfo from '@/stores/userInfo'
// import * as echarts from 'echarts' // 引入所有的echarts
import * as echarts from 'echarts/core' // 引入核心包
import { LineChart } from 'echarts/charts' // 引入折线图
import { GridComponent, TooltipComponent } from 'echarts/components' // 引入组件
import { CanvasRenderer } from 'echarts/renderers' // 引入渲染器
import { UniversalTransition } from 'echarts/features'

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition, TooltipComponent]);

const { userInfo: user } = useUserInfo()

onMounted(() => {
  getHomeData()
  getNotice()
})
const homeData = ref(null)
const getHomeData = async () => {
  const data = await getHomeDataAPI()
  homeData.value = data
  setOption()
}
const noticeData = ref(null)
const getNotice = async () => {
  const data = await getNoticeAPI()
  noticeData.value = data
}

const date = ref()

// 图表
let socialRef = ref(null)
let social = ref(null)
let providentRef = ref(null)
let provident = ref(null)
onMounted(() => {
  social = echarts.init(socialRef.value)
  provident = echarts.init(providentRef.value)
  window.addEventListener('resize', () => {
    social.resize()
    provident.resize()
  })
})

const setOption = () => {
  // 设置图表
  social.setOption({
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: homeData.value?.socialInsurance?.xAxis
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      trigger: 'axis'
    },
    series: [
      {
        name: '人数',
        data: homeData.value?.socialInsurance?.yAxis,
        type: 'line',
        areaStyle: { // 区域填充渐变颜色
          color: {
            type: 'linear',
            colorStops: [{
              offset: 0, color: 'rgba(98, 38, 238, 1)' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(98, 38, 238, 0.4)' // 100% 处的颜色
            }],
          }
        },
        lineStyle: {
          color: '#6226ee' // 线的颜色
        }
      }
    ]
  })
  provident.setOption({
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: homeData.value?.providentFund?.xAxis
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      trigger: 'axis'
    },
    series: [
      {
        name: '人数',
        data: homeData.value?.providentFund?.yAxis,
        type: 'line',
        areaStyle: { // 区域填充渐变颜色
          color: {
            type: 'linear',
            colorStops: [{
              offset: 0, color: 'rgba(98, 38, 238, 1)' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(98, 38, 238, 0.4)' // 100% 处的颜色
            }],
          }
        },
        lineStyle: {
          color: '#6226ee' // 线的颜色
        }
      }
    ]
  })
}
  ;
</script>

<template>
  <div>
    <a-row
      :gutter="16"
      style="max-height: 300px;"
    >
      <a-col
        :span="8"
        style="max-height: 300px;"
      >
        <div class="bg-white h-full p-4">
          <header class="flex align-center">
            <a-avatar
              class="my-avatar"
              :src="user.staffPhoto"
            ></a-avatar>
            <div class="flex flex-col justify-between ml-3">
              <h1 class="text-base">宇宙科技银河集团</h1>
              <p class="text-sm text-gray-500">
                {{ user.username }}
                <a-divider type="vertical" />
                {{ user.profile.company }} - {{ user.profile.departmentName }}
              </p>
            </div>
          </header>
          <div class="mt-6">
            <a-row :gutter="16">
              <a-col
                :span="6"
                class="mb-9"
              >
                <a-statistic
                  title="组织总人数"
                  :value="homeData?.employeeTotal"
                />
              </a-col>
              <a-col :span="6">
                <a-statistic
                  title="正式员工"
                  :value="homeData?.regularEmployeeTotal"
                />
              </a-col>
              <a-col :span="6">
                <a-statistic
                  title="合同待签署"
                  :value="homeData?.contractSignTotal"
                />
              </a-col>
              <a-col :span="6">
                <a-statistic
                  title="待入职"
                  :value="homeData?.toBeEmployed"
                />
              </a-col>
              <a-col :span="6">
                <a-statistic
                  title="本月待转正"
                  :value="homeData?.toBeConfirmed"
                />
              </a-col>
              <a-col :span="6">
                <a-statistic
                  title="本月待离职"
                  :value="homeData?.toBeDismissed"
                />
              </a-col>
              <a-col :span="6">
                <a-statistic
                  title="接口总访问"
                  :value="homeData?.interfaceAccessTotal"
                />
              </a-col>
            </a-row>
          </div>
        </div>
      </a-col>
      <a-col
        :span="8"
        style="max-height: 300px; max-width: 49.3%;"
        class="bg-white"
      >
        <div class="bg-white h-full p-4 relative">
          <h1 class="text-base absolute bg-white">通知公告</h1>
          <a-list
            item-layout="horizontal"
            class="pt-10 overflow-y-auto"
          >
            <a-list-item v-for="item in noticeData">
              <a-list-item-meta :description="item.createTime">
                <template #title>
                  <a
                    class="text-ellipsis block"
                    :title="item.notice"
                  >{{ item.notice }}</a>
                </template>
                <template #avatar>
                  <a-avatar :src="item.icon" />
                </template>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </div>
      </a-col>
      <a-col :span="8" style="max-height: 300px;">
        <div class="bg-white h-full p-4">
          <h1 class="text-base">帮助链接</h1>
          <div class="links">
            <div class="link-item">
              <FilePdfFilled
                class="mr-2"
                style="color: #6226ee; font-size: 16px;"
              />入门指南
            </div>
            <div class="link-item">
              <BulbFilled
                class="mr-2"
                style="color: #6226ee; font-size: 16px;"
              />在线帮助手册
            </div>
            <div class="link-item">
              <AudioFilled
                class="mr-2"
                style="color: #6226ee; font-size: 16px;"
              />联系技术支持
            </div>
            <div class="link-item">
              <PlusCircleFilled
                class="mr-2"
                style="color: #6226ee; font-size: 16px;"
              /> 添加链接
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <a-row
      :gutter="16"
      style="height: 300px"
      class="mt-3 charts"
    >
      <a-col
        :span="16"
        style="padding-right: 0px;"
      >
        <div class="bg-white h-full p-4">
          <h1 class="text-base">社保申报数据</h1>
          <div class="flex mt-6 h-full">
            <div
              style="flex: 4;"
              class="h-full"
            >
              <div>
                <div class="num">
                  <a-statistic
                    title="申报人数"
                    :value="homeData?.socialInsurance?.declarationTotal"
                  />
                </div>
                <div>
                  <a-row
                    :gutter="16"
                    class="mt-6"
                  >
                    <a-col :span="12">
                      <a-statistic
                        title="待申报(人)"
                        :value="homeData?.socialInsurance?.toDeclareTotal"
                      />
                    </a-col>
                    <a-col :span="12">
                      <a-statistic
                        title="申报中(人)"
                        :value="homeData?.socialInsurance?.declaringTotal"
                      />
                    </a-col>
                    <a-col :span="12">
                      <a-statistic
                        title="已申报(人)"
                        :value="homeData?.socialInsurance?.declaredTotal"
                      />
                    </a-col>
                  </a-row>
                </div>
              </div>
            </div>
            <div
              style="flex: 6;"
              class="h-full"
            >
              <!-- 图表 -->
              <div
                ref="socialRef"
                id="social"
                style="width: 100%; height: 300px"
              />
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="bg-white h-full p-4">
          <a-calendar
            v-model:value="date"
            :fullscreen="false"
          />
        </div>
      </a-col>
    </a-row>

    <a-row
      :gutter="16"
      style="height: 300px; margin-top: 92px;"
      class="charts"
    >
      <a-col
        :span="16"
        style="padding-right: 0px;"
      >
        <div class="bg-white h-full p-4">
          <h1 class="text-base">公积金申报数据</h1>
          <div class="flex mt-6 h-full">
            <div
              style="flex: 4;"
              class="h-full"
            >
              <div>
                <div class="num">
                  <a-statistic
                    title="申报人数"
                    :value="homeData?.providentFund?.declarationTotal"
                  />
                </div>
                <div>
                  <a-row
                    :gutter="16"
                    class="mt-6"
                  >
                    <a-col :span="12">
                      <a-statistic
                        title="待申报(人)"
                        :value="homeData?.providentFund?.toDeclareTotal"
                      />
                    </a-col>
                    <a-col :span="12">
                      <a-statistic
                        title="申报中(人)"
                        :value="homeData?.providentFund?.declaringTotal"
                      />
                    </a-col>
                    <a-col :span="12">
                      <a-statistic
                        title="已申报(人)"
                        :value="homeData?.providentFund?.declaredTotal"
                      />
                    </a-col>
                  </a-row>
                </div>
              </div>
            </div>
            <div
              style="flex: 6;"
              class="h-full"
            >
              <!-- 图表 -->
              <div
                ref="providentRef"
                id="provident"
                style="width: 100%; height: 300px"
              />
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="bg-white h-full p-4">
          
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="less" scoped>
.my-avatar {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  border: 1px solid transparent;
}
:deep(.ant-statistic-content-value-int) {
  font-size: 30px;
}
:deep(.ant-spin-container) {
  overflow-y: auto;
  height: 236px;
}
.links {
  margin-bottom: 30px;
  .link-item {
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding: 0 10px;
    width: 100%;
    line-height: 52px;
    border-radius: 4px;
    font-size: 14px;
    background: #f5f6f8;
    color: #697086;
    cursor: pointer;
  }
}

.charts .num :deep(.ant-statistic-content-value-int) {
  color: #6226ee;
}
.text-ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  white-space: nowrap;
}
</style>

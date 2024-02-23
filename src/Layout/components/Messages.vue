<script setup>
import { ref } from 'vue'
import { putMessageAPI, deleteMessageAPI } from '@/api/navbar'


const props = defineProps({
  messagesData: { type: Object, default: () => ({ read: [], unread: [] }) },
})
const emit = defineEmits(['getMessages'])

// 已读 read
// 未读 unread
let activeKey = ref('unread')

const putMessage = async (id) => {
  await putMessageAPI(id)
  emit('getMessages')
}
const deleteMessage = async (id) => {
  await deleteMessageAPI(id)
  emit('getMessages')
}
;
</script>

<template>
  <a-tabs v-model:activeKey="activeKey" style="min-width: 318px; max-width: 318px; max-height: 600px; overflow-y: auto; overflow-x: hidden;">
    <a-tab-pane key="unread">
      <template #tab>
        未读 <span class="text-base font-bold">{{ messagesData.unread.length }}</span> 条
      </template>
      <a-result status="404" title="" sub-title="暂无未读消息"  v-if="messagesData.unread.length === 0"/>
      <a-badge :dot="true" v-for="item in messagesData.unread" :key="item.id">
        <a-card size="small" style="width: 300px" class="mb-2 pr-1">
          <template #title>
            <a-tag color="red" v-if="item.type === 4">紧急</a-tag>
            <a-tag color="orange" v-if="item.type === 3">重要</a-tag>
            <a-tag color="cyan" v-if="item.type === 2">提示</a-tag>
            <a-tag color="green" v-if="item.type === 1">通知</a-tag>
            <a-tooltip title="标记为已读">
              <a-button type="text" shape="circle" @click="putMessage(item.id)"><CheckOutlined /></a-button>
            </a-tooltip>
          </template>
          <template #extra>
            <a-tooltip title="删除此消息">
              <a-button type="text" shape="circle" @click="deleteMessage(item.id)"><CloseOutlined /></a-button>
            </a-tooltip>
          </template>
          <div>
            <a-tooltip :title="item.content">
              <p class="ellipsis-3">{{ item.content }}</p>
            </a-tooltip>
            <div class="flex items-end flex-col mt-1 text-xs text-gray-400">
              <p>发送人：{{ item.sendUser.username }}</p>
              <p>{{ item.create_time }}</p>
            </div>
          </div>
        </a-card>
      </a-badge>
    </a-tab-pane>
    <a-tab-pane key="read">
      <template #tab>
        已读 <span class="text-base font-bold">{{ messagesData.read.length }}</span> 条
      </template>
      <a-result status="404" title="" sub-title="暂无已读消息"  v-if="messagesData.read.length === 0"/>
      <a-card size="small" v-for="item in messagesData.read" :key="item.id" class="mb-2">
        <template #title>
          <a-tag color="red" v-if="item.type === 4">紧急</a-tag>
          <a-tag color="orange" v-if="item.type === 3">重要</a-tag>
          <a-tag color="cyan" v-if="item.type === 2">提示</a-tag>
          <a-tag color="green" v-if="item.type === 1">通知</a-tag>
        </template>
        <template #extra>
          <a-tooltip title="删除此消息">
            <a-button type="text" shape="circle" @click="deleteMessage(item.id)"><CloseOutlined /></a-button>
          </a-tooltip>
        </template>
        <div>
          <a-tooltip :title="item.content">
            <p class="ellipsis-3">{{ item.content }}</p>
          </a-tooltip>
          <div class="flex items-end flex-col mt-1 text-xs text-gray-400">
            <p>发送人：{{ item.sendUser.username }}</p>
            <p>{{ item.update_time }}</p>
          </div>
        </div>
      </a-card>
    </a-tab-pane>
  </a-tabs>
</template>

<style lang="less" scoped>
.ellipsis-3{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

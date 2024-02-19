<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const backHome = () => {
  router.push('/')
}
;
</script>

<template>
  <a-result status="404" title="404" sub-title="您访问的页面不存在！">
    <template #extra>
      <a-button type="primary" @click="backHome">回到首页</a-button>
    </template>
  </a-result>
</template>
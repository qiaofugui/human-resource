import { defineStore } from 'pinia' // 引入定义状态仓库的工具
import { ref } from 'vue'
// 1.仓库的标识 2. 仓库的需要管理的状态
const useToken = defineStore('token', () => {
  // 回调函数  进行返回的状态就是要管理的状态
  const token = ref(null) // 需要在token变化的时候 通知组件
  // 修改token的方法
  const updateToken = (val) => token.value = val
  // 删除token的方法
  const removeToken = () => token.value = null

  return { token, updateToken, removeToken }
}, {
  persist: true // 可持久化的标记将数据持久化到前端缓存中
})

export default useToken
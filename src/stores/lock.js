import { defineStore } from 'pinia'
import { ref } from 'vue'

const useLock = defineStore('lock', () => {
  const isLock = ref(false)
  const password = ref('')

  const updateLock = (val) => isLock.value = val
  const updatePassword = (val) => password.value = val

  return { isLock, password, updateLock, updatePassword }
}, {
  persist: true
})

export default useLock
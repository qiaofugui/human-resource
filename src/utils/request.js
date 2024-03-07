import axios from 'axios'
import { message as Msg } from 'ant-design-vue'
import useToken from '@/stores/token'
import useLock from '@/stores/lock'
import useUserInfo from '@/stores/userInfo'
import router from '@/router'

const http = axios.create({
  // 初始化参数
  baseURL: '/api'
})

// 请求拦截器
http.interceptors.request.use(config => {
  const { token } = useToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
},
  (error) => Promise.reject(error)
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    const { success, message, data } = response.data // axios 默认加了一层data
    if (success) {
      // 表示执行成功
      return data
    }
    // 提示消息
    Msg.error(message)
    // 报错
    return Promise.reject(new Error(message))
  },
  (error) => {
    if (error.response?.status === 401) {
      // 此时说明token超时了，超时和没有token是没有任何区别的
      const { removeToken } = useToken()
      const lock = useLock()
      // 删除token
      removeToken()
      const { removeUserInfo } = useUserInfo()
      removeUserInfo()
      lock.updateLock(false)
      lock.updatePassword('')
      // 回到登录
      Msg.destroy()
      Msg.warning('登录过期，请重新登录！')
      router.push('/login')
    } else {
      Msg.destroy()
      Msg.warning(error.message)
    }
    return Promise.reject(error)
  }
)
export default http

import axios from 'axios'
import { message as Msg } from 'ant-design-vue'
import useToken from '@/stores/token'

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
  (error) => Promise.reject(error)
)
export default http

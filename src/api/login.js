// 封装一个登录请求的方法
// 接口地址
// 请求工具
import request from '@/utils/request'

// 登录接口
export function loginAPI (data) {
  // 要拿登录成功的数据
  return request({
    url: '/sys/login', // 请求地址
    method: 'post',
    data
    // 请求体参数 url参数 请求体参数 header body
  })
}

// 用户信息
export function getUserInfoAPI() {
  return request({
    url: '/sys/profile',
    method: 'get'
  })
}

// 用户基本信息
export function getUserBaseInfoAPI(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}
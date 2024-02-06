// 封装一个登录请求的方法
// 接口地址
// 请求工具
import request from '@/utils/request'
//提供方法
export function login (data) {
  // 要拿登录成功的数据
  return request({
    url: '/sys/login', // 请求地址
    method: 'post',
    data
    // 请求体参数 url参数 请求体参数 header body
  })
}

import request from '@/utils/request'

// 获取城市
export function getCityAPI () {
  return request({
    url: '/sys/city',
    method: 'get'
  })
}

// 获取社保列表
export function getSocialListAPI (data) {
  return request({
    url: '/social_securitys/list',
    method: 'post',
    data
  })
}
// 获取详情
export function getSocialDetailAPI (id) {
  return request({
    url: `/social_securitys/${id}`,
    method: 'get',
  })
}
// 获取某个城市社保基数

export function getSocialBaseAPI (id) {
  return request({
    url: `social_securitys/payment_item/${id}`,
    method: 'get'
  })
}
// 保存
export function putSocialAPI (id, data) {
  return request({
    url: `/social_securitys/${id}`,
    method: 'put',
    data
  })
}
import request from '@/utils/request'

// 获取薪水列表
export function getSalaryListAPI (params) {
  return request({
    url: '/salarys/list',
    method: 'get',
    params
  })
}
// 获取某个人的调整薪水
export function getSalaryAdjustDetailAPI (id) {
  return request({
    url: `/salarys/modify/${id}`,
    method: 'get'
  })
}
// 调整某个人的薪水
export function postSalaryAdjustAPI (id, data) {
  return request({
    url: `/salarys/modify/${id}`,
    method: 'post',
    data
  })
}
// 获取薪水设置
export function getSalarySettingsAPI () {
  return request({
    url: '/salarys/settings',
    method: 'get'
  })
}
// 保存薪水设置
export function postSalarySettingsAPI (data) {
  return request({
    url: '/salarys/settings',
    method: 'post',
    data
  })
}
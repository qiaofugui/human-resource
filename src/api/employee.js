
import request from '@/utils/request'

// 获取员工数据
export function getEmployeeAPI (params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}
// 群发通知
export function sendNoticeAPI (data) {
  return request({
    url: '/sys/messageMuch',
    method: 'post',
    data
  })
}
// 添加员工
export function postEmployeeAPI (data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}
// 删除员工
export function deleteEmployeeAPI (id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete',
  })
}
// 获取指定员工信息
export function getEmployeeInfoAPI (id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get',
  })
}
// 更新员工
export function putEmployeeAPI (data, id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'put',
    data
  })
}
// 获取角色列表
export function getRoleAPI () {
  return request({
    url: '/sys/role/list/enabled',
    method: 'get'
  })
}
// 更新角色信息
export function putRoleAPI (data) {
  return request({
    url: `/sys/user/assignRoles`,
    method: 'put',
    data
  })
}
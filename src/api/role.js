import request from '@/utils/request'

// 获取角色列表
export function getRoleAPI (params) {
  return request({
    url: '/sys/role',
    params
  })
}
// 添加角色
export function postRoleAPI (data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}
// 更新角色
export function putRoleAPI (data, id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'put',
    data
  })
}
// 删除角色
export function deleteRoleAPI (id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
// 获取权限树
export function getRolePermissionAPI () {
  return request({
    url: `sys/permission`,
  })
}
// 获取角色已拥有权限
export function getRoleHavePermissionAPI (id) {
  return request({
    url: `sys/role/${id}`,
  })
}
// 分配权限
export function putRolePermissionAPI (data) {
  return request({
    url: `sys/role/assignPrem`,
    method: 'put',
    data
  })
}
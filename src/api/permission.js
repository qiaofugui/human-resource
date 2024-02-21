import request from '@/utils/request'

// 获取权限
export function getPermissionAPI () {
  return request({
    url: '/sys/permission',
    method: 'get'
  })
}
// 添加权限
export function postPermissionAPI (data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}
// 删除权限
export function deletePermissionAPI (id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })
}
// 获取某个权限
export function getPermissionByIdAPI (id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'get'
  })
}
// 更新权限
export function putPermissionAPI (id, data) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'put',
    data
  })
}
import request from '@/utils/request'

// 获取组织
export function getDepartmentAPI () {
  return request({
    url: '/company/department',
  })
}
// 新增部门
export function postDepartmentAPI (data) {
  return request({
    url: '/company/department',
    method: 'post',
    data,
  })
}
// 更新部门
export function putDepartmentAPI (data, id) {
  return request({
    url: `/company/department/${id}`,
    method: 'put',
    data,
  })
}
// 删除部门
export function deleteDepartmentAPI (id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete',
  })
}
// 获取部门负责人
export function getDepartmentLeaderAPI () {
  return request({
    url: '/sys/user/simple',
  })
}
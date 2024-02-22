import request from '@/utils/request'

// 获取考勤数据
export function getAttendancesAPI (params) {
  return request({
    url: '/attendances',
    method: 'get',
    params
  })
}
// 获取可更改考勤方式的列表
export function getAttendancesListAPI (params) {
  return request({
    url: '/attendances/adtStatu/list',
    method: 'get',
    params
  })
}
// 修改考勤状态
export function putAttendancesAPI (id, data) {
  return request({
    url: `/attendances/${id}`,
    method: 'put',
    data
  })
}
// 获取某个部门的出勤时间
export function getAttendancesByDeptAPI (params) {
  return request({
    url: '/cfg/atte/item',
    method: 'get',
    params
  })
}
// 更改某个部门的出勤时间
export function putAttendancesByDeptAPI (data) {
  return request({
    url: '/cfg/atte',
    method: 'put',
    data
  })
}
// 获取某个部门的假期列表
export function getAttendancesByDeptHolidaysAPI (params) {
  return request({
    url: '/cfg/leave/list',
    method: 'get',
    params
  })
}
// 保存假期设置
export function postAttendancesByDeptHolidaysAPI (data) {
  return request({
    url: '/cfg/leave',
    method: 'post',
    data
  })
}
// 获取某个部门的扣款设置
export function getAttendancesByDeptDeductionsAPI (params) {
  return request({
    url: '/cfg/ded/list',
    method: 'get',
    params
  })
}
// 保存扣款设置
export function postAttendancesByDeptDeductionsAPI (data) {
  return request({
    url: '/cfg/deduction',
    method: 'post',
    data
  })
}
// 获取某个部门加班设置
export function getAttendancesByDeptOvertimeAPI (params) {
  return request({
    url: '/cfg/extDuty/item',
    method: 'get',
    params
  })
}
// 保存加班规则
export function putAttendancesByDeptOvertimeAPI (data) {
  return request({
    url: '/cfg/extDuty',
    method: 'put',
    data
  })
}
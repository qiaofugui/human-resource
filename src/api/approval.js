import request from '@/utils/request'

// 获取审批数据
export function getApprovalDataAPI () {
  return request({
    url: '/user/process/instance/1/100',
    method: 'get',
  })
}
// 获取审批详情
export function getApprovalDetailAPI (id) {
  return request({
    url: `/user/process/instance/${id}`,
    method: 'get',
  })
}
// 获取审批任务
export function getApprovalTaskAPI (id) {
  return request({
    url: `/user/process/instance/tasks/detail/${id}`,
    method: 'get',
  })
}
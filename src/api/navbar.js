import request from '@/utils/request'

// 获取通知消息
export function getMessageAPI () {
  return request({
    url: '/sys/message',
  })
}
// 修改消息为已读
export function putMessageAPI (id) {
  return request({
    url: `/sys/message/${id}`,
    method: 'put',
    // data: id
  })
}
// 删除消息
export function deleteMessageAPI (id) {
  return request({
    url: `/sys/message/${id}`,
    method: 'delete',
    // data: id
  })
}
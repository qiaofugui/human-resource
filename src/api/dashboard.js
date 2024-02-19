import request from '@/utils/request'

// 获取首页信息
export function getHomeDataAPI () {
  return request({
    url: '/home/data',
  })
}
// 获取公告信息
export function getNoticeAPI () {
  return request({
    url: '/home/notice',
  })
}

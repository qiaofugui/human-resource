export default {
  path: '/attendance',
  name: 'attendance',
  component: () => import('@/views/Attendance/index.vue'),
  meta: {
    title: '考勤',
    icon: 'FundViewOutlined',
    hidden: false
  }
}

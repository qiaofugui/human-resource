export default {
  path: '/approval',
  name: 'approval',
  component: () => import('@/views/Approval/index.vue'),
  meta: {
    title: '审批',
    icon: 'AuditOutlined',
    hidden: false
  }
}

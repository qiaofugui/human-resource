export default {
  path: '/employee',
  name: 'employee',
  component: () => import('@/views/Employee/index.vue'),
  meta: {
    title: '员工',
    icon: 'TeamOutlined',
    hidden: false
  }
}

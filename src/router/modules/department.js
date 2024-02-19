export default {
  path: '/department',
  name: 'department',
  component: () => import('@/views/Department/index.vue'),
  meta: {
    title: '组织',
    icon: 'ApartmentOutlined',
    hidden: false
  }
}

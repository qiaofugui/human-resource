export default {
  path: '/role',
  name: 'role',
  component: () => import('@/views/Role/index.vue'),
  meta: {
    title: '角色',
    icon: 'PartitionOutlined',
    hidden: false
  }
}

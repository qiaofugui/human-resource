export default {
  path: '/permission',
  name: 'permission',
  component: () => import('@/views/Permission/index.vue'),
  meta: {
    title: '权限',
    icon: 'LockOutlined',
    hidden: false
  }
}

export default {
  path: '/salary',
  name: 'salary',
  component: () => import('@/views/Salary/index.vue'),
  meta: {
    title: '薪水',
    icon: 'TransactionOutlined',
    hidden: false
  }
}

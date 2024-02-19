// import Layout from '@/Layout/index.vue'
// export default {
//   path: '/employee',
//   name: 'employee',
//   component: Layout,
//   children: [{
//     path: '',
//     name: 'employee',
//     component: () => import('@/views/Employee/index.vue'),
//     meta: {
//       title: '员工',
//       icon: 'TeamOutlined'
//     }
//   }, {
//     path: '/employee/detail/:id',
//     name: 'employeeDetail',
//     component: () => import('@/views/Employee/Detail.vue'),
//     hidden: true,
//     meta: {
//       title: '员工详情'
//     }
//   }]
// }

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

import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/Layout/index.vue'

import departmentRouter from './modules/department'
import approvalRouter from './modules/approval'
import attendanceRouter from './modules/attendance'
import employeeRouter from './modules/employee'
import permissionRouter from './modules/permission'
import roleRouter from './modules/role'
import salaryRouter from './modules/salary'
import socialRouter from './modules/social'

const router = createRouter({
  // TODO 上线问题
  // 使用createWebHistory路由模式需要在Nginx修改配置文件
  // 刷新后，浏览器根据当前的url去请求html文件，但是SPA只有一个html文件，所以需要在nginx.conf的对应location里配置一行代码 "try_files $uri  $uri/ /index.html;"
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/index.vue'),
      meta: {
        title: '登录',
        icon: '',
        hidden: true
      }
    },
    {
      path: '/404',
      name: 'notfound',
      component: () => import('@/views/NotFound/index.vue'),
      meta: {
        title: '404',
        icon: '',
        hidden: true
      }
    },
    {
      path: '/',
      redirect: '/dashboard',
      name: 'layout',
      component: Layout,
      meta: {
        title: 'Layout',
        icon: '',
        hidden: true
      },
      // 子节点
      children: [
        {
          path: 'dashboard', // 二级路由的地址
          name: 'dashboard',
          component: () => import('@/views/Dashboard/index.vue'),
          // 路由元信息
          meta: {
            title: '首页',
            icon: 'HomeOutlined',
            hidden: false
          }
        },
      ]
    },

    // 在异步路由中添加，确保在最后一个
    // {
    //   path: '/:pathMatch(.*)*', // vue-router 通配符
    //   redirect: '/404',
    //   meta: {
    //     title: '404',
    //     icon: '',
    //     hidden: true
    //   }
    // }
  ]
})

// 动态路由
export const asyncRoutes = [
  departmentRouter,
  roleRouter,
  employeeRouter,
  permissionRouter,
  attendanceRouter,
  approvalRouter,
  salaryRouter,
  socialRouter
]

export default router

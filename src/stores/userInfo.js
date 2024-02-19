import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { asyncRoutes } from '@/router'

const useUserInfo = defineStore('userInfo', () => {
  const router = useRouter()

  const userInfo = ref(null)
  const updateUserInfo = (val) => userInfo.value = val
  const removeUserInfo = () => {
    userInfo.value = null
    routes.value = null
  }

  const collapsed = ref(false)
  const toggleCollapsed = (val) => {
    collapsed.value = !collapsed.value
  }

  const routes = ref(null)
  // 动态添加路由
  const addAuthorizedRoutes = () => {
    const { roles: { menus } } = userInfo.value
    const filterRoutes = asyncRoutes.filter(item => {
      return menus.includes(item.name)
    })
    filterRoutes.forEach(route => {
      if(!router.hasRoute(route.name)) {
        router.addRoute('layout', route)
      }
    })
    // 处理没有权限的路由导向404
    if(!router.hasRoute('notfound')) {
      router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/404', hidden: true })
    }

    routes.value = router.getRoutes().filter((item) => !item.meta.hidden)
  }

  return { userInfo, updateUserInfo, removeUserInfo, collapsed, toggleCollapsed, routes, addAuthorizedRoutes }
}, {
  persist: true
})

export default useUserInfo
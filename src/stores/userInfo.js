import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { asyncRoutes } from '@/router'
import throttle from 'lodash/throttle'
import useToken from '@/stores/token'

const useUserInfo = defineStore('userInfo', () => {
  const router = useRouter()

  const userInfo = ref(null)
  const updateUserInfo = (val) => userInfo.value = val
  const updateUserInfoSingle = (key, val) => {
    userInfo.value[key] = val
  }
  const removeUserInfo = () => {
    userInfo.value = null
    routes.value = null
    hasRoles.value = true
  }

  const collapsed = ref(false)
  const toggleCollapsed = (val) => {
    collapsed.value = !collapsed.value
  }

  const routes = ref(null)
  let hasRoles = ref(true)  // 创建了一个状态位，来判断是否是第一次进入
  const updateHasRoles = (val) => hasRoles.value = val
  // 动态添加路由
  const addAuthorizedRoutes = () => {
    try {
      const { roles: { menus } } = userInfo.value
      const filterRoutes = asyncRoutes.filter(item => {
        return menus.includes(item.name)
      })
      filterRoutes.forEach(route => {
        if (!router.hasRoute(route.name)) {
          router.addRoute('layout', route)
        }
      })
      // 处理没有权限的路由导向404
      router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/404', meta: { title: '404', icon: '', hidden: true } })

      routes.value = router.getRoutes().filter((item) => !item.meta.hidden)
    } catch (error) {
      // 数据不完整，重新登录
      removeUserInfo()
      useToken().removeToken()
      router.push('/login')
    }
  }

  // 刷新
  const refresh = ref(true)
  const toggleRefresh = throttle(() => {
    refresh.value = false
    setTimeout(() => {
      refresh.value = true
    }, 360)
  }, 3000)

  return { userInfo, updateUserInfo, removeUserInfo, collapsed, toggleCollapsed, routes, hasRoles, updateHasRoles, addAuthorizedRoutes, refresh, toggleRefresh, updateUserInfoSingle }
}, {
  persist: {
    paths: ['userInfo', 'collapsed'],
  }
})

export default useUserInfo
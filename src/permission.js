// 权限控制
import router from '@/router'
import useToken from '@/stores/token'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css' // 引入进度条样式
// import { useRouter } from 'vue-router' 这个方法只能用在组件中

// 进度条个性化配置
nprogress.configure({
  easing: 'ease',  // 动画方式
  speed: 500,  // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})

// 前置导航守卫
// 只要是路由发生跳转-就会执行- 跳转之前执行
// to 到哪里去
// from 从哪里来
// next 必须执行的一个函数

const whiteList = ['/login', '/404'] // 登录页 404 白名单
router.beforeEach((to, from, next) => {
  nprogress.start() // 开启进度条
  const { token } = useToken()
  if (token) {
    // 有 token 的情况下
    if (to.path === '/login') {
      // 就是登录页
      next('/') // 跳转到主页
    } else {
      next() // 放行的意思
    }
  } else {
    // 没有 token 的情况下
    if (whiteList.includes(to.path)) {
      // 在白名单中 直接放行
      next()
    } else {
      next('/login')
    }
  }
})

// 后置导航守卫
router.afterEach(() => nprogress.done()) // 关闭进度条

import Vue from 'vue'
import VueRouter from 'vue-router'
import TreeLogin from '@/components/login/TreeLogin.vue'
import TreeHomepage from '@/components/home/TreeHomepage.vue'
import TreeEmpty from '@/components/error/TreeEmpty.vue'
import TreeGraph from '@/components/graph/graph.vue'

Vue.use(VueRouter)

const Routers = [
  // 已知路径的跳转
  {
    path: '*',
    redirect: '/empty'
  },
  {
    path: '/',
    redirect: '/login'
  },
  // 组件路径注册
  {
    path: '/login',
    meta: {
      title: '登陆-家谱系统(FTS)'
    },
    name: 'TreeLogin',
    component: TreeLogin
  },
  {
    path: '/homepage/:nickName',
    meta: {
      title: '个人首页-家谱系统(FTS)'
    },
    name: 'TreeHomepage',
    component: TreeHomepage
  },
  {
    path: '/empty',
    meta: {
      title: '家谱系统(FTS)'
    },
    name: 'TreeEmpty',
    component: TreeEmpty
  },
  {
    path: '/tree/:genealogy',
    meta: {
      title: '家谱-家谱系统(FTS)'
    },
    name: 'TreeGraph',
    component: TreeGraph
  }
]

const RouterConfig = {
  mode: 'hash',
  routes: Routers
}

const router = new VueRouter(RouterConfig)
router.beforeEach((to, from, next) => {
  /* to: 即将要进入的目标的路由对象
  from: 当前导航即将要离开的路由对象
  next: 调用该方法后才能进入下一个钩子 */
  window.document.title = to.meta.title
  next()
})
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

export default router

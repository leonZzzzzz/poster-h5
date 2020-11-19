export default [
  // {
  //   path: '/sidebar-dev/speechcraft',
  //   component: () => import('@/views/sidebar-dev/speechCraft')
  // },
  // {
  //   path: '/sidebar-dev/customerInfo',
  //   component: () => import('@/views/sidebar-dev/customerInfo')
  // },
  // 客户画像-客户标签编辑
  // {
  //   path: '/',
  //   redirect: '/sidebar/login',
  //   component: () => import(/* webpackChunkName: "scrm" */ '@/views/sidebar-dev/login')
  // },
  {
    path: '/',
    redirect: '/sidebar/speechcraft',
    component: () => import(/* webpackChunkName: "sidebar" */ '@/views/sidebar-dev/speechCraft')
  },
  // 登录页
  {
    path: '/sidebar/login',
    component: () => import(/* webpackChunkName: "sidebar" */ '@/views/sidebar-dev/login')
  },
  // 海报
  {
    path: '/sidebar/speechcraft',
    component: () => import(/* webpackChunkName: "sidebar" */ '@/views/sidebar-dev/speechCraft')
  },
  {
    path: '/sidebar/makePoster',
    component: () => import(/* webpackChunkName: "sidebar" */ '@/views/sidebar-dev/makePoster')
  },

]
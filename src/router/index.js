import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path*',
  //       component: () => import('@/views/redirect/index')
  //     }
  //   ]
  // },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  // 商城
  {
    path: '/mall-management',
    component: Layout,
    name: 'mall-management',
    meta: { title: '商城管理', icon: 'documentation', affix: true },
    children: [
      {
        path: 'powerpoint',
        component: () => import('@/views/mall-management/powerpoint'),
        name: 'powerpoint',
        meta: { title: '首页幻灯片' }
      },
      {
        path: 'nxdyigate',
        component: () => import('@/views/mall-management/nxdyigate'),
        name: 'nxdyigate',
        meta: { title: '导航图标' }
      },
      {
        path: 'advertising-space',
        component: () => import('@/views/mall-management/advertising-space'),
        name: 'advertising-space',
        meta: { title: '广告位' }
      },
      {
        path: 'parameters',
        component: () => import('@/views/mall-management/parameters'),
        name: 'parameters',
        meta: { title: '商品推荐' }
      }
    ]
  },
  // 商品管理
  {
    path: '/product-management',
    component: Layout,
    redirect: '/product-management',
    name: 'product-management',
    meta: {
      title: '商品管理',
      icon: 'excel'
    },
    children: [
      {
        path: 'product-table',
        component: () => import('@/views/product-management/product-table'),
        name: 'product-table',
        meta: { title: '商品列表' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/product-management/product-table'),
        name: 'MergeHeader',
        meta: { title: '回收站' }
      },
      {
        path: 'goods-category',
        component: () => import('@/views/product-management/goods-category'),
        name: 'goods-category',
        meta: { title: '商品分类' }
      }
    ]
  },
  // 会员管理
  {
    path: '/member',
    component: Layout,
    redirect: '/member',
    name: 'member',
    meta: {
      title: '会员管理',
      icon: 'excel'
    },
    children: [
      {
        path: 'membership-details',
        component: () => import('@/views/member/membership-details'),
        name: 'membership-details',
        meta: { title: '会员详情' }
      }
    ]
  },
  // 订单
  // 金行
  // 财务
  // 设置
  {
    path: '/setting',
    component: Layout,
    redirect: 'noredirect',
    name: 'setting',
    meta: {
      title: '设置',
      icon: 'excel'
    },
    children: [
      {
        path: 'mall-setting',
        component: () => import('@/views/setting/mall-setting'),
        name: 'mall-setting',
        meta: { title: '商城设置' }
      },
      {
        path: 'trade-setting',
        component: () => import('@/views/setting/trade-setting'),
        name: 'trade-setting',
        meta: { title: '交易设置' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

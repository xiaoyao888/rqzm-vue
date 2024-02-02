import {createRouter,createWebHistory} from 'vue-router'



/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    /*{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index')
            }
        ]
    },*/
    // {
    //     path: '/login',
    //     component: () => import('@/views/login/index'),
    //     hidden: true
    // },
    // {
    //     path: '/desktop',
    //     component: () => import('@/views/desktop/desktop'),
    //     hidden: true
    // },
    {
        path: '/',
        component: () => import('@/views/desktop/desktop'),
        hidden: true
    },
    {
        path: '/drag',
        component: () => import('@/views/desktop/drag'),
        hidden: true
    },
    {
        path: '/muyu',
        component: () => import('@/views/muyu/muyu'),
        hidden: true
    },
    // {
    //   path: '/auth-redirect',
    //   component: () => import('@/views/login/auth-redirect'),
    //   hidden: true
    // },
    {
        path: '/404',
        component: () => import('@/views/errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/errorPage/401'),
        hidden: true
    },
    // {
    //   path: '/',
    //   component: Layout,
    //   redirect: '/dashboard',
    //   children: [
    //     {
    //       path: 'dashboard',
    //       component: () => import('@/views/dashboard/index'),
    //       name: 'Dashboard',
    //       meta: { title: '人气桌面', icon: 'dashboard', affix: true }
    //     }
    //   ]
    // },

    // {
    //     path: '/userInfo',
    //     component: Layout,
    //     children: [
    //         {
    //             path: 'index',
    //             component: () => import('@/views/userInfo/index'),
    //             name: 'userInfo',
    //             meta: { title: '用户管理', icon: 'documentation' }
    //         }
    //     ]
    // }
    /* {
      path: '/article',
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import('@/views/article/index'),
          name: 'article',
          meta: { title: '文章管理', icon: 'documentation' }
        }
      ]
    }*/

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
    // {
    //   path: '/error',
    //   component: Layout,
    //   redirect: 'noRedirect',
    //   name: 'ErrorPages',
    //   meta: {
    //     title: 'Error Pages',
    //     icon: '404'
    //   },
    //   children: [
    //     {
    //       path: '401',
    //       component: () => import('@/views/error-page/401'),
    //       name: 'Page401',
    //       meta: { title: '401', noCache: true }
    //     },
    //     {
    //       path: '404',
    //       component: () => import('@/views/error-page/404'),
    //       name: 'Page404',
    //       meta: { title: '404', noCache: true }
    //     }
    //   ]
    // },
    //
    // {
    //   path: '/error-log',
    //   component: Layout,
    //   children: [
    //     {
    //       path: 'log',
    //       component: () => import('@/views/error-log/index'),
    //       name: 'ErrorLog',
    //       meta: { title: 'Error Log', icon: 'bug' }
    //     }
    //   ]
    // },

    // {
    //   path: '/theme',
    //   component: Layout,
    //   children: [
    //     {
    //       path: 'index',
    //       component: () => import('@/views/theme/index'),
    //       name: 'Theme',
    //       meta: { title: 'Theme', icon: 'theme' }
    //     }
    //   ]
    // },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const router = createRouter({
    history: createWebHistory(), // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

export function resetRouter() {
    const newRouter = createRouter({
        history: createWebHistory(), // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes
    })
    router.matcher = newRouter.matcher // reset router
}

export default router

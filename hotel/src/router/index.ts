import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（比如浏览器前进后退），使用保存的位置
    if (savedPosition) {
      return savedPosition
    }
    // 如果有锚点，滚动到锚点
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // 默认滚动到页面顶部
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/tea-culture',
      name: 'tea-culture',
      component: () => import('../views/TeaCultureView.vue'),
    },
    {
      path: '/tea-experience-booking',
      name: 'tea-experience-booking',
      component: () => import('../views/TeaExperienceBookingView.vue'),
    },

    {
      path: '/surrounding-products',
      name: 'surrounding-products',
      component: () => import('../views/SurroundingProductsView.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/user/ProductsView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/homestay-activities',
      name: 'homestay-activities',
      component: () => import('../views/HomestayActivitiesView.vue'),
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: () => import('../views/ProductDetailView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/edit-profile',
      name: 'edit-profile',
      component: () => import('../views/EditProfileView.vue'),
      meta: { requiresAuth: true, role: 'user' }
    },
    // 用户页面
    {
      path: '/ai-rooms',
      name: 'ai-rooms',
      component: () => import('../views/user/AIRoomSelectionView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/ai-room-selection',
      name: 'ai-room-selection',
      component: () => import('../views/user/AIRoomSelectionView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/room-type/:roomType',
      name: 'room-type-detail',
      component: () => import('../views/user/RoomTypeDetailView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/rooms',
      name: 'rooms',
      redirect: '/ai-rooms'
    },
    {
      path: '/room/:id',
      name: 'room-detail',
      component: () => import('../views/user/RoomDetailView.vue'),
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/book/:id',
      name: 'booking',
      component: () => import('../views/user/BookingView.vue'),
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/user/OrdersView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/order/:id',
      name: 'order-detail',
      component: () => import('../views/user/OrderDetailView.vue'),
      meta: { requiresAuth: true, role: 'user' }
    },
    // 管理员登录页面
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/admin/AdminLoginView.vue'),
      meta: { requiresAuth: false }
    },
    // 管理员调试页面
    {
      path: '/admin/debug',
      name: 'admin-debug',
      component: () => import('../views/admin/AdminDebugView.vue'),
      meta: { requiresAuth: false }
    },



    // 管理员后台页面
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/dashboard'
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('../views/admin/AdminDashboardView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/simple',
      name: 'admin-simple',
      component: () => import('../views/admin/AdminDashboardSimple.vue'),
      meta: { requiresAuth: false }
    },
  ],
})

/* // 路由守卫
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  console.log('路由守卫:', {
    to: to.path,
    from: from.path,
    isAuthenticated: auth.isAuthenticated,
    userRole: auth.userRole,
    requiresAuth: to.meta.requiresAuth,
    requiredRole: to.meta.role
  })

  // 如果路由需要认证
  if (to.meta.requiresAuth) {
    // 检查是否已登录
    if (!auth.isAuthenticated) {
      console.log('未登录，重定向到登录页')
      next('/login')
      return
    }

    // 检查角色权限
    if (to.meta.role && auth.userRole !== to.meta.role) {
      console.log('角色不匹配:', { userRole: auth.userRole, requiredRole: to.meta.role })
      // 如果是管理员访问用户页面，重定向到管理员首页
      if (auth.userRole === 'admin' && to.meta.role === 'user') {
        console.log('管理员访问用户页面，重定向到管理员首页')
        next('/admin/dashboard')
        return
      }
      // 如果是用户访问管理员页面，重定向到用户首页
      if (auth.userRole === 'user' && to.meta.role === 'admin') {
        console.log('用户访问管理员页面，重定向到用户首页')
        next('/ai-rooms')
        return
      }
      // 其他情况重定向到登录页
      console.log('其他角色不匹配情况，重定向到登录页')
      next('/login')
      return
    }
  }

  // 如果已登录用户访问登录页，重定向到对应首页
  if (to.path === '/login' && auth.isAuthenticated) {
    console.log('已登录用户访问登录页，重定向')
    if (auth.userRole === 'admin') {
      next('/admin/dashboard')
    } else {
      next('/ai-rooms')
    }
    return
  }

  console.log('路由守卫通过，继续导航')
  next()
}) */

export default router
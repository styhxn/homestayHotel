import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const userRole = ref<'user' | 'admin' | null>(null)
  const menuList = ref<any[]>([])
  const user = ref<{
    id?: number
    username?: string
    email: string
    name?: string
    token: string
    avatar?: string
    realName?: string
    idCard?: string
    phone?: string
    gender?: string
    create_time?: string
    update_time?: string
    login_time?: string
    remark?: string
    total?: number
    status?: number
  } | null>(null)

  function login(
    email: string,
    token: string,
    name?: string,
    phone?: string,
    gender?: string,
    idCard?: string,
    avatar?: string,
    total?: number,
    username?: string,
    realName?: string
  ) {
    isAuthenticated.value = true
    user.value = {
      email,
      token,
      name,
      phone,
      gender,
      idCard,
      avatar,
      total,
      username,
      realName
    }
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user.value))

    // 登录成功后初始化用户相关数据
    initializeUserStores()
  }

  function setUserRole(role: 'user' | 'admin', menus?: any[]) {
    userRole.value = role
    if (menus) {
      menuList.value = menus
    }
    localStorage.setItem('userRole', role)
    if (menus) {
      localStorage.setItem('menuList', JSON.stringify(menus))
    }
  }

  async function logout() {
    console.log('🚪 开始用户登出流程...')

    // 清理其他store的用户数据
    await clearUserStores()

    isAuthenticated.value = false
    user.value = null
    userRole.value = null
    menuList.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    localStorage.removeItem('menuList')

    console.log('✅ 用户登出完成')
  }

  // 清理用户相关的store数据
  async function clearUserStores() {
    try {
      console.log('🧹 开始清理用户数据...')

      // 清理购物车数据
      const { useCartStore } = await import('./cart')
      const cartStore = useCartStore()
      cartStore.clearUserData()
      console.log('✅ 购物车数据已清理')

      // 清理聊天记录数据
      const { useChatHistoryStore } = await import('./chatHistory')
      const chatStore = useChatHistoryStore()
      chatStore.onUserLogout()
      console.log('✅ 聊天记录已清理')

    } catch (error) {
      console.error('❌ 清理用户数据失败:', error)
    }
  }

  // 初始化用户相关的store数据
  function initializeUserStores() {
    try {
      // 动态导入避免循环依赖
      import('./cart').then(({ useCartStore }) => {
        const cartStore = useCartStore()
        cartStore.initializeUserData()
      })

      import('./chatHistory').then(({ useChatHistoryStore }) => {
        const chatStore = useChatHistoryStore()
        chatStore.initializeUserData()
      })
    } catch (error) {
      console.error('初始化用户数据失败:', error)
    }
  }

  function initialize() {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole') as 'user' | 'admin' | null
    const menus = localStorage.getItem('menuList')
    const userData = localStorage.getItem('user')

    if (token) {
      isAuthenticated.value = true
      userRole.value = role
      if (userData) {
        try {
          user.value = JSON.parse(userData)
        } catch (error) {
          console.error('解析用户数据失败:', error)
        }
      }
      if (menus) {
        menuList.value = JSON.parse(menus)
      }
      // 验证Token是否仍然有效
      validateToken()
    }
  }

  async function validateToken() {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch('http://localhost:8091/h/user/getUserInfo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'satoken': token
        }
      })

      if (response.status !== 200) {
        console.log('Token验证失败，清除登录状态')
        logout()
      }
    } catch (error) {
      console.error('Token验证错误:', error)
      logout()
    }
  }

  return {
    isAuthenticated,
    user,
    userRole,
    menuList,
    login,
    setUserRole,
    logout,
    initialize,
    validateToken
  }
})
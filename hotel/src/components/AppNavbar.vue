<template>
  <nav class="app-navbar">
    <div class="nav-container">
      <!-- Logo -->
      <div class="logo" @click="router.push('/')">
        <img src="@/assets/images/logo.png" width="60" height="60"/>
        普洱蘑菇庄园民宿
      </div>

      <!-- 导航菜单 -->
      <div class="nav-menu">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
          首页
        </router-link>
        <a @click="handleNavClick('/tea-culture')" class="nav-link" :class="{ active: $route.path === '/tea-culture' }">
          茶文化
        </a>

        <a @click="handleNavClick('/surrounding-products')" class="nav-link" :class="{ active: $route.path === '/surrounding-products' }">
          周边产品
        </a>
        <a @click="handleNavClick('/homestay-activities')" class="nav-link" :class="{ active: $route.path === '/homestay-activities' }">
          庄园活动
        </a>
        <a @click="handleNavClick('/ai-rooms')" class="nav-link" :class="{ active: $route.path === '/ai-rooms' }">
          AI选房
        </a>
        <router-link
          v-if="auth.isAuthenticated"
          to="/orders"
          class="nav-link"
          :class="{ active: $route.path === '/orders' }"
        >
          我的订单
        </router-link>
        <router-link 
          v-if="auth.isAuthenticated" 
          to="/profile" 
          class="nav-link" 
          :class="{ active: $route.path === '/profile' || $route.path === '/edit-profile' }"
        >
          个人信息
        </router-link>
      </div>

      <!-- 右侧按钮区域 -->
      <div class="nav-buttons">
        <template v-if="auth.isAuthenticated">
          <!-- 已登录状态 -->
          <div class="user-info">
            <button @click="handleLogout" class="btn btn-outline">
              <i class="fas fa-right-from-bracket"></i>
              退出登录
            </button>
          </div>
        </template>
        <template v-else>
          <!-- 未登录状态 -->
          <div class="auth-buttons">
            <router-link to="/login" class="btn btn-outline">
              <i class="fas fa-right-to-bracket"></i>
              登录
            </router-link>
            <router-link to="/register" class="btn btn-primary">
              <i class="fas fa-user-plus"></i>
              注册
            </router-link>
          </div>
        </template>
      </div>

      <!-- 移动端菜单按钮 -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <i class="fas fa-bars"></i>
      </button>
    </div>

    <!-- 移动端菜单 -->
    <div class="mobile-menu" :class="{ active: showMobileMenu }">
      <div class="mobile-menu-content">
        <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
          <i class="fas fa-home"></i>
          首页
        </router-link>
        <a @click="handleMobileNavClick('/tea-culture')" class="mobile-nav-link">
          <i class="fas fa-leaf"></i>
          茶文化
        </a>

        <a @click="handleMobileNavClick('/surrounding-products')" class="mobile-nav-link">
          <i class="fas fa-gift"></i>
          周边产品
        </a>
        <a @click="handleMobileNavClick('/homestay-activities')" class="mobile-nav-link">
          <i class="fas fa-calendar-alt"></i>
          庄园活动
        </a>
        <a @click="handleMobileNavClick('/ai-rooms')" class="mobile-nav-link">
          <i class="fas fa-robot"></i>
          AI选房
        </a>
        
        <template v-if="auth.isAuthenticated">
          <router-link to="/orders" class="mobile-nav-link" @click="closeMobileMenu">
            <i class="fas fa-clipboard-list"></i>
            我的订单
          </router-link>
          <router-link to="/profile" class="mobile-nav-link" @click="closeMobileMenu">
            <i class="fas fa-user"></i>
            个人信息
          </router-link>
          <div class="mobile-user-info">
            <button @click="handleLogout" class="mobile-logout-btn">
              <i class="fas fa-right-from-bracket"></i>
              退出登录
            </button>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="mobile-nav-link" @click="closeMobileMenu">
            <i class="fas fa-right-to-bracket"></i>
            登录
          </router-link>
          <router-link to="/register" class="mobile-nav-link" @click="closeMobileMenu">
            <i class="fas fa-user-plus"></i>
            注册
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { notifySuccess } from '../utils/notification'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

// 移动端菜单状态
const showMobileMenu = ref(false)

// 计算显示的用户名
const displayUserName = computed(() => {
  if (!auth.user) return '用户'
  
  // 优先显示真实姓名，然后是用户名，最后是邮箱的用户名部分
  if (auth.user.realName) return auth.user.realName
  if (auth.user.name) return auth.user.name
  if (auth.user.username) return auth.user.username
  if (auth.user.email) {
    // 从邮箱中提取用户名部分
    return auth.user.email.split('@')[0]
  }
  return '用户'
})

// 切换移动端菜单
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// 处理导航点击（桌面端）- 移除拦截，直接跳转
const handleNavClick = (path: string) => {
  router.push(path)
}

// 处理移动端导航点击 - 移除拦截，直接跳转
const handleMobileNavClick = (path: string) => {
  closeMobileMenu()
  router.push(path)
}

// 处理退出登录
const handleLogout = () => {
  auth.logout()
  notifySuccess('退出成功', '您已安全退出登录')
  closeMobileMenu()
  router.push('/')
}
</script>

<style scoped>
/* 导航栏主体 */
.app-navbar {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  position: relative;
}

/* Logo */
.logo {
  font-size: 1.6rem;
  font-weight: 700;
  background: linear-gradient(to bottom, #a7ca87 0%, #0cd398 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 12px;
  min-width: fit-content;
  flex-shrink: 0;
}


.logo img {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logo:hover img {
  transform: scale(1.05);
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  gap: 24px;
  align-items: center;
  flex: 1;
  justify-content: center;
  margin: 0 40px;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  font-size: 15px;
  white-space: nowrap;
  min-width: fit-content;
}

.nav-link:hover {
  color: #d4af37;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
}

.nav-link.active {
  color: #9eb98b;
  background: linear-gradient(135deg, rgba(158, 185, 139, 0.15) 0%, rgba(158, 185, 139, 0.08) 100%);
  box-shadow: 0 2px 8px rgba(158, 185, 139, 0.3);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: linear-gradient(90deg, #9eb98b 0%, #7e9e68 100%);
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(212, 175, 55, 0.4);
}

/* 右侧按钮区域 */
.nav-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  min-width: fit-content;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.02) 100%);
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.user-welcome {
  color: #4b5563;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
}

.auth-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
  transition: left 0.6s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn-outline {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%);
  color: #4b5563;
  border: 1px solid rgba(209, 213, 219, 0.8);
  backdrop-filter: blur(10px);
}

.btn-outline:hover {
  background: linear-gradient(135deg, rgba(249, 250, 251, 0.9) 0%, rgba(243, 244, 246, 0.9) 100%);
  border-color: #9ca3af;
  color: #374151;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  color: white;
  border: 1px solid #d4af37;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #b8941f 0%, #9a7b1a 100%);
  border-color: #b8941f;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4);
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #4b5563;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
}

/* 移动端菜单 */
.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.mobile-menu.active {
  transform: translateY(0);
  opacity: 1;
}

.mobile-menu-content {
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: rgba(158, 185, 139, 0.1);
  color: #9eb98b;
}

.mobile-user-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.mobile-user-welcome {
  display: block;
  color: #4b5563;
  font-weight: 500;
  margin-bottom: 12px;
  padding: 0 16px;
}

.mobile-logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-logout-btn:hover {
  background: #dc2626;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .nav-menu {
    gap: 16px;
    margin: 0 20px;
  }

  .nav-link {
    padding: 8px 12px;
    font-size: 14px;
  }

  .btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}

@media (max-width: 1024px) {
  .nav-container {
    padding: 0 20px;
  }

  .nav-menu {
    gap: 12px;
    margin: 0 16px;
  }

  .nav-link {
    padding: 6px 10px;
    font-size: 13px;
  }

  .user-welcome {
    display: none;
  }
}

@media (max-width: 900px) {
  .nav-container {
    padding: 0 16px;
  }

  .nav-menu,
  .nav-buttons {
    display: none;
  }

  .mobile-menu-btn,
  .mobile-menu {
    display: block;
  }

  .logo {
    font-size: 1.4rem;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }

  .logo {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 12px;
    height: 60px;
  }

  .logo {
    font-size: 1.2rem;
  }

  .logo img {
    width: 50px;
    height: 50px;
  }
}
</style>

<script lang="ts">
export default {
  name: 'AppNavbar'
}
</script>

<template>
  <nav class="modern-navbar">
    <div class="nav-container">
      <!-- Logo 区域 -->
      <div class="logo-section" @click="router.push('/')">
        <div class="logo-wrapper">
          <img src="@/assets/images/logo.png" alt="普洱蘑菇庄园民宿" class="logo-image"/>
          <div class="logo-text">
            <span class="logo-title">普洱蘑菇庄园</span>
            <span class="logo-subtitle">生态民宿</span>
          </div>
        </div>
      </div>

      <!-- 主导航菜单 -->
      <div class="nav-menu">
        <router-link 
          to="/" 
          class="nav-link" 
          :class="{ active: $route.path === '/' }"
        >
          <i class="fas fa-home nav-icon"></i>
          <span>首页</span>
        </router-link>
        
        <a 
          @click="handleNavClick('/tea-culture')" 
          class="nav-link" 
          :class="{ active: $route.path === '/tea-culture' }"
        >
          <i class="fas fa-leaf nav-icon"></i>
          <span>茶文化</span>
        </a>

        <a 
          @click="handleNavClick('/surrounding-products')" 
          class="nav-link" 
          :class="{ active: $route.path === '/surrounding-products' }"
        >
          <i class="fas fa-gift nav-icon"></i>
          <span>周边产品</span>
        </a>
        
        <a 
          @click="handleNavClick('/homestay-activities')" 
          class="nav-link" 
          :class="{ active: $route.path === '/homestay-activities' }"
        >
          <i class="fas fa-calendar-alt nav-icon"></i>
          <span>庄园活动</span>
        </a>
        
        <a 
          @click="handleNavClick('/ai-rooms')" 
          class="nav-link nav-link-special" 
          :class="{ active: $route.path === '/ai-rooms' }"
        >
          <i class="fas fa-robot nav-icon"></i>
          <span>AI选房</span>
          <div class="nav-badge">智能</div>
        </a>
        
        <router-link
          v-if="auth.isAuthenticated"
          to="/orders"
          class="nav-link"
          :class="{ active: $route.path === '/orders' }"
        >
          <i class="fas fa-list-alt nav-icon"></i>
          <span>我的订单</span>
        </router-link>
        
        <router-link 
          v-if="auth.isAuthenticated" 
          to="/profile" 
          class="nav-link" 
          :class="{ active: $route.path === '/profile' || $route.path === '/edit-profile' }"
        >
          <i class="fas fa-user nav-icon"></i>
          <span>个人信息</span>
        </router-link>
      </div>

      <!-- 用户操作区域 -->
      <div class="nav-actions">
        <template v-if="auth.isAuthenticated">
          <!-- 已登录状态 -->
          <div class="user-section">
            <div class="user-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="user-info">
              <span class="user-name">{{ displayUserName }}</span>
              <span class="user-status">在线</span>
            </div>
            <button @click="handleLogout" class="logout-btn">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </template>
        <template v-else>
          <!-- 未登录状态 -->
          <div class="auth-section">
            <router-link to="/login" class="auth-btn login-btn">
              <i class="fas fa-sign-in-alt"></i>
              <span>登录</span>
            </router-link>
            <router-link to="/register" class="auth-btn register-btn">
              <i class="fas fa-user-plus"></i>
              <span>注册</span>
            </router-link>
          </div>
        </template>
      </div>

      <!-- 移动端菜单按钮 -->
      <button class="mobile-menu-toggle" @click="toggleMobileMenu" :class="{ active: showMobileMenu }">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>

    <!-- 现代化移动端菜单 -->
    <div class="mobile-menu-overlay" :class="{ active: showMobileMenu }" @click="closeMobileMenu"></div>
    <div class="mobile-menu" :class="{ active: showMobileMenu }">
      <div class="mobile-menu-header">
        <div class="mobile-logo">
          <img src="@/assets/images/logo.png" alt="普洱蘑菇庄园民宿" class="mobile-logo-image"/>
          <span class="mobile-logo-text">普洱蘑菇庄园</span>
        </div>
        <button class="mobile-menu-close" @click="closeMobileMenu">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="mobile-menu-content">
        <div class="mobile-nav-section">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
            <div class="mobile-nav-icon">
              <i class="fas fa-home"></i>
            </div>
            <span class="mobile-nav-text">首页</span>
            <i class="fas fa-chevron-right mobile-nav-arrow"></i>
          </router-link>
          
          <a @click="handleMobileNavClick('/tea-culture')" class="mobile-nav-link">
            <div class="mobile-nav-icon">
              <i class="fas fa-leaf"></i>
            </div>
            <span class="mobile-nav-text">茶文化</span>
            <i class="fas fa-chevron-right mobile-nav-arrow"></i>
          </a>

          <a @click="handleMobileNavClick('/surrounding-products')" class="mobile-nav-link">
            <div class="mobile-nav-icon">
              <i class="fas fa-gift"></i>
            </div>
            <span class="mobile-nav-text">周边产品</span>
            <i class="fas fa-chevron-right mobile-nav-arrow"></i>
          </a>
          
          <a @click="handleMobileNavClick('/homestay-activities')" class="mobile-nav-link">
            <div class="mobile-nav-icon">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <span class="mobile-nav-text">庄园活动</span>
            <i class="fas fa-chevron-right mobile-nav-arrow"></i>
          </a>
          
          <a @click="handleMobileNavClick('/ai-rooms')" class="mobile-nav-link mobile-nav-special">
            <div class="mobile-nav-icon">
              <i class="fas fa-robot"></i>
            </div>
            <span class="mobile-nav-text">AI选房</span>
            <div class="mobile-nav-badge">智能</div>
          </a>
          
          <template v-if="auth.isAuthenticated">
            <router-link to="/orders" class="mobile-nav-link" @click="closeMobileMenu">
              <div class="mobile-nav-icon">
                <i class="fas fa-clipboard-list"></i>
              </div>
              <span class="mobile-nav-text">我的订单</span>
              <i class="fas fa-chevron-right mobile-nav-arrow"></i>
            </router-link>
            
            <router-link to="/profile" class="mobile-nav-link" @click="closeMobileMenu">
              <div class="mobile-nav-icon">
                <i class="fas fa-user"></i>
              </div>
              <span class="mobile-nav-text">个人信息</span>
              <i class="fas fa-chevron-right mobile-nav-arrow"></i>
            </router-link>
          </template>
        </div>

        <!-- 移动端用户区域 -->
        <div class="mobile-user-section">
          <template v-if="auth.isAuthenticated">
            <div class="mobile-user-card">
              <div class="mobile-user-avatar">
                <i class="fas fa-user-circle"></i>
              </div>
              <div class="mobile-user-details">
                <span class="mobile-user-name">{{ displayUserName }}</span>
                <span class="mobile-user-status">在线</span>
              </div>
              <button @click="handleLogout" class="mobile-logout-btn">
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </template>
          <template v-else>
            <div class="mobile-auth-actions">
              <router-link to="/login" class="mobile-auth-btn mobile-login-btn" @click="closeMobileMenu">
                <i class="fas fa-sign-in-alt"></i>
                <span>登录</span>
              </router-link>
              <router-link to="/register" class="mobile-auth-btn mobile-register-btn" @click="closeMobileMenu">
                <i class="fas fa-user-plus"></i>
                <span>注册</span>
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const showMobileMenu = ref(false)

// 计算显示的用户名
const displayUserName = computed(() => {
  return auth.user?.realName || auth.user?.username || '用户'
})

// 处理导航点击 - 移除拦截，直接跳转
const handleNavClick = (path: string) => {
  router.push(path)
}

// 处理移动端导航点击 - 移除拦截，直接跳转
const handleMobileNavClick = (path: string) => {
  router.push(path)
  closeMobileMenu()
}

// 处理登出
const handleLogout = () => {
  auth.logout()
  router.push('/')
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  showMobileMenu.value = false
}
</script>

<style scoped>
/* ===== 现代化导航栏样式 ===== */

.modern-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  z-index: var(--z-fixed, 1030);
  transition: all var(--transition-base, 250ms ease-in-out);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.modern-navbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary, #d4af37), transparent);
  opacity: 0.6;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-6, 1.5rem);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

/* ===== Logo 区域 ===== */
.logo-section {
  cursor: pointer;
  transition: var(--transition-base);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-3, 0.75rem);
}

.logo-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  object-fit: cover;
}

.logo-section:hover .logo-image {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-title {
  font-size: var(--font-size-xl, 1.25rem);
  font-weight: var(--font-weight-bold, 700);
  color: var(--color-primary, #d4af37);
  line-height: var(--line-height-tight, 1.25);
}

.logo-subtitle {
  font-size: var(--font-size-xs, 0.75rem);
  font-weight: var(--font-weight-medium, 500);
  color: var(--color-gray-600, #4b5563);
  line-height: var(--line-height-tight, 1.25);
}

/* ===== 主导航菜单 ===== */
.nav-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-8, 2rem);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-2, 0.5rem);
  color: var(--color-gray-600, #4b5563);
  text-decoration: none;
  font-weight: var(--font-weight-medium, 500);
  font-size: var(--font-size-sm, 0.875rem);
  padding: var(--spacing-2, 0.5rem) var(--spacing-4, 1rem);
  border-radius: var(--radius-lg, 0.5rem);
  transition: var(--transition-base);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transition: left 0.5s ease;
}

.nav-link:hover::before {
  left: 100%;
}

.nav-link:hover {
  color: var(--color-primary, #d4af37);
  background: rgba(212, 175, 55, 0.08);
  transform: translateY(-1px);
}

.nav-link.active {
  color: var(--color-primary, #d4af37);
  background: rgba(212, 175, 55, 0.12);
  font-weight: var(--font-weight-semibold, 600);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 2px;
  background: var(--color-primary, #d4af37);
  border-radius: 1px;
}

.nav-icon {
  font-size: 1rem;
  opacity: 0.8;
  transition: var(--transition-base);
}

.nav-link:hover .nav-icon {
  opacity: 1;
  transform: scale(1.1);
}

/* AI选房特殊样式 */
.nav-link-special {
  position: relative;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(139, 195, 74, 0.1));
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.nav-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, var(--color-primary, #d4af37), var(--color-secondary, #8bc34a));
  color: white;
  font-size: 10px;
  font-weight: var(--font-weight-bold, 700);
  padding: 2px 6px;
  border-radius: var(--radius-full, 9999px);
  box-shadow: var(--shadow-sm);
  animation: pulse 2s infinite;
}

/* ===== 用户操作区域 ===== */
.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-4, 1rem);
}

.user-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-3, 0.75rem);
  padding: var(--spacing-2, 0.5rem) var(--spacing-4, 1rem);
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: var(--radius-xl, 0.75rem);
  transition: var(--transition-base);
}

.user-section:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: rgba(212, 175, 55, 0.3);
}

.user-avatar {
  font-size: 1.5rem;
  color: var(--color-primary, #d4af37);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-gray-800, #1f2937);
}

.user-status {
  font-size: var(--font-size-xs, 0.75rem);
  color: var(--color-success, #10b981);
  font-weight: var(--font-weight-medium, 500);
}

.logout-btn {
  background: none;
  border: none;
  color: var(--color-gray-500, #6b7280);
  font-size: 1rem;
  padding: var(--spacing-2, 0.5rem);
  border-radius: var(--radius-base, 0.25rem);
  transition: var(--transition-base);
  cursor: pointer;
}

.logout-btn:hover {
  color: var(--color-error, #ef4444);
  background: rgba(239, 68, 68, 0.1);
}

.auth-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-3, 0.75rem);
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2, 0.5rem);
  padding: var(--spacing-2, 0.5rem) var(--spacing-4, 1rem);
  border-radius: var(--radius-lg, 0.5rem);
  font-weight: var(--font-weight-medium, 500);
  font-size: var(--font-size-sm, 0.875rem);
  text-decoration: none;
  transition: var(--transition-base);
  border: 1px solid transparent;
}

.login-btn {
  color: var(--color-primary, #d4af37);
  border-color: var(--color-primary, #d4af37);
}

.login-btn:hover {
  background: var(--color-primary, #d4af37);
  color: white;
  transform: translateY(-1px);
}

.register-btn {
  background: var(--color-primary-gradient, linear-gradient(135deg, #d4af37 0%, #b8941f 100%));
  color: white;
  box-shadow: var(--shadow-md);
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* ===== 移动端菜单按钮 ===== */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: var(--radius-lg, 0.5rem);
  transition: var(--transition-base);
}

.mobile-menu-toggle:hover {
  background: rgba(212, 175, 55, 0.1);
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: var(--color-gray-600, #4b5563);
  margin: 2px 0;
  transition: var(--transition-base);
  border-radius: 1px;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
  background: var(--color-primary, #d4af37);
}

.mobile-menu-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
  background: var(--color-primary, #d4af37);
}

/* ===== 移动端菜单覆盖层 ===== */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: var(--transition-base);
  z-index: var(--z-modal-backdrop, 1040);
}

.mobile-menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* ===== 移动端菜单 ===== */
.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 320px;
  height: 100vh;
  background: white;
  box-shadow: var(--shadow-2xl);
  transition: var(--transition-base);
  z-index: var(--z-modal, 1050);
  overflow-y: auto;
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--color-gray-200, #e5e7eb);
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.mobile-logo-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.mobile-logo-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary, #d4af37);
}

.mobile-menu-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-gray-500);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--radius-base);
  transition: var(--transition-base);
}

.mobile-menu-close:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
}

.mobile-menu-content {
  padding: var(--spacing-6);
}

.mobile-nav-section {
  margin-bottom: var(--spacing-8);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  color: var(--color-gray-700);
  text-decoration: none;
  border-radius: var(--radius-lg);
  transition: var(--transition-base);
  margin-bottom: var(--spacing-2);
}

.mobile-nav-link:hover {
  background: rgba(212, 175, 55, 0.1);
  color: var(--color-primary, #d4af37);
}

.mobile-nav-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-100);
  border-radius: var(--radius-lg);
  font-size: 1.2rem;
  transition: var(--transition-base);
}

.mobile-nav-link:hover .mobile-nav-icon {
  background: rgba(212, 175, 55, 0.2);
  color: var(--color-primary, #d4af37);
}

.mobile-nav-text {
  flex: 1;
  font-weight: var(--font-weight-medium);
}

.mobile-nav-arrow {
  color: var(--color-gray-400);
  transition: var(--transition-base);
}

.mobile-nav-link:hover .mobile-nav-arrow {
  color: var(--color-primary, #d4af37);
  transform: translateX(4px);
}

.mobile-nav-special {
  position: relative;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(139, 195, 74, 0.1));
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.mobile-nav-badge {
  background: linear-gradient(135deg, var(--color-primary, #d4af37), var(--color-secondary, #8bc34a));
  color: white;
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  padding: 4px 8px;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

.mobile-user-section {
  border-top: 1px solid var(--color-gray-200);
  padding-top: var(--spacing-6);
}

.mobile-user-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  background: var(--color-gray-50);
  border-radius: var(--radius-xl);
}

.mobile-user-avatar {
  font-size: 2rem;
  color: var(--color-primary, #d4af37);
}

.mobile-user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-user-name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
}

.mobile-user-status {
  font-size: var(--font-size-sm);
  color: var(--color-success, #10b981);
}

.mobile-logout-btn {
  background: var(--color-error, #ef4444);
  color: white;
  border: none;
  padding: var(--spacing-2);
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: var(--transition-base);
}

.mobile-logout-btn:hover {
  background: #dc2626;
}

.mobile-auth-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.mobile-auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: var(--transition-base);
}

.mobile-login-btn {
  color: var(--color-primary, #d4af37);
  border: 1px solid var(--color-primary, #d4af37);
}

.mobile-login-btn:hover {
  background: var(--color-primary, #d4af37);
  color: white;
}

.mobile-register-btn {
  background: var(--color-primary-gradient, linear-gradient(135deg, #d4af37 0%, #b8941f 100%));
  color: white;
  box-shadow: var(--shadow-md);
}

.mobile-register-btn:hover {
  box-shadow: var(--shadow-lg);
}

/* ===== 响应式设计 ===== */
@media (max-width: 1024px) {
  .nav-menu {
    gap: var(--spacing-6);
  }

  .nav-link {
    padding: var(--spacing-2) var(--spacing-3);
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .nav-actions {
    display: none;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .nav-container {
    padding: 0 var(--spacing-4);
  }

  .logo-title {
    font-size: var(--font-size-lg);
  }

  .logo-image {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    height: 70px;
  }

  .logo-title {
    font-size: var(--font-size-base);
  }

  .logo-image {
    width: 45px;
    height: 45px;
  }

  .mobile-menu {
    width: 280px;
  }
}

/* ===== 动画效果 ===== */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>

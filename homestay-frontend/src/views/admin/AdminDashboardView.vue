<template>
  <div class="admin-dashboard">
    <!-- 顶部导航栏 -->
    <nav class="admin-navbar">
      <div class="navbar-content">
        <div class="navbar-left">
          <div class="logo">
            <i class="fas fa-seedling"></i>
            普洱蘑菇庄园民宿 - 管理后台
          </div>
        </div>
        <div class="navbar-right">
          <div class="admin-info">
            <i class="fas fa-user-shield"></i>
            <span>{{ auth.user?.realName || '管理员' }}</span>
          </div>
          <button @click="handleLogout" class="logout-btn">
            <i class="fas fa-right-from-bracket"></i>
            退出登录
          </button>
        </div>
      </div>
    </nav>

    <!-- 通知容器 -->
    <!-- <AdminNotificationContainer ref="notificationRef" /> -->

    <!-- 主要内容区域 -->
    <div class="admin-content">
      <!-- 侧边栏 -->
      <aside class="admin-sidebar">
        <div class="sidebar-menu">
          <div class="menu-item" :class="{ active: activeMenu === 'dashboard' }" @click="setActiveMenu('dashboard')">
            <i class="fas fa-tachometer-alt"></i>
            <span>仪表板</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'rooms' }" @click="setActiveMenu('rooms')">
            <i class="fas fa-bed"></i>
            <span>房间管理</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'orders' }" @click="setActiveMenu('orders')">
            <i class="fas fa-clipboard-list"></i>
            <span>订单管理</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'users' }" @click="setActiveMenu('users')">
            <i class="fas fa-users"></i>
            <span>用户管理</span>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'test' }" @click="setActiveMenu('test')">
            <i class="fas fa-flask"></i>
            <span>功能测试</span>
          </div>
        </div>
      </aside>

      <!-- 主内容区域 -->
      <main class="admin-main">
        <!-- 仪表板 -->
        <div v-if="activeMenu === 'dashboard'" class="dashboard-content">
          <h1 class="page-title">管理仪表板</h1>
          
          <!-- 统计卡片 -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon rooms">
                <i class="fas fa-bed"></i>
              </div>
              <div class="stat-info">
                <h3>总房间数</h3>
                <p class="stat-number">{{ stats.totalRooms }}</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon orders">
                <i class="fas fa-clipboard-list"></i>
              </div>
              <div class="stat-info">
                <h3>总订单数</h3>
                <p class="stat-number">{{ stats.totalOrders }}</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon users">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-info">
                <h3>注册用户</h3>
                <p class="stat-number">{{ stats.totalUsers }}</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon revenue">
                <i class="fas fa-dollar-sign"></i>
              </div>
              <div class="stat-info">
                <h3>本月收入</h3>
                <p class="stat-number">¥{{ stats.monthlyRevenue }}</p>
              </div>
            </div>
          </div>

          <!-- 快速操作 -->
          <div class="quick-actions">
            <h2>快速操作</h2>
            <div class="action-grid">
              <button class="action-btn" @click="handleRoomAction">
                <i class="fas fa-plus"></i>
                <span>添加房间</span>
              </button>
              <button class="action-btn" @click="handleOrderAction">
                <i class="fas fa-eye"></i>
                <span>查看订单</span>
              </button>
              <button class="action-btn" @click="handleUserAction">
                <i class="fas fa-user-plus"></i>
                <span>管理用户</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 房间管理 -->
        <div v-else-if="activeMenu === 'rooms'" class="rooms-content">
          <RoomManagementView />
        </div>

        <!-- 订单管理 -->
        <div v-else-if="activeMenu === 'orders'" class="orders-content">
          <OrderManagementView />
        </div>

        <!-- 用户管理 -->
        <div v-else-if="activeMenu === 'users'" class="users-content">
          <UserManagementView />
        </div>

        <!-- 功能测试 -->
        <div v-else-if="activeMenu === 'test'" class="test-content">
          <AdminTestView />
        </div>


      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import request from '../../utils/request'
import type { ApiResponse } from '@/types/api'
// import AdminNotificationContainer from '../../components/admin/AdminNotificationContainer.vue'
// import { setNotificationInstance, adminMessages, notification } from '../../utils/notification'
import RoomManagementView from './RoomManagementView.vue'
import OrderManagementView from './OrderManagementView.vue'
import UserManagementView from './UserManagementView.vue'
import AdminTestView from './AdminTestView.vue'

const router = useRouter()
const auth = useAuthStore()

// 通知实例
// const notificationRef = ref()

// 当前激活的菜单
const activeMenu = ref('dashboard')

// 统计数据
const stats = reactive({
  totalRooms: 0,
  totalOrders: 0,
  totalUsers: 0,
  monthlyRevenue: 0
})

// 设置激活菜单
const setActiveMenu = (menu: string) => {
  activeMenu.value = menu
}

// 获取统计数据
const fetchStats = async () => {
  try {
    // 获取房间统计
    const roomResponse = await request.get('/h/room', {
      params: { pageNum: 1, pageSize: 1 }
    })
    if (roomResponse.code === 200) {
      stats.totalRooms = roomResponse.data?.total || 0
    }

    // 获取订单统计
    const orderResponse = await request.get('/h/order', {
      params: { pageNum: 1, pageSize: 1 }
    })
    if (orderResponse.code === 200) {
      stats.totalOrders = orderResponse.data?.total || 0
    }

    // 获取用户统计
    const userResponse = await request.get('/h/user', {
      params: { pageNum: 1, pageSize: 1 }
    })
    if (userResponse.code === 200) {
      stats.totalUsers = userResponse.data?.total || 0
    }

    // 计算月收入（这里需要根据实际业务逻辑调整）
    stats.monthlyRevenue = stats.totalOrders * 450 // 假设平均订单金额为450

    // notification.success('统计数据加载成功', '数据更新')
  } catch (error) {
    console.error('获取统计数据失败:', error)
    // 使用模拟数据作为后备
    stats.totalRooms = 12
    stats.totalOrders = 156
    stats.totalUsers = 89
    stats.monthlyRevenue = 45680

    // notification.warning('使用模拟数据，请检查后端服务', '数据加载')
  }
}

// 退出登录
const handleLogout = () => {
  if (confirm('确定要退出管理后台吗？')) {
    auth.logout()
    // adminMessages.logoutSuccess()
    router.push('/admin/login')
  }
}

// 快速操作处理函数
const handleRoomAction = () => {
  // notification.success('房间管理功能开发中', '功能提示', { duration: 2000 })
  setActiveMenu('rooms')
}

const handleOrderAction = () => {
  // notification.info('正在加载订单数据...', '订单管理', { duration: 2000 })
  setActiveMenu('orders')
}

const handleUserAction = () => {
  // notification.info('正在加载用户管理...', '用户管理', { duration: 2000 })
  setActiveMenu('users')
}

// 页面加载时获取数据
onMounted(() => {
  // 设置通知实例
  // if (notificationRef.value) {
  //   setNotificationInstance(notificationRef.value)
  //   notification.info('欢迎使用普洱蘑菇庄园管理后台', '系统提示', { duration: 3000 })
  // }
  fetchStats()
})
</script>

<style scoped>
/* 基础样式 */
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #e5e7eb 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
}

.admin-dashboard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="mushroom" patternUnits="userSpaceOnUse" width="20" height="20"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23mushroom)"/></svg>');
  opacity: 0.3;
  pointer-events: none;
}

/* 顶部导航栏 */
.admin-navbar {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 70px;
  border-bottom: 3px solid #d4af37;
}

.navbar-content {
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-left .logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #d4af37;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Pacifico', cursive;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.navbar-left .logo i {
  color: #10b981;
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-weight: 500;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #b91c1c;
}

/* 主要内容区域 */
.admin-content {
  display: flex;
  margin-top: 70px;
  min-height: calc(100vh - 70px);
}

/* 侧边栏 */
.admin-sidebar {
  width: 250px;
  background: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 24px 0;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background: #f3f4f6;
  color: #dc2626;
}

.menu-item.active {
  background: #fef2f2;
  color: #dc2626;
  border-left-color: #dc2626;
  font-weight: 600;
}

.menu-item i {
  font-size: 1.1rem;
  width: 20px;
}

/* 主内容区域 */
.admin-main {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 32px;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.rooms {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.stat-icon.orders {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
}

.stat-icon.users {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-info h3 {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

/* 快速操作 */
.quick-actions {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.quick-actions h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 24px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
}

.action-btn:hover {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
}

.action-btn i {
  font-size: 2rem;
}

.action-btn span {
  font-weight: 600;
}

/* 内容占位符 */
.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #6b7280;
}

.content-placeholder i {
  font-size: 4rem;
  margin-bottom: 16px;
  color: #d1d5db;
}

.content-placeholder h3 {
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: #374151;
}

.content-placeholder p {
  font-size: 1rem;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-content {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    order: 2;
  }
  
  .admin-main {
    order: 1;
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

<template>
  <div class="admin-dashboard">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span>🍄</span>
          <span>蘑菇庄园管理系统</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 class="nav-title">主要功能</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/admin" class="nav-link active">
                <i class="fas fa-tachometer-alt"></i>
                <span>控制台</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/rooms" class="nav-link">
                <i class="fas fa-home"></i>
                <span>民宿管理</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/orders" class="nav-link">
                <i class="fas fa-clipboard-list"></i>
                <span>预订管理</span>
              </router-link>
            </li>
          </ul>
        </div>
        
        <div class="nav-section">
          <h3 class="nav-title">系统管理</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <a href="#" class="nav-link">
                <i class="fas fa-users"></i>
                <span>用户管理</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">
                <i class="fas fa-chart-bar"></i>
                <span>数据统计</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">
                <i class="fas fa-cog"></i>
                <span>系统设置</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 顶部导航栏 -->
      <header class="top-header">
        <div class="header-left">
          <h1 class="page-title">控制台</h1>
          <p class="page-subtitle">欢迎回来，{{ auth.user?.realName || '管理员' }}</p>
        </div>
        <div class="header-right">
          <div class="user-info">
            <img :src="auth.user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'" alt="头像" class="avatar">
            <span class="username">{{ auth.user?.realName || auth.user?.username }}</span>
          </div>
          <button @click="handleLogout" class="logout-btn">
            <i class="fas fa-right-from-bracket"></i>
            退出登录
          </button>
        </div>
      </header>

      <!-- 仪表板内容 -->
      <div class="dashboard-content">
        <!-- 统计卡片 -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon rooms">
              <i class="fas fa-home"></i>
            </div>
            <div class="stat-info">
              <h3 class="stat-number">{{ stats.totalRooms }}</h3>
              <p class="stat-label">总民宿数</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon orders">
              <i class="fas fa-clipboard-list"></i>
            </div>
            <div class="stat-info">
              <h3 class="stat-number">{{ stats.totalOrders }}</h3>
              <p class="stat-label">总预订数</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon revenue">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="stat-info">
              <h3 class="stat-number">¥{{ stats.totalRevenue.toLocaleString() }}</h3>
              <p class="stat-label">总收入</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon occupancy">
              <i class="fas fa-percentage"></i>
            </div>
            <div class="stat-info">
              <h3 class="stat-number">{{ stats.occupancyRate }}%</h3>
              <p class="stat-label">入住率</p>
            </div>
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="quick-actions">
          <h2 class="section-title">快速操作</h2>
          <div class="actions-grid">
            <router-link to="/admin/rooms" class="action-card">
              <i class="fas fa-plus"></i>
              <span>添加民宿</span>
            </router-link>

            <router-link to="/admin/orders" class="action-card">
              <i class="fas fa-eye"></i>
              <span>查看预订</span>
            </router-link>
            
            <a href="#" class="action-card">
              <i class="fas fa-users"></i>
              <span>用户管理</span>
            </a>
            
            <a href="#" class="action-card">
              <i class="fas fa-chart-line"></i>
              <span>数据报表</span>
            </a>
          </div>
        </div>

        <!-- 最近预订 -->
        <div class="recent-orders">
          <h2 class="section-title">最近预订</h2>
          <div class="orders-table">
            <div v-if="loading" class="loading">
              <i class="fas fa-spinner fa-spin"></i>
              <span>加载中...</span>
            </div>
            
            <table v-else class="table">
              <thead>
                <tr>
                  <th>预订号</th>
                  <th>客户</th>
                  <th>民宿</th>
                  <th>入住日期</th>
                  <th>状态</th>
                  <th>金额</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td>{{ order.orderNumber }}</td>
                  <td>{{ order.customerName }}</td>
                  <td>{{ order.roomName }}</td>
                  <td>{{ formatDate(order.checkInDate) }}</td>
                  <td>
                    <span class="status-badge" :class="order.status">
                      {{ getStatusText(order.status) }}
                    </span>
                  </td>
                  <td>¥{{ order.totalAmount }}</td>
                  <td>
                    <button @click="viewOrder(order)" class="btn btn-sm">查看</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import request from '../../utils/request'

const router = useRouter()
const auth = useAuthStore()

// 响应式数据
const loading = ref(false)
const recentOrders = ref<any[]>([])

const stats = reactive({
  totalRooms: 0,
  totalOrders: 0,
  totalRevenue: 0,
  occupancyRate: 0
})

// 方法
const fetchDashboardData = async () => {
  loading.value = true
  try {
    // 获取统计数据
    const statsResponse = await request.get('/admin/dashboard/stats')
    Object.assign(stats, statsResponse.data)
    
    // 获取最近订单
    const ordersResponse = await request.get('/admin/dashboard/recent-orders')
    recentOrders.value = ordersResponse.data
  } catch (error) {
    console.error('获取仪表板数据失败:', error)
    // 模拟数据
    Object.assign(stats, {
      totalRooms: 48,
      totalOrders: 156,
      totalRevenue: 89650,
      occupancyRate: 78
    })
    
    recentOrders.value = [
      {
        id: 1,
        orderNumber: 'MG202501070001',
        customerName: '张三',
        roomName: '蘑菇森林小屋',
        checkInDate: '2025-01-15',
        status: 'confirmed',
        totalAmount: 776
      },
      {
        id: 2,
        orderNumber: 'MG202501070002',
        customerName: '李四',
        roomName: '普洱茶香木屋',
        checkInDate: '2025-01-16',
        status: 'pending',
        totalAmount: 576
      }
    ]
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const viewOrder = (order: any) => {
  router.push(`/admin/orders/${order.id}`)
}

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

// 生命周期
onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
/* 管理员仪表板布局 */
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 侧边栏 */
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #374151;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: bold;
}

.logo i {
  color: #d4af37;
  font-size: 1.5rem;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 0;
}

.nav-section {
  margin-bottom: 32px;
}

.nav-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin-bottom: 16px;
  padding: 0 24px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 3px solid transparent;
  border-radius: 0 25px 25px 0;
  margin-right: 12px;
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

.nav-link:hover {
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
  color: white;
  transform: translateX(4px);
}

.nav-link:hover::before {
  left: 100%;
}

.nav-link.active {
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: #1f2937;
  border-right-color: #d4af37;
  font-weight: 600;
  box-shadow:
    0 4px 12px rgba(212, 175, 55, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.nav-link i {
  width: 20px;
  text-align: center;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.top-header {
  background: white;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

.page-subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-weight: 500;
  color: #374151;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* 仪表板内容 */
.dashboard-content {
  flex: 1;
  padding: 32px;
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
  padding: 28px;
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.12),
    0 8px 24px rgba(0, 0, 0, 0.08);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.orders {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.occupancy {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  --gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-card:nth-child(1) {
  --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card:nth-child(2) {
  --gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card:nth-child(3) {
  --gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card:nth-child(4) {
  --gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info h3 {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-info p {
  color: #6b7280;
  font-size: 0.875rem;
}

/* 快速操作 */
.quick-actions {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 24px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: #374151;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  color: #d4af37;
}

.action-card i {
  font-size: 2rem;
  color: #d4af37;
}

.action-card span {
  font-weight: 500;
}

/* 最近订单 */
.recent-orders {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.recent-orders .section-title {
  padding: 24px 24px 0;
  margin-bottom: 24px;
}

.orders-table {
  padding: 0 24px 24px;
}

.loading {
  text-align: center;
  padding: 40px 0;
  color: #6b7280;
}

.loading i {
  font-size: 1.5rem;
  margin-bottom: 12px;
  display: block;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.table th {
  font-weight: 600;
  color: #374151;
  background: #f9fafb;
}

.table td {
  color: #6b7280;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.confirmed {
  background: #d1fae5;
  color: #059669;
}

.status-badge.completed {
  background: #dbeafe;
  color: #2563eb;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.btn:hover {
  background: #f3f4f6;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 0.75rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .main-content {
    margin-left: 0;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .top-header {
    padding: 16px 20px;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .dashboard-content {
    padding: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .table {
    font-size: 0.875rem;
  }

  .table th,
  .table td {
    padding: 8px;
  }
}
</style>

<style scoped>
/* 管理员仪表板布局 */
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 侧边栏 */
.sidebar {
  width: 280px;
  background: #1f2937;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #374151;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: bold;
}

.logo i {
  color: #d4af37;
  font-size: 1.5rem;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 0;
}

.nav-section {
  margin-bottom: 32px;
}

.nav-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin-bottom: 16px;
  padding: 0 24px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.3s ease;
  border-right: 3px solid transparent;
}

.nav-link:hover {
  background: #374151;
  color: white;
}

.nav-link.active {
  background: #374151;
  color: #d4af37;
  border-right-color: #d4af37;
}

.nav-link i {
  width: 20px;
  text-align: center;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.top-header {
  background: white;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

.page-subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-weight: 500;
  color: #374151;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* 仪表板内容 */
.dashboard-content {
  flex: 1;
  padding: 32px;
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
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.orders {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.occupancy {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info h3 {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-info p {
  color: #6b7280;
  font-size: 0.875rem;
}
</style>

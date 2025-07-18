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
              <router-link to="/admin" class="nav-link">
                <i class="fas fa-tachometer-alt"></i>
                <span>控制台</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/rooms" class="nav-link">
                <i class="fas fa-bed"></i>
                <span>房间管理</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/orders" class="nav-link active">
                <i class="fas fa-clipboard-list"></i>
                <span>订单管理</span>
              </router-link>
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
          <h1 class="page-title">预订管理</h1>
          <p class="page-subtitle">审核和管理所有用户预订</p>
        </div>
        <div class="header-right">
          <button @click="exportOrders" class="btn btn-outline">
            <i class="fas fa-download"></i>
            导出订单
          </button>
          <button @click="handleLogout" class="logout-btn">
            <i class="fas fa-right-from-bracket"></i>
            退出登录
          </button>
        </div>
      </header>

      <!-- 订单管理内容 -->
      <div class="orders-content">
        <!-- 统计卡片 -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon pending">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-info">
              <h3>{{ orderStats.pending }}</h3>
              <p>待审核订单</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon confirmed">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
              <h3>{{ orderStats.confirmed }}</h3>
              <p>已确认订单</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon completed">
              <i class="fas fa-star"></i>
            </div>
            <div class="stat-info">
              <h3>{{ orderStats.completed }}</h3>
              <p>已完成订单</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon revenue">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="stat-info">
              <h3>¥{{ orderStats.totalRevenue.toLocaleString() }}</h3>
              <p>总收入</p>
            </div>
          </div>
        </div>

        <!-- 搜索和筛选 -->
        <div class="filters-section">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="搜索订单号或客户姓名..."
              class="search-input"
            >
          </div>
          
          <div class="filters">
            <select v-model="statusFilter" class="filter-select">
              <option value="">全部状态</option>
              <option value="pending">待审核</option>
              <option value="confirmed">已确认</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
            
            <input 
              type="date" 
              v-model="dateFilter" 
              class="filter-select"
              placeholder="选择日期"
            >
          </div>
        </div>

        <!-- 订单列表 -->
        <div class="orders-table-section">
          <div v-if="loading" class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>加载中...</span>
          </div>
          
          <div v-else class="table-container">
            <table class="orders-table">
              <thead>
                <tr>
                  <th>订单号</th>
                  <th>客户信息</th>
                  <th>房间信息</th>
                  <th>入住日期</th>
                  <th>退房日期</th>
                  <th>总金额</th>
                  <th>状态</th>
                  <th>下单时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                  <td>
                    <div class="order-number">{{ order.orderNumber }}</div>
                  </td>
                  <td>
                    <div class="customer-info">
                      <div class="customer-name">{{ order.customerName }}</div>
                      <div class="customer-phone">{{ order.customerPhone }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="room-info">
                      <div class="room-name">{{ order.roomName }}</div>
                      <div class="room-type">{{ order.roomType }}</div>
                    </div>
                  </td>
                  <td>{{ formatDate(order.checkInDate) }}</td>
                  <td>{{ formatDate(order.checkOutDate) }}</td>
                  <td class="price">¥{{ order.totalAmount }}</td>
                  <td>
                    <span class="status-badge" :class="order.status">
                      {{ getStatusText(order.status) }}
                    </span>
                  </td>
                  <td>{{ formatDateTime(order.createTime) }}</td>
                  <td>
                    <div class="action-buttons">
                      <button 
                        v-if="order.status === 'pending'"
                        @click="confirmOrder(order)" 
                        class="btn btn-sm btn-success"
                      >
                        <i class="fas fa-check"></i>
                        确认
                      </button>
                      
                      <button 
                        v-if="order.status === 'pending'"
                        @click="rejectOrder(order)" 
                        class="btn btn-sm btn-danger"
                      >
                        <i class="fas fa-times"></i>
                        拒绝
                      </button>
                      
                      <button 
                        v-if="order.status === 'confirmed'"
                        @click="completeOrder(order)" 
                        class="btn btn-sm btn-primary"
                      >
                        <i class="fas fa-flag-checkered"></i>
                        完成
                      </button>
                      
                      <button 
                        @click="viewOrderDetails(order)" 
                        class="btn btn-sm btn-outline"
                      >
                        <i class="fas fa-eye"></i>
                        详情
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- 订单详情模态框 -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>订单详情</h3>
          <button @click="closeDetailsModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body" v-if="selectedOrder">
          <div class="detail-section">
            <h4>订单信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>订单号：</label>
                <span>{{ selectedOrder.orderNumber }}</span>
              </div>
              <div class="detail-item">
                <label>下单时间：</label>
                <span>{{ formatDateTime(selectedOrder.createTime) }}</span>
              </div>
              <div class="detail-item">
                <label>订单状态：</label>
                <span class="status-badge" :class="selectedOrder.status">
                  {{ getStatusText(selectedOrder.status) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>客户信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>姓名：</label>
                <span>{{ selectedOrder.customerName }}</span>
              </div>
              <div class="detail-item">
                <label>手机号：</label>
                <span>{{ selectedOrder.customerPhone }}</span>
              </div>
              <div class="detail-item">
                <label>身份证：</label>
                <span>{{ selectedOrder.customerIdCard || '未提供' }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>房间信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>房间名称：</label>
                <span>{{ selectedOrder.roomName }}</span>
              </div>
              <div class="detail-item">
                <label>房间类型：</label>
                <span>{{ selectedOrder.roomType }}</span>
              </div>
              <div class="detail-item">
                <label>入住日期：</label>
                <span>{{ formatDate(selectedOrder.checkInDate) }}</span>
              </div>
              <div class="detail-item">
                <label>退房日期：</label>
                <span>{{ formatDate(selectedOrder.checkOutDate) }}</span>
              </div>
              <div class="detail-item">
                <label>住宿天数：</label>
                <span>{{ selectedOrder.nights }}晚</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h4>费用明细</h4>
            <div class="price-breakdown">
              <div class="price-item">
                <span>房费：</span>
                <span>¥{{ selectedOrder.roomPrice }} × {{ selectedOrder.nights }}晚</span>
              </div>
              <div class="price-item total">
                <span>总计：</span>
                <span>¥{{ selectedOrder.totalAmount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import request from '../../utils/request'

const router = useRouter()
const auth = useAuthStore()

// 响应式数据
const loading = ref(false)
const orders = ref<any[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const showDetailsModal = ref(false)
const selectedOrder = ref<any>(null)

const orderStats = reactive({
  pending: 0,
  confirmed: 0,
  completed: 0,
  totalRevenue: 0
})

// 计算属性
const filteredOrders = computed(() => {
  let result = [...orders.value]
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(order => 
      order.orderNumber.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query)
    )
  }
  
  // 状态筛选
  if (statusFilter.value) {
    result = result.filter(order => order.status === statusFilter.value)
  }
  
  // 日期筛选
  if (dateFilter.value) {
    result = result.filter(order => 
      order.checkInDate.startsWith(dateFilter.value)
    )
  }
  
  return result
})

// 方法
const fetchOrders = async () => {
  loading.value = true
  try {
    const response = await request.get('/admin/orders')
    orders.value = response.data
    updateOrderStats()
  } catch (error) {
    console.error('获取订单列表失败:', error)
    // 模拟数据
    orders.value = [
      {
        id: 1,
        orderNumber: 'HT202501070001',
        customerName: '张三',
        customerPhone: '13800138000',
        customerIdCard: '110101199001011234',
        roomName: '豪华海景套房',
        roomType: '套房',
        checkInDate: '2025-01-15',
        checkOutDate: '2025-01-17',
        nights: 2,
        roomPrice: 888,
        totalAmount: 1776,
        status: 'pending',
        createTime: '2025-01-07 10:30:00'
      },
      {
        id: 2,
        orderNumber: 'HT202501070002',
        customerName: '李四',
        customerPhone: '13900139000',
        roomName: '商务标准间',
        roomType: '标准间',
        checkInDate: '2025-01-20',
        checkOutDate: '2025-01-22',
        nights: 2,
        roomPrice: 288,
        totalAmount: 576,
        status: 'confirmed',
        createTime: '2025-01-07 14:20:00'
      }
    ]
    updateOrderStats()
  } finally {
    loading.value = false
  }
}

const updateOrderStats = () => {
  orderStats.pending = orders.value.filter(o => o.status === 'pending').length
  orderStats.confirmed = orders.value.filter(o => o.status === 'confirmed').length
  orderStats.completed = orders.value.filter(o => o.status === 'completed').length
  orderStats.totalRevenue = orders.value
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0)
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待审核',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

const confirmOrder = async (order: any) => {
  if (confirm(`确定要确认订单"${order.orderNumber}"吗？`)) {
    try {
      await request.put(`/admin/orders/${order.id}/confirm`)
      order.status = 'confirmed'
      updateOrderStats()
      alert('订单已确认')
    } catch (error) {
      console.error('确认订单失败:', error)
      alert('操作失败，请稍后重试')
    }
  }
}

const rejectOrder = async (order: any) => {
  if (confirm(`确定要拒绝订单"${order.orderNumber}"吗？`)) {
    try {
      await request.put(`/admin/orders/${order.id}/reject`)
      order.status = 'cancelled'
      updateOrderStats()
      alert('订单已拒绝')
    } catch (error) {
      console.error('拒绝订单失败:', error)
      alert('操作失败，请稍后重试')
    }
  }
}

const completeOrder = async (order: any) => {
  if (confirm(`确定要完成订单"${order.orderNumber}"吗？`)) {
    try {
      await request.put(`/admin/orders/${order.id}/complete`)
      order.status = 'completed'
      updateOrderStats()
      alert('订单已完成')
    } catch (error) {
      console.error('完成订单失败:', error)
      alert('操作失败，请稍后重试')
    }
  }
}

const viewOrderDetails = (order: any) => {
  selectedOrder.value = order
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedOrder.value = null
}

const exportOrders = () => {
  // 导出订单功能
  alert('导出功能开发中...')
}

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

// 生命周期
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
/* 复用管理员仪表板的基础样式 */
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

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

.main-content {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
}

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
  gap: 16px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-outline {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  background: #f3f4f6;
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

/* 订单管理内容 */
.orders-content {
  flex: 1;
  padding: 32px;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.stat-icon.pending {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-icon.confirmed {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon.completed {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-info h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-info p {
  color: #6b7280;
  font-size: 0.875rem;
}

/* 搜索和筛选 */
.filters-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  display: flex;
  gap: 24px;
  align-items: center;
}

.search-bar {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-bar i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.filters {
  display: flex;
  gap: 16px;
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: #d4af37;
}

/* 订单表格 */
.orders-table-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.loading {
  text-align: center;
  padding: 60px 0;
  color: #6b7280;
}

.loading i {
  font-size: 2rem;
  margin-bottom: 16px;
  display: block;
}

.table-container {
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.orders-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.order-number {
  font-weight: 600;
  color: #1f2937;
}

.customer-info .customer-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.customer-info .customer-phone {
  color: #6b7280;
  font-size: 0.875rem;
}

.room-info .room-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.room-info .room-type {
  color: #6b7280;
  font-size: 0.875rem;
}

.price {
  font-weight: 600;
  color: #d4af37;
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

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.75rem;
}

.btn-success {
  background: #10b981;
  color: white;
  border: 1px solid #10b981;
}

.btn-success:hover {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: 1px solid #ef4444;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-primary {
  background: #d4af37;
  color: white;
  border: 1px solid #d4af37;
}

.btn-primary:hover {
  background: #b8941f;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.detail-section {
  margin-bottom: 32px;
}

.detail-section h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.detail-item label {
  font-weight: 500;
  color: #6b7280;
}

.detail-item span {
  color: #1f2937;
  font-weight: 500;
}

.price-breakdown {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  color: #6b7280;
}

.price-item.total {
  font-weight: 600;
  color: #1f2937;
  font-size: 1.125rem;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  margin-top: 8px;
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
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar {
    max-width: none;
  }

  .filters {
    flex-direction: column;
  }

  .filter-select {
    min-width: auto;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .orders-table {
    font-size: 0.75rem;
  }

  .orders-table th,
  .orders-table td {
    padding: 8px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .modal {
    width: 95%;
    margin: 20px;
  }
}
</style>

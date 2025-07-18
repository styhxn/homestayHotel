<template>
  <div class="order-detail-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <i class="fas fa-seedling"></i>
          普洱蘑菇庄园
        </div>
        <div class="nav-menu">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/tea-culture" class="nav-link">茶文化</router-link>
          <router-link to="/products" class="nav-link">民宿产品</router-link>
          <router-link to="/ai-rooms" class="nav-link">AI选房</router-link>
          <router-link to="/orders" class="nav-link">订单</router-link>
          <router-link to="/profile" class="nav-link">个人信息</router-link>
        </div>
        <div class="nav-buttons">
          <span class="user-welcome">欢迎，{{ auth.user?.realName || auth.user?.username }}</span>
          <button @click="handleLogout" class="btn btn-outline">退出登录</button>
        </div>
      </div>
    </nav>

    <!-- 订单详情内容 -->
    <main class="main-content">
      <div v-if="loading" class="loading-container">
        <i class="fas fa-spinner fa-spin"></i>
        <span>加载中...</span>
      </div>

      <div v-else-if="order" class="order-detail-container">
        <!-- 返回按钮 -->
        <div class="back-section">
          <button @click="goBack" class="back-btn">
            <i class="fas fa-arrow-left"></i>
            返回订单列表
          </button>
        </div>

        <!-- 订单状态 -->
        <div class="order-status-section">
          <div class="status-icon" :class="order.status">
            <i :class="getStatusIcon(order.status)"></i>
          </div>
          <div class="status-info">
            <h2 class="status-title">{{ getStatusText(order.status) }}</h2>
            <p class="status-desc">{{ getStatusDescription(order.status) }}</p>
          </div>
        </div>

        <!-- 订单基本信息 -->
        <div class="order-info-card">
          <h3>订单信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">订单号：</span>
              <span class="value">{{ order.orderNumber }}</span>
            </div>
            <div class="info-item">
              <span class="label">下单时间：</span>
              <span class="value">{{ formatDateTime(order.createTime) }}</span>
            </div>
            <div class="info-item">
              <span class="label">联系电话：</span>
              <span class="value">{{ order.phone }}</span>
            </div>
            <div class="info-item">
              <span class="label">入住人数：</span>
              <span class="value">{{ order.guestCount }}人</span>
            </div>
          </div>
          <div v-if="order.specialRequirements" class="special-requirements">
            <span class="label">特殊要求：</span>
            <p class="requirements-text">{{ order.specialRequirements }}</p>
          </div>
        </div>

        <!-- 房间信息 -->
        <div class="room-info-card">
          <h3>房间信息</h3>
          <div class="room-content">
            <div class="room-image">
              <img :src="order.roomImage || '/api/placeholder/300/200'" :alt="order.roomName">
            </div>
            <div class="room-details">
              <h4 class="room-name">{{ order.roomName }}</h4>
              <p class="room-type">{{ order.roomType }}</p>
              <div class="stay-dates">
                <div class="date-item">
                  <i class="fas fa-calendar-check"></i>
                  <div>
                    <span class="date-label">入住日期</span>
                    <span class="date-value">{{ formatDate(order.checkInDate) }}</span>
                  </div>
                </div>
                <div class="date-separator">
                  <i class="fas fa-arrow-right"></i>
                </div>
                <div class="date-item">
                  <i class="fas fa-calendar-times"></i>
                  <div>
                    <span class="date-label">退房日期</span>
                    <span class="date-value">{{ formatDate(order.checkOutDate) }}</span>
                  </div>
                </div>
              </div>
              <div class="nights-info">
                <i class="fas fa-moon"></i>
                <span>共 {{ order.nights }} 晚</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 费用明细 -->
        <div class="cost-detail-card">
          <h3>费用明细</h3>
          <div class="cost-breakdown">
            <div class="cost-item">
              <span>房费 ({{ order.nights }}晚 × ¥{{ order.roomPrice }})</span>
              <span>¥{{ order.totalAmount }}</span>
            </div>
            <div class="cost-total">
              <span>总计</span>
              <span class="total-amount">¥{{ order.totalAmount }}</span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button 
            v-if="order.status === 'pending'"
            @click="cancelOrder"
            class="btn btn-danger"
          >
            <i class="fas fa-times"></i>
            取消订单
          </button>
          
          <button 
            v-if="order.status === 'completed'"
            @click="rateOrder"
            class="btn btn-primary"
          >
            <i class="fas fa-star"></i>
            评价订单
          </button>
          
          <button 
            @click="contactService"
            class="btn btn-outline"
          >
            <i class="fas fa-headset"></i>
            联系客服
          </button>
        </div>
      </div>

      <div v-else class="error-container">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>订单不存在</h3>
        <p>抱歉，您查看的订单不存在或已被删除</p>
        <button @click="goBack" class="btn btn-primary">返回订单列表</button>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import request from '../../utils/request'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

// 响应式数据
const loading = ref(true)
const order = ref<any>(null)

// 方法
const fetchOrderDetail = async () => {
  loading.value = true
  try {
    const orderId = route.params.id
    // 先尝试从用户订单列表中获取
    const response: any = await request.get('/h/order/getUserOrders')
    if (response.code === 200 && response.data?.records) {
      const foundOrder = response.data.records.find((o: any) => o.id.toString() === orderId)
      if (foundOrder) {
        order.value = {
          ...foundOrder,
          orderNumber: foundOrder.orderNumber || `MG${foundOrder.id.toString().padStart(8, '0')}`,
          status: mapOrderStatus(foundOrder.status),
          nights: foundOrder.nightCount || calculateNights(foundOrder.checkInDate, foundOrder.checkOutDate),
          roomName: foundOrder.roomName || '房间名称',
          roomType: foundOrder.roomType || '房间类型',
          roomImage: foundOrder.roomImage || '/src/assets/images/实地调研/房间参观/房间参观1.jpg'
        }
      } else {
        throw new Error('订单不存在')
      }
    } else {
      throw new Error('获取订单详情失败')
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    // 模拟数据用于演示
    const orderId = route.params.id
    order.value = {
      id: orderId,
      orderNumber: 'MG202501070001',
      roomName: '蘑菇森林小屋',
      roomType: '蘑菇小屋',
      roomImage: '/src/assets/images/实地调研/房间参观/房间参观1.jpg',
      checkInDate: '2025-01-15',
      checkOutDate: '2025-01-17',
      nights: 2,
      roomPrice: 388,
      totalAmount: 776,
      status: 'confirmed',
      createTime: '2025-01-07 10:30:00',
      guestCount: 2,
      phone: '13800138000',
      specialRequirements: '希望安排安静的房间，谢谢！'
    }
  } finally {
    loading.value = false
  }
}

const calculateNights = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return 0
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const diffTime = checkOutDate.getTime() - checkInDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

const mapOrderStatus = (status: number | string) => {
  const statusMap: Record<string | number, string> = {
    0: 'pending',
    1: 'confirmed',
    2: 'completed',
    3: 'cancelled',
    'pending': 'pending',
    'confirmed': 'confirmed',
    'completed': 'completed',
    'cancelled': 'cancelled'
  }
  return statusMap[status] || 'pending'
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

const getStatusIcon = (status: string) => {
  const iconMap: Record<string, string> = {
    pending: 'fas fa-clock',
    confirmed: 'fas fa-check-circle',
    completed: 'fas fa-flag-checkered',
    cancelled: 'fas fa-times-circle'
  }
  return iconMap[status] || 'fas fa-question-circle'
}

const getStatusDescription = (status: string) => {
  const descMap: Record<string, string> = {
    pending: '您的订单正在等待管理员确认，请耐心等待',
    confirmed: '您的订单已确认，请按时入住',
    completed: '您的订单已完成，感谢您的入住',
    cancelled: '订单已取消'
  }
  return descMap[status] || ''
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  })
}

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cancelOrder = async () => {
  if (confirm('确定要取消这个订单吗？')) {
    try {
      const response: any = await request.delete(`/h/order/${order.value.id}`)
      if (response.code === 200) {
        order.value.status = 'cancelled'
        alert('订单已取消')
      } else {
        alert(response.msg || '取消订单失败')
      }
    } catch (error) {
      console.error('取消订单失败:', error)
      alert('取消订单失败，请稍后重试')
    }
  }
}

const rateOrder = () => {
  router.push(`/order/${order.value.id}/rate`)
}

const contactService = () => {
  alert('客服功能开发中，如有问题请拨打客服电话：400-123-4567')
}

const goBack = () => {
  router.push('/orders')
}

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

// 生命周期
onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
/* 基础样式 */
.order-detail-page {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 导航栏样式 */
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4caf50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-menu {
  display: flex;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
}

.nav-link:hover,
.nav-link.active {
  color: #4caf50;
  border-bottom-color: #4caf50;
}

.nav-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-welcome {
  color: #6b7280;
  font-weight: 500;
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
  color: #4caf50;
  border: 1px solid #4caf50;
}

.btn-outline:hover {
  background: #4caf50;
  color: white;
}

.btn-primary {
  background: #4caf50;
  color: white;
  border: 1px solid #4caf50;
}

.btn-primary:hover {
  background: #45a049;
}

.btn-danger {
  background: #dc2626;
  color: white;
  border: 1px solid #dc2626;
}

.btn-danger:hover {
  background: #b91c1c;
}

/* 主要内容 */
.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.loading-container i {
  font-size: 2rem;
  color: #4caf50;
  margin-bottom: 16px;
}

.error-container i {
  font-size: 3rem;
  color: #f56565;
  margin-bottom: 16px;
}

/* 返回按钮 */
.back-section {
  margin-bottom: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.back-btn:hover {
  color: #4caf50;
}

/* 订单详情容器 */
.order-detail-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 订单状态区域 */
.order-status-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.status-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
}

.status-icon.pending {
  background: #f59e0b;
}

.status-icon.confirmed {
  background: #10b981;
}

.status-icon.completed {
  background: #3b82f6;
}

.status-icon.cancelled {
  background: #ef4444;
}

.status-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.status-desc {
  color: #6b7280;
  margin: 0;
}

/* 信息卡片 */
.order-info-card,
.room-info-card,
.cost-detail-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.order-info-card h3,
.room-info-card h3,
.cost-detail-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.label {
  color: #6b7280;
  font-weight: 500;
}

.value {
  color: #1f2937;
  font-weight: 600;
}

.special-requirements {
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.requirements-text {
  margin: 8px 0 0 0;
  color: #1f2937;
  background: #f9fafb;
  padding: 12px;
  border-radius: 6px;
}

/* 房间信息 */
.room-content {
  display: flex;
  gap: 24px;
}

.room-image {
  flex-shrink: 0;
}

.room-image img {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.room-details {
  flex: 1;
}

.room-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.room-type {
  color: #6b7280;
  margin: 0 0 20px 0;
}

.stay-dates {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-item i {
  color: #4caf50;
  font-size: 1.2rem;
}

.date-label {
  display: block;
  font-size: 0.9rem;
  color: #6b7280;
}

.date-value {
  display: block;
  font-weight: 600;
  color: #1f2937;
}

.date-separator {
  color: #9ca3af;
}

.nights-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-weight: 500;
}

.nights-info i {
  color: #4caf50;
}

/* 费用明细 */
.cost-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  color: #6b7280;
}

.cost-total {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  font-weight: 600;
  color: #1f2937;
}

.total-amount {
  color: #4caf50;
  font-size: 1.2rem;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 24px;
}

.action-buttons .btn {
  padding: 12px 24px;
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .order-status-section {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }
  
  .room-content {
    flex-direction: column;
  }
  
  .room-image img {
    width: 100%;
    height: 200px;
  }
  
  .stay-dates {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .date-separator {
    transform: rotate(90deg);
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>

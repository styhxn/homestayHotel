<template>
  <div class="orders-page">
    <AppNavbar />

    <!-- 动态背景 -->
    <div class="animated-background">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
    </div>

    <!-- 主要内容 -->
    <main class="orders-main">
      <div class="orders-container">
        <!-- 页面标题 - 添加动画 -->
        <div class="page-header" data-aos="fade-down" data-aos-duration="800">
          <div class="header-decoration">
            <div class="decoration-line"></div>
            <div class="decoration-icon">
              <i class="fas fa-receipt"></i>
            </div>
            <div class="decoration-line"></div>
          </div>
          <h1 class="page-title">
            <span class="title-text">我的预订</span>
            <div class="title-underline"></div>
          </h1>
          <p class="page-subtitle">管理您在普洱蘑菇庄园的美好住宿体验</p>
          <div class="stats-preview" v-if="auth.isAuthenticated">
            <div class="stat-item" data-aos="zoom-in" data-aos-delay="200">
              <div class="stat-number">{{ allOrders.length }}</div>
              <div class="stat-label">总订单</div>
            </div>
            <div class="stat-item" data-aos="zoom-in" data-aos-delay="400">
              <div class="stat-number">{{ getOrderCount('completed') }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-item" data-aos="zoom-in" data-aos-delay="600">
              <div class="stat-number">{{ getOrderCount('pending') }}</div>
              <div class="stat-label">待确认</div>
            </div>
          </div>
        </div>

        <!-- 订单状态筛选 - 添加动画 -->
        <div class="order-filters" data-aos="fade-up" data-aos-delay="300">
          <div class="filters-container">
            <button
              v-for="(status, index) in orderStatuses"
              :key="status.value"
              @click="currentFilter = status.value"
              :class="['filter-btn', { active: currentFilter === status.value }]"
              :data-aos="'fade-up'"
              :data-aos-delay="400 + index * 100"
            >
              <div class="filter-icon">
                <i :class="getFilterIcon(status.value)"></i>
              </div>
              <span class="filter-text">{{ status.label }}</span>
              <div class="count" v-if="getOrderCount(status.value) > 0">
                {{ getOrderCount(status.value) }}
              </div>
              <div class="filter-ripple"></div>
            </button>
          </div>
        </div>

        <!-- 订单列表 -->
        <div class="orders-section">
          <!-- 未登录提示 -->
          <div v-if="!auth.isAuthenticated" class="login-prompt" data-aos="fade-up">
            <div class="prompt-animation">
              <div class="lock-icon">
                <i class="fas fa-user-lock"></i>
                <div class="lock-pulse"></div>
              </div>
            </div>
            <h3>请先登录</h3>
            <p>登录后即可查看您的订单信息</p>
            <div class="prompt-actions">
              <router-link to="/login" class="btn btn-primary btn-animated">
                <span>立即登录</span>
                <div class="btn-shine"></div>
              </router-link>
              <router-link to="/register" class="btn btn-outline btn-animated">
                <span>注册账号</span>
                <div class="btn-shine"></div>
              </router-link>
            </div>
          </div>

          <!-- 已登录用户的订单内容 -->
          <template v-else>
            <div v-if="loading" class="loading" data-aos="fade-in">
              <div class="loading-animation">
                <div class="loading-spinner">
                  <div class="spinner-ring"></div>
                  <div class="spinner-ring"></div>
                  <div class="spinner-ring"></div>
                </div>
                <div class="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <span class="loading-text">正在加载您的订单...</span>
            </div>

            <div v-else-if="filteredOrders.length === 0" class="no-orders" data-aos="fade-up">
              <div class="empty-animation">
                <div class="empty-icon">
                  <i class="fas fa-calendar-times"></i>
                  <div class="empty-waves">
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                  </div>
                </div>
              </div>
              <h3>暂无{{ currentFilterLabel }}订单</h3>
              <p>开始您的普洱蘑菇庄园之旅吧</p>
              <router-link to="/ai-room-selection" class="btn btn-primary btn-animated">
                <span>AI智能选房</span>
                <div class="btn-shine"></div>
              </router-link>
            </div>

            <div v-else class="orders-list">
            <div
              v-for="(order, index) in filteredOrders"
              :key="order.id"
              class="order-card"
              :data-aos="'fade-up'"
              :data-aos-delay="index * 100"
              @click="viewOrderDetails(order)"
            >
              <!-- 订单卡片装饰 -->
              <div class="card-decoration">
                <div class="decoration-pattern"></div>
                <div class="card-glow"></div>
              </div>

              <div class="order-header">
                <div class="order-info">
                  <div class="order-number-section">
                    <div class="order-icon">
                      <i :class="order.type === 'product' ? 'fas fa-shopping-bag' : 'fas fa-bed'"></i>
                    </div>
                    <div class="order-details">
                      <h3 class="order-number">{{ order.orderNo || order.orderNumber }}</h3>
                      <div class="order-meta">
                        <span class="order-date">
                          <i class="fas fa-clock"></i>
                          {{ formatDate(order.createdAt || order.createTime) }}
                        </span>
                        <span class="order-type" :class="order.type">
                          <i :class="order.type === 'product' ? 'fas fa-tag' : 'fas fa-home'"></i>
                          {{ order.type === 'product' ? '产品订单' : '房间订单' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="order-status-container">
                  <div class="order-status" :class="order.status">
                    <div class="status-icon">
                      <i :class="getStatusIcon(order.status)"></i>
                    </div>
                    <span class="status-text">{{ getStatusText(order.status) }}</span>
                    <div class="status-pulse" v-if="order.status === 'pending'"></div>
                  </div>
                </div>
              </div>
              
              <div class="order-content">
                <!-- 房间订单内容 -->
                <div v-if="order.type !== 'product'" class="room-info">
                  <div class="room-image-container">
                    <img :src="order.roomImage || '/src/assets/images/实地调研/房间参观/房间参观1.jpg'" :alt="order.roomName" class="room-image">
                    <div class="image-overlay">
                      <div class="overlay-content">
                        <i class="fas fa-eye"></i>
                        <span>查看详情</span>
                      </div>
                    </div>
                    <div class="image-frame"></div>
                  </div>
                  <div class="room-details">
                    <div class="room-header">
                      <h4 class="room-name">
                        <i class="fas fa-home"></i>
                        {{ order.roomName }}
                      </h4>
                      <div class="room-rating">
                        <div class="stars">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </div>
                        <span class="rating-text">5.0</span>
                      </div>
                    </div>
                    <p class="room-type">
                      <i class="fas fa-tag"></i>
                      {{ order.roomType }}
                    </p>
                    <div class="stay-info">
                      <div class="stay-item">
                        <div class="stay-icon">
                          <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="stay-details">
                          <span class="stay-label">入住</span>
                          <span class="stay-value">{{ formatDate(order.checkInDate) }}</span>
                        </div>
                      </div>
                      <div class="stay-separator">
                        <i class="fas fa-arrow-right"></i>
                      </div>
                      <div class="stay-item">
                        <div class="stay-icon">
                          <i class="fas fa-calendar-times"></i>
                        </div>
                        <div class="stay-details">
                          <span class="stay-label">退房</span>
                          <span class="stay-value">{{ formatDate(order.checkOutDate) }}</span>
                        </div>
                      </div>
                      <div class="nights-badge">
                        <i class="fas fa-moon"></i>
                        <span>{{ order.nights }}晚</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 产品订单内容 -->
                <div v-if="order.type === 'product'" class="product-info">
                  <div v-for="item in order.items" :key="item.id" class="product-item">
                    <img :src="item.image" :alt="item.name" class="product-image">
                    <div class="product-details">
                      <h4 class="product-name">{{ item.name }}</h4>
                      <p class="product-desc">{{ item.description }}</p>
                      <div class="product-specs" v-if="item.specs">
                        <span v-for="spec in item.specs.slice(0, 2)" :key="spec" class="spec-tag">{{ spec }}</span>
                      </div>
                    </div>
                    <div class="product-quantity">
                      <span>x{{ item.quantity }}</span>
                    </div>
                    <div class="product-price">
                      <span class="current-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
                    </div>
                  </div>

                  <!-- 收货信息 -->
                  <div class="shipping-info">
                    <div class="info-item">
                      <span class="label">收货地址：</span>
                      <span class="value">{{ order.shippingAddress }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">联系电话：</span>
                      <span class="value">{{ order.contactPhone }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="order-price">
                  <div class="price-container">
                    <div class="price-breakdown">
                      <div class="price-item">
                        <span class="price-label">
                          <i class="fas fa-bed"></i>
                          房费
                        </span>
                        <span class="price-calculation">¥{{ order.roomPrice }} × {{ order.nights }}晚</span>
                      </div>
                      <div class="price-divider"></div>
                      <div class="price-item total">
                        <span class="price-label">
                          <i class="fas fa-calculator"></i>
                          总计
                        </span>
                        <span class="total-amount">
                          <span class="currency">¥</span>
                          <span class="amount">{{ order.totalAmount }}</span>
                        </span>
                      </div>
                    </div>
                    <div class="price-decoration">
                      <div class="price-glow"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="order-actions">
                <div class="actions-container">
                  <button
                    v-if="order.status === 'pending'"
                    @click.stop="cancelOrder(order)"
                    class="btn btn-outline btn-danger btn-animated"
                  >
                    <i class="fas fa-times"></i>
                    <span>取消订单</span>
                    <div class="btn-ripple"></div>
                  </button>

                  <button
                    v-if="order.status === 'confirmed'"
                    @click.stop="viewOrderDetails(order)"
                    class="btn btn-outline btn-animated"
                  >
                    <i class="fas fa-eye"></i>
                    <span>查看详情</span>
                    <div class="btn-ripple"></div>
                  </button>

                  <button
                    v-if="order.status === 'completed'"
                    @click.stop="rateOrder(order)"
                    class="btn btn-primary btn-animated"
                  >
                    <i class="fas fa-star"></i>
                    <span>评价订单</span>
                    <div class="btn-ripple"></div>
                  </button>

                  <button
                    @click.stop="viewOrderDetails(order)"
                    class="btn btn-outline btn-animated"
                  >
                    <i class="fas fa-file-alt"></i>
                    <span>订单详情</span>
                    <div class="btn-ripple"></div>
                  </button>
                </div>
              </div>
            </div>
            </div>
          </template>
        </div>
      </div>
    </main>


  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useCartStore, type CartOrder } from '../../stores/cart'
import request from '../../utils/request'
import { productAI } from '../../services/ProductAIService'
import AppNavbar from '../../components/AppNavbar.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'


const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const cartStore = useCartStore()

// 响应式数据
const loading = ref(false)
const orders = ref<any[]>([])
const currentFilter = ref('all')

// 房间图片映射
const roomImageMap: { [key: string]: string } = {
  '201': '/src/assets/images/实地调研/房间参观/房间参观1.jpg',
  '202': '/src/assets/images/实地调研/房间参观/房间参观1.jpg',
  '301': '/src/assets/images/实地调研/房间参观/房间参观2.jpg',
  '302': '/src/assets/images/实地调研/房间参观/房间参观2.jpg',
  '401': '/src/assets/images/实地调研/室内调研/室内3.jpg',
  '402': '/src/assets/images/实地调研/室内调研/室内3.jpg',
  '501': '/src/assets/images/实地调研/室内调研/室内5.jpg',
  '502': '/src/assets/images/实地调研/室内调研/室内5.jpg',
  '601': '/src/assets/images/实地调研/室内调研/室内7.jpg',
  '602': '/src/assets/images/实地调研/室内调研/室内7.jpg'
}

// 房间名称映射
const roomNameMap: { [key: string]: string } = {
  '201': '蘑菇森林小屋',
  '202': '蘑菇森林小屋',
  '301': '蘑菇生态园',
  '302': '蘑菇生态园',
  '401': '茶文化体验馆',
  '402': '茶文化体验馆',
  '501': '普洱茶园',
  '502': '普洱茶园',
  '601': '生态餐厅',
  '602': '生态餐厅'
}

// 订单状态配置
const orderStatuses = [
  { value: 'all', label: '全部订单' },
  { value: 'pending', label: '待确认' },
  { value: 'confirmed', label: '已确认' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

// 购物车订单状态映射
const mapCartOrderStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    '待发货': 'pending',
    '已发货': 'confirmed',
    '已完成': 'completed',
    '已取消': 'cancelled'
  }
  return statusMap[status] || 'pending'
}

// 获取购物车订单
const cartOrders = computed(() => {
  return cartStore.getUserOrders().map(order => ({
    id: order.id,
    orderNo: order.id,
    orderNumber: order.id,
    status: mapCartOrderStatus(order.status),
    originalStatus: order.status,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    createTime: order.createdAt,
    type: 'product',
    items: order.items,
    shippingAddress: order.shippingAddress,
    contactPhone: order.contactPhone,
    remarks: order.remarks,
    // 为了显示统一，添加一些房间订单的字段
    roomName: '周边产品',
    roomType: '产品订单',
    roomImage: order.items?.[0]?.image || '/src/assets/images/周边产品/普洱茶叶1.jpg'
  }))
})

// 合并所有订单
const allOrders = computed(() => {
  return [...orders.value, ...cartOrders.value].sort((a, b) => {
    const timeA = new Date(a.createdAt || a.createTime).getTime()
    const timeB = new Date(b.createdAt || b.createTime).getTime()
    return timeB - timeA
  })
})

// 计算属性
const filteredOrders = computed(() => {
  if (currentFilter.value === 'all') {
    return allOrders.value
  }
  return allOrders.value.filter(order => order.status === currentFilter.value)
})

const currentFilterLabel = computed(() => {
  const status = orderStatuses.find(s => s.value === currentFilter.value)
  return status ? status.label.replace('订单', '') : ''
})

// 辅助函数
const calculateNights = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return 0
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const diffTime = checkOutDate.getTime() - checkInDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

const mapOrderStatus = (state: string, status?: number) => {
  // 优先使用state字段，如果没有则使用status字段映射
  if (state) {
    const stateMap: Record<string, string> = {
      '预订': 'pending',    // 待确认/预订中
      '入住': 'confirmed',  // 已确认/入住中
      '完成': 'completed',  // 已完成
      '取消': 'cancelled',  // 已取消
      '删除': 'cancelled'   // 已删除（显示为取消）
    }
    return stateMap[state] || 'pending'
  }

  // 备用：根据后端status状态码映射到前端状态
  const statusMap: Record<string | number, string> = {
    0: 'pending',    // 正常 -> 待确认
    1: 'completed',  // 完成 -> 已完成
    2: 'cancelled',  // 关闭 -> 已取消
    3: 'cancelled',  // 删除 -> 已取消
    'pending': 'pending',
    'confirmed': 'confirmed',
    'completed': 'completed',
    'cancelled': 'cancelled'
  }
  return statusMap[status || 0] || 'pending'
}

// 方法
const fetchOrders = async () => {
  loading.value = true
  try {
    const response: any = await request.get('/h/order/getUserOrders')
    console.log('订单列表响应:', response)

    if (response.code === 200 || response.code === "200") {
      // 检查是否有data和records字段
      if (response.data && Array.isArray(response.data.records)) {
        orders.value = response.data.records.map((order: any) => {
          const roomCode = order.roomCode || order.roomName
          return {
            id: order.id,
            orderNumber: order.orderNumber || `MG${order.id.toString().padStart(8, '0')}`,
            roomName: roomNameMap[roomCode] || order.roomName || roomCode || '房间名称',
            roomType: order.roomType || '房间类型',
            roomImage: roomImageMap[roomCode] || order.roomImage || '/src/assets/images/实地调研/房间参观/房间参观1.jpg',
          checkInDate: order.startDate,
          checkOutDate: order.endDate,
          nights: order.days || calculateNights(order.startDate, order.endDate),
          roomPrice: order.roomPrice || order.price,
          totalAmount: order.total || order.amount,
          status: mapOrderStatus(order.state, order.status), // 传递state和status
          state: order.state, // 保留原始state字段
          systemStatus: order.status, // 保留原始status字段
          createTime: order.createTime,
          guestCount: order.amount,
          phone: order.phone,
          specialRequirements: order.userRemark
          }
        })
        console.log('处理后的订单列表:', orders.value)
      } else {
        // 没有records字段或records不是数组，设置为空数组
        orders.value = []
        console.log('没有订单数据，设置为空数组')
      }
    } else {
      throw new Error(response.msg || '获取订单列表失败')
    }
  } catch (error: any) {
    console.error('获取订单列表失败:', error)
    // 如果获取失败，显示空列表
    orders.value = []

    // 检查是否是登录问题
    if (error.response && error.response.status === 401) {
      console.log('401错误，跳转到登录页')
      alert('登录已过期，请重新登录')
      auth.logout()
      router.push('/login')
    } else if (error.response && error.response.status === 500) {
      const errorMessage = error.response.data?.message || error.message || ''
      console.log('500错误，错误信息:', errorMessage)
      if (errorMessage.includes('Token无效') || errorMessage.includes('NotLoginException')) {
        alert('登录已过期，请重新登录')
        auth.logout()
        router.push('/login')
      } else {
        alert('获取订单列表失败，请稍后重试')
      }
    } else if (error.message && error.message.includes('登录已过期')) {
      // 这是从request拦截器抛出的错误
      console.log('Token过期错误，跳转到登录页')
      auth.logout()
      router.push('/login')
    } else {
      console.log('其他错误:', error.message)
      alert('获取订单列表失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

const getOrderCount = (status: string) => {
  if (status === 'all') return allOrders.value.length
  return allOrders.value.filter(order => order.status === status).length
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

// 获取状态图标
const getStatusIcon = (status: string) => {
  const iconMap: Record<string, string> = {
    pending: 'fas fa-clock',
    confirmed: 'fas fa-check-circle',
    completed: 'fas fa-star',
    cancelled: 'fas fa-times-circle'
  }
  return iconMap[status] || 'fas fa-question-circle'
}

// 获取过滤器图标
const getFilterIcon = (filter: string) => {
  const iconMap: Record<string, string> = {
    all: 'fas fa-list',
    pending: 'fas fa-clock',
    confirmed: 'fas fa-check-circle',
    completed: 'fas fa-star',
    cancelled: 'fas fa-times-circle'
  }
  return iconMap[filter] || 'fas fa-list'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const cancelOrder = async (order: any) => {
  console.log('取消订单:', order)

  if (confirm('确定要取消这个订单吗？')) {
    try {
      if (order.type === 'product') {
        // 购物车订单 - 更新本地状态
        const orderIndex = cartStore.orders.findIndex(o => o.id === order.id)
        if (orderIndex !== -1) {
          cartStore.orders[orderIndex].status = '已取消'
          // 保存到localStorage
          localStorage.setItem('product_orders', JSON.stringify(cartStore.orders))
          alert('订单已取消')
          return
        }
      } else {
        // 房间订单 - 调用后端API
        // 检查后端的state字段，只有"预订"状态才能取消
        if (order.state !== '预订') {
          alert(`只有预订状态的订单才能取消，当前状态：${order.state || '未知'}`)
          return
        }

        console.log('取消订单请求:', order.id)
        const response: any = await request.delete(`/h/order/${order.id}`)
        console.log('取消订单响应:', response)

        if (response.code === 200 || response.code === "200") {
          alert('订单已取消')
          // 重新获取订单列表
          fetchOrders()

          // 通知其他页面刷新房间状态
          window.dispatchEvent(new CustomEvent('orderCancelled', {
            detail: { roomId: order.roomId, orderId: order.id }
          }))
        } else {
          const errorMsg = response.msg || response.message || '取消订单失败'
          alert(errorMsg)
          console.error('取消订单失败:', response)
        }
      }
    } catch (error: any) {
      console.error('取消订单失败:', error)
      let errorMsg = '取消订单失败，请稍后重试'

      if (error.response) {
        // 服务器返回了错误响应
        if (error.response.status === 404) {
          errorMsg = '订单不存在或已被删除'
        } else if (error.response.status === 403) {
          errorMsg = '没有权限取消此订单'
        } else if (error.response.data?.msg) {
          errorMsg = error.response.data.msg
        }
      }

      alert(errorMsg)
    }
  }
}

const viewOrderDetails = (order: any) => {
  router.push(`/order/${order.id}`)
}

const rateOrder = (order: any) => {
  router.push(`/order/${order.id}/rate`)
}

// handleLogout 现在由 AppNavbar 组件处理

// 处理产品订单创建
const handleProductOrder = () => {
  const action = route.query.action
  if (action === 'create') {
    const productId = route.query.productId as string
    const quantity = parseInt(route.query.quantity as string) || 1
    const items = route.query.items as string

    if (productId) {
      // 单个产品订单
      createProductOrder(productId, quantity)
    } else if (items) {
      // 购物车订单
      try {
        const cartItems = JSON.parse(items)
        createCartOrder(cartItems)
      } catch (error) {
        console.error('解析购物车数据失败:', error)
      }
    }
  }
}

// 创建产品订单
const createProductOrder = async (productId: string, quantity: number) => {
  const product = productAI.getProductById(productId)
  if (!product) {
    alert('产品不存在')
    return
  }

  const orderData = {
    type: 'product',
    productId: product.id,
    productName: product.name,
    quantity: quantity,
    unitPrice: product.price,
    totalAmount: product.price * quantity,
    status: 'pending',
    createTime: new Date().toISOString()
  }

  try {
    // 这里可以调用后端API创建订单
    // const response = await request.post('/h/order/createProductOrder', orderData)

    // 暂时模拟创建成功
    console.log('创建产品订单:', orderData)
    alert(`成功创建订单：${product.name} x ${quantity}`)

    // 清除URL参数
    router.replace('/orders')

    // 刷新订单列表
    fetchOrders()
  } catch (error) {
    console.error('创建产品订单失败:', error)
    alert('创建订单失败，请稍后重试')
  }
}

// 创建购物车订单
const createCartOrder = async (cartItems: any[]) => {
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const orderData = {
    type: 'cart',
    items: cartItems,
    totalAmount: totalAmount,
    status: 'pending',
    createTime: new Date().toISOString()
  }

  try {
    // 这里可以调用后端API创建订单
    // const response = await request.post('/h/order/createCartOrder', orderData)

    // 暂时模拟创建成功
    console.log('创建购物车订单:', orderData)
    alert(`成功创建订单，共${cartItems.length}件商品`)

    // 清除URL参数
    router.replace('/orders')

    // 刷新订单列表
    fetchOrders()
  } catch (error) {
    console.error('创建购物车订单失败:', error)
    alert('创建订单失败，请稍后重试')
  }
}

// 生命周期
onMounted(() => {
  if (auth.isAuthenticated) {
    // 初始化购物车数据
    cartStore.initializeUserData()
    fetchOrders()
  }
  handleProductOrder()

  // 初始化AOS动画库
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50
  })
})
</script>

<style scoped>
/* 页面容器 */
.orders-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #2d5016 0%, #4a7c59 50%, #1e3a5f 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* 动态背景 */
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 20s infinite linear;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: 10%;
  animation-delay: -5s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 30%;
  left: 20%;
  animation-delay: -10s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  right: 20%;
  animation-delay: -15s;
}

.shape-5 {
  width: 40px;
  height: 40px;
  top: 50%;
  left: 50%;
  animation-delay: -7s;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.3;
  }
  100% {
    transform: translateY(0px) rotate(360deg);
    opacity: 0.7;
  }
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
  background: linear-gradient(135deg, #a7ca87 0%, #0cd398 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  color: #0cd398;
  border-bottom-color: #0cd398;
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

/* 按钮样式 */
.btn {
  position: relative;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  overflow: hidden;
  min-width: 120px;
  justify-content: center;
}

.btn-animated {
  overflow: hidden;
}

.btn-animated::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-animated:hover::before {
  left: 100%;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.btn-animated:hover .btn-shine {
  left: 100%;
}

.btn-outline {
  background: transparent;
  color: #0cd398;
  border: 2px solid #0cd398;
  backdrop-filter: blur(10px);
}

.btn-outline:hover {
  background: #0cd398;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(12, 211, 152, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #a7ca87, #0cd398);
  color: white;
  border: 2px solid transparent;
  box-shadow: 0 4px 15px rgba(167, 202, 135, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #549688, #a7ca87);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(167, 202, 135, 0.4);
}

.btn-danger {
  color: #dc2626;
  border: 2px solid #dc2626;
  background: transparent;
}

.btn-danger:hover {
  background: #dc2626;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
}

.btn-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: btnRipple 0.6s linear;
  pointer-events: none;
}

@keyframes btnRipple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.btn i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.btn:hover i {
  transform: scale(1.1);
}

/* 主要内容 */
.orders-main {
  padding: 40px 0;
  position: relative;
  z-index: 1;
}

.orders-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 60px;
  padding: 40px 0;
}

.header-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  gap: 20px;
}

.decoration-line {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shimmer 2s infinite;
}

.decoration-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.decoration-icon i {
  font-size: 1.5rem;
  color: white;
  animation: pulse 2s infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.page-title {
  position: relative;
  margin-bottom: 20px;
}

.title-text {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
  display: inline-block;
  animation: titleGlow 3s ease-in-out infinite alternate;
}

.title-underline {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #a7ca87, #0cd398, #a7ca87);
  border-radius: 2px;
  animation: underlineExpand 1s ease-out 0.5s both;
}

@keyframes titleGlow {
  0% { text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); }
  100% { text-shadow: 0 4px 30px rgba(212, 175, 55, 0.4); }
}

@keyframes underlineExpand {
  0% { width: 0; }
  100% { width: 100px; }
}

.page-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* 统计预览 */
.stats-preview {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 120px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 5px;
  text-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* 订单筛选器 */
.order-filters {
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
}

.filters-container {
  display: flex;
  gap: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  position: relative;
  padding: 15px 25px;
  border: none;
  border-radius: 15px;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  min-width: 120px;
  justify-content: center;
}

.filter-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.filter-btn:hover::before {
  opacity: 1;
}

.filter-btn:hover {
  transform: translateY(-2px);
  color: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.filter-btn.active {
  background: linear-gradient(135deg, #a7ca87, #0cd398);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(167, 202, 135, 0.4);
}

.filter-btn.active::before {
  opacity: 0;
}

.filter-icon {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.filter-btn:hover .filter-icon {
  transform: scale(1.1);
}

.filter-text {
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.count {
  background: rgba(255, 255, 255, 0.3);
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 20px;
  text-align: center;
  animation: countPulse 0.5s ease-out;
}

.filter-btn.active .count {
  background: rgba(255, 255, 255, 0.4);
}

@keyframes countPulse {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.filter-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* 登录提示 */
.login-prompt {
  text-align: center;
  padding: 80px 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  margin: 0 auto;
}

.prompt-animation {
  margin-bottom: 30px;
}

.lock-icon {
  position: relative;
  display: inline-block;
}

.lock-icon i {
  font-size: 4rem;
  color: #0cd398;
  animation: lockBounce 2s infinite;
}

.lock-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 2px solid #0cd398;
  border-radius: 50%;
  animation: lockPulse 2s infinite;
}

@keyframes lockBounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes lockPulse {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

.login-prompt h3 {
  color: #1f2937;
  margin-bottom: 15px;
  font-size: 1.8rem;
  font-weight: 700;
}

.login-prompt p {
  margin-bottom: 30px;
  color: #6b7280;
  font-size: 1.1rem;
  line-height: 1.6;
}

.prompt-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 80px 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  max-width: 400px;
  margin: 0 auto;
}

.loading-animation {
  margin-bottom: 30px;
}

.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid #0cd398;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 60px;
  height: 60px;
  top: 10px;
  left: 10px;
  border-top-color: #0cd398;
  animation-delay: -0.3s;
}

.spinner-ring:nth-child(3) {
  width: 40px;
  height: 40px;
  top: 20px;
  left: 20px;
  border-top-color: #a7ca87;
  animation-delay: -0.6s;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: #0cd398;
  border-radius: 50%;
  animation: loadingDots 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(3) {
  animation-delay: -0.16s;
}

@keyframes loadingDots {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.2); opacity: 1; }
}

.loading-text {
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
}

/* 空状态 */
.no-orders {
  text-align: center;
  padding: 80px 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  max-width: 500px;
  margin: 0 auto;
}

.empty-animation {
  margin-bottom: 30px;
}

.empty-icon {
  position: relative;
  display: inline-block;
}

.empty-icon i {
  font-size: 5rem;
  color: #d1d5db;
  animation: emptyFloat 3s ease-in-out infinite;
}

.empty-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.wave {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  animation: waveExpand 2s infinite;
}

.wave:nth-child(2) {
  animation-delay: 0.5s;
}

.wave:nth-child(3) {
  animation-delay: 1s;
}

@keyframes emptyFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes waveExpand {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

.no-orders h3 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #374151;
  font-weight: 700;
}

.no-orders p {
  margin-bottom: 30px;
  color: #6b7280;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* 订单列表 */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.order-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.order-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border-color: rgba(212, 175, 55, 0.3);
}

/* 卡片装饰 */
.card-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #a7ca87, #0cd398, #a7ca87);
  animation: decorationShimmer 3s infinite;
}

.decoration-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(30px, -30px);
}

.card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.order-card:hover .card-glow {
  opacity: 1;
}

@keyframes decorationShimmer {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* 订单头部 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.8));
}

.order-number-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.order-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #a7ca87, #0cd398);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.order-details h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.order-meta {
  display: flex;
  gap: 15px;
  align-items: center;
}

.order-date {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
}

.order-type {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-type.product {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1976d2;
}

.order-type:not(.product) {
  background: linear-gradient(135deg, #f3e5f5, #e1bee7);
  color: #7b1fa2;
}

/* 订单状态 */
.order-status-container {
  position: relative;
}

.order-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.order-status::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.order-status:hover::before {
  transform: translateX(100%);
}

.status-icon {
  font-size: 1rem;
  animation: statusPulse 2s infinite;
}

@keyframes statusPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.order-status.pending {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #d97706;
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.2);
}

.order-status.confirmed {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #059669;
  box-shadow: 0 4px 15px rgba(5, 150, 105, 0.2);
}

.order-status.completed {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #2563eb;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
}

.order-status.cancelled {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2);
}

.status-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border: 2px solid currentColor;
  border-radius: 16px;
  animation: statusRipple 2s infinite;
}

@keyframes statusRipple {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
}

/* 订单内容 */
.order-content {
  padding: 30px;
  display: flex;
  gap: 30px;
}

/* 房间信息 */
.room-info {
  display: flex;
  gap: 20px;
  flex: 1;
}

.room-image-container {
  position: relative;
  width: 160px;
  height: 120px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.room-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.room-image-container:hover .room-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.room-image-container:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 600;
}

.overlay-content i {
  font-size: 1.5rem;
}

.image-frame {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid transparent;
  border-radius: 16px;
  background: linear-gradient(45deg, #a7ca87, #0cd398) border-box;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.room-image-container:hover .image-frame {
  opacity: 1;
}

/* 产品订单样式 */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-details {
  flex: 1;
}

.product-name {
  margin: 0 0 5px 0;
  font-size: 1rem;
  color: #333;
}

.product-desc {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0 0 8px 0;
}

.product-specs {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.spec-tag {
  background: #e9ecef;
  color: #6c757d;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.product-quantity {
  font-weight: 600;
  color: #333;
}

.product-price {
  text-align: right;
}

.current-price {
  color: #e74c3c;
  font-weight: 600;
  font-size: 1.1rem;
}

.shipping-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  color: #6c757d;
  min-width: 80px;
}

.info-item .value {
  color: #333;
}

.order-type {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  margin-left: 10px;
}

/* 房间详情 */
.room-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.room-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0;
}

.room-name i {
  color: #0cd398;
  font-size: 1.1rem;
}

.room-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  color: #fbbf24;
  font-size: 0.9rem;
}

.rating-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
}

.room-type {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}

.room-type i {
  color: #0cd398;
  font-size: 0.9rem;
}

/* 住宿信息 */
.stay-info {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(247, 233, 142, 0.05));
  border-radius: 16px;
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.stay-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stay-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #a7ca87, #0cd398);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.stay-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stay-label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stay-value {
  font-size: 0.95rem;
  color: #1f2937;
  font-weight: 600;
}

.stay-separator {
  display: flex;
  align-items: center;
  color: #0cd398;
  font-size: 1.2rem;
  animation: arrowPulse 2s infinite;
}

@keyframes arrowPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.nights-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #1f2937, #374151);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(31, 41, 55, 0.3);
}

.nights-badge i {
  color: #fbbf24;
  font-size: 1rem;
}

/* 价格信息 */
.order-price {
  min-width: 250px;
}

.price-container {
  position: relative;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(247, 233, 142, 0.05));
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.price-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}

.price-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-weight: 500;
}

.price-label i {
  color: #0cd398;
  font-size: 0.9rem;
}

.price-calculation {
  color: #374151;
  font-weight: 600;
}

.price-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
  margin: 8px 0;
}

.price-item.total {
  font-weight: 700;
  color: #1f2937;
  font-size: 1.1rem;
  padding-top: 8px;
}

.total-amount {
  display: flex;
  align-items: baseline;
  gap: 2px;
  color: #0cd398;
  font-size: 1.4rem;
  font-weight: 800;
  text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
}

.currency {
  font-size: 1rem;
  font-weight: 600;
}

.amount {
  font-size: 1.4rem;
  animation: priceGlow 3s ease-in-out infinite alternate;
}

@keyframes priceGlow {
  0% { text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3); }
  100% { text-shadow: 0 2px 20px rgba(212, 175, 55, 0.6); }
}

.price-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(20px, -20px);
}

.price-glow {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  background: linear-gradient(45deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.price-container:hover .price-glow {
  opacity: 1;
}

/* 操作按钮 */
.order-actions {
  padding: 25px 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(255, 255, 255, 0.8));
}

.actions-container {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .stats-preview {
    gap: 20px;
  }

  .stat-item {
    min-width: 100px;
    padding: 15px;
  }

  .filters-container {
    gap: 15px;
  }

  .filter-btn {
    min-width: 100px;
    padding: 12px 20px;
  }
}

@media (max-width: 768px) {
  .orders-container {
    padding: 0 16px;
  }

  .page-header {
    padding: 30px 0;
    margin-bottom: 40px;
  }

  .title-text {
    font-size: 2.5rem;
  }

  .stats-preview {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .stat-item {
    width: 200px;
  }

  .filters-container {
    flex-direction: column;
    gap: 10px;
    padding: 15px;
  }

  .filter-btn {
    width: 100%;
    min-width: auto;
    justify-content: center;
  }

  .order-card {
    border-radius: 20px;
  }

  .order-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
    padding: 20px;
  }

  .order-number-section {
    width: 100%;
  }

  .order-status-container {
    align-self: flex-end;
  }

  .order-content {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }

  .room-info {
    flex-direction: column;
    gap: 15px;
  }

  .room-image-container {
    width: 100%;
    height: 200px;
  }

  .stay-info {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .stay-separator {
    transform: rotate(90deg);
    align-self: center;
  }

  .order-price {
    min-width: auto;
  }

  .order-actions {
    padding: 20px;
  }

  .actions-container {
    flex-direction: column;
    gap: 10px;
  }

  .actions-container .btn {
    width: 100%;
    justify-content: center;
  }

  .login-prompt,
  .loading,
  .no-orders {
    padding: 60px 20px;
    margin: 0 10px;
  }
}

@media (max-width: 480px) {
  .title-text {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .order-header {
    padding: 15px;
  }

  .order-content {
    padding: 15px;
  }

  .order-actions {
    padding: 15px;
  }

  .room-image-container {
    height: 160px;
  }

  .stay-info {
    padding: 15px;
  }

  .price-container {
    padding: 15px;
  }
}
</style>

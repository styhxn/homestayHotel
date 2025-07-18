<template>
  <div class="booking-page">
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

    <!-- 预订内容 -->
    <main class="main-content">
      <div v-if="loading" class="loading-container">
        <i class="fas fa-spinner fa-spin"></i>
        <span>加载中...</span>
      </div>

      <div v-else-if="room" class="booking-container">
        <!-- 返回按钮 -->
        <div class="back-section">
          <button @click="goBack" class="back-btn">
            <i class="fas fa-arrow-left"></i>
            返回房间详情
          </button>
        </div>

        <div class="booking-content">
          <!-- 房间信息摘要 -->
          <div class="room-summary">
            <div class="room-image">
              <img :src="room.image || room.images?.[0] || '/api/placeholder/300/200'" :alt="room.name">
            </div>
            <div class="room-info">
              <h2>{{ room.name }}</h2>
              <p class="room-type">{{ room.type }}</p>
              <div class="room-price">
                <span class="price">¥{{ room.price }}</span>
                <span class="unit">/晚</span>
              </div>
            </div>
          </div>

          <!-- 预订表单 -->
          <div class="booking-form">
            <div class="form-header">
              <h3>预订信息</h3>
              <p class="form-subtitle">请填写您的入住信息</p>
            </div>

            <form @submit.prevent="submitBooking" class="booking-form-content">
              <!-- 入住日期 -->
              <div class="form-group">
                <label for="checkIn">入住日期</label>
                <input 
                  type="date" 
                  id="checkIn"
                  v-model="bookingForm.checkInDate"
                  :min="minDate"
                  required
                  @change="calculateTotal"
                />
              </div>

              <!-- 退房日期 -->
              <div class="form-group">
                <label for="checkOut">退房日期</label>
                <input 
                  type="date" 
                  id="checkOut"
                  v-model="bookingForm.checkOutDate"
                  :min="minCheckOutDate"
                  required
                  @change="calculateTotal"
                />
              </div>

              <!-- 入住人数 -->
              <div class="form-group">
                <label for="guests">入住人数</label>
                <select id="guests" v-model="bookingForm.guestCount" required>
                  <option value="1">1人</option>
                  <option value="2">2人</option>
                  <option value="3" v-if="room.maxGuests >= 3">3人</option>
                  <option value="4" v-if="room.maxGuests >= 4">4人</option>
                </select>
              </div>

              <!-- 联系电话 -->
              <div class="form-group">
                <label for="phone">联系电话</label>
                <input 
                  type="tel" 
                  id="phone"
                  v-model="bookingForm.phone"
                  :placeholder="auth.user?.phone || '请输入联系电话'"
                  required
                />
              </div>

              <!-- 特殊要求 -->
              <div class="form-group">
                <label for="requirements">特殊要求（可选）</label>
                <textarea 
                  id="requirements"
                  v-model="bookingForm.specialRequirements"
                  placeholder="如有特殊需求，请在此说明..."
                  rows="3"
                ></textarea>
              </div>

              <!-- 费用明细 -->
              <div class="cost-breakdown" v-if="totalCost > 0">
                <h4>费用明细</h4>
                <div class="cost-item">
                  <span>房费 ({{ nightCount }}晚 × ¥{{ room.price }})</span>
                  <span>¥{{ totalCost }}</span>
                </div>
                <div class="cost-total">
                  <span>总计</span>
                  <span class="total-amount">¥{{ totalCost }}</span>
                </div>
              </div>

              <!-- 提交按钮 -->
              <div class="form-actions">
                <button type="button" @click="goBack" class="btn btn-secondary">取消</button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="!isFormValid || submitting"
                >
                  <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
                  {{ submitting ? '提交中...' : '确认预订' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div v-else class="error-container">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>房间不存在</h3>
        <p>抱歉，您要预订的房间不存在或已被删除</p>
        <button @click="goToRooms" class="btn btn-primary">返回房间列表</button>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import request from '../../utils/request'
import type { Room, SimpleRoomData } from '@/types/api'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

// 响应式数据
const loading = ref(true)
const submitting = ref(false)
const room = ref<any>(null)

const bookingForm = reactive({
  checkInDate: '',
  checkOutDate: '',
  guestCount: '2',
  phone: '',
  specialRequirements: ''
})

// 计算属性
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const minCheckOutDate = computed(() => {
  if (!bookingForm.checkInDate) return minDate.value
  const checkIn = new Date(bookingForm.checkInDate)
  checkIn.setDate(checkIn.getDate() + 1)
  return checkIn.toISOString().split('T')[0]
})

const nightCount = computed(() => {
  if (!bookingForm.checkInDate || !bookingForm.checkOutDate) return 0
  const checkIn = new Date(bookingForm.checkInDate)
  const checkOut = new Date(bookingForm.checkOutDate)
  const diffTime = checkOut.getTime() - checkIn.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
})

const totalCost = computed(() => {
  if (!room.value || nightCount.value <= 0) return 0
  return nightCount.value * room.value.price
})

const isFormValid = computed(() => {
  return bookingForm.checkInDate && 
         bookingForm.checkOutDate && 
         bookingForm.guestCount && 
         bookingForm.phone &&
         nightCount.value > 0
})

// 方法
const fetchRoomDetail = async () => {
  loading.value = true
  try {
    const roomId = route.params.id
    const response: any = await request.get(`/h/room/detail?id=${roomId}`)
    if (response.code === 200 && response.data) {
      room.value = {
        ...response.data.room,
        status: response.data.room.status === 0 ? 'available' : 'booked',
        maxGuests: response.data.room.maxGuests || response.data.room.seat || 2,
        image: response.data.img?.[0]?.url || `http://localhost:8091/files/${response.data.room.banner}` || '/src/assets/images/实地调研/房间参观/房间参观1.jpg'
      }

      console.log('房间详情获取成功:', room.value)
      console.log('原始API响应:', response.data)
      console.log('房间名称:', response.data.room?.name)

      // 如果房间不可用，跳转回AI选房页面
      if (room.value.status !== 'available') {
        alert('抱歉，该房间已被预订')
        router.push('/ai-rooms')
        return
      }
    } else {
      throw new Error('获取房间详情失败')
    }
  } catch (error) {
    console.error('获取房间详情失败:', error)
    // 根据房间ID返回对应的模拟数据
    const roomId = parseInt(route.params.id as string)
    const roomData: SimpleRoomData = {
      1: { name: '蘑菇森林小屋', type: '豪华间', price: 388, image: '/src/assets/images/card/card01.jpg', code: '201' },
      2: { name: '蘑菇森林小屋', type: '豪华间', price: 388, image: '/src/assets/images/card/card01.jpg', code: '202' },
      3: { name: '蘑菇生态园', type: '标准间', price: 288, image: '/src/assets/images/card/card02.jpg', code: '301' },
      4: { name: '蘑菇生态园', type: '标准间', price: 288, image: '/src/assets/images/card/card02.jpg', code: '302' },
      5: { name: '茶文化体验馆', type: '特色间', price: 358, image: '/src/assets/images/card/card03.jpg', code: '401' },
      6: { name: '茶文化体验馆', type: '特色间', price: 358, image: '/src/assets/images/card/card03.jpg', code: '402' },
      7: { name: '普洱茶园', type: '豪华间', price: 468, image: '/src/assets/images/card/card04.JPG', code: '501' },
      8: { name: '普洱茶园', type: '豪华间', price: 468, image: '/src/assets/images/card/card04.JPG', code: '502' },
      9: { name: '生态餐厅', type: '套房', price: 588, image: '/src/assets/images/card/card05.jpg', code: '601' },
      10: { name: '生态餐厅', type: '套房', price: 588, image: '/src/assets/images/card/card05.jpg', code: '602' }
    }

    const defaultRoom = roomData[roomId] || roomData[1] // 如果找不到对应房间，使用房间1作为默认

    room.value = {
      id: roomId,
      name: defaultRoom.name,
      type: defaultRoom.type,
      price: defaultRoom.price,
      status: 'available',
      maxGuests: 2,
      image: defaultRoom.image,
      roomCode: defaultRoom.code,
      code: defaultRoom.code
    }

    console.log('使用模拟数据:', room.value)
  } finally {
    loading.value = false
  }
}

const calculateTotal = () => {
  // 总费用计算在computed中自动处理
}

const submitBooking = async () => {
  if (!isFormValid.value) return

  submitting.value = true
  try {
    // 根据后端HOrder实体类结构构造数据
    const bookingData = {
      username: auth.user?.realName || auth.user?.name || auth.user?.email,
      phone: bookingForm.phone,
      startDate: bookingForm.checkInDate,
      endDate: bookingForm.checkOutDate,
      amount: parseInt(bookingForm.guestCount),
      roomId: parseInt(room.value.id),
      roomCode: room.value.roomCode || room.value.name || `房间${room.value.id}`,
      userRemark: bookingForm.specialRequirements || '',
      state: '预订',
      total: totalCost.value.toString(), // 转换为字符串，后端会处理为BigDecimal
      payState: 0, // 未支付
      status: 0, // 正常状态
      days: nightCount.value
    }

    console.log('🔍 订单创建调试信息:')
    console.log('room.value:', room.value)
    console.log('room.value.roomCode:', room.value.roomCode)
    console.log('room.value.name:', room.value.name)
    console.log('最终使用的roomCode:', bookingData.roomCode)
    console.log('完整订单数据:', bookingData)

    console.log('提交预订数据:', bookingData)
    const response: any = await request.post('/h/order', bookingData)

    if (response.code === 200) {
      alert('预订成功！请等待管理员确认。')

      // 发送房间状态更新事件，通知其他页面刷新房间列表
      window.dispatchEvent(new CustomEvent('roomBooked', {
        detail: {
          roomId: room.value.id,
          roomCode: room.value.roomCode || room.value.code,
          status: 'booked'
        }
      }))

      router.push('/orders')
    } else {
      alert(response.msg || '预订失败，请重试')
    }
  } catch (error) {
    console.error('提交预订失败:', error)
    alert('预订失败，请重试')
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.push(`/room/${route.params.id}`)
}

const goToRooms = () => {
  router.push('/rooms')
}

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

// 生命周期
onMounted(() => {
  fetchRoomDetail()
  // 预填用户手机号
  if (auth.user?.phone) {
    bookingForm.phone = auth.user.phone
  }
})
</script>

<style scoped>
/* 基础样式 */
.booking-page {
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

.btn-primary:hover:not(:disabled) {
  background: #45a049;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6b7280;
  color: white;
  border: 1px solid #6b7280;
}

.btn-secondary:hover {
  background: #5b6470;
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

/* 预订容器 */
.booking-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.booking-content {
  padding: 32px;
}

/* 房间摘要 */
.room-summary {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.room-image {
  flex-shrink: 0;
}

.room-image img {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}

.room-info h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.room-type {
  color: #6b7280;
  margin: 0 0 12px 0;
}

.room-price .price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4caf50;
}

.room-price .unit {
  color: #6b7280;
  font-size: 1rem;
}

/* 预订表单 */
.form-header {
  margin-bottom: 32px;
  text-align: center;
}

.form-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.form-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
}

.booking-form-content {
  background: #f8fafc;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.05);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102,126,234,0.1);
  transform: translateY(-1px);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

/* 费用明细 */
.cost-breakdown {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  margin: 24px 0;
}

.cost-breakdown h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
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

/* 表单操作 */
.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
}

.form-actions .btn {
  padding: 12px 24px;
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .booking-content {
    padding: 24px 16px;
  }
  
  .room-summary {
    flex-direction: column;
    gap: 16px;
  }
  
  .room-image img {
    width: 100%;
    height: 200px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    width: 100%;
  }
}
</style>

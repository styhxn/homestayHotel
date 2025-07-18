<template>
  <div class="page-container fade-in">
    <AppNavbar />
    
    <main class="main-content">
      <!-- 页面头部 -->
      <section class="page-header">
        <div class="header-background">
          <img src="@/assets/images/环境展示/tea_bg.png" alt="茶文化背景" />
          <div class="header-overlay"></div>
        </div>
        <div class="container">
          <div class="header-content">
            <div class="breadcrumb">
              <router-link to="/" class="breadcrumb-link">首页</router-link>
              <span class="breadcrumb-separator">></span>
              <router-link to="/tea-culture" class="breadcrumb-link">茶文化</router-link>
              <span class="breadcrumb-separator">></span>
              <span class="breadcrumb-current">预约体验</span>
            </div>
            <h1 class="page-title">
              <SvgIcon name="leaf" size="32" color="#d4af37" />
              茶文化体验预约
            </h1>
            <p class="page-subtitle">
              体验正宗普洱茶文化，感受千年传承的茶道精神
            </p>
          </div>
        </div>
      </section>

      <!-- 预约内容区域 -->
      <section class="booking-section">
        <div class="container">
          <div class="booking-content">
            <!-- 体验项目选择 -->
            <div class="section-card">
              <div class="section-header">
                <h2>
                  <SvgIcon name="spa" size="24" color="#d4af37" />
                  选择体验项目
                </h2>
                <p>精心设计的茶文化体验项目，让您深度感受普洱茶的魅力</p>
              </div>
              <div class="experience-grid">
                <div
                  v-for="experience in experiences"
                  :key="experience.id"
                  class="experience-card"
                  :class="{ active: selectedExperience?.id === experience.id }"
                  @click="selectExperience(experience)"
                >
                  <div class="experience-image">
                    <img :src="experience.image" :alt="experience.name" />
                    <div class="experience-badge">{{ experience.duration }}</div>
                    <div class="experience-overlay">
                      <SvgIcon name="check-circle" size="32" color="white" />
                    </div>
                  </div>
                  <div class="experience-info">
                    <h3>{{ experience.name }}</h3>
                    <p>{{ experience.description }}</p>
                    <div class="experience-features">
                      <span class="feature-item">
                        <SvgIcon name="users" size="16" />
                        最多{{ experience.maxParticipants }}人
                      </span>
                      <span class="feature-item">
                        <SvgIcon name="clock" size="16" />
                        {{ experience.duration }}
                      </span>
                    </div>
                    <div class="experience-price">
                      <span class="price">¥{{ experience.price }}</span>
                      <span class="unit">/人</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 预约信息表单 -->
            <div v-if="selectedExperience" id="booking-form-section" class="section-card booking-form-card">
              <div class="section-header">
                <h2>
                  <SvgIcon name="calendar-alt" size="24" color="#d4af37" />
                  预约信息
                </h2>
                <p>请填写您的预约信息，我们将为您安排最佳的体验时间</p>

                <!-- 选中的体验项目信息 -->
                <div class="selected-experience-info">
                  <div class="selected-badge">
                    <SvgIcon name="check-circle" size="16" color="#d4af37" />
                    已选择体验项目
                  </div>
                  <div class="selected-details">
                    <span class="selected-name">{{ selectedExperience.name }}</span>
                    <span class="selected-price">¥{{ selectedExperience.price }}/人</span>
                    <span class="selected-duration">{{ selectedExperience.duration }}</span>
                  </div>
                </div>
              </div>
              <div class="booking-form">
                <div class="form-grid">
                  <div class="form-group">
                    <label>
                      <SvgIcon name="calendar" size="16" />
                      体验日期
                    </label>
                    <input
                      v-model="bookingForm.date"
                      type="date"
                      :min="minDate"
                      class="form-input"
                      placeholder="请选择体验日期"
                    />
                  </div>
                  <div class="form-group">
                    <label>
                      <SvgIcon name="clock" size="16" />
                      体验时间
                    </label>
                    <select v-model="bookingForm.time" class="form-select">
                      <option value="">请选择时间段</option>
                      <option v-for="time in availableTimes" :key="time" :value="time">
                        {{ time }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>
                      <SvgIcon name="users" size="16" />
                      参与人数
                    </label>
                    <div class="quantity-selector">
                      <button @click="decreaseQuantity" class="qty-btn" :disabled="bookingForm.quantity <= 1">
                        <SvgIcon name="minus" size="16" />
                      </button>
                      <span class="quantity">{{ bookingForm.quantity }}</span>
                      <button @click="increaseQuantity" class="qty-btn" :disabled="bookingForm.quantity >= selectedExperience.maxParticipants">
                        <SvgIcon name="plus" size="16" />
                      </button>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>
                      <SvgIcon name="phone" size="16" />
                      联系电话
                    </label>
                    <input
                      v-model="bookingForm.phone"
                      type="tel"
                      placeholder="请输入您的联系电话"
                      class="form-input"
                    />
                  </div>
                </div>
                <div class="form-group full-width">
                  <label>
                    <SvgIcon name="edit" size="16" />
                    特殊需求
                  </label>
                  <textarea
                    v-model="bookingForm.remarks"
                    placeholder="请输入特殊需求或备注信息（可选）"
                    class="form-textarea"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- 价格汇总 -->
            <div v-if="selectedExperience" class="section-card price-summary-card">
              <div class="section-header">
                <h2>
                  <SvgIcon name="calculator" size="24" color="#d4af37" />
                  价格汇总
                </h2>
              </div>
              <div class="price-summary">
                <div class="summary-item">
                  <div class="item-info">
                    <span class="item-name">{{ selectedExperience.name }}</span>
                    <span class="item-details">{{ bookingForm.quantity }}人 × ¥{{ selectedExperience.price }}/人</span>
                  </div>
                  <span class="item-price">¥{{ selectedExperience.price * bookingForm.quantity }}</span>
                </div>
                <div class="summary-total">
                  <span class="total-label">总计金额</span>
                  <span class="total-price">¥{{ totalPrice }}</span>
                </div>
              </div>
            </div>

            <!-- 提交按钮 -->
            <div v-if="selectedExperience" class="submit-section">
              <button
                @click="submitBooking"
                :disabled="!canSubmit || isSubmitting"
                class="submit-btn"
              >
                <SvgIcon v-if="isSubmitting" name="spinner" spin size="20" />
                <SvgIcon v-else name="check" size="20" />
                {{ isSubmitting ? '提交中...' : '确认预约' }}
              </button>
              <p class="submit-note">
                点击确认预约即表示您同意我们的
                <a href="#" class="link">服务条款</a>
                和
                <a href="#" class="link">隐私政策</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>普洱蘑菇庄园</h3>
          <p>隐于森林深处，与自然共生的生态民宿体验</p>
        </div>
        <div class="footer-section">
          <h4>联系我们</h4>
          <p>地址：云南省普洱市思茅区</p>
          <p>电话：400-123-4567</p>
          <p>邮箱：info@mushroomfarm.com</p>
        </div>
        <div class="footer-section">
          <h4>快速链接</h4>
          <router-link to="/" class="footer-link">首页</router-link>
          <router-link to="/tea-culture" class="footer-link">茶文化</router-link>
          <router-link to="/products" class="footer-link">民宿产品</router-link>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 普洱蘑菇庄园民宿. 保留所有权利.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppNavbar from '../components/AppNavbar.vue'
import SvgIcon from '../components/icons/SvgIcon.vue'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const selectedExperience = ref<any>(null)
const isSubmitting = ref(false)

// 预约表单
const bookingForm = ref({
  date: '',
  time: '',
  quantity: 1,
  phone: '',
  remarks: ''
})

// 茶文化体验项目
const experiences = ref([
  {
    id: 1,
    name: '普洱茶品鉴体验',
    description: '专业茶艺师指导，品味不同年份普洱茶的独特韵味，了解普洱茶的分类和品鉴技巧',
    price: 168,
    duration: '2小时',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研10.jpg',
    maxParticipants: 8
  },
  {
    id: 2,
    name: '茶艺表演与学习',
    description: '学习传统茶艺手法，体验茶道文化的精髓，掌握正宗的普洱茶冲泡技巧',
    price: 128,
    duration: '1.5小时',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研15.jpg',
    maxParticipants: 6
  },
  {
    id: 3,
    name: '茶园采摘体验',
    description: '亲手采摘茶叶，了解茶叶从采摘到制作的全过程，体验茶农的辛勤劳作',
    price: 98,
    duration: '3小时',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研8.jpg',
    maxParticipants: 12
  },
  {
    id: 4,
    name: '茶文化深度游',
    description: '参观茶厂，了解普洱茶制作工艺，品尝地道茶点，深度了解茶文化历史',
    price: 288,
    duration: '半天',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研1.jpg',
    maxParticipants: 10
  }
])

// 可选时间段
const availableTimes = [
  '09:00-11:00',
  '10:00-12:00',
  '14:00-16:00',
  '15:00-17:00',
  '16:00-18:00'
]

// 计算属性
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const totalPrice = computed(() => {
  if (!selectedExperience.value) return 0
  return selectedExperience.value.price * bookingForm.value.quantity
})

const canSubmit = computed(() => {
  return selectedExperience.value &&
         bookingForm.value.date &&
         bookingForm.value.time &&
         bookingForm.value.phone &&
         bookingForm.value.quantity > 0
})

// 方法
const selectExperience = (experience: any) => {
  selectedExperience.value = experience
  bookingForm.value.quantity = 1

  // 滚动到预约信息区域
  setTimeout(() => {
    const bookingSection = document.getElementById('booking-form-section')
    if (bookingSection) {
      bookingSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, 100) // 短暂延迟确保DOM更新完成
}

const increaseQuantity = () => {
  if (selectedExperience.value && bookingForm.value.quantity < selectedExperience.value.maxParticipants) {
    bookingForm.value.quantity++
  }
}

const decreaseQuantity = () => {
  if (bookingForm.value.quantity > 1) {
    bookingForm.value.quantity--
  }
}

const submitBooking = async () => {
  if (!authStore.isAuthenticated) {
    alert('请先登录后再预约')
    router.push('/login')
    return
  }

  if (!canSubmit.value) {
    alert('请填写完整的预约信息')
    return
  }

  isSubmitting.value = true

  try {
    // 创建预约订单
    const bookingData = {
      type: 'tea_experience',
      experienceId: selectedExperience.value.id,
      experienceName: selectedExperience.value.name,
      date: bookingForm.value.date,
      time: bookingForm.value.time,
      quantity: bookingForm.value.quantity,
      unitPrice: selectedExperience.value.price,
      totalAmount: totalPrice.value,
      phone: bookingForm.value.phone,
      remarks: bookingForm.value.remarks,
      status: 'pending',
      createTime: new Date().toISOString()
    }

    // 保存到localStorage（模拟后端API）
    const existingOrders = JSON.parse(localStorage.getItem('tea_experience_orders') || '[]')
    const orderId = 'TEA_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
    
    const order = {
      id: orderId,
      userId: authStore.user?.id || authStore.user?.username,
      ...bookingData
    }
    
    existingOrders.unshift(order)
    localStorage.setItem('tea_experience_orders', JSON.stringify(existingOrders))

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    alert(`预约成功！\n订单号：${orderId}\n体验项目：${selectedExperience.value.name}\n体验时间：${bookingForm.value.date} ${bookingForm.value.time}\n参与人数：${bookingForm.value.quantity}人\n总金额：¥${totalPrice.value}`)
    
    // 跳转到订单页面
    router.push('/orders')

  } catch (error) {
    console.error('预约失败:', error)
    alert('预约失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // 如果用户已登录，预填手机号
  if (authStore.user?.phone) {
    bookingForm.value.phone = authStore.user.phone
  }
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f8fafc;
}

.main-content {
  padding-top: 0;
}

/* 页面头部样式 */
.page-header {
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.header-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.8), rgba(74, 124, 89, 0.8));
  z-index: 2;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  position: relative;
  z-index: 3;
  color: white;
  text-align: center;
}

.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.breadcrumb-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: white;
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.6);
}

.breadcrumb-current {
  color: white;
  font-weight: 500;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 预约内容区域 */
.booking-section {
  padding: 60px 0;
}

.booking-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.1);
  transition: all 0.3s ease;
  scroll-margin-top: 100px; /* 为固定导航栏留出空间 */
}

.section-card:target {
  border-color: rgba(212, 175, 55, 0.3);
  box-shadow: 0 15px 50px rgba(212, 175, 55, 0.15);
}

/* 预约表单卡片特殊样式 */
.booking-form-card {
  background: linear-gradient(135deg, #fefdf8, #ffffff);
  border: 2px solid rgba(212, 175, 55, 0.2);
  animation: slideInUp 0.5s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 10px;
}

.section-header p {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* 选中的体验项目信息样式 */
.selected-experience-info {
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.selected-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #d4af37;
  margin-bottom: 12px;
}

.selected-details {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.selected-name {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.selected-price {
  font-size: 14px;
  font-weight: 600;
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.selected-duration {
  font-size: 14px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
}

/* 体验项目网格 */
.experience-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.experience-card {
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.experience-card:hover {
  border-color: #d4af37;
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(212, 175, 55, 0.2);
}

.experience-card.active {
  border-color: #d4af37;
  background: linear-gradient(135deg, #fefdf8, #ffffff);
  box-shadow: 0 15px 40px rgba(212, 175, 55, 0.3);
}

.experience-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.experience-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.experience-card:hover .experience-image img {
  transform: scale(1.05);
}

.experience-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(212, 175, 55, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.experience-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(212, 175, 55, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.experience-card.active .experience-overlay {
  opacity: 1;
}

.experience-info {
  padding: 24px;
}

.experience-info h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.experience-info p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 14px;
}

.experience-features {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 12px;
}

.experience-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #d4af37;
}

.unit {
  font-size: 14px;
  color: #6b7280;
}

/* 预约表单样式 */
.booking-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-input,
.form-select,
.form-textarea {
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  width: fit-content;
}

.qty-btn {
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-weight: 700;
  font-size: 16px;
  min-width: 30px;
  text-align: center;
  color: #1f2937;
}

/* 价格汇总样式 */
.price-summary-card {
  background: linear-gradient(135deg, #fefdf8, #ffffff);
  border: 2px solid rgba(212, 175, 55, 0.2);
}

.price-summary {
  background: #f9fafb;
  border-radius: 12px;
  padding: 24px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-weight: 600;
  color: #1f2937;
}

.item-details {
  font-size: 14px;
  color: #6b7280;
}

.item-price {
  font-weight: 600;
  color: #1f2937;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  font-size: 18px;
  font-weight: 700;
}

.total-label {
  color: #1f2937;
}

.total-price {
  color: #d4af37;
  font-size: 24px;
}

/* 提交按钮区域 */
.submit-section {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 48px;
  background: linear-gradient(135deg, #d4af37, #b8941f);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  margin-bottom: 16px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(212, 175, 55, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-note {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.link {
  color: #d4af37;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

/* 页脚样式 */
.footer {
  background: #1e293b;
  color: white;
  padding: 40px 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 15px;
  color: #d4af37;
}

.footer-section p {
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.footer-link {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #d4af37;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    height: 250px;
  }

  .page-title {
    font-size: 2rem;
  }

  .section-card {
    padding: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .experience-grid {
    grid-template-columns: 1fr;
  }

  .experience-features {
    flex-direction: column;
    gap: 8px;
  }

  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .submit-btn {
    width: 100%;
    padding: 16px 24px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }

  .booking-section {
    padding: 40px 0;
  }

  .section-card {
    padding: 20px;
  }

  .page-title {
    font-size: 1.8rem;
    flex-direction: column;
    gap: 8px;
  }
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

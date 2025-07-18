<template>
  <div class="tea-experience-booking">
    <!-- 预约按钮 -->
    <button @click="showBooking = true" class="booking-trigger-btn">
      <SvgIcon name="teapot" size="20" />
      <span>预约茶文化体验</span>
    </button>

    <!-- 预约弹窗 -->
    <div v-if="showBooking" class="booking-overlay" @click="closeBooking">
      <div class="booking-modal" @click.stop>
        <div class="modal-header">
          <h3>
            <SvgIcon name="leaf" size="24" color="#d4af37" />
            茶文化体验预约
          </h3>
          <button @click="closeBooking" class="close-btn">
            <SvgIcon name="times" size="20" />
          </button>
        </div>

        <div class="modal-content">
          <!-- 体验项目选择 -->
          <div class="section">
            <h4>
              <SvgIcon name="spa" size="18" />
              选择体验项目
            </h4>
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
                </div>
                <div class="experience-info">
                  <h5>{{ experience.name }}</h5>
                  <p>{{ experience.description }}</p>
                  <div class="experience-price">
                    <span class="price">¥{{ experience.price }}</span>
                    <span class="unit">/人</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 预约信息 -->
          <div v-if="selectedExperience" class="section">
            <h4>
              <SvgIcon name="calendar-alt" size="18" />
              预约信息
            </h4>
            <div class="booking-form">
              <div class="form-row">
                <div class="form-group">
                  <label>体验日期</label>
                  <input
                    v-model="bookingForm.date"
                    type="date"
                    :min="minDate"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>体验时间</label>
                  <select v-model="bookingForm.time" class="form-select">
                    <option value="">请选择时间</option>
                    <option v-for="time in availableTimes" :key="time" :value="time">
                      {{ time }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>参与人数</label>
                  <div class="quantity-selector">
                    <button @click="decreaseQuantity" class="qty-btn">
                      <SvgIcon name="minus" size="16" />
                    </button>
                    <span class="quantity">{{ bookingForm.quantity }}</span>
                    <button @click="increaseQuantity" class="qty-btn">
                      <SvgIcon name="plus" size="16" />
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label>联系电话</label>
                  <input
                    v-model="bookingForm.phone"
                    type="tel"
                    placeholder="请输入联系电话"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-group full-width">
                <label>特殊需求</label>
                <textarea
                  v-model="bookingForm.remarks"
                  placeholder="请输入特殊需求或备注信息"
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- 价格汇总 -->
          <div v-if="selectedExperience" class="section">
            <div class="price-summary">
              <div class="summary-row">
                <span>{{ selectedExperience.name }} × {{ bookingForm.quantity }}人</span>
                <span>¥{{ selectedExperience.price * bookingForm.quantity }}</span>
              </div>
              <div class="summary-total">
                <span>总计</span>
                <span class="total-price">¥{{ totalPrice }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeBooking" class="btn btn-secondary">取消</button>
          <button
            @click="submitBooking"
            :disabled="!canSubmit || isSubmitting"
            class="btn btn-primary"
          >
            <SvgIcon v-if="isSubmitting" name="spinner" spin size="16" />
            {{ isSubmitting ? '提交中...' : '确认预约' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import SvgIcon from './icons/SvgIcon.vue'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const showBooking = ref(false)
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
    description: '专业茶艺师指导，品味不同年份普洱茶的独特韵味',
    price: 168,
    duration: '2小时',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研10.jpg',
    maxParticipants: 8
  },
  {
    id: 2,
    name: '茶艺表演与学习',
    description: '学习传统茶艺手法，体验茶道文化的精髓',
    price: 128,
    duration: '1.5小时',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研15.jpg',
    maxParticipants: 6
  },
  {
    id: 3,
    name: '茶园采摘体验',
    description: '亲手采摘茶叶，了解茶叶从采摘到制作的全过程',
    price: 98,
    duration: '3小时',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研8.jpg',
    maxParticipants: 12
  },
  {
    id: 4,
    name: '茶文化深度游',
    description: '参观茶厂，了解普洱茶制作工艺，品尝地道茶点',
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
  // 重置数量为1
  bookingForm.value.quantity = 1
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

const closeBooking = () => {
  showBooking.value = false
  selectedExperience.value = null
  resetForm()
}

const resetForm = () => {
  bookingForm.value = {
    date: '',
    time: '',
    quantity: 1,
    phone: '',
    remarks: ''
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
    
    closeBooking()
    
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
.booking-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #d4af37, #b8941f);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.booking-trigger-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.booking-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.booking-modal {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-content {
  padding: 24px;
}

.section {
  margin-bottom: 32px;
}

.section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.experience-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.experience-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.experience-card:hover {
  border-color: #d4af37;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.experience-card.active {
  border-color: #d4af37;
  background: #fefdf8;
}

.experience-image {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.experience-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.experience-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(212, 175, 55, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.experience-info {
  padding: 16px;
}

.experience-info h5 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.experience-info p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.experience-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #d4af37;
}

.unit {
  font-size: 14px;
  color: #6b7280;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: fit-content;
}

.qty-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.qty-btn:hover {
  background: #f3f4f6;
}

.quantity {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.price-summary {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #6b7280;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
  font-weight: 600;
  color: #1f2937;
}

.total-price {
  font-size: 18px;
  color: #d4af37;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37, #b8941f);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .booking-modal {
    margin: 10px;
    max-height: calc(100vh - 20px);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .experience-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<script lang="ts">
export default {
  name: 'TeaExperienceBooking'
}
</script>

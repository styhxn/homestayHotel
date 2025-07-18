<template>
  <div class="estate-activity-booking">
    <!-- 活动预订触发按钮 -->
    <button @click="showBooking = true" class="activity-booking-btn">
      <SvgIcon name="calendar-alt" size="20" />
      <span>预订庄园活动</span>
    </button>

    <!-- 预订弹窗 -->
    <div v-if="showBooking" class="booking-overlay" @click="closeBooking">
      <div class="booking-modal" @click.stop>
        <div class="modal-header">
          <h3>
            <SvgIcon name="calendar-alt" size="24" color="#d4af37" />
            庄园活动预订
          </h3>
          <button @click="closeBooking" class="close-btn">
            <SvgIcon name="times" size="20" />
          </button>
        </div>

        <div class="modal-content">
          <!-- 活动选择 -->
          <div class="section">
            <h4>
              <SvgIcon name="star" size="18" />
              选择活动项目
            </h4>
            <div class="activities-grid">
              <div
                v-for="activity in activities"
                :key="activity.id"
                class="activity-card"
                :class="{ active: selectedActivity?.id === activity.id }"
                @click="selectActivity(activity)"
              >
                <div class="activity-image">
                  <img :src="activity.image" :alt="activity.name" />
                  <div class="activity-badge">{{ activity.duration }}</div>
                  <div class="activity-difficulty">{{ activity.difficulty }}</div>
                </div>
                <div class="activity-info">
                  <h5>{{ activity.name }}</h5>
                  <p>{{ activity.description }}</p>
                  <div class="activity-features">
                    <span v-for="feature in activity.features" :key="feature" class="feature-tag">
                      {{ feature }}
                    </span>
                  </div>
                  <div class="activity-pricing">
                    <span class="price">¥{{ activity.price }}</span>
                    <span class="unit">/人</span>
                    <span v-if="activity.groupDiscount" class="group-discount">
                      团体优惠
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 预订详情 -->
          <div v-if="selectedActivity" class="section">
            <h4>
              <SvgIcon name="clock" size="18" />
              预订详情
            </h4>
            <div class="booking-details">
              <div class="form-row">
                <div class="form-group">
                  <label>活动日期</label>
                  <input
                    v-model="bookingForm.date"
                    type="date"
                    :min="minDate"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>活动时间</label>
                  <select v-model="bookingForm.timeSlot" class="form-select">
                    <option value="">请选择时间段</option>
                    <option v-for="slot in selectedActivity.timeSlots" :key="slot" :value="slot">
                      {{ slot }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>参与人数</label>
                  <div class="quantity-selector">
                    <button @click="decreaseParticipants" class="qty-btn">
                      <SvgIcon name="minus" size="16" />
                    </button>
                    <span class="quantity">{{ bookingForm.participants }}</span>
                    <button @click="increaseParticipants" class="qty-btn">
                      <SvgIcon name="plus" size="16" />
                    </button>
                  </div>
                  <div class="participants-note">
                    最少{{ selectedActivity.minParticipants }}人，最多{{ selectedActivity.maxParticipants }}人
                  </div>
                </div>
                <div class="form-group">
                  <label>联系人姓名</label>
                  <input
                    v-model="bookingForm.contactName"
                    type="text"
                    placeholder="请输入联系人姓名"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>联系电话</label>
                  <input
                    v-model="bookingForm.phone"
                    type="tel"
                    placeholder="请输入联系电话"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>紧急联系人</label>
                  <input
                    v-model="bookingForm.emergencyContact"
                    type="tel"
                    placeholder="紧急联系人电话"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-group full-width">
                <label>特殊需求</label>
                <textarea
                  v-model="bookingForm.specialRequests"
                  placeholder="如有特殊需求或身体状况需要说明，请在此填写"
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- 价格计算 -->
          <div v-if="selectedActivity" class="section">
            <div class="price-calculation">
              <div class="calc-row">
                <span>{{ selectedActivity.name }} × {{ bookingForm.participants }}人</span>
                <span>¥{{ basePrice }}</span>
              </div>
              <div v-if="groupDiscountAmount > 0" class="calc-row discount">
                <span>团体优惠 ({{ bookingForm.participants }}人)</span>
                <span>-¥{{ groupDiscountAmount }}</span>
              </div>
              <div class="calc-total">
                <span>总计</span>
                <span class="total-price">¥{{ finalPrice }}</span>
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
            {{ isSubmitting ? '提交中...' : '确认预订' }}
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
const selectedActivity = ref<any>(null)
const isSubmitting = ref(false)

// 预订表单
const bookingForm = ref({
  date: '',
  timeSlot: '',
  participants: 2,
  contactName: '',
  phone: '',
  emergencyContact: '',
  specialRequests: ''
})

// 庄园活动数据
const activities = ref([
  {
    id: 1,
    name: '森林徒步探险',
    description: '深入原始森林，探索神秘的自然世界，观察野生动植物',
    price: 128,
    duration: '3小时',
    difficulty: '中等',
    minParticipants: 2,
    maxParticipants: 12,
    groupDiscount: true,
    image: '/src/assets/images/实地调研/房间参观/房间参观3.jpg',
    features: ['专业向导', '安全装备', '自然讲解', '拍照服务'],
    timeSlots: ['08:00-11:00', '14:00-17:00']
  },
  {
    id: 2,
    name: '蘑菇采摘体验',
    description: '在专业向导带领下，学习识别可食用蘑菇，体验采摘乐趣',
    price: 98,
    duration: '2小时',
    difficulty: '简单',
    minParticipants: 1,
    maxParticipants: 8,
    groupDiscount: true,
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研8.jpg',
    features: ['蘑菇知识', '采摘工具', '安全指导', '成果带走'],
    timeSlots: ['09:00-11:00', '15:00-17:00']
  },
  {
    id: 3,
    name: '茶园文化之旅',
    description: '参观古茶园，了解普洱茶制作工艺，品尝地道茶香',
    price: 168,
    duration: '4小时',
    difficulty: '简单',
    minParticipants: 2,
    maxParticipants: 15,
    groupDiscount: true,
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研5.jpg',
    features: ['茶艺表演', '制茶体验', '品茶环节', '茶叶礼品'],
    timeSlots: ['09:00-13:00', '14:00-18:00']
  },
  {
    id: 4,
    name: '星空观测夜',
    description: '远离城市光污染，在专业设备下观测璀璨星空',
    price: 188,
    duration: '3小时',
    difficulty: '简单',
    minParticipants: 2,
    maxParticipants: 10,
    groupDiscount: false,
    image: '/src/assets/images/实地调研/房间参观/房间参观1.jpg',
    features: ['专业望远镜', '天文讲解', '热饮提供', '观星地图'],
    timeSlots: ['19:00-22:00', '20:00-23:00']
  },
  {
    id: 5,
    name: '农耕体验活动',
    description: '体验传统农耕生活，学习有机种植技术',
    price: 88,
    duration: '2.5小时',
    difficulty: '中等',
    minParticipants: 1,
    maxParticipants: 20,
    groupDiscount: true,
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研1.jpg',
    features: ['农具使用', '种植指导', '有机知识', '农产品品尝'],
    timeSlots: ['08:00-10:30', '15:00-17:30']
  }
])

// 计算属性
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const basePrice = computed(() => {
  if (!selectedActivity.value) return 0
  return selectedActivity.value.price * bookingForm.value.participants
})

const groupDiscountAmount = computed(() => {
  if (!selectedActivity.value || !selectedActivity.value.groupDiscount) return 0
  const participants = bookingForm.value.participants
  if (participants >= 5) return basePrice.value * 0.1 // 10% 团体优惠
  return 0
})

const finalPrice = computed(() => {
  return basePrice.value - groupDiscountAmount.value
})

const canSubmit = computed(() => {
  return selectedActivity.value &&
         bookingForm.value.date &&
         bookingForm.value.timeSlot &&
         bookingForm.value.contactName &&
         bookingForm.value.phone &&
         bookingForm.value.participants >= selectedActivity.value.minParticipants &&
         bookingForm.value.participants <= selectedActivity.value.maxParticipants
})

// 方法
const selectActivity = (activity: any) => {
  selectedActivity.value = activity
  bookingForm.value.participants = Math.max(activity.minParticipants, 2)
}

const increaseParticipants = () => {
  if (selectedActivity.value && bookingForm.value.participants < selectedActivity.value.maxParticipants) {
    bookingForm.value.participants++
  }
}

const decreaseParticipants = () => {
  if (selectedActivity.value && bookingForm.value.participants > selectedActivity.value.minParticipants) {
    bookingForm.value.participants--
  }
}

const closeBooking = () => {
  showBooking.value = false
  selectedActivity.value = null
  resetForm()
}

const resetForm = () => {
  bookingForm.value = {
    date: '',
    timeSlot: '',
    participants: 2,
    contactName: '',
    phone: '',
    emergencyContact: '',
    specialRequests: ''
  }
}

const submitBooking = async () => {
  if (!authStore.isAuthenticated) {
    alert('请先登录后再预订')
    router.push('/login')
    return
  }

  if (!canSubmit.value) {
    alert('请填写完整的预订信息')
    return
  }

  isSubmitting.value = true

  try {
    // 创建活动预订订单
    const bookingData = {
      type: 'estate_activity',
      activityId: selectedActivity.value.id,
      activityName: selectedActivity.value.name,
      date: bookingForm.value.date,
      timeSlot: bookingForm.value.timeSlot,
      participants: bookingForm.value.participants,
      unitPrice: selectedActivity.value.price,
      baseAmount: basePrice.value,
      discountAmount: groupDiscountAmount.value,
      totalAmount: finalPrice.value,
      contactName: bookingForm.value.contactName,
      phone: bookingForm.value.phone,
      emergencyContact: bookingForm.value.emergencyContact,
      specialRequests: bookingForm.value.specialRequests,
      status: 'pending',
      createTime: new Date().toISOString()
    }

    // 保存到localStorage（模拟后端API）
    const existingOrders = JSON.parse(localStorage.getItem('estate_activity_orders') || '[]')
    const orderId = 'ACT_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
    
    const order = {
      id: orderId,
      userId: authStore.user?.id || authStore.user?.username,
      ...bookingData
    }
    
    existingOrders.unshift(order)
    localStorage.setItem('estate_activity_orders', JSON.stringify(existingOrders))

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    alert(`预订成功！\n订单号：${orderId}\n活动项目：${selectedActivity.value.name}\n活动时间：${bookingForm.value.date} ${bookingForm.value.timeSlot}\n参与人数：${bookingForm.value.participants}人\n总金额：¥${finalPrice.value}`)
    
    closeBooking()
    
    // 跳转到订单页面
    router.push('/orders')

  } catch (error) {
    console.error('预订失败:', error)
    alert('预订失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // 如果用户已登录，预填联系信息
  if (authStore.user) {
    bookingForm.value.contactName = authStore.user.name || authStore.user.username || ''
    bookingForm.value.phone = authStore.user.phone || ''
  }
})
</script>

<style scoped>
.activity-booking-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.activity-booking-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
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
  max-width: 900px;
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

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.activity-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.activity-card:hover {
  border-color: #10b981;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.activity-card.active {
  border-color: #10b981;
  background: #f0fdf4;
}

.activity-image {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(16, 185, 129, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.activity-difficulty {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.activity-info {
  padding: 16px;
}

.activity-info h5 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.activity-info p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.activity-features {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
}

.feature-tag {
  background: #e5e7eb;
  color: #374151;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.activity-pricing {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #10b981;
}

.unit {
  font-size: 14px;
  color: #6b7280;
}

.group-discount {
  background: #fef3c7;
  color: #d97706;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

/* 表单样式 */
.booking-details {
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
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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

.participants-note {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

/* 价格计算 */
.price-calculation {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.calc-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #6b7280;
}

.calc-row.discount {
  color: #10b981;
}

.calc-total {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
  font-weight: 600;
  color: #1f2937;
}

.total-price {
  font-size: 18px;
  color: #10b981;
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
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
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
  
  .activities-grid {
    grid-template-columns: 1fr;
  }
}
</style>

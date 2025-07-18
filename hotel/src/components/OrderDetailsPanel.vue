<template>
  <div class="order-details-panel" v-if="currentOrder">
    <div class="panel-header">
      <h3 class="panel-title">
        <span class="order-icon">📋</span>
        订单详情
      </h3>
      <button @click="closePanel" class="close-btn">
        <span>✕</span>
      </button>
    </div>
    
    <div class="order-content">
      <!-- 订单状态 -->
      <div class="order-status">
        <div class="status-badge" :class="statusClass">
          {{ statusText }}
        </div>
        <div class="order-number">
          订单号：{{ currentOrder.orderNumber || generateOrderNumber() }}
        </div>
      </div>
      
      <!-- 房间信息 -->
      <div class="section">
        <h4 class="section-title">🏠 房间信息</h4>
        <div class="room-card">
          <div class="room-image">
            <img :src="currentOrder.roomImage || getDefaultRoomImage()" :alt="currentOrder.roomName" />
          </div>
          <div class="room-details">
            <div class="room-name">{{ currentOrder.roomCode }}号房 - {{ currentOrder.roomName }}</div>
            <div class="room-price">¥{{ currentOrder.roomPrice }}/晚</div>
          </div>
        </div>
      </div>
      
      <!-- 入住信息 -->
      <div class="section">
        <h4 class="section-title">📅 入住信息</h4>
        <div class="stay-info">
          <div class="info-row">
            <span class="label">入住日期：</span>
            <span class="value">{{ currentOrder.checkInDate }}</span>
          </div>
          <div class="info-row">
            <span class="label">离开日期：</span>
            <span class="value">{{ currentOrder.checkOutDate }}</span>
          </div>
          <div class="info-row">
            <span class="label">住宿天数：</span>
            <span class="value">{{ currentOrder.nights }}晚</span>
          </div>
        </div>
      </div>
      
      <!-- 费用明细 -->
      <div class="section">
        <h4 class="section-title">💰 费用明细</h4>
        <div class="cost-breakdown">
          <div class="cost-row">
            <span class="cost-label">房费</span>
            <span class="cost-value">¥{{ currentOrder.roomPrice }} × {{ currentOrder.nights }}晚</span>
            <span class="cost-amount">¥{{ currentOrder.roomPrice * currentOrder.nights }}</span>
          </div>
          <div class="cost-row total">
            <span class="cost-label">总计</span>
            <span class="cost-value"></span>
            <span class="cost-amount">¥{{ currentOrder.totalAmount }}</span>
          </div>
        </div>
      </div>
      
      <!-- 用户画像推荐 -->
      <div class="section" v-if="packageRecommendation">
        <h4 class="section-title">🎁 专属推荐</h4>
        <div class="package-recommendation">
          <div class="package-header">
            <div class="package-name">{{ packageRecommendation.name }}</div>
            <div class="package-discount">优惠{{ packageRecommendation.discount }}%</div>
          </div>
          <div class="package-description">{{ packageRecommendation.description }}</div>
          <div class="package-items">
            <div v-for="item in packageRecommendation.items" :key="item" class="package-item">
              ✓ {{ item }}
            </div>
          </div>
          <div class="package-pricing">
            <span class="original-price">原价：¥{{ packageRecommendation.originalPrice }}</span>
            <span class="package-price">套餐价：¥{{ packageRecommendation.packagePrice }}</span>
          </div>
          <button @click="selectPackage" class="package-btn">
            选择套餐
          </button>
        </div>
      </div>
      
      <!-- 数字孪生场景路线图 -->
      <div class="section" v-if="digitalTwinRoute">
        <h4 class="section-title">🗺️ 数字孪生场景路线</h4>
        <div class="digital-twin-route">
          <div v-for="(step, index) in digitalTwinRoute" :key="index" class="route-step">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-description">{{ step.description }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 联系信息 -->
      <div class="section">
        <h4 class="section-title">📞 联系我们</h4>
        <div class="contact-info">
          <div class="contact-item">
            <span class="contact-icon">📱</span>
            <span>24小时管家热线：400-123-4567</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">💬</span>
            <span>微信客服：PuPuMushroom</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Order {
  orderNumber?: string
  roomId: number | string
  roomCode: string
  roomName: string
  roomPrice: number
  roomImage?: string
  checkInDate: string
  checkOutDate: string
  nights: number
  totalAmount: number
  status?: string
  userProfile?: any
}

interface PackageRecommendation {
  name: string
  description: string
  originalPrice: number
  packagePrice: number
  discount: number
  items: string[]
}

// Props
interface Props {
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: true
})

// Emits
const emit = defineEmits<{
  packageSelected: [packageData: any]
  orderClosed: []
}>()

// 响应式数据
const currentOrder = ref<Order | null>({
  orderNumber: 'MG20250718001',
  roomId: 301,
  roomCode: '301',
  roomName: '云端亲子蘑菇屋',
  roomPrice: 588,
  roomImage: '/src/assets/images/实地调研/房间调研/房间调研3.jpg',
  checkInDate: '2025-07-07',
  checkOutDate: '2025-07-20',
  nights: 13,
  totalAmount: 7644,
  status: 'confirmed',
  userProfile: {
    type: 'family_with_children',
    keywords: ['亲子', '家庭'],
    preferences: ['安全', '宽敞', '娱乐设施']
  }
})

const packageRecommendation = ref<PackageRecommendation | null>({
  name: '蘑菇森林亲子奇遇套餐',
  description: '专为亲子家庭设计的综合体验套餐',
  originalPrice: 680,
  packagePrice: 578,
  discount: 15,
  items: [
    '民宿住宿体验',
    '儿童茶艺启蒙课',
    '蘑菇森林探索',
    '茶山寻宝游戏',
    '数字孪生导览'
  ]
})

const digitalTwinRoute = ref<any[]>([
  {
    title: '🏠 蘑菇屋入住体验',
    description: '360°全景房间导览，了解房间设施'
  },
  {
    title: '🍵 儿童茶艺启蒙课堂',
    description: '互动式茶艺学习，寓教于乐'
  },
  {
    title: '🌲 蘑菇森林探索之旅',
    description: 'VR森林探索，认识各种蘑菇'
  },
  {
    title: '🎯 茶山寻宝游戏',
    description: 'AR寻宝游戏，收集茶叶知识'
  }
])

// 计算属性
const statusClass = computed(() => {
  const status = currentOrder.value?.status || 'confirmed'
  return {
    'status-confirmed': status === 'confirmed',
    'status-pending': status === 'pending',
    'status-completed': status === 'completed'
  }
})

const statusText = computed(() => {
  const status = currentOrder.value?.status || 'confirmed'
  const statusMap = {
    'confirmed': '✅ 预订成功',
    'pending': '⏳ 待确认',
    'completed': '🎉 已完成'
  }
  return statusMap[status] || '预订成功'
})

// 方法
const closePanel = () => {
  currentOrder.value = null
  packageRecommendation.value = null
  digitalTwinRoute.value = []
  emit('orderClosed')
}

const generateOrderNumber = (): string => {
  const now = new Date()
  const timestamp = now.getTime().toString().slice(-8)
  return `MG${timestamp}`
}

const getDefaultRoomImage = (): string => {
  return '/src/assets/images/实地调研/房间调研/房间调研1.jpg'
}

const selectPackage = () => {
  if (packageRecommendation.value) {
    emit('packageSelected', {
      order: currentOrder.value,
      package: packageRecommendation.value
    })
  }
}

// 创建订单
const createOrder = (orderData: Order) => {
  currentOrder.value = {
    ...orderData,
    orderNumber: generateOrderNumber(),
    status: 'confirmed'
  }
  
  // 根据用户画像生成推荐
  if (orderData.userProfile) {
    generatePackageRecommendation(orderData.userProfile)
    generateDigitalTwinRoute(orderData.userProfile)
  }
}

// 生成套餐推荐
const generatePackageRecommendation = (userProfile: any) => {
  if (userProfile.type === 'family_with_children') {
    packageRecommendation.value = {
      name: '蘑菇森林亲子奇遇套餐',
      description: '专为亲子家庭设计的综合体验套餐',
      originalPrice: 680,
      packagePrice: 578,
      discount: 15,
      items: [
        '民宿住宿体验',
        '儿童茶艺启蒙课',
        '蘑菇森林探索',
        '茶山寻宝游戏',
        '数字孪生导览'
      ]
    }
  } else if (userProfile.type === 'culture_enthusiast') {
    packageRecommendation.value = {
      name: '普洱茶文化深度体验套餐',
      description: '深度体验普洱茶文化的完整旅程',
      originalPrice: 580,
      packagePrice: 464,
      discount: 20,
      items: [
        '传统民宿住宿',
        '非遗工坊手工制茶',
        '普洱茶品鉴课程',
        '普洱茶博物馆门票',
        '文化导师陪同'
      ]
    }
  }
}

// 生成数字孪生路线
const generateDigitalTwinRoute = (userProfile: any) => {
  if (userProfile.type === 'family_with_children') {
    digitalTwinRoute.value = [
      {
        title: '🏠 蘑菇屋入住体验',
        description: '360°全景房间导览，了解房间设施'
      },
      {
        title: '🍵 儿童茶艺启蒙课堂',
        description: '互动式茶艺学习，寓教于乐'
      },
      {
        title: '🌲 蘑菇森林探索之旅',
        description: 'VR森林探索，认识各种蘑菇'
      },
      {
        title: '🎯 茶山寻宝游戏',
        description: 'AR寻宝游戏，收集茶叶知识'
      }
    ]
  } else if (userProfile.type === 'culture_enthusiast') {
    digitalTwinRoute.value = [
      {
        title: '🏠 传统民宿住宿体验',
        description: '感受传统建筑文化魅力'
      },
      {
        title: '🫖 非遗工坊手工制茶',
        description: '亲手体验传统制茶工艺'
      },
      {
        title: '🍵 普洱茶品鉴课程',
        description: '专业品茶师指导品鉴'
      },
      {
        title: '🏛️ 普洱茶博物馆参观',
        description: '了解普洱茶历史文化'
      }
    ]
  }
}

// 暴露方法给全局使用
onMounted(() => {
  if (typeof window !== 'undefined') {
    (window as any).createOrder = createOrder
  }
})
</script>

<style scoped>
.order-details-panel {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 380px;
  max-height: 80vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  z-index: 1000;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%);
  color: white;
}

.panel-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-icon {
  font-size: 18px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.order-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 20px;
}

.order-status {
  text-align: center;
  margin-bottom: 20px;
}

.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.status-confirmed {
  background: #d4edda;
  color: #155724;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-completed {
  background: #d1ecf1;
  color: #0c5460;
}

.order-number {
  font-size: 12px;
  color: #666;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.room-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.room-image {
  height: 100px;
  overflow: hidden;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-details {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-name {
  font-weight: 600;
  color: #333;
}

.room-price {
  color: #D4AF37;
  font-weight: 600;
}

.stay-info, .contact-info {
  background: white;
  border-radius: 8px;
  padding: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
  font-size: 14px;
}

.value {
  font-weight: 500;
  color: #333;
}

.cost-breakdown {
  background: white;
  border-radius: 8px;
  padding: 12px;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.cost-row:last-child {
  margin-bottom: 0;
}

.cost-row.total {
  border-top: 1px solid #eee;
  padding-top: 8px;
  font-weight: 600;
  color: #D4AF37;
}

.package-recommendation {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 2px solid #D4AF37;
}

.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.package-name {
  font-weight: 600;
  color: #333;
}

.package-discount {
  background: #D4AF37;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.package-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

.package-items {
  margin-bottom: 12px;
}

.package-item {
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
}

.package-pricing {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 13px;
}

.package-price {
  color: #D4AF37;
  font-weight: 600;
}

.package-btn {
  width: 100%;
  background: linear-gradient(135deg, #D4AF37, #f4d03f);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.package-btn:hover {
  transform: translateY(-1px);
}

.digital-twin-route {
  background: white;
  border-radius: 8px;
  padding: 12px;
}

.route-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.route-step:last-child {
  margin-bottom: 0;
}

.step-number {
  width: 24px;
  height: 24px;
  background: #2D5016;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.step-description {
  color: #666;
  font-size: 13px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-icon {
  font-size: 16px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .order-details-panel {
    right: 10px;
    left: 10px;
    width: auto;
    max-width: none;
  }
}
</style>

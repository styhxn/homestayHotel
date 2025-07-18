<template>
  <div class="room-type-detail">
    <AppNavbar />
    
    <div class="main-content">
      <div class="container">
        <!-- 返回按钮 -->
        <div class="back-navigation">
          <button @click="goBack" class="back-btn">
            <i class="fas fa-arrow-left"></i>
            返回选房
          </button>
        </div>

        <!-- 房型详情 -->
        <div v-if="roomType" class="room-type-detail-content">
          <!-- 房型头部信息 -->
          <div class="room-type-header">
            <div class="room-type-image">
              <img :src="roomType.image" :alt="roomType.name" />
            </div>
            <div class="room-type-info">
              <h1 class="room-type-title">{{ roomType.name }}</h1>
              <div class="room-type-category">{{ roomType.category }}</div>
              <div class="room-type-price">
                <span class="price-amount">¥{{ roomType.price }}</span>
                <span class="price-unit">/晚</span>
              </div>
              <div class="room-type-rating">
                <div class="stars">
                  <i v-for="i in 5" :key="i" :class="['fas fa-star', { active: i <= Math.floor(roomType.rating) }]"></i>
                </div>
                <span class="rating-text">{{ roomType.rating }} 分</span>
              </div>
            </div>
          </div>

          <!-- 房型描述 -->
          <div class="room-type-description">
            <h2>房型介绍</h2>
            <p>{{ roomType.describe }}</p>
          </div>

          <!-- 房间设施 -->
          <div class="room-facilities">
            <h2>房间设施</h2>
            <div class="facilities-grid">
              <div v-for="facility in roomType.features" :key="facility" class="facility-item">
                <i class="fas fa-check"></i>
                <span>{{ facility }}</span>
              </div>
            </div>
          </div>

          <!-- 房间列表 -->
          <div class="available-rooms">
            <h2>房间列表</h2>
            <div class="rooms-grid">
              <div 
                v-for="room in roomType.rooms" 
                :key="room.id"
                :class="['room-item', { 'booked': room.status === 'booked' }]"
              >
                <div class="room-number">{{ room.code }}</div>
                <div class="room-status">
                  <span v-if="room.status === 'available'" class="status-available">可预订</span>
                  <span v-else class="status-booked">已预订</span>
                </div>
                <button 
                  v-if="room.status === 'available'"
                  @click="bookRoom(room)"
                  class="book-room-btn"
                >
                  立即预订
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-else class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          <span>正在加载房型信息...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import AppNavbar from '../../components/AppNavbar.vue'
import type { RoomType, RoomDataMap } from '@/types/api'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const roomType = ref<RoomType | null>(null)

// 示例房型数据
const roomTypesData: RoomDataMap = {
  '蘑菇森林小屋': {
    name: '蘑菇森林小屋',
    category: '豪华间',
    price: 388,
    describe: '隐藏在蘑菇森林深处的温馨小屋，四周环绕着各种珍稀蘑菇。房间采用天然木材装修，配备现代化设施，让您在享受自然美景的同时，体验舒适的住宿环境。清晨可听到鸟儿的歌声，夜晚可观赏满天繁星。',
    image: '/src/assets/images/card/card01.jpg',
    features: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '观景阳台', '24小时热水', '免费早餐'],
    rating: 4.8,
    rooms: [
      { id: 1, code: '201', status: 'available' },
      { id: 2, code: '202', status: 'available' }
    ]
  },
  '蘑菇生态园': {
    name: '蘑菇生态园',
    category: '标准间',
    price: 288,
    describe: '紧邻蘑菇生态园的舒适客房，可近距离观察各种蘑菇的生长过程，体验生态农业的魅力。房间设计简约舒适，配备生态观察窗，让您在休息的同时了解蘑菇种植知识。',
    image: '/src/assets/images/card/card02.jpg',
    features: ['WiFi', '空调', '电视', '独立卫浴', '生态观察窗', '蘑菇知识图册', '24小时热水'],
    rating: 4.5,
    rooms: [
      { id: 3, code: '301', status: 'available' },
      { id: 4, code: '302', status: 'available' }
    ]
  },
  '茶文化体验馆': {
    name: '茶文化体验馆',
    category: '特色间',
    price: 358,
    describe: '融合茶文化元素的特色客房，房间内设有茶艺台和品茶区，可体验正宗的普洱茶文化。房间装饰典雅，茶香怡人，是茶文化爱好者的理想选择。',
    image: '/src/assets/images/card/card03.jpg',
    features: ['WiFi', '空调', '电视', '独立卫浴', '茶艺台', '品茶区', '茶具套装', '普洱茶品鉴'],
    rating: 4.7,
    rooms: [
      { id: 5, code: '401', status: 'available' },
      { id: 6, code: '402', status: 'available' }
    ]
  },
  '普洱茶园': {
    name: '普洱茶园',
    category: '豪华间',
    price: 468,
    describe: '面向茶园的豪华客房，清晨可观赏茶园日出，房间充满茶香，是茶文化爱好者的首选。房间宽敞明亮，配备茶园观景台，让您尽情享受茶园美景。',
    image: '/src/assets/images/card/card04.JPG',
    features: ['WiFi', '空调', '电视', '独立卫浴', '茶园观景台', '茶叶储藏柜', '品茶设备', '茶园导览'],
    rating: 4.8,
    rooms: [
      { id: 7, code: '501', status: 'available' },
      { id: 8, code: '502', status: 'booked' }
    ]
  },
  '生态餐厅': {
    name: '生态餐厅',
    category: '套房',
    price: 588,
    describe: '紧邻生态餐厅的豪华套房，可享受便利的用餐服务，房间宽敞舒适，适合商务或家庭入住。套房配备客厅、用餐区和迷你厨房，让您享受家的温馨。',
    image: '/src/assets/images/card/card05.jpg',
    features: ['WiFi', '空调', '电视', '独立卫浴', '客厅', '用餐区', '迷你厨房', '保险箱', '24小时客房服务'],
    rating: 4.6,
    rooms: [
      { id: 9, code: '601', status: 'available' },
      { id: 10, code: '602', status: 'available' }
    ]
  }
}

onMounted(() => {
  const roomTypeName = route.params.roomType as string
  if (roomTypeName && roomTypesData[roomTypeName]) {
    roomType.value = roomTypesData[roomTypeName]
  }
})

const goBack = () => {
  router.push('/ai-rooms')
}

const bookRoom = (room: any) => {
  if (auth.isAuthenticated && roomType.value) {
    router.push({
      path: '/booking',
      query: {
        roomId: room.id,
        roomName: roomType.value.name,
        roomType: roomType.value.category,
        price: roomType.value.price
      }
    })
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.room-type-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.main-content {
  padding-top: 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.back-navigation {
  margin-bottom: 30px;
}

.back-btn {
  background: white;
  border: 2px solid #007bff;
  color: #007bff;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  background: #007bff;
  color: white;
}

.room-type-detail-content {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.05);
}

.room-type-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  padding: 30px;
}

.room-type-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
}

.room-type-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.room-type-category {
  background: #007bff;
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 15px;
}

.room-type-price {
  margin-bottom: 15px;
}

.price-amount {
  font-size: 2rem;
  font-weight: 700;
  color: #e74c3c;
}

.price-unit {
  color: #6c757d;
  font-size: 1rem;
}

.room-type-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars i {
  color: #ddd;
  font-size: 1.2rem;
}

.stars i.active {
  color: #ffc107;
}

.rating-text {
  color: #6c757d;
  font-weight: 600;
}

.room-type-description,
.room-facilities,
.available-rooms {
  padding: 30px;
  border-top: 1px solid #e9ecef;
}

.room-type-description h2,
.room-facilities h2,
.available-rooms h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.room-type-description p {
  color: #6c757d;
  line-height: 1.6;
  font-size: 1.1rem;
}

.facilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.facility-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.facility-item i {
  color: #28a745;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.room-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.room-item:not(.booked):hover {
  border-color: #007bff;
  transform: translateY(-2px);
}

.room-item.booked {
  background: #f5f5f5;
  opacity: 0.7;
  border: 2px solid #dc3545;
  position: relative;
}

.room-item.booked::before {
  content: '已预订';
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.room-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

.room-status {
  margin-bottom: 15px;
}

.status-available {
  color: #28a745;
  font-weight: 600;
}

.status-booked {
  color: #dc3545;
  font-weight: 600;
}

.book-room-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 4px 15px rgba(102,126,234,0.3);
}

.book-room-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102,126,234,0.4);
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.loading {
  text-align: center;
  padding: 60px;
  color: #6c757d;
}

.loading i {
  font-size: 2rem;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .room-type-header {
    grid-template-columns: 1fr;
  }
  
  .room-type-title {
    font-size: 2rem;
  }
}
</style>

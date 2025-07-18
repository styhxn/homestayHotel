<template>
  <div class="room-detail-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">🍄 普洱蘑菇庄园</div>
        <div class="nav-menu">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/tea-culture" class="nav-link">茶文化</router-link>
          <router-link to="/products" class="nav-link">民宿产品</router-link>
          <router-link to="/ai-rooms" class="nav-link">AI选房</router-link>
          <router-link to="/orders" class="nav-link">订单</router-link>
          <router-link to="/profile" class="nav-link">个人信息</router-link>
        </div>
        <div class="nav-buttons">
          <span class="user-welcome">欢迎，{{ auth.user?.username }}</span>
          <button @click="handleLogout" class="btn btn-outline">退出</button>
        </div>
      </div>
    </nav>

    <!-- 房间详情内容 -->
    <main class="main-content">
      <div v-if="loading" class="loading-container">
        <i class="fas fa-spinner fa-spin"></i>
        <span>加载中...</span>
      </div>

      <div v-else-if="room" class="room-detail-container">
        <!-- 返回按钮 -->
        <div class="back-section">
          <button @click="goBack" class="back-btn">
            <i class="fas fa-arrow-left"></i>
            返回房间列表
          </button>
        </div>

        <!-- 房间图片轮播 -->
        <div class="room-gallery">
          <div class="main-image">
            <img :src="currentImage" :alt="room.name" />
            <div class="image-nav">
              <button 
                @click="prevImage" 
                class="nav-btn prev-btn"
                :disabled="room.images.length <= 1"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button 
                @click="nextImage" 
                class="nav-btn next-btn"
                :disabled="room.images.length <= 1"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div class="thumbnail-list" v-if="room.images.length > 1">
            <img 
              v-for="(image, index) in room.images" 
              :key="index"
              :src="image" 
              :alt="`${room.name} ${index + 1}`"
              :class="{ active: currentImageIndex === index }"
              @click="currentImageIndex = index"
            />
          </div>
        </div>

        <!-- 房间信息 -->
        <div class="room-info-section">
          <div class="room-header">
            <h1 class="room-title">{{ room.name }}</h1>
            <div class="room-rating" v-if="room.rating">
              <div class="stars">
                <i v-for="i in 5" :key="i"
                   :class="i <= room.rating ? 'fas fa-star' : 'fa-regular fa-star'"></i>
              </div>
              <span class="rating-text">{{ room.rating }} 分</span>
            </div>
          </div>

          <div class="room-price">
            <span class="price">¥{{ room.price }}</span>
            <span class="unit">/晚</span>
          </div>

          <div class="room-description">
            <h3>房间介绍</h3>
            <p>{{ room.description }}</p>
          </div>

          <!-- 房间设施 -->
          <div class="room-amenities">
            <h3>房间设施</h3>
            <div class="amenities-grid">
              <div v-for="amenity in room.amenities" :key="amenity" class="amenity-item">
                <i class="fas fa-check"></i>
                <span>{{ amenity }}</span>
              </div>
            </div>
          </div>

          <!-- 房间详细信息 -->
          <div class="room-details">
            <h3>详细信息</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="label">房间类型：</span>
                <span class="value">{{ room.type }}</span>
              </div>
              <div class="detail-item">
                <span class="label">房间面积：</span>
                <span class="value">{{ room.area || '25' }}㎡</span>
              </div>
              <div class="detail-item">
                <span class="label">最大入住：</span>
                <span class="value">{{ room.maxGuests || '2' }}人</span>
              </div>
              <div class="detail-item">
                <span class="label">床型：</span>
                <span class="value">{{ room.bedType || '大床' }}</span>
              </div>
            </div>
          </div>

          <!-- 预订按钮 -->
          <div class="booking-section">
            <div class="availability-status" :class="room.status">
              <i :class="room.status === 'available' ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
              <span>{{ room.status === 'available' ? '可预订' : '已被预订' }}</span>
            </div>
            <button 
              class="book-btn"
              :disabled="room.status !== 'available'"
              @click="bookRoom"
            >
              {{ room.status === 'available' ? '立即预订' : '暂不可预订' }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="error-container">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>房间不存在</h3>
        <p>抱歉，您查看的房间不存在或已被删除</p>
        <button @click="goBack" class="btn btn-primary">返回房间列表</button>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import request from '../../utils/request'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

// 响应式数据
const loading = ref(true)
const room = ref<any>(null)
const currentImageIndex = ref(0)

// 计算属性
const currentImage = computed(() => {
  if (!room.value?.images || room.value.images.length === 0) {
    return '/src/assets/images/card/card01.jpg'
  }
  return room.value.images[currentImageIndex.value]
})

// 方法
const fetchRoomDetail = async () => {
  loading.value = true
  try {
    const roomId = route.params.id;

    // 先尝试获取房间详情和图片
    let response: any;
    try {
      response = await request.get(`/h/room/detail?id=${roomId}`);
    } catch (detailError) {
      // 如果详情接口失败，尝试基础房间信息接口
      response = await request.get(`/h/room/${roomId}`);
    }

    if (response.code === 200 || response.code === "200") {
      if (response.data.room) {
        // 详情接口返回的数据结构
        room.value = {
          ...response.data.room,
          status: response.data.room.status === 0 ? 'available' : 'booked',
          images: response.data.img?.map((img: any) => getImageUrl(img.url)) || getDefaultImages(roomId),
          amenities: response.data.room.device?.split(',') || getDefaultAmenities()
        };
      } else {
        // 基础接口返回的数据结构
        room.value = {
          ...response.data,
          status: response.data.status === 0 ? 'available' : 'booked',
          images: getDefaultImages(roomId),
          amenities: response.data.device?.split(',') || getDefaultAmenities()
        };
      }
    } else {
      throw new Error('获取房间详情失败');
    }
  } catch (error) {
    console.error('获取房间详情失败:', error);
    // 使用示例数据作为备用
    room.value = getExampleRoom(route.params.id as string);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (imageName: string) => {
  if (!imageName) return getDefaultRoomImage();
  if (imageName.startsWith('http')) return imageName;
  return `http://localhost:8091/files/${imageName}`;
};

const getDefaultImages = (roomId: any) => {
  const imageMap: any = {
    '1': [
      '/src/assets/images/实地调研/房间参观/房间参观1.jpg',
      '/src/assets/images/实地调研/室内调研/室内1.jpg'
    ],
    '2': [
      '/src/assets/images/实地调研/房间参观/房间参观2.jpg',
      '/src/assets/images/实地调研/室内调研/室内2.jpg'
    ],
    '3': [
      '/src/assets/images/实地调研/室内调研/室内3.jpg',
      '/src/assets/images/实地调研/室内调研/室内4.jpg'
    ]
  };
  return imageMap[roomId] || [
    '/src/assets/images/实地调研/房间参观/房间参观1.jpg',
    '/src/assets/images/实地调研/室内调研/室内1.jpg'
  ];
};

const getDefaultAmenities = () => {
  return ['免费WiFi', '空调', '24小时热水', '独立卫浴', '电视', '冰箱'];
};

const getDefaultRoomImage = () => {
  return '/src/assets/images/实地调研/房间参观/房间参观1.jpg';
};

const getExampleRoom = (id: string) => {
  const exampleRooms: any = {
    '1': {
      id: 1,
      name: '蘑菇森林小屋',
      code: 'MG-001',
      category: '豪华间',
      price: 388,
      state: '空闲',
      status: 'available',
      describe: '隐藏在蘑菇森林深处的温馨小屋，四周环绕着各种珍稀蘑菇。房间采用天然木材装修，配备现代化设施。',
      device: 'WiFi,空调,电视,独立卫浴,迷你吧,阳台',
      address: '普洱蘑菇庄园森林区A栋',
      city: '普洱市',
      seat: 2,
      images: getDefaultImages('1'),
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '迷你吧', '阳台']
    },
    '2': {
      id: 2,
      name: '普洱茶香木屋',
      code: 'MG-002',
      category: '标准间',
      price: 288,
      state: '空闲',
      status: 'available',
      describe: '充满茶香的精致木屋，房间内陈设着各种普洱茶具和茶叶。您可以在房间内品茶赏景。',
      device: 'WiFi,空调,电视,独立卫浴,茶具套装,观景窗',
      address: '普洱蘑菇庄园茶园区B栋',
      city: '普洱市',
      seat: 2,
      images: getDefaultImages('2'),
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '茶具套装', '观景窗']
    },
    '3': {
      id: 3,
      name: '庄园豪华套房',
      code: 'MG-003',
      category: '套房',
      price: 588,
      state: '空闲',
      status: 'available',
      describe: '庄园内最豪华的套房，拥有独立客厅、卧室和观景阳台。房间装修典雅，设施齐全。',
      device: 'WiFi,空调,电视,独立卫浴,客厅,阳台,迷你吧,保险箱',
      address: '普洱蘑菇庄园主楼C栋',
      city: '普洱市',
      seat: 4,
      images: getDefaultImages('3'),
      amenities: ['WiFi', '空调', '电视', '独立卫浴', '客厅', '阳台', '迷你吧', '保险箱']
    }
  };

  return exampleRooms[id] || exampleRooms['1'];
};

const prevImage = () => {
  if (room.value?.images && room.value.images.length > 1) {
    currentImageIndex.value = currentImageIndex.value === 0
      ? room.value.images.length - 1
      : currentImageIndex.value - 1;
  }
};

const nextImage = () => {
  if (room.value?.images && room.value.images.length > 1) {
    currentImageIndex.value = currentImageIndex.value === room.value.images.length - 1
      ? 0
      : currentImageIndex.value + 1;
  }
};

const goBack = () => {
  router.push('/ai-rooms');
};

const bookRoom = () => {
  if (room.value && room.value.status === 'available') {
    router.push(`/book/${room.value.id}`);
  }
};

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};

// 生命周期
onMounted(() => {
  fetchRoomDetail();
});
</script>

<style scoped>
/* 基础样式 */
.room-detail-page {
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

.btn-primary:hover {
  background: #45a049;
}

/* 主要内容 */
.main-content {
  max-width: 1200px;
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

/* 房间详情容器 */
.room-detail-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* 图片轮播 */
.room-gallery {
  position: relative;
}

.main-image {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-nav {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-btn:hover:not(:disabled) {
  background: white;
  transform: scale(1.1);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.thumbnail-list {
  display: flex;
  gap: 8px;
  padding: 16px;
  overflow-x: auto;
}

.thumbnail-list img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.thumbnail-list img.active,
.thumbnail-list img:hover {
  opacity: 1;
}

/* 房间信息 */
.room-info-section {
  padding: 32px;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.room-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.room-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  color: #fbbf24;
}

.rating-text {
  color: #6b7280;
  font-size: 0.9rem;
}

.room-price {
  margin-bottom: 24px;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #4caf50;
}

.unit {
  color: #6b7280;
  font-size: 1rem;
}

.room-description,
.room-amenities,
.room-details {
  margin-bottom: 32px;
}

.room-description h3,
.room-amenities h3,
.room-details h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.room-description p {
  color: #6b7280;
  line-height: 1.6;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
}

.amenity-item i {
  color: #4caf50;
  font-size: 0.8rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.detail-item {
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

/* 预订区域 */
.booking-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: #f9fafb;
  border-radius: 8px;
  margin-top: 32px;
}

.availability-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.availability-status.available {
  color: #059669;
}

.availability-status.booked {
  color: #dc2626;
}

.book-btn {
  padding: 12px 32px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.book-btn:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
}

.book-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .room-info-section {
    padding: 24px 16px;
  }
  
  .room-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .room-title {
    font-size: 1.5rem;
  }
  
  .booking-section {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .book-btn {
    width: 100%;
  }
  
  .amenities-grid {
    grid-template-columns: 1fr;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="ai-recommendation-panel" v-if="recommendations.length > 0">
    <div class="panel-header">
      <h3 class="panel-title">
        <span class="ai-icon">🤖</span>
        普普为您推荐
      </h3>
      <button @click="clearRecommendations" class="clear-btn">
        <span>✕</span>
      </button>
    </div>
    
    <div class="recommendations-list">
      <div 
        v-for="room in recommendations" 
        :key="room.id"
        class="recommendation-item"
        @click="selectRoom(room)"
      >
        <div class="room-image">
          <img :src="room.image" :alt="room.name" />
          <div class="room-badge" v-if="room.type?.includes('亲子')">
            👨‍👩‍👧‍👦 亲子房
          </div>
        </div>
        
        <div class="room-info">
          <div class="room-header">
            <h4 class="room-name">{{ room.code }}号房 - {{ room.name }}</h4>
            <div class="room-price">¥{{ room.price }}/晚</div>
          </div>
          
          <div class="room-features">
            <span class="feature" v-if="room.direction">
              🧭 {{ room.direction }}
            </span>
            <span class="feature" v-if="room.hasWindow !== false">
              🪟 有窗户
            </span>
            <span class="feature" v-if="room.floor">
              🏢 {{ room.floor }}楼
            </span>
          </div>
          
          <div class="room-highlights" v-if="room.features">
            <span 
              v-for="feature in room.features.slice(0, 3)" 
              :key="feature"
              class="highlight"
            >
              ✨ {{ feature }}
            </span>
          </div>
          
          <div class="action-buttons">
            <a
              v-if="room.vrUrl"
              :href="room.vrUrl"
              target="_blank"
              class="vr-btn"
              @click.stop
            >
              🔗 VR全景
            </a>
            <button @click.stop="viewRoom(room)" class="view-btn">
              📱 查看详情
            </button>
            <button @click.stop="bookRoom(room)" class="book-btn">
              📅 立即预订
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="panel-footer">
      <p class="ai-tip">
        💡 这些推荐基于您的需求智能匹配，点击房间可查看更多详情
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Room {
  id: number | string
  code: string
  name: string
  price: number
  floor: number | string
  direction?: string
  hasWindow?: boolean
  type?: string
  features?: string[]
  image?: string
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
  roomSelected: [room: Room]
  roomBooked: [room: Room]
  roomViewed: [room: Room]
}>()

// 响应式数据
const recommendations = ref<Room[]>([])

// 方法
const clearRecommendations = () => {
  recommendations.value = []
}

const selectRoom = (room: Room) => {
  emit('roomSelected', room)
}

const viewRoom = (room: Room) => {
  emit('roomViewed', room)
}

const bookRoom = (room: Room) => {
  emit('roomBooked', room)
}

// 显示推荐房间
const showRecommendations = (rooms: Room[]) => {
  recommendations.value = rooms.map(room => ({
    ...room,
    image: room.image || getDefaultRoomImage(room)
  }))
}

// 获取默认房间图片
const getDefaultRoomImage = (room: Room): string => {
  const floor = typeof room.floor === 'string' ? parseInt(room.floor) : room.floor
  if (floor === 1) {
    return '/src/assets/images/实地调研/房间调研/房间调研1.jpg'
  } else if (floor === 2) {
    return '/src/assets/images/实地调研/房间调研/房间调研2.jpg'
  } else if (floor === 3) {
    return '/src/assets/images/实地调研/房间调研/房间调研3.jpg'
  }
  return '/src/assets/images/实地调研/房间调研/房间调研1.jpg'
}

// 暴露方法给全局使用
onMounted(() => {
  if (typeof window !== 'undefined') {
    (window as any).showRoomRecommendations = showRecommendations
  }
})
</script>

<style scoped>
.ai-recommendation-panel {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 350px;
  max-height: 70vh;
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
  background: linear-gradient(135deg, #2D5016 0%, #4a7c59 100%);
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

.ai-icon {
  font-size: 18px;
}

.clear-btn {
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

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.recommendations-list {
  max-height: 50vh;
  overflow-y: auto;
  padding: 16px;
}

.recommendation-item {
  background: white;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.recommendation-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-color: #2D5016;
}

.room-image {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(45, 80, 22, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.room-info {
  padding: 16px;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.room-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.room-price {
  color: #D4AF37;
  font-weight: 600;
  font-size: 16px;
}

.room-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.feature {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  color: #666;
}

.room-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.highlight {
  background: linear-gradient(135deg, #2D5016, #4a7c59);
  color: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 11px;
}

.action-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.vr-btn, .view-btn, .book-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.vr-btn {
  background: linear-gradient(135deg, #D4AF37, #f4d03f);
  color: white;
  border: 1px solid #D4AF37;
}

.vr-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
  background: linear-gradient(135deg, #B8941F, #D4AF37);
}

.view-btn {
  background: #f8f9fa;
  color: #666;
}

.view-btn:hover {
  background: #e9ecef;
}

.book-btn {
  background: linear-gradient(135deg, #D4AF37, #f4d03f);
  color: white;
}

.book-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.panel-footer {
  padding: 12px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.ai-tip {
  margin: 0;
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .ai-recommendation-panel {
    left: 10px;
    right: 10px;
    width: auto;
    max-width: none;
  }
  
  .recommendation-item {
    margin-bottom: 12px;
  }
  
  .room-image {
    height: 100px;
  }
  
  .room-info {
    padding: 12px;
  }
}
</style>

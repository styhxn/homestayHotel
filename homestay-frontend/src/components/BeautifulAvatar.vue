<template>
  <div class="beautiful-avatar" :class="[`size-${size}`, { clickable: clickable }]" @click="handleClick">
    <div class="avatar-container">
      <!-- 外层装饰环 -->
      <div class="decoration-ring"></div>
      
      <!-- 主头像框架 -->
      <div class="avatar-frame">
        <div class="avatar-inner">
          <img 
            :src="avatarUrl" 
            :alt="alt" 
            class="avatar-image"
            @error="handleImageError"
          >
          
          <!-- 状态指示器 -->
          <div v-if="showStatus" class="status-indicator" :class="statusType">
            <div class="status-dot"></div>
          </div>
          
          <!-- 悬停覆盖层 -->
          <div v-if="clickable" class="hover-overlay">
            <i class="fas fa-camera"></i>
            <span>更换头像</span>
          </div>
        </div>
      </div>
      
      <!-- 光效动画 -->
      <div v-if="animated" class="glow-effect"></div>
      <div v-if="animated" class="pulse-ring"></div>
    </div>
    
    <!-- 用户名标签 -->
    <div v-if="showName && userName" class="user-name-tag">
      <span>{{ userName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

// Props
interface Props {
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  clickable?: boolean
  animated?: boolean
  showStatus?: boolean
  statusType?: 'online' | 'offline' | 'busy' | 'away'
  showName?: boolean
  userName?: string
  fallbackType?: 'ip' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '用户头像',
  size: 'md',
  clickable: false,
  animated: false,
  showStatus: false,
  statusType: 'offline',
  showName: false,
  userName: '',
  fallbackType: 'ip'
})

// Emits
const emit = defineEmits<{
  click: []
}>()

// 计算属性
const avatarUrl = computed(() => {
  if (props.src) {
    return props.src
  }
  
  // 使用IP形象作为默认头像
  if (props.fallbackType === 'ip') {
    return '/src/assets/images/IP形象/普普正面.png'
  }
  
  // 默认头像
  return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&h=400&q=80'
})

// 方法
const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (props.fallbackType === 'ip') {
    img.src = '/src/assets/images/IP形象/普普正面.png'
  } else {
    img.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&h=400&q=80'
  }
}
</script>

<style scoped>
.beautiful-avatar {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.decoration-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border-radius: 50%;
  background: linear-gradient(45deg, 
    #FFD700 0%, 
    #4CAF50 25%, 
    #8B4513 50%, 
    #CD853F 75%, 
    #FFD700 100%);
  opacity: 0.3;
  animation: rotate 8s linear infinite;
}

.avatar-frame {
  position: relative;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700, #4CAF50);
  padding: 4px;
  box-shadow: 
    0 8px 32px rgba(139, 69, 19, 0.25),
    0 0 0 3px rgba(255, 255, 255, 0.8),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
}

.avatar-inner {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  background: white;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.clickable .avatar-image:hover {
  transform: scale(1.05);
}

.status-indicator {
  position: absolute;
  bottom: 8%;
  right: 8%;
  width: 25%;
  height: 25%;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.status-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.online .status-dot {
  background: #4CAF50;
}

.status-indicator.offline .status-dot {
  background: #9E9E9E;
}

.status-indicator.busy .status-dot {
  background: #F44336;
}

.status-indicator.away .status-dot {
  background: #FF9800;
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(139, 69, 19, 0.8);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  gap: 4px;
}

.clickable:hover .hover-overlay {
  opacity: 1;
}

.hover-overlay i {
  font-size: 1.2rem;
}

.glow-effect {
  position: absolute;
  top: -20%;
  left: -20%;
  right: -20%;
  bottom: -20%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
  animation: glow 3s ease-in-out infinite alternate;
}

.pulse-ring {
  position: absolute;
  top: -10%;
  left: -10%;
  right: -10%;
  bottom: -10%;
  border: 2px solid rgba(139, 69, 19, 0.3);
  border-radius: 50%;
  animation: pulse-ring 2s ease-out infinite;
}

.user-name-tag {
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.9), rgba(205, 133, 63, 0.9));
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
  backdrop-filter: blur(10px);
}

/* 尺寸变体 */
.size-xs .avatar-inner {
  width: 32px;
  height: 32px;
}

.size-sm .avatar-inner {
  width: 48px;
  height: 48px;
}

.size-md .avatar-inner {
  width: 80px;
  height: 80px;
}

.size-lg .avatar-inner {
  width: 120px;
  height: 120px;
}

.size-xl .avatar-inner {
  width: 160px;
  height: 160px;
}

/* 点击效果 */
.clickable {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.clickable:active {
  transform: scale(0.95);
}

/* 动画 */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes glow {
  from {
    opacity: 0.5;
    transform: scale(1);
  }
  to {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .size-lg .avatar-inner {
    width: 100px;
    height: 100px;
  }
  
  .size-xl .avatar-inner {
    width: 120px;
    height: 120px;
  }
}
</style>

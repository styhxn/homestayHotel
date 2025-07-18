<template>
  <div class="ip-avatar-selector">
    <div class="selector-header">
      <h3>
        <i class="fas fa-palette"></i>
        选择您的专属IP形象
      </h3>
      <p>选择一个可爱的IP形象作为您的头像</p>
    </div>

    <div class="avatar-grid">
      <div 
        v-for="avatar in ipAvatars" 
        :key="avatar.id"
        class="avatar-option"
        :class="{ active: selectedAvatar === avatar.id }"
        @click="selectAvatar(avatar.id)"
      >
        <div class="avatar-frame">
          <img :src="avatar.image" :alt="avatar.name" class="avatar-image">
          <div class="avatar-overlay">
            <i class="fas fa-check"></i>
          </div>
        </div>
        <div class="avatar-info">
          <h4>{{ avatar.name }}</h4>
          <p>{{ avatar.description }}</p>
        </div>
      </div>
    </div>

    <div class="selector-actions">
      <button class="cancel-btn" @click="$emit('cancel')">
        <i class="fas fa-times"></i>
        取消
      </button>
      <button class="confirm-btn" @click="confirmSelection" :disabled="!selectedAvatar">
        <i class="fas fa-check"></i>
        确认选择
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

// Props
interface Props {
  currentAvatar?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentAvatar: ''
})

// Emits
const emit = defineEmits<{
  select: [avatarId: string, avatarUrl: string]
  cancel: []
}>()

// 响应式数据
const selectedAvatar = ref<string>(props.currentAvatar)

// IP形象头像列表
const ipAvatars = [
  {
    id: 'pupu-front',
    name: '普普正面',
    description: '温暖亲切的茶文化专家',
    image: '/src/assets/images/IP形象/普普正面.png'
  },
  {
    id: 'pupu-2d-1',
    name: '普普平面1',
    description: '活泼可爱的2D形象',
    image: '/src/assets/images/IP形象/普普平面展示2D   1.png'
  },
  {
    id: 'pupu-2d-2',
    name: '普普平面2',
    description: '优雅精致的2D形象',
    image: '/src/assets/images/IP形象/普普平面展示2D    2.png'
  }
]

// 方法
const selectAvatar = (avatarId: string) => {
  selectedAvatar.value = avatarId
}

const confirmSelection = () => {
  if (selectedAvatar.value) {
    const avatar = ipAvatars.find(a => a.id === selectedAvatar.value)
    if (avatar) {
      emit('select', avatar.id, avatar.image)
    }
  }
}
</script>

<style scoped>
.ip-avatar-selector {
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.selector-header {
  text-align: center;
  margin-bottom: 30px;
}

.selector-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.selector-header h3 i {
  color: #8B4513;
}

.selector-header p {
  color: #718096;
  margin: 0;
  font-size: 0.95rem;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.avatar-option {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 15px;
  border-radius: 15px;
  border: 2px solid transparent;
}

.avatar-option:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(139, 69, 19, 0.15);
}

.avatar-option.active {
  border-color: #8B4513;
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.05), rgba(205, 133, 63, 0.05));
}

.avatar-frame {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #FFD700, #4CAF50);
  padding: 3px;
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.2);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  background: white;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(139, 69, 19, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-option.active .avatar-overlay {
  opacity: 1;
}

.avatar-overlay i {
  color: white;
  font-size: 1.5rem;
}

.avatar-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 5px 0;
}

.avatar-info p {
  font-size: 0.85rem;
  color: #718096;
  margin: 0;
}

.selector-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.cancel-btn,
.confirm-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.cancel-btn {
  background: #f7fafc;
  color: #718096;
  border: 2px solid #e2e8f0;
}

.cancel-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.confirm-btn {
  background: linear-gradient(135deg, #8B4513, #CD853F);
  color: white;
  border: 2px solid transparent;
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.3);
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ip-avatar-selector {
    padding: 20px;
    margin: 10px;
  }
  
  .avatar-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .avatar-frame {
    width: 80px;
    height: 80px;
  }
  
  .selector-actions {
    flex-direction: column;
  }
}
</style>

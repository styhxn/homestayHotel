<template>
  <Transition name="notification" appear>
    <div v-if="visible" :class="['notification', `notification-${type}`]" @click="handleClick">
      <div class="notification-icon">
        <i :class="iconClass"></i>
      </div>
      <div class="notification-content">
        <h4 v-if="title" class="notification-title">{{ title }}</h4>
        <p class="notification-message">{{ message }}</p>
      </div>
      <button v-if="closable" @click.stop="close" class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  closable?: boolean
  onClick?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 4000,
  closable: true
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)

const iconClass = computed(() => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  }
  return icons[props.type]
})

const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

const handleClick = () => {
  if (props.onClick) {
    props.onClick()
  }
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>

<style scoped>
.notification {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.notification::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: currentColor;
}

.notification:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.notification-success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%);
  color: #059669;
  border-color: rgba(16, 185, 129, 0.3);
}

.notification-error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
  color: #dc2626;
  border-color: rgba(239, 68, 68, 0.3);
}

.notification-warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%);
  color: #d97706;
  border-color: rgba(245, 158, 11, 0.3);
}

.notification-info {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(184, 148, 31, 0.05) 100%);
  color: #d4af37;
  border-color: rgba(212, 175, 55, 0.3);
}

.notification-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: inherit;
}

.notification-message {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: inherit;
  opacity: 0.9;
}

.notification-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.notification-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}

/* 动画效果 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notification {
    padding: 16px;
    margin-bottom: 12px;
  }
  
  .notification-title {
    font-size: 14px;
  }
  
  .notification-message {
    font-size: 13px;
  }
}
</style>

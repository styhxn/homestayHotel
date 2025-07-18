<template>
  <div class="empty-state">
    <div class="empty-icon">
      <i :class="iconClass"></i>
    </div>
    <div class="empty-content">
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-description">{{ description }}</p>
      <div v-if="$slots.action" class="empty-action">
        <slot name="action"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'default' | 'search' | 'error' | 'network' | 'permission'
  title?: string
  description?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  title: '暂无数据',
  description: '当前没有可显示的内容'
})

const iconClass = computed(() => {
  if (props.icon) {
    return props.icon
  }
  
  const icons = {
    default: 'fas fa-inbox',
    search: 'fas fa-search',
    error: 'fas fa-exclamation-triangle',
    network: 'fas fa-wifi',
    permission: 'fas fa-lock'
  }
  
  return icons[props.type]
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  min-height: 300px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
}

.empty-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(184, 148, 31, 0.05) 100%);
  border-radius: 50%;
}

.empty-icon i {
  font-size: 48px;
  color: #d4af37;
  position: relative;
  z-index: 1;
  opacity: 0.8;
}

.empty-content {
  max-width: 400px;
}

.empty-title {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.empty-description {
  margin: 0 0 32px 0;
  font-size: 16px;
  line-height: 1.6;
  color: #6b7280;
}

.empty-action {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 不同类型的样式变化 */
.empty-state[data-type="search"] .empty-icon {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.empty-state[data-type="search"] .empty-icon i {
  color: #3b82f6;
}

.empty-state[data-type="error"] .empty-icon {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.empty-state[data-type="error"] .empty-icon i {
  color: #ef4444;
}

.empty-state[data-type="network"] .empty-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.empty-state[data-type="network"] .empty-icon i {
  color: #f59e0b;
}

.empty-state[data-type="permission"] .empty-icon {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
}

.empty-state[data-type="permission"] .empty-icon i {
  color: #6366f1;
}

/* 动画效果 */
.empty-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-icon i {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .empty-state {
    padding: 60px 24px;
    min-height: 250px;
  }
  
  .empty-icon {
    width: 100px;
    height: 100px;
    margin-bottom: 24px;
  }
  
  .empty-icon i {
    font-size: 40px;
  }
  
  .empty-title {
    font-size: 20px;
    margin-bottom: 12px;
  }
  
  .empty-description {
    font-size: 14px;
    margin-bottom: 24px;
  }
  
  .empty-action {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .empty-state {
    padding: 40px 16px;
  }
  
  .empty-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
  }
  
  .empty-icon i {
    font-size: 32px;
  }
  
  .empty-title {
    font-size: 18px;
  }
  
  .empty-description {
    font-size: 13px;
  }
}
</style>

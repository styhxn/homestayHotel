<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="[toast.type, { 'toast-dismissible': toast.dismissible }]"
          @click="toast.dismissible && removeToast(toast.id)"
        >
          <div class="toast-icon">
            <i :class="getIconClass(toast.type)"></i>
          </div>
          
          <div class="toast-content">
            <div v-if="toast.title" class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          
          <button
            v-if="toast.dismissible"
            @click.stop="removeToast(toast.id)"
            class="toast-close"
          >
            <i class="fas fa-times"></i>
          </button>
          
          <div
            v-if="toast.duration && toast.duration > 0"
            class="toast-progress"
            :style="{ animationDuration: `${toast.duration}ms` }"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  dismissible?: boolean
}

const toasts = ref<Toast[]>([])

// 添加通知
const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
  const newToast: Toast = {
    id,
    dismissible: true,
    duration: 5000,
    ...toast
  }
  
  toasts.value.push(newToast)
  
  // 自动移除
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }
  
  return id
}

// 移除通知
const removeToast = (id: string) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// 清空所有通知
const clearToasts = () => {
  toasts.value = []
}

// 获取图标类名
const getIconClass = (type: Toast['type']) => {
  const iconMap = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  }
  return iconMap[type]
}

// 暴露方法给外部使用
const toastMethods = {
  addToast,
  removeToast,
  clearToasts,
  success: (message: string, title?: string, options?: Partial<Toast>) =>
    addToast({ type: 'success', message, title, ...options }),
  error: (message: string, title?: string, options?: Partial<Toast>) =>
    addToast({ type: 'error', message, title, ...options }),
  warning: (message: string, title?: string, options?: Partial<Toast>) =>
    addToast({ type: 'warning', message, title, ...options }),
  info: (message: string, title?: string, options?: Partial<Toast>) =>
    addToast({ type: 'info', message, title, ...options })
}

defineExpose(toastMethods)

// 监听全局事件
onMounted(() => {
  // 可以监听全局事件来显示通知
  window.addEventListener('show-toast', (event: any) => {
    addToast(event.detail)
  })
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--spacing-6);
  right: var(--spacing-6);
  z-index: var(--z-toast, 1080);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  max-width: 400px;
  width: 100%;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border-left: 4px solid;
  position: relative;
  overflow: hidden;
  cursor: default;
  transition: var(--transition-base);
}

.toast:hover {
  transform: translateX(-4px);
  box-shadow: var(--shadow-xl);
}

.toast-dismissible {
  cursor: pointer;
}

/* 类型样式 */
.toast.success {
  border-left-color: var(--color-success, #10b981);
}

.toast.error {
  border-left-color: var(--color-error, #ef4444);
}

.toast.warning {
  border-left-color: var(--color-warning, #f59e0b);
}

.toast.info {
  border-left-color: var(--color-info, #3b82f6);
}

/* 图标样式 */
.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
}

.toast.success .toast-icon {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success, #10b981);
}

.toast.error .toast-icon {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error, #ef4444);
}

.toast.warning .toast-icon {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning, #f59e0b);
}

.toast.info .toast-icon {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-info, #3b82f6);
}

/* 内容样式 */
.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-1);
}

.toast-message {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
}

/* 关闭按钮 */
.toast-close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  border-radius: var(--radius-base);
  transition: var(--transition-base);
  font-size: 12px;
}

.toast-close:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

/* 进度条 */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  animation: toast-progress linear forwards;
}

.toast.success .toast-progress {
  color: var(--color-success, #10b981);
}

.toast.error .toast-progress {
  color: var(--color-error, #ef4444);
}

.toast.warning .toast-progress {
  color: var(--color-warning, #f59e0b);
}

.toast.info .toast-progress {
  color: var(--color-info, #3b82f6);
}

/* 动画 */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes toast-progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .toast-container {
    top: var(--spacing-4);
    right: var(--spacing-4);
    left: var(--spacing-4);
    max-width: none;
  }
  
  .toast {
    padding: var(--spacing-3);
  }
  
  .toast-title {
    font-size: var(--font-size-xs);
  }
  
  .toast-message {
    font-size: var(--font-size-xs);
  }
}
</style>

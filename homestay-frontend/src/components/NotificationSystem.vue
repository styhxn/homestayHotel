<template>
  <teleport to="body">
    <div class="notification-container">
      <transition-group name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['notification', `notification-${notification.type}`]"
          @click="removeNotification(notification.id)"
        >
          <div class="notification-icon">
            <i :class="getIcon(notification.type)"></i>
          </div>
          <div class="notification-content">
            <h4 class="notification-title">{{ notification.title }}</h4>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          <button class="notification-close" @click.stop="removeNotification(notification.id)">
            <i class="fas fa-times"></i>
          </button>
          <div class="notification-progress" :style="{ animationDuration: notification.duration + 'ms' }"></div>
        </div>
      </transition-group>
    </div>

    <!-- 确认对话框 -->
    <div v-if="confirmDialog.show" class="modal-overlay" @click="cancelConfirm">
      <div class="confirm-dialog" @click.stop>
        <div class="confirm-header">
          <div class="confirm-icon">
            <i :class="confirmDialog.icon || 'fas fa-question-circle'"></i>
          </div>
          <h3 class="confirm-title">{{ confirmDialog.title || '确认操作' }}</h3>
        </div>
        <div class="confirm-body">
          <p class="confirm-message">{{ confirmDialog.message }}</p>
        </div>
        <div class="confirm-footer">
          <button class="btn btn-outline" @click="cancelConfirm">
            {{ confirmDialog.cancelText || '取消' }}
          </button>
          <button class="btn btn-primary" @click="confirmAction">
            {{ confirmDialog.confirmText || '确认' }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface Notification {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration: number
}

interface ConfirmDialog {
  show: boolean
  title?: string
  message: string
  icon?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

const notifications = ref<Notification[]>([])
const confirmDialog = reactive<ConfirmDialog>({
  show: false,
  message: '',
  onConfirm: undefined,
  onCancel: undefined
})

let notificationId = 0

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return 'fas fa-check-circle'
    case 'error':
      return 'fas fa-exclamation-circle'
    case 'warning':
      return 'fas fa-exclamation-triangle'
    case 'info':
      return 'fas fa-info-circle'
    default:
      return 'fas fa-bell'
  }
}

const addNotification = (type: Notification['type'], title: string, message: string, duration = 4000) => {
  const id = ++notificationId
  const notification: Notification = {
    id,
    type,
    title,
    message,
    duration
  }
  
  notifications.value.push(notification)
  
  setTimeout(() => {
    removeNotification(id)
  }, duration)
  
  return id
}

const removeNotification = (id: number) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const showConfirm = (options: {
  title?: string
  message: string
  icon?: string
  confirmText?: string
  cancelText?: string
}): Promise<boolean> => {
  return new Promise((resolve) => {
    confirmDialog.show = true
    confirmDialog.title = options.title
    confirmDialog.message = options.message
    confirmDialog.icon = options.icon
    confirmDialog.confirmText = options.confirmText
    confirmDialog.cancelText = options.cancelText
    
    confirmDialog.onConfirm = () => {
      confirmDialog.show = false
      resolve(true)
    }
    
    confirmDialog.onCancel = () => {
      confirmDialog.show = false
      resolve(false)
    }
  })
}

const confirmAction = () => {
  confirmDialog.onConfirm?.()
}

const cancelConfirm = () => {
  confirmDialog.onCancel?.()
}

// 导出方法供全局使用
defineExpose({
  success: (title: string, message: string, duration?: number) => 
    addNotification('success', title, message, duration),
  error: (title: string, message: string, duration?: number) => 
    addNotification('error', title, message, duration),
  warning: (title: string, message: string, duration?: number) => 
    addNotification('warning', title, message, duration),
  info: (title: string, message: string, duration?: number) => 
    addNotification('info', title, message, duration),
  confirm: showConfirm
})
</script>

<style scoped>
/* 通知容器 */
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

/* 通知卡片 */
.notification {
  position: relative;
  width: 350px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  margin-bottom: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  pointer-events: auto;
  overflow: hidden;
  border-left: 4px solid;
}

.notification-success {
  border-left-color: #10b981;
}

.notification-error {
  border-left-color: #ef4444;
}

.notification-warning {
  border-left-color: #f59e0b;
}

.notification-info {
  border-left-color: #3b82f6;
}

.notification-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.notification-success .notification-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.notification-error .notification-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.notification-warning .notification-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.notification-info .notification-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.notification-content {
  flex: 1;
}

.notification-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.notification-message {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.notification-close {
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.notification-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #059669);
  animation: progress linear;
  transform-origin: left;
}

.notification-error .notification-progress {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.notification-warning .notification-progress {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.notification-info .notification-progress {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

@keyframes progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* 通知动画 */
.notification-enter-active {
  transition: all 0.3s ease;
}

.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 模态框覆盖层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

/* 确认对话框 */
.confirm-dialog {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  animation: slideIn 0.3s ease;
}

.confirm-header {
  padding: 24px 24px 16px;
  text-align: center;
}

.confirm-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  font-size: 24px;
}

.confirm-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.confirm-body {
  padding: 0 24px 24px;
  text-align: center;
}

.confirm-message {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
  white-space: pre-line;
}

.confirm-footer {
  padding: 16px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover {
  background: #059669;
}

.btn-outline {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .notification-container {
    left: 20px;
    right: 20px;
  }
  
  .notification {
    width: 100%;
  }
  
  .confirm-dialog {
    margin: 20px;
  }
}
</style>

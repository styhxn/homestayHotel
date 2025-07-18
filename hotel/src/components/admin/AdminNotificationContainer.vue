<template>
  <Teleport to="body">
    <div class="notification-container">
      <AdminNotification
        v-for="notification in notifications"
        :key="notification.id"
        :type="notification.type"
        :title="notification.title"
        :message="notification.message"
        :duration="notification.duration"
        :closable="notification.closable"
        :onClick="notification.onClick"
        @close="removeNotification(notification.id)"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminNotification from './AdminNotification.vue'

export interface NotificationOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  closable?: boolean
  onClick?: () => void
}

interface NotificationItem extends NotificationOptions {
  id: string
}

const notifications = ref<NotificationItem[]>([])

const addNotification = (options: NotificationOptions) => {
  const id = Date.now().toString() + Math.random().toString(36).substring(2, 11)
  const notification: NotificationItem = {
    id,
    type: 'info',
    duration: 4000,
    closable: true,
    ...options
  }
  
  notifications.value.push(notification)
  
  return id
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const clearAll = () => {
  notifications.value = []
}

// 便捷方法
const success = (message: string, title?: string, options?: Partial<NotificationOptions>) => {
  return addNotification({ type: 'success', message, title, ...options })
}

const error = (message: string, title?: string, options?: Partial<NotificationOptions>) => {
  return addNotification({ type: 'error', message, title, ...options })
}

const warning = (message: string, title?: string, options?: Partial<NotificationOptions>) => {
  return addNotification({ type: 'warning', message, title, ...options })
}

const info = (message: string, title?: string, options?: Partial<NotificationOptions>) => {
  return addNotification({ type: 'info', message, title, ...options })
}

defineExpose({
  addNotification,
  removeNotification,
  clearAll,
  success,
  error,
  warning,
  info
})


</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 90px;
  right: 24px;
  z-index: 9999;
  max-width: 400px;
  width: 100%;
  pointer-events: none;
}

.notification-container > * {
  pointer-events: auto;
}

@media (max-width: 768px) {
  .notification-container {
    top: 80px;
    right: 16px;
    left: 16px;
    max-width: none;
  }
}
</style>

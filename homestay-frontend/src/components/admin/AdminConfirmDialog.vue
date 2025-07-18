<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <div class="modal-icon" :class="iconClass">
              <i :class="iconName"></i>
            </div>
            <h3 class="modal-title">{{ title }}</h3>
          </div>
          
          <div class="modal-body">
            <p class="modal-message">{{ message }}</p>
          </div>
          
          <div class="modal-footer">
            <button 
              @click="handleCancel" 
              class="btn btn-secondary"
              :disabled="loading"
            >
              {{ cancelText }}
            </button>
            <button 
              @click="handleConfirm" 
              :class="['btn', confirmButtonClass]"
              :disabled="loading"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  visible?: boolean
  type?: 'info' | 'warning' | 'danger' | 'success'
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  type: 'info',
  title: '确认操作',
  message: '您确定要执行此操作吗？',
  confirmText: '确认',
  cancelText: '取消',
  loading: false,
  closeOnOverlay: true
})

const emit = defineEmits<{
  confirm: []
  cancel: []
  close: []
}>()

const iconName = computed(() => {
  const icons = {
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle',
    danger: 'fas fa-exclamation-circle',
    success: 'fas fa-check-circle'
  }
  return icons[props.type]
})

const iconClass = computed(() => `icon-${props.type}`)

const confirmButtonClass = computed(() => {
  const classes = {
    info: 'btn-primary',
    warning: 'btn-warning',
    danger: 'btn-danger',
    success: 'btn-success'
  }
  return classes[props.type]
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay && !props.loading) {
    emit('cancel')
    emit('close')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 480px;
  width: 100%;
  overflow: hidden;
  transform: scale(1);
}

.modal-header {
  padding: 32px 32px 24px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}

.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 28px;
}

.icon-info {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #3b82f6;
}

.icon-warning {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #f59e0b;
}

.icon-danger {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #ef4444;
}

.icon-success {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #10b981;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.modal-body {
  padding: 24px 32px;
}

.modal-message {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #4b5563;
  text-align: center;
}

.modal-footer {
  padding: 24px 32px 32px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #b8941f 0%, #9a7b1a 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.btn-warning:hover:not(:disabled) {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

/* 动画效果 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(-20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
  }
  
  .modal-header {
    padding: 24px 24px 20px;
  }
  
  .modal-icon {
    width: 56px;
    height: 56px;
    font-size: 24px;
    margin-bottom: 12px;
  }
  
  .modal-title {
    font-size: 18px;
  }
  
  .modal-body {
    padding: 20px 24px;
  }
  
  .modal-message {
    font-size: 15px;
  }
  
  .modal-footer {
    padding: 20px 24px 24px;
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>

<template>
  <div v-if="visible" :class="['loading-overlay', { fullscreen }]">
    <div class="loading-content">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="mushroom-icon">
          <i class="fas fa-seedling"></i>
        </div>
      </div>
      <div class="loading-text">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible?: boolean
  title?: string
  message?: string
  fullscreen?: boolean
}

withDefaults(defineProps<Props>(), {
  visible: true,
  title: '加载中',
  message: '请稍候...',
  fullscreen: false
})
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  border-radius: inherit;
}

.loading-overlay.fullscreen {
  position: fixed;
  border-radius: 0;
}

.loading-content {
  text-align: center;
  padding: 40px;
}

.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: #d4af37;
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  border-right-color: #10b981;
  animation-delay: 0.3s;
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
}

.spinner-ring:nth-child(3) {
  border-bottom-color: #f59e0b;
  animation-delay: 0.6s;
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
}

.mushroom-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: #d4af37;
  animation: pulse 2s ease-in-out infinite;
}

.loading-text h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.loading-text p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.8;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-content {
    padding: 24px;
  }
  
  .loading-spinner {
    width: 60px;
    height: 60px;
    margin-bottom: 16px;
  }
  
  .mushroom-icon {
    font-size: 18px;
  }
  
  .loading-text h3 {
    font-size: 16px;
  }
  
  .loading-text p {
    font-size: 13px;
  }
}
</style>

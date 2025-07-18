<template>
  <div class="loading-container" :class="{ fullscreen, overlay }">
    <div class="loading-content">
      <!-- 主加载动画 -->
      <div class="spinner" :class="[size, variant]">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      
      <!-- 加载文本 -->
      <div v-if="text" class="loading-text" :class="textSize">
        {{ text }}
      </div>
      
      <!-- 进度条 -->
      <div v-if="showProgress" class="progress-container">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <div class="progress-text">{{ progress }}%</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'white' | 'dark'
  text?: string
  textSize?: 'sm' | 'md' | 'lg'
  fullscreen?: boolean
  overlay?: boolean
  showProgress?: boolean
  progress?: number
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  textSize: 'md',
  fullscreen: false,
  overlay: false,
  showProgress: false,
  progress: 0
})
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
}

.loading-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal, 1050);
}

.loading-container.overlay {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
}

/* ===== 加载动画 ===== */
.spinner {
  position: relative;
  display: inline-block;
}

.spinner-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
  animation-delay: -0.45s;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.3s;
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.15s;
}

/* 尺寸变体 */
.spinner.sm {
  width: 20px;
  height: 20px;
}

.spinner.sm .spinner-ring {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.spinner.md {
  width: 32px;
  height: 32px;
}

.spinner.md .spinner-ring {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

.spinner.lg {
  width: 48px;
  height: 48px;
}

.spinner.lg .spinner-ring {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

.spinner.xl {
  width: 64px;
  height: 64px;
}

.spinner.xl .spinner-ring {
  width: 64px;
  height: 64px;
  border-width: 5px;
}

/* 颜色变体 */
.spinner.primary .spinner-ring {
  border-top-color: var(--color-primary, #d4af37);
  border-right-color: var(--color-primary, #d4af37);
}

.spinner.secondary .spinner-ring {
  border-top-color: var(--color-secondary, #8bc34a);
  border-right-color: var(--color-secondary, #8bc34a);
}

.spinner.white .spinner-ring {
  border-top-color: white;
  border-right-color: white;
}

.spinner.dark .spinner-ring {
  border-top-color: var(--color-gray-800, #1f2937);
  border-right-color: var(--color-gray-800, #1f2937);
}

/* ===== 加载文本 ===== */
.loading-text {
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
  text-align: center;
}

.loading-text.sm {
  font-size: var(--font-size-sm);
}

.loading-text.md {
  font-size: var(--font-size-base);
}

.loading-text.lg {
  font-size: var(--font-size-lg);
}

/* ===== 进度条 ===== */
.progress-container {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--color-gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary, #d4af37), var(--color-primary-light, #e6c55a));
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 1.5s infinite;
}

.progress-text {
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
}

/* ===== 动画 ===== */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* ===== 响应式设计 ===== */
@media (max-width: 640px) {
  .progress-container {
    width: 150px;
  }
  
  .spinner.xl {
    width: 48px;
    height: 48px;
  }
  
  .spinner.xl .spinner-ring {
    width: 48px;
    height: 48px;
    border-width: 4px;
  }
}
</style>

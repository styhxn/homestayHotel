<template>
  <div :class="cardClasses" @click="handleClick">
    <!-- 卡片头部 -->
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
      </slot>
    </div>

    <!-- 卡片图片 -->
    <div v-if="image || $slots.image" class="card-image">
      <slot name="image">
        <img v-if="image" :src="image" :alt="imageAlt" class="card-img" />
      </slot>
      <!-- 图片覆盖层 -->
      <div v-if="overlay" class="card-overlay">
        <slot name="overlay"></slot>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div v-if="$slots.default || content" class="card-content">
      <slot>
        <p v-if="content" class="card-text">{{ content }}</p>
      </slot>
    </div>

    <!-- 卡片底部 -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="card-loading">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits } from 'vue'

interface Props {
  title?: string
  content?: string
  image?: string
  imageAlt?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
  clickable?: boolean
  loading?: boolean
  overlay?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  hoverable: true,
  clickable: false,
  loading: false,
  overlay: false,
  rounded: 'lg',
  imageAlt: ''
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const cardClasses = computed(() => {
  const baseClasses = [
    'modern-card',
    'relative',
    'overflow-hidden',
    'transition-all',
    'duration-300',
    'ease-in-out'
  ]

  // 变体样式
  const variantClasses = {
    default: ['bg-white', 'shadow-md', 'border', 'border-gray-200'],
    elevated: ['bg-white', 'shadow-lg', 'border-0'],
    outlined: ['bg-white', 'border-2', 'border-gray-300', 'shadow-sm'],
    filled: ['bg-gray-50', 'border', 'border-gray-200', 'shadow-sm']
  }

  // 尺寸样式
  const sizeClasses = {
    sm: ['p-4'],
    md: ['p-6'],
    lg: ['p-8']
  }

  // 圆角样式
  const roundedClasses = {
    none: ['rounded-none'],
    sm: ['rounded-sm'],
    md: ['rounded-md'],
    lg: ['rounded-lg'],
    xl: ['rounded-xl'],
    full: ['rounded-full']
  }

  // 交互样式
  const interactionClasses = []
  if (props.hoverable) {
    interactionClasses.push('hover:shadow-xl', 'hover:-translate-y-1')
  }
  if (props.clickable) {
    interactionClasses.push('cursor-pointer', 'active:scale-98')
  }

  return [
    ...baseClasses,
    ...variantClasses[props.variant],
    ...sizeClasses[props.size],
    ...roundedClasses[props.rounded],
    ...interactionClasses
  ]
})

const handleClick = (event: Event) => {
  if (props.clickable && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.modern-card {
  background: var(--color-white, #ffffff);
  position: relative;
}

.card-header {
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900, #111827);
  margin: 0;
}

.card-image {
  position: relative;
  margin: -1.5rem -1.5rem 1rem -1.5rem;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.modern-card:hover .card-img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modern-card:hover .card-overlay {
  opacity: 1;
}

.card-content {
  flex: 1;
}

.card-text {
  color: var(--color-gray-600, #4b5563);
  line-height: 1.6;
  margin: 0;
}

.card-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-200, #e5e7eb);
}

.card-loading {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--color-gray-200, #e5e7eb);
  border-top: 3px solid var(--color-primary, #d4af37);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .card-image {
    margin: -1rem -1rem 1rem -1rem;
  }
  
  .card-img {
    height: 160px;
  }
}

/* 工具类支持 */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}

.active\:scale-98:active {
  transform: scale(0.98);
}
</style>

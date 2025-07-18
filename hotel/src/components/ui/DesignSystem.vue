<template>
  <div class="design-system">
    <!-- 现代化按钮组件 -->
    <component
      :is="tag"
      :class="buttonClasses"
      :disabled="disabled"
      :type="type"
      @click="handleClick"
      v-bind="$attrs"
    >
      <i v-if="icon" :class="iconClasses"></i>
      <span v-if="loading" class="loading-spinner"></span>
      <slot></slot>
    </component>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: string
  loading?: boolean
  disabled?: boolean
  rounded?: boolean
  tag?: string
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  tag: 'button',
  type: 'button',
  rounded: false,
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'modern-btn',
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2'
  ]

  // 变体样式
  const variantClasses = {
    primary: [
      'bg-gradient-to-r',
      'from-primary',
      'to-primary-dark',
      'text-white',
      'shadow-lg',
      'hover:shadow-xl',
      'hover:scale-105',
      'focus:ring-primary'
    ],
    secondary: [
      'bg-white',
      'text-primary',
      'border-2',
      'border-primary',
      'hover:bg-primary',
      'hover:text-white',
      'focus:ring-primary'
    ],
    outline: [
      'bg-transparent',
      'text-gray-700',
      'border',
      'border-gray-300',
      'hover:bg-gray-50',
      'focus:ring-gray-500'
    ],
    ghost: [
      'bg-transparent',
      'text-gray-600',
      'hover:bg-gray-100',
      'hover:text-gray-900',
      'focus:ring-gray-500'
    ],
    danger: [
      'bg-red-600',
      'text-white',
      'hover:bg-red-700',
      'focus:ring-red-500'
    ]
  }

  // 尺寸样式
  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm', 'rounded-md'],
    md: ['px-4', 'py-2', 'text-sm', 'rounded-lg'],
    lg: ['px-6', 'py-3', 'text-base', 'rounded-lg'],
    xl: ['px-8', 'py-4', 'text-lg', 'rounded-xl']
  }

  // 状态样式
  const stateClasses = []
  if (props.disabled || props.loading) {
    stateClasses.push('opacity-60', 'cursor-not-allowed')
  }

  if (props.rounded) {
    stateClasses.push('rounded-full')
  }

  return [
    ...baseClasses,
    ...variantClasses[props.variant],
    ...sizeClasses[props.size],
    ...stateClasses
  ]
})

const iconClasses = computed(() => {
  const baseClasses = [props.icon]
  
  if (props.size === 'sm') {
    baseClasses.push('w-4', 'h-4')
  } else if (props.size === 'lg' || props.size === 'xl') {
    baseClasses.push('w-5', 'h-5')
  } else {
    baseClasses.push('w-4', 'h-4')
  }

  return baseClasses
})

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.modern-btn {
  position: relative;
  overflow: hidden;
  user-select: none;
}

.modern-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.modern-btn:hover::before {
  left: 100%;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 自定义CSS变量支持 */
.modern-btn {
  --primary: var(--color-primary, #d4af37);
  --primary-dark: var(--color-primary-dark, #b8941f);
}

.bg-gradient-to-r.from-primary.to-primary-dark {
  background: linear-gradient(to right, var(--primary), var(--primary-dark));
}

.text-primary {
  color: var(--primary);
}

.border-primary {
  border-color: var(--primary);
}

.hover\:bg-primary:hover {
  background-color: var(--primary);
}

.focus\:ring-primary:focus {
  --tw-ring-color: var(--primary);
}
</style>

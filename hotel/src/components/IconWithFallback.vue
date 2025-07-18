<template>
  <span :class="['icon-wrapper', size]">
    <i 
      v-if="showIcon" 
      :class="iconClass" 
      :style="iconStyle"
      @error="handleIconError"
    ></i>
    <span 
      v-else 
      :class="['icon-fallback', type]"
      :style="fallbackStyle"
    >
      {{ fallbackText }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  icon: string // Font Awesome 图标类名，如 'fas fa-home'
  fallback?: string // 备用文字，如果不提供则自动生成
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  color?: string
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  fallback: '',
  size: 'md',
  color: '',
  type: 'primary'
})

const showIcon = ref(true)

const iconClass = computed(() => props.icon)

const iconStyle = computed(() => {
  const styles: Record<string, string> = {}
  if (props.color) {
    styles.color = props.color
  }
  return styles
})

const fallbackText = computed(() => {
  if (props.fallback) {
    return props.fallback
  }
  
  // 根据图标类名自动生成备用文字
  const iconMap: Record<string, string> = {
    'fa-home': '首页',
    'fa-user': '用户',
    'fa-users': '用户',
    'fa-star': '星',
    'fa-heart': '心',
    'fa-search': '搜',
    'fa-envelope': '邮',
    'fa-phone': '电',
    'fa-map-marker-alt': '位',
    'fa-bed': '房',
    'fa-clipboard-list': '单',
    'fa-chart-bar': '图',
    'fa-cog': '设',
    'fa-seedling': '菇',
    'fa-flask': '测',
    'fa-sign-out-alt': '出',
    'fa-plus': '+',
    'fa-edit': '编',
    'fa-trash': '删',
    'fa-eye': '看',
    'fa-check': '✓',
    'fa-times': '✗',
    'fa-sync-alt': '刷',
    'fa-download': '下',
    'fa-upload': '上',
    'fa-save': '存',
    'fa-print': '印',
    'fa-share': '享',
    'fa-lock': '锁',
    'fa-unlock': '开',
    'fa-wifi': '网',
    'fa-signal': '信',
    'fa-battery-full': '电',
    'fa-volume-up': '音',
    'fa-camera': '相',
    'fa-video': '视',
    'fa-music': '乐',
    'fa-file': '文',
    'fa-folder': '夹',
    'fa-calendar': '历',
    'fa-clock': '时',
    'fa-bell': '铃',
    'fa-comment': '评',
    'fa-thumbs-up': '赞',
    'fa-thumbs-down': '踩',
    'fa-arrow-left': '←',
    'fa-arrow-right': '→',
    'fa-arrow-up': '↑',
    'fa-arrow-down': '↓',
    'fa-check-circle': '✓',
    'fa-exclamation-circle': '!',
    'fa-exclamation-triangle': '⚠',
    'fa-info-circle': 'i',
    'fa-question-circle': '?',
    'fa-spinner': '⟳'
  }
  
  // 提取图标名称（去掉前缀）
  const iconName = props.icon.split(' ').pop() || ''
  return iconMap[iconName] || '图'
})

const fallbackStyle = computed(() => {
  const styles: Record<string, string> = {}
  
  // 设置颜色
  if (props.color) {
    styles.color = props.color
  } else {
    // 根据类型设置默认颜色
    const colorMap = {
      primary: '#d4af37',
      secondary: '#10b981',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6'
    }
    styles.color = colorMap[props.type]
  }
  
  return styles
})

const handleIconError = () => {
  showIcon.value = false
}

// 检测Font Awesome是否加载
const checkFontAwesome = () => {
  const testElement = document.createElement('i')
  testElement.className = 'fas fa-home'
  testElement.style.position = 'absolute'
  testElement.style.left = '-9999px'
  document.body.appendChild(testElement)
  
  setTimeout(() => {
    const computedStyle = window.getComputedStyle(testElement, '::before')
    const content = computedStyle.getPropertyValue('content')
    
    if (content === 'none' || content === '') {
      showIcon.value = false
    }
    
    document.body.removeChild(testElement)
  }, 100)
}

onMounted(() => {
  checkFontAwesome()
})
</script>

<style scoped>
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper.xs {
  font-size: 0.75rem;
}

.icon-wrapper.sm {
  font-size: 0.875rem;
}

.icon-wrapper.md {
  font-size: 1rem;
}

.icon-wrapper.lg {
  font-size: 1.125rem;
}

.icon-wrapper.xl {
  font-size: 1.25rem;
}

.icon-wrapper.2xl {
  font-size: 1.5rem;
}

.icon-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1em;
  min-height: 1em;
  border-radius: 2px;
  font-weight: 600;
  font-size: 0.8em;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid currentColor;
  opacity: 0.8;
}

.icon-fallback.primary {
  background: rgba(212, 175, 55, 0.1);
  border-color: #d4af37;
}

.icon-fallback.secondary {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
}

.icon-fallback.success {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
}

.icon-fallback.warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
}

.icon-fallback.danger {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.icon-fallback.info {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}
</style>

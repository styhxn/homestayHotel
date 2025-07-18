<template>
  <span :class="['custom-icon', size, type]" :style="iconStyle">
    {{ iconChar }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  color?: string
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: '',
  type: 'primary'
})

// Unicode图标映射
const iconMap: Record<string, string> = {
  // 基础图标
  'home': '🏠',
  'user': '👤',
  'users': '👥',
  'star': '⭐',
  'heart': '❤️',
  'search': '🔍',
  'envelope': '✉️',
  'phone': '📞',
  'map-marker-alt': '📍',
  'location': '📍',
  'menu': '☰',
  'bars': '☰',

  // 管理图标
  'bed': '🛏️',
  'clipboard-list': '📋',
  'chart-bar': '📊',
  'cog': '⚙️',
  'settings': '⚙️',
  'seedling': '🍄',
  'mushroom': '🍄',
  'flask': '🧪',
  'sign-out-alt': '🚪',
  'logout': '🚪',
  'dashboard': '📊',
  'tachometer-alt': '📊',
  'sign-in-alt': '🔑',
  'login': '🔑',
  'user-shield': '🛡️',
  'eye-slash': '🙈',

  // 操作图标
  'plus': '➕',
  'add': '➕',
  'edit': '✏️',
  'trash': '🗑️',
  'delete': '🗑️',
  'eye': '👁️',
  'view': '👁️',
  'check': '✅',
  'times': '❌',
  'close': '❌',
  'sync-alt': '🔄',
  'refresh': '🔄',
  'download': '⬇️',
  'upload': '⬆️',
  'save': '💾',
  'print': '🖨️',
  'share': '📤',
  
  // 状态图标
  'check-circle': '✅',
  'exclamation-circle': '❗',
  'exclamation-triangle': '⚠️',
  'info-circle': 'ℹ️',
  'question-circle': '❓',
  'spinner': '⟳',
  'loading': '⟳',
  'lock': '🔒',
  'unlock': '🔓',
  'wifi': '📶',
  'signal': '📶',
  'battery-full': '🔋',
  'volume-up': '🔊',
  'camera': '📷',
  'video': '📹',
  'music': '🎵',
  
  // 文件图标
  'file': '📄',
  'folder': '📁',
  'calendar': '📅',
  'clock': '🕐',
  'bell': '🔔',
  'comment': '💬',
  'thumbs-up': '👍',
  'thumbs-down': '👎',
  
  // 箭头图标
  'arrow-left': '←',
  'arrow-right': '→',
  'arrow-up': '↑',
  'arrow-down': '↓',
  'chevron-left': '‹',
  'chevron-right': '›',
  'chevron-up': '⌃',
  'chevron-down': '⌄',
  
  // 社交图标
  'facebook-f': 'f',
  'weibo': '微',
  'wechat': '微',
  'qq': 'Q',
  'github': 'G',
  'twitter': 'T',
  
  // 业务图标
  'money': '💰',
  'dollar-sign': '$',
  'credit-card': '💳',
  'shopping-cart': '🛒',
  'gift': '🎁',
  'tag': '🏷️',
  'tags': '🏷️',
  'bookmark': '🔖',
  'flag': '🚩',
  'medal': '🏅',
  'trophy': '🏆',
  'crown': '👑',
  
  // 工具图标
  'wrench': '🔧',
  'hammer': '🔨',
  'screwdriver': '🪛',
  'gear': '⚙️',
  'tools': '🛠️',
  'bug': '🐛',
  'code': '💻',
  'terminal': '⌨️',
  'database': '🗄️',
  'server': '🖥️',
  'cloud': '☁️',
  'link': '🔗',
  'unlink': '⛓️‍💥',
  
  // 默认图标
  'default': '●'
}

const iconChar = computed(() => {
  return iconMap[props.name] || iconMap['default']
})

const iconStyle = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.color) {
    styles.color = props.color
  }
  
  return styles
})
</script>

<style scoped>
.custom-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  line-height: 1;
  vertical-align: middle;
  user-select: none;
}

/* 尺寸 */
.custom-icon.xs {
  font-size: 0.75rem;
}

.custom-icon.sm {
  font-size: 0.875rem;
}

.custom-icon.md {
  font-size: 1rem;
}

.custom-icon.lg {
  font-size: 1.125rem;
}

.custom-icon.xl {
  font-size: 1.25rem;
}

.custom-icon.\\32 xl {
  font-size: 1.5rem;
}

/* 颜色主题 */
.custom-icon.primary {
  color: #d4af37;
}

.custom-icon.secondary {
  color: #10b981;
}

.custom-icon.success {
  color: #10b981;
}

.custom-icon.warning {
  color: #f59e0b;
}

.custom-icon.danger {
  color: #ef4444;
}

.custom-icon.info {
  color: #3b82f6;
}

/* 动画效果 */
.custom-icon.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 悬停效果 */
.custom-icon:hover {
  opacity: 0.8;
  transform: scale(1.1);
  transition: all 0.2s ease;
}
</style>

import type { App } from 'vue'
import CustomIcon from '../components/CustomIcon.vue'

// Font Awesome到自定义图标的映射
export const iconMapping: Record<string, string> = {
  // 基础图标
  'fas fa-home': 'home',
  'fas fa-user': 'user',
  'fas fa-users': 'users',
  'fas fa-star': 'star',
  'fas fa-heart': 'heart',
  'fas fa-search': 'search',
  'fas fa-envelope': 'envelope',
  'fas fa-phone': 'phone',
  'fas fa-map-marker-alt': 'location',
  'fas fa-bars': 'menu',
  'fas fa-menu': 'menu',
  
  // 管理图标
  'fas fa-bed': 'bed',
  'fas fa-clipboard-list': 'clipboard-list',
  'fas fa-chart-bar': 'chart-bar',
  'fas fa-cog': 'cog',
  'fas fa-seedling': 'seedling',
  'fas fa-flask': 'flask',
  'fas fa-sign-out-alt': 'logout',
  'fas fa-tachometer-alt': 'dashboard',
  'fas fa-sign-in-alt': 'login',
  'fas fa-user-shield': 'user-shield',
  'fas fa-eye-slash': 'eye-slash',

  // 操作图标
  'fas fa-plus': 'plus',
  'fas fa-edit': 'edit',
  'fas fa-trash': 'trash',
  'fas fa-eye': 'eye',
  'fas fa-check': 'check',
  'fas fa-times': 'times',
  'fas fa-sync-alt': 'refresh',
  'fas fa-download': 'download',
  'fas fa-upload': 'upload',
  'fas fa-save': 'save',
  'fas fa-print': 'print',
  'fas fa-share': 'share',
  
  // 状态图标
  'fas fa-check-circle': 'check-circle',
  'fas fa-exclamation-circle': 'exclamation-circle',
  'fas fa-exclamation-triangle': 'exclamation-triangle',
  'fas fa-info-circle': 'info-circle',
  'fas fa-question-circle': 'question-circle',
  'fas fa-spinner': 'spinner',
  'fas fa-lock': 'lock',
  'fas fa-unlock': 'unlock',
  'fas fa-wifi': 'wifi',
  'fas fa-signal': 'signal',
  
  // 箭头图标
  'fas fa-arrow-left': 'arrow-left',
  'fas fa-arrow-right': 'arrow-right',
  'fas fa-arrow-up': 'arrow-up',
  'fas fa-arrow-down': 'arrow-down',
  'fas fa-chevron-left': 'chevron-left',
  'fas fa-chevron-right': 'chevron-right',
  'fas fa-chevron-up': 'chevron-up',
  'fas fa-chevron-down': 'chevron-down',
  
  // 文件图标
  'fas fa-file': 'file',
  'fas fa-folder': 'folder',
  'fas fa-calendar': 'calendar',
  'fas fa-clock': 'clock',
  'fas fa-bell': 'bell',
  'fas fa-comment': 'comment',
  'fas fa-thumbs-up': 'thumbs-up',
  'fas fa-thumbs-down': 'thumbs-down',
  
  // 社交图标
  'fab fa-facebook-f': 'facebook-f',
  'fab fa-weibo': 'weibo',
  'fab fa-wechat': 'wechat',
  'fab fa-qq': 'qq',
  'fab fa-github': 'github',
  'fab fa-twitter': 'twitter',
  
  // 业务图标
  'fas fa-dollar-sign': 'dollar-sign',
  'fas fa-credit-card': 'credit-card',
  'fas fa-shopping-cart': 'shopping-cart',
  'fas fa-gift': 'gift',
  'fas fa-tag': 'tag',
  'fas fa-tags': 'tags',
  'fas fa-bookmark': 'bookmark',
  'fas fa-flag': 'flag',
  'fas fa-medal': 'medal',
  'fas fa-trophy': 'trophy',
  'fas fa-crown': 'crown',
  
  // 工具图标
  'fas fa-wrench': 'wrench',
  'fas fa-hammer': 'hammer',
  'fas fa-tools': 'tools',
  'fas fa-bug': 'bug',
  'fas fa-code': 'code',
  'fas fa-terminal': 'terminal',
  'fas fa-database': 'database',
  'fas fa-server': 'server',
  'fas fa-cloud': 'cloud',
  'fas fa-link': 'link',
  'fas fa-unlink': 'unlink'
}

// 自动替换页面中的Font Awesome图标
export function replaceIconsInPage() {
  const icons = document.querySelectorAll('i[class*="fa"]')
  
  icons.forEach(icon => {
    const classes = icon.className
    const mappedIcon = iconMapping[classes]
    
    if (mappedIcon) {
      // 创建自定义图标元素
      const customIcon = document.createElement('span')
      customIcon.className = 'custom-icon-replaced'
      customIcon.setAttribute('data-icon', mappedIcon)
      customIcon.setAttribute('data-original-class', classes)
      
      // 获取原始样式
      const computedStyle = window.getComputedStyle(icon)
      const fontSize = computedStyle.fontSize
      const color = computedStyle.color
      
      // 应用样式
      customIcon.style.fontSize = fontSize
      customIcon.style.color = color
      customIcon.style.display = 'inline-flex'
      customIcon.style.alignItems = 'center'
      customIcon.style.justifyContent = 'center'
      
      // 设置图标内容
      const iconChar = getIconChar(mappedIcon)
      customIcon.textContent = iconChar
      
      // 替换原始图标
      icon.parentNode?.replaceChild(customIcon, icon)
    }
  })
}

// 获取图标字符
function getIconChar(iconName: string): string {
  const iconChars: Record<string, string> = {
    // 基础图标
    'home': '🏠',
    'user': '👤',
    'users': '👥',
    'star': '⭐',
    'heart': '❤️',
    'search': '🔍',
    'envelope': '✉️',
    'phone': '📞',
    'location': '📍',
    'menu': '☰',
    
    // 管理图标
    'bed': '🛏️',
    'clipboard-list': '📋',
    'chart-bar': '📊',
    'cog': '⚙️',
    'seedling': '🍄',
    'flask': '🧪',
    'logout': '🚪',
    'dashboard': '📊',
    'login': '🔑',
    'user-shield': '🛡️',
    'eye-slash': '🙈',

    // 操作图标
    'plus': '➕',
    'edit': '✏️',
    'trash': '🗑️',
    'eye': '👁️',
    'check': '✅',
    'times': '❌',
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
    'lock': '🔒',
    'unlock': '🔓',
    'wifi': '📶',
    'signal': '📶',
    
    // 箭头图标
    'arrow-left': '←',
    'arrow-right': '→',
    'arrow-up': '↑',
    'arrow-down': '↓',
    'chevron-left': '‹',
    'chevron-right': '›',
    'chevron-up': '⌃',
    'chevron-down': '⌄',
    
    // 文件图标
    'file': '📄',
    'folder': '📁',
    'calendar': '📅',
    'clock': '🕐',
    'bell': '🔔',
    'comment': '💬',
    'thumbs-up': '👍',
    'thumbs-down': '👎',
    
    // 社交图标
    'facebook-f': 'f',
    'weibo': '微',
    'wechat': '微',
    'qq': 'Q',
    'github': 'G',
    'twitter': 'T',
    
    // 业务图标
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
    'tools': '🛠️',
    'bug': '🐛',
    'code': '💻',
    'terminal': '⌨️',
    'database': '🗄️',
    'server': '🖥️',
    'cloud': '☁️',
    'link': '🔗',
    'unlink': '⛓️‍💥'
  }
  
  return iconChars[iconName] || '●'
}

// Vue插件
export default {
  install(app: App) {
    // 全局注册CustomIcon组件
    app.component('CustomIcon', CustomIcon)
    
    // 添加全局属性
    app.config.globalProperties.$replaceIcons = replaceIconsInPage
    app.config.globalProperties.$iconMapping = iconMapping
    
    // 自动替换图标（延迟执行以确保DOM已渲染）
    app.mixin({
      mounted() {
        this.$nextTick(() => {
          if (localStorage.getItem('useCustomIcons') === 'true') {
            replaceIconsInPage()
          }
        })
      },
      updated() {
        this.$nextTick(() => {
          if (localStorage.getItem('useCustomIcons') === 'true') {
            replaceIconsInPage()
          }
        })
      }
    })
  }
}

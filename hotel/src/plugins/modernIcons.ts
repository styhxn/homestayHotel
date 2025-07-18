import type { App } from 'vue'
import SvgIcon from '../components/icons/SvgIcon.vue'

// Font Awesome到现代SVG图标的映射
export const modernIconMapping: Record<string, string> = {
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
  'fas fa-seedling': 'leaf',
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
  'fas fa-times-circle': 'times-circle',
  'fas fa-spinner': 'spinner',
  'fas fa-lock': 'lock',
  'fas fa-unlock': 'unlock',
  
  // 导航图标
  'fas fa-angle-left': 'chevron-left',
  'fas fa-angle-right': 'chevron-right',
  'fas fa-angle-up': 'chevron-up',
  'fas fa-angle-down': 'chevron-down',
  'fas fa-chevron-left': 'chevron-left',
  'fas fa-chevron-right': 'chevron-right',
  'fas fa-chevron-up': 'chevron-up',
  'fas fa-chevron-down': 'chevron-down',
  'fas fa-arrow-left': 'chevron-left',
  'fas fa-arrow-right': 'chevron-right',
  'fas fa-arrow-up': 'chevron-up',
  'fas fa-arrow-down': 'chevron-down',
  
  // 茶文化相关
  'fas fa-leaf': 'leaf',
  'fas fa-spa': 'spa',
  'fas fa-coffee': 'coffee',
  
  // 时间相关
  'fas fa-calendar-alt': 'calendar-alt',
  'fas fa-calendar': 'calendar-alt',
  'fas fa-clock': 'clock',
  'fas fa-history': 'clock',
  
  // 购物相关
  'fas fa-shopping-cart': 'shopping-cart',
  'fas fa-shopping-bag': 'shopping-cart',
  'fas fa-gift': 'gift',
  'fas fa-tag': 'tag',
  'fas fa-tags': 'tag',
  'fas fa-credit-card': 'credit-card',
  'fas fa-money-bill': 'money-bill',
  
  // 通信图标
  'fas fa-mail': 'envelope',
  'fas fa-message': 'message',
  'fas fa-chat': 'message',
  'fas fa-comments': 'message',
  'fas fa-comment': 'message',
  
  // 媒体图标
  'fas fa-play': 'play',
  'fas fa-pause': 'pause',
  'fas fa-stop': 'stop',
  'fas fa-volume-up': 'volume-up',
  'fas fa-volume-down': 'volume-down',
  'fas fa-volume-off': 'volume-off',
  'fas fa-music': 'music',
  'fas fa-video': 'video',
  'fas fa-image': 'image',
  'fas fa-camera': 'camera',
  
  // 文件图标
  'fas fa-file': 'file',
  'fas fa-folder': 'folder',
  'fas fa-bell': 'bell',
  'fas fa-thumbs-up': 'thumbs-up',
  'fas fa-thumbs-down': 'thumbs-down',
  
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

// 现代化图标替换函数
export function replaceWithModernIcons() {
  const icons = document.querySelectorAll('i[class*="fa"]')
  
  icons.forEach(icon => {
    const classes = icon.className
    const mappedIcon = modernIconMapping[classes]
    
    if (mappedIcon) {
      // 创建现代化图标元素
      const modernIcon = document.createElement('span')
      modernIcon.className = 'modern-icon-replaced'
      modernIcon.setAttribute('data-icon', mappedIcon)
      modernIcon.setAttribute('data-original-class', classes)
      
      // 获取原始样式
      const computedStyle = window.getComputedStyle(icon)
      const fontSize = computedStyle.fontSize
      const color = computedStyle.color
      
      // 创建SVG图标
      const svgIcon = createSVGIcon(mappedIcon, fontSize, color)
      modernIcon.appendChild(svgIcon)
      
      // 替换原始图标
      if (icon.parentNode) {
        icon.parentNode.replaceChild(modernIcon, icon)
      }
    }
  })
}

// 创建SVG图标元素
function createSVGIcon(iconName: string, size: string, color: string): HTMLElement {
  const iconContainer = document.createElement('span')
  iconContainer.style.display = 'inline-flex'
  iconContainer.style.alignItems = 'center'
  iconContainer.style.justifyContent = 'center'
  iconContainer.style.width = size
  iconContainer.style.height = size
  iconContainer.style.color = color
  iconContainer.style.transition = 'all 0.3s ease'
  
  // 获取SVG内容
  const svgContent = getSVGContent(iconName)
  iconContainer.innerHTML = svgContent
  
  // 添加悬停效果
  iconContainer.addEventListener('mouseenter', () => {
    iconContainer.style.transform = 'scale(1.1)'
  })
  
  iconContainer.addEventListener('mouseleave', () => {
    iconContainer.style.transform = 'scale(1)'
  })
  
  return iconContainer
}

// 获取SVG内容
function getSVGContent(iconName: string): string {
  const svgIcons: Record<string, string> = {
    'home': `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>`,
    
    'user': `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>`,
    
    'star': `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>`,
    
    'heart': `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>`,
    
    'search': `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>`,
    
    'leaf': `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
    </svg>`,
    
    'spa': `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
      <path d="M8.55 12c-1.07-.71-2.25-1.27-3.53-1.61 1.28.34 2.46.9 3.53 1.61zm10.43-1.61c-1.29.34-2.49.91-3.57 1.64 1.08-.73 2.28-1.3 3.57-1.64zM15.49 9.63c-.18-2.79-1.31-5.51-3.43-7.63-2.14 2.14-3.32 4.86-3.5 7.63 1.26.32 2.56.76 3.81 1.35 1.25-.59 2.55-1.03 3.81-1.35z"/>
      <path d="M12.04 12.78c-.61-.42-1.25-.75-1.92-1.03-.69.28-1.35.61-1.97 1.03.64.44 1.31.78 2.01 1.03.66-.25 1.31-.59 1.88-1.03zM12 15.45c-1.52-.69-3.22-1.04-4.54-1.36-1.92 2.24-3.64 6.17-3.64 6.17s3.93-1.72 6.17-3.64c.32 1.32.67 3.02 1.36 4.54.69-1.52 1.04-3.22 1.36-4.54 2.24 1.92 6.17 3.64 6.17 3.64s-1.72-3.93-3.64-6.17c-1.32.32-3.02.67-4.54 1.36z"/>
    </svg>`,
    
    'coffee': `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
      <path d="M2,21V19H20V21H2M20,8V5L18,5V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z"/>
    </svg>`,
    
    'shopping-cart': `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>`,
    
    'gift': `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
      <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
    </svg>`,
    
    'calendar-alt': `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
    </svg>`,
    
    'chevron-down': `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
    </svg>`,
    
    'menu': `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
    </svg>`
  }
  
  return svgIcons[iconName] || svgIcons['home']
}

// 图标切换器
export const modernIconSwitcher = {
  enableModernIcons() {
    localStorage.setItem('useModernIcons', 'true')
    replaceWithModernIcons()
  },
  
  disableModernIcons() {
    localStorage.setItem('useModernIcons', 'false')
    // 恢复原始图标的逻辑可以在这里实现
    location.reload()
  },
  
  isEnabled() {
    return localStorage.getItem('useModernIcons') === 'true'
  }
}

// Vue插件
export default {
  install(app: App) {
    // 全局注册SvgIcon组件
    app.component('SvgIcon', SvgIcon)
    
    // 添加全局属性
    app.config.globalProperties.$modernIcons = modernIconSwitcher
    app.config.globalProperties.$modernIconMapping = modernIconMapping
    
    // 自动替换图标
    app.mixin({
      mounted() {
        this.$nextTick(() => {
          if (modernIconSwitcher.isEnabled()) {
            replaceWithModernIcons()
          }
        })
      },
      updated() {
        this.$nextTick(() => {
          if (modernIconSwitcher.isEnabled()) {
            replaceWithModernIcons()
          }
        })
      }
    })
  }
}

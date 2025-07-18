// 图标切换工具
export class IconSwitcher {
  private static instance: IconSwitcher
  private isCustomIconsEnabled = false
  private observer: MutationObserver | null = null

  constructor() {
    this.isCustomIconsEnabled = localStorage.getItem('useCustomIcons') === 'true'
    this.init()
  }

  static getInstance(): IconSwitcher {
    if (!IconSwitcher.instance) {
      IconSwitcher.instance = new IconSwitcher()
    }
    return IconSwitcher.instance
  }

  private init() {
    if (this.isCustomIconsEnabled) {
      this.enableCustomIcons()
      this.startObserving()
    }
  }

  // 启用自定义图标
  enableCustomIcons() {
    localStorage.setItem('useCustomIcons', 'true')
    this.isCustomIconsEnabled = true
    this.replaceAllIcons()
    this.startObserving()
    this.addCustomStyles()
  }

  // 禁用自定义图标
  disableCustomIcons() {
    localStorage.removeItem('useCustomIcons')
    this.isCustomIconsEnabled = false
    this.restoreOriginalIcons()
    this.stopObserving()
    this.removeCustomStyles()
  }

  // 切换图标模式
  toggleIcons() {
    if (this.isCustomIconsEnabled) {
      this.disableCustomIcons()
    } else {
      this.enableCustomIcons()
    }
    return this.isCustomIconsEnabled
  }

  // 替换所有图标
  private replaceAllIcons() {
    const icons = document.querySelectorAll('i[class*="fa"]')
    
    icons.forEach(icon => {
      this.replaceIcon(icon as HTMLElement)
    })
  }

  // 替换单个图标
  private replaceIcon(icon: HTMLElement) {
    if (icon.hasAttribute('data-custom-replaced')) {
      return // 已经替换过了
    }

    const classes = icon.className
    const mappedIcon = this.getIconMapping(classes)
    
    if (mappedIcon) {
      // 保存原始信息
      icon.setAttribute('data-original-class', classes)
      icon.setAttribute('data-custom-replaced', 'true')
      
      // 获取原始样式
      const computedStyle = window.getComputedStyle(icon)
      const fontSize = computedStyle.fontSize
      const color = computedStyle.color
      
      // 清空原始内容并设置新内容
      icon.innerHTML = ''
      icon.textContent = this.getIconChar(mappedIcon)
      
      // 应用自定义样式
      icon.style.fontFamily = 'inherit'
      icon.style.fontStyle = 'normal'
      icon.style.fontWeight = 'normal'
      icon.style.fontSize = fontSize
      icon.style.color = color
      icon.style.display = 'inline-flex'
      icon.style.alignItems = 'center'
      icon.style.justifyContent = 'center'
      icon.style.lineHeight = '1'
      icon.style.verticalAlign = 'middle'

      // 清除Font Awesome的伪元素
      icon.style.setProperty('font-family', 'inherit', 'important')
      icon.style.setProperty('font-weight', 'normal', 'important')
      icon.style.setProperty('font-style', 'normal', 'important')
      
      // 添加自定义类
      icon.classList.add('custom-icon-replaced')
    }
  }

  // 恢复原始图标
  private restoreOriginalIcons() {
    const replacedIcons = document.querySelectorAll('i[data-custom-replaced="true"]')
    
    replacedIcons.forEach(icon => {
      const htmlIcon = icon as HTMLElement
      const originalClass = htmlIcon.getAttribute('data-original-class')
      if (originalClass) {
        // 恢复原始类名
        htmlIcon.className = originalClass

        // 清除自定义样式
        htmlIcon.style.fontFamily = ''
        htmlIcon.style.fontStyle = ''
        htmlIcon.style.fontWeight = ''
        htmlIcon.style.display = ''
        htmlIcon.style.alignItems = ''
        htmlIcon.style.justifyContent = ''
        htmlIcon.style.lineHeight = ''
        htmlIcon.style.verticalAlign = ''

        // 清除内容
        htmlIcon.textContent = ''
        
        // 移除自定义属性
        icon.removeAttribute('data-original-class')
        icon.removeAttribute('data-custom-replaced')
        icon.classList.remove('custom-icon-replaced')
      }
    })
  }

  // 开始监听DOM变化
  private startObserving() {
    if (this.observer) {
      return
    }

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement
            
            // 检查新添加的图标
            if (element.tagName === 'I' && element.className.includes('fa')) {
              this.replaceIcon(element)
            }
            
            // 检查子元素中的图标
            const icons = element.querySelectorAll('i[class*="fa"]')
            icons.forEach(icon => {
              this.replaceIcon(icon as HTMLElement)
            })
          }
        })
      })
    })

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  // 停止监听DOM变化
  private stopObserving() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }

  // 获取图标映射
  private getIconMapping(className: string): string | null {
    const mapping: Record<string, string> = {
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
      'fas fa-check-circle': 'check-circle',
      'fas fa-exclamation-circle': 'exclamation-circle',
      'fas fa-exclamation-triangle': 'exclamation-triangle',
      'fas fa-info-circle': 'info-circle',
      'fas fa-question-circle': 'question-circle',
      'fas fa-spinner': 'spinner',
      'fas fa-lock': 'lock',
      'fas fa-unlock': 'unlock',
      'fas fa-arrow-left': 'arrow-left',
      'fas fa-arrow-right': 'arrow-right',
      'fas fa-arrow-up': 'arrow-up',
      'fas fa-arrow-down': 'arrow-down',
      'fas fa-tools': 'tools',
      'fas fa-bug': 'bug'
    }

    return mapping[className] || null
  }

  // 获取图标字符
  private getIconChar(iconName: string): string {
    const iconChars: Record<string, string> = {
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
      'check-circle': '✅',
      'exclamation-circle': '❗',
      'exclamation-triangle': '⚠️',
      'info-circle': 'ℹ️',
      'question-circle': '❓',
      'spinner': '⟳',
      'lock': '🔒',
      'unlock': '🔓',
      'arrow-left': '←',
      'arrow-right': '→',
      'arrow-up': '↑',
      'arrow-down': '↓',
      'tools': '🛠️',
      'bug': '🐛'
    }

    return iconChars[iconName] || '●'
  }

  // 添加自定义样式
  private addCustomStyles() {
    const styleId = 'custom-icons-style'
    if (document.getElementById(styleId)) {
      return
    }

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      .custom-icon-replaced {
        font-family: inherit !important;
        font-style: normal !important;
        font-weight: normal !important;
        text-rendering: auto !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
      }

      .custom-icon-replaced::before {
        content: none !important;
        display: none !important;
      }

      .custom-icon-replaced::after {
        content: none !important;
        display: none !important;
      }

      /* 清除所有Font Awesome相关的伪元素 */
      i[class*="fa"].custom-icon-replaced::before,
      i[class*="fa"].custom-icon-replaced::after {
        content: none !important;
        display: none !important;
      }

      .custom-icon-replaced.fa-spin {
        animation: fa-spin 2s infinite linear !important;
      }

      @keyframes fa-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)
  }

  // 移除自定义样式
  private removeCustomStyles() {
    const style = document.getElementById('custom-icons-style')
    if (style) {
      style.remove()
    }
  }

  // 获取当前状态
  isEnabled(): boolean {
    return this.isCustomIconsEnabled
  }
}

// 导出单例实例
export const iconSwitcher = IconSwitcher.getInstance()

// 自动初始化
if (typeof window !== 'undefined') {
  // 页面加载完成后自动启用自定义图标
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      iconSwitcher.enableCustomIcons()
    })
  } else {
    iconSwitcher.enableCustomIcons()
  }
}

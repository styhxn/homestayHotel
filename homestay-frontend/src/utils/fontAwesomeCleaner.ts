// Font Awesome 样式清除工具
export class FontAwesomeCleaner {
  private static instance: FontAwesomeCleaner
  private cleanupStyleId = 'fa-cleanup-styles'

  static getInstance(): FontAwesomeCleaner {
    if (!FontAwesomeCleaner.instance) {
      FontAwesomeCleaner.instance = new FontAwesomeCleaner()
    }
    return FontAwesomeCleaner.instance
  }

  // 强制清除所有Font Awesome样式
  forceCleanup() {
    this.addCleanupStyles()
    this.cleanAllIcons()
    console.log('Font Awesome样式已强制清除')
  }

  // 添加清除样式
  private addCleanupStyles() {
    // 移除现有的清除样式
    const existingStyle = document.getElementById(this.cleanupStyleId)
    if (existingStyle) {
      existingStyle.remove()
    }

    const style = document.createElement('style')
    style.id = this.cleanupStyleId
    style.textContent = `
      /* 强制清除所有Font Awesome相关样式 */
      i[class*="fa"]::before,
      i[class*="fa"]::after,
      .fa::before,
      .fa::after,
      .fas::before,
      .fas::after,
      .far::before,
      .far::after,
      .fab::before,
      .fab::after,
      .fal::before,
      .fal::after,
      .fad::before,
      .fad::after {
        content: none !important;
        display: none !important;
        font-family: inherit !important;
      }
      
      /* 重置Font Awesome图标的字体 */
      i[class*="fa"],
      .fa,
      .fas,
      .far,
      .fab,
      .fal,
      .fad {
        font-family: inherit !important;
        font-style: normal !important;
        font-weight: normal !important;
        font-variant: normal !important;
        text-transform: none !important;
        line-height: 1 !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
      }
      
      /* 确保自定义图标正常显示 */
      .custom-icon-replaced {
        font-family: inherit !important;
        font-style: normal !important;
        font-weight: normal !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        line-height: 1 !important;
        vertical-align: middle !important;
      }
      
      .custom-icon-replaced::before,
      .custom-icon-replaced::after {
        content: none !important;
        display: none !important;
      }
      
      /* 保持旋转动画 */
      .custom-icon-replaced.fa-spin {
        animation: custom-spin 2s infinite linear !important;
      }
      
      @keyframes custom-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* 隐藏可能的Font Awesome加载指示器 */
      .fa-loading,
      .fa-spinner-third,
      .fa-circle-notch {
        display: none !important;
      }
    `
    
    document.head.appendChild(style)
  }

  // 清理所有图标元素
  private cleanAllIcons() {
    const icons = document.querySelectorAll('i[class*="fa"]')
    
    icons.forEach(icon => {
      const element = icon as HTMLElement
      
      // 强制清除内联样式中的Font Awesome相关属性
      element.style.removeProperty('font-family')
      element.style.setProperty('font-family', 'inherit', 'important')
      element.style.setProperty('font-style', 'normal', 'important')
      element.style.setProperty('font-weight', 'normal', 'important')
      element.style.setProperty('font-variant', 'normal', 'important')
      element.style.setProperty('text-transform', 'none', 'important')
      
      // 如果元素为空或只有空白字符，且没有被自定义图标替换
      if (!element.hasAttribute('data-custom-replaced') && 
          (!element.textContent || element.textContent.trim() === '')) {
        // 添加一个占位符，防止显示小方块
        element.textContent = '●'
        element.style.setProperty('opacity', '0.3', 'important')
        element.title = '图标加载中...'
      }
    })
  }

  // 移除清除样式
  removeCleanupStyles() {
    const style = document.getElementById(this.cleanupStyleId)
    if (style) {
      style.remove()
    }
  }

  // 检查是否有Font Awesome样式冲突
  checkForConflicts(): boolean {
    const testElement = document.createElement('i')
    testElement.className = 'fas fa-test-icon'
    testElement.style.position = 'absolute'
    testElement.style.left = '-9999px'
    document.body.appendChild(testElement)
    
    const computedStyle = window.getComputedStyle(testElement, '::before')
    const fontFamily = computedStyle.getPropertyValue('font-family')
    const content = computedStyle.getPropertyValue('content')
    
    document.body.removeChild(testElement)
    
    // 检查是否有Font Awesome字体或内容
    const hasConflict = fontFamily.includes('Font Awesome') ||
                       fontFamily.includes('FontAwesome') ||
                       (content && content !== 'none' && content !== '""')

    return Boolean(hasConflict)
  }

  // 自动清理（在页面加载时调用）
  autoCleanup() {
    // 立即清理
    this.forceCleanup()

    // 延迟清理，确保所有动态内容都被处理
    setTimeout(() => {
      this.forceCleanup()
    }, 1000)

    // 监听DOM变化，自动清理新添加的图标
    const observer = new MutationObserver(() => {
      // 延迟清理新图标
      setTimeout(() => {
        this.cleanAllIcons()
      }, 100)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }
}

// 导出单例实例
export const fontAwesomeCleaner = FontAwesomeCleaner.getInstance()

// 自动初始化
if (typeof window !== 'undefined') {
  // 页面加载完成后自动清理
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fontAwesomeCleaner.autoCleanup()
    })
  } else {
    fontAwesomeCleaner.autoCleanup()
  }
}

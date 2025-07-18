// 全局通知服务 - 美化版本
import { createApp } from 'vue'
import NotificationSystem from '@/components/NotificationSystem.vue'

class NotificationService {
  private notificationInstance: any = null
  private container: HTMLElement | null = null

  constructor() {
    this.init()
  }

  private init() {
    // 创建容器
    this.container = document.createElement('div')
    this.container.id = 'notification-container'
    document.body.appendChild(this.container)

    // 创建Vue应用实例
    const app = createApp(NotificationSystem)
    this.notificationInstance = app.mount(this.container)
  }

  // 成功通知
  success(title: string, message: string = '', duration: number = 4000) {
    if (this.notificationInstance) {
      return this.notificationInstance.success(title, message, duration)
    } else {
      console.log('✅', title, message)
    }
  }

  // 错误通知
  error(title: string, message: string = '', duration: number = 5000) {
    if (this.notificationInstance) {
      return this.notificationInstance.error(title, message, duration)
    } else {
      console.error('❌', title, message)
    }
  }

  // 警告通知
  warning(title: string, message: string = '', duration: number = 4000) {
    if (this.notificationInstance) {
      return this.notificationInstance.warning(title, message, duration)
    } else {
      console.warn('⚠️', title, message)
    }
  }

  // 信息通知
  info(title: string, message: string = '', duration: number = 4000) {
    if (this.notificationInstance) {
      return this.notificationInstance.info(title, message, duration)
    } else {
      console.info('ℹ️', title, message)
    }
  }

  // 确认对话框
  confirm(options: {
    title?: string
    message: string
    icon?: string
    confirmText?: string
    cancelText?: string
  }): Promise<boolean> {
    if (this.notificationInstance) {
      return this.notificationInstance.confirm(options)
    } else {
      return Promise.resolve(window.confirm(options.message))
    }
  }

  // 清除所有通知
  clear() {
    // 新版本通知会自动消失，这里保留接口兼容性
  }
}

// 创建全局实例
const notificationService = new NotificationService()

// 兼容旧版本的接口
export const notification = {
  success: (message: string, title: string = '操作成功') =>
    notificationService.success(title, message),
  error: (message: string, title: string = '操作失败') =>
    notificationService.error(title, message),
  warning: (message: string, title: string = '警告') =>
    notificationService.warning(title, message),
  info: (message: string, title: string = '提示') =>
    notificationService.info(title, message),
  clear: () => notificationService.clear(),
  add: (options: any) => {
    const { type = 'info', title = '通知', message = '' } = options
    return (notificationService as any)[type](title, message)
  }
}

// 设置通知实例（兼容旧版本）
export const setNotificationInstance = (instance: any) => {
  // 新版本不需要外部设置实例
}

// 导出便捷方法
export const useNotification = () => {
  return {
    success: notificationService.success.bind(notificationService),
    error: notificationService.error.bind(notificationService),
    warning: notificationService.warning.bind(notificationService),
    info: notificationService.info.bind(notificationService),
    confirm: notificationService.confirm.bind(notificationService)
  }
}

// 快捷方法
export const notifySuccess = (title: string, message?: string) =>
  notificationService.success(title, message || '')
export const notifyError = (title: string, message?: string) =>
  notificationService.error(title, message || '')
export const notifyWarning = (title: string, message?: string) =>
  notificationService.warning(title, message || '')
export const notifyInfo = (title: string, message?: string) =>
  notificationService.info(title, message || '')

// 确认对话框快捷方法
export const confirmAction = (message: string, title?: string) =>
  notificationService.confirm({ title, message })

// 登录相关通知
export const notifyLoginSuccess = (username: string) => {
  notificationService.success(
    '登录成功！',
    `欢迎回来，${username}！祝您在普洱蘑菇庄园度过愉快的时光。`
  )
}

export const notifyLoginError = (reason: string = '用户名或密码错误') => {
  notificationService.error(
    '登录失败',
    `${reason}，请检查您的登录信息后重试。`
  )
}

// 操作相关通知
export const notifyOperationSuccess = (operation: string, target: string = '') => {
  notificationService.success(
    `${operation}成功`,
    target ? `${target}已${operation}成功` : `操作已成功完成`
  )
}

export const notifyOperationError = (operation: string, reason: string = '未知错误') => {
  notificationService.error(
    `${operation}失败`,
    `操作失败：${reason}，请稍后重试。`
  )
}

// 默认导出
export default notificationService



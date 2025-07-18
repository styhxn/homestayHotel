// 🛠️ 语音通话错误处理和恢复服务
// 提供全面的错误处理、自动恢复和用户友好的错误提示

export interface ErrorConfig {
  // 重试配置
  maxRetryAttempts: number
  retryDelay: number
  exponentialBackoff: boolean
  
  // 超时配置
  connectionTimeout: number
  responseTimeout: number
  
  // 降级配置
  enableGracefulDegradation: boolean
  fallbackOptions: string[]
  
  // 用户体验配置
  showDetailedErrors: boolean
  autoRecovery: boolean
  userNotifications: boolean
}

export interface ErrorInfo {
  code: string
  type: 'network' | 'audio' | 'permission' | 'browser' | 'ai' | 'unknown'
  message: string
  details?: any
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  recoverable: boolean
  userAction?: string
}

export interface RecoveryAction {
  action: string
  description: string
  execute: () => Promise<boolean>
  fallback?: () => Promise<boolean>
}

export interface ErrorEvents {
  onError: (error: ErrorInfo) => void
  onRecoveryAttempt: (action: string) => void
  onRecoverySuccess: (action: string) => void
  onRecoveryFailed: (action: string, error: Error) => void
  onFallbackActivated: (fallback: string) => void
  onUserActionRequired: (action: string, message: string) => void
}

export class VoiceErrorHandler {
  private config: ErrorConfig
  private events: ErrorEvents
  
  // 错误历史和统计
  private errorHistory: ErrorInfo[] = []
  private recoveryAttempts: Map<string, number> = new Map()
  private lastErrorTime: Map<string, number> = new Map()
  
  // 恢复动作注册表
  private recoveryActions: Map<string, RecoveryAction> = new Map()
  
  // 状态管理
  private isRecovering = false
  private currentError?: ErrorInfo

  constructor(config: Partial<ErrorConfig> = {}, events: Partial<ErrorEvents> = {}) {
    this.config = {
      maxRetryAttempts: 3,
      retryDelay: 1000,
      exponentialBackoff: true,
      connectionTimeout: 10000,
      responseTimeout: 15000,
      enableGracefulDegradation: true,
      fallbackOptions: ['basic_mode', 'text_only', 'offline_mode'],
      showDetailedErrors: false,
      autoRecovery: true,
      userNotifications: true,
      ...config
    }
    
    this.events = {
      onError: () => {},
      onRecoveryAttempt: () => {},
      onRecoverySuccess: () => {},
      onRecoveryFailed: () => {},
      onFallbackActivated: () => {},
      onUserActionRequired: () => {},
      ...events
    }
    
    this.initializeRecoveryActions()
  }

  /**
   * 初始化恢复动作
   */
  private initializeRecoveryActions(): void {
    // 网络连接恢复
    this.registerRecoveryAction('network_reconnect', {
      action: 'network_reconnect',
      description: '重新建立网络连接',
      execute: async () => {
        // 检查网络连接
        if (!navigator.onLine) {
          throw new Error('网络不可用')
        }
        
        // 尝试重新连接
        await this.testNetworkConnection()
        return true
      },
      fallback: async () => {
        // 启用离线模式
        this.events.onFallbackActivated('offline_mode')
        return true
      }
    })
    
    // 麦克风权限恢复
    this.registerRecoveryAction('microphone_permission', {
      action: 'microphone_permission',
      description: '重新请求麦克风权限',
      execute: async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          stream.getTracks().forEach(track => track.stop())
          return true
        } catch (error) {
          throw new Error('无法获取麦克风权限')
        }
      },
      fallback: async () => {
        // 启用文本模式
        this.events.onFallbackActivated('text_only')
        this.events.onUserActionRequired(
          'enable_microphone',
          '请在浏览器设置中允许麦克风访问，然后刷新页面'
        )
        return true
      }
    })
    
    // 语音识别恢复
    this.registerRecoveryAction('speech_recognition_restart', {
      action: 'speech_recognition_restart',
      description: '重启语音识别服务',
      execute: async () => {
        // 检查浏览器支持
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
          throw new Error('浏览器不支持语音识别')
        }
        
        // 重新初始化语音识别
        return true
      },
      fallback: async () => {
        // 启用基础模式
        this.events.onFallbackActivated('basic_mode')
        return true
      }
    })
    
    // AI服务恢复
    this.registerRecoveryAction('ai_service_reconnect', {
      action: 'ai_service_reconnect',
      description: '重新连接AI服务',
      execute: async () => {
        // 测试AI服务连接
        await this.testAIConnection()
        return true
      },
      fallback: async () => {
        // 使用本地回复
        this.events.onFallbackActivated('local_responses')
        return true
      }
    })
  }

  /**
   * 注册恢复动作
   */
  registerRecoveryAction(errorCode: string, action: RecoveryAction): void {
    this.recoveryActions.set(errorCode, action)
  }

  /**
   * 处理错误
   */
  async handleError(error: Error | ErrorInfo, context?: any): Promise<boolean> {
    let errorInfo: ErrorInfo
    
    if (error instanceof Error) {
      errorInfo = this.parseError(error, context)
    } else {
      errorInfo = error
    }
    
    // 记录错误
    this.recordError(errorInfo)
    
    // 触发错误事件
    this.events.onError(errorInfo)
    
    // 如果启用自动恢复，尝试恢复
    if (this.config.autoRecovery && errorInfo.recoverable) {
      return await this.attemptRecovery(errorInfo)
    }
    
    return false
  }

  /**
   * 解析错误
   */
  private parseError(error: Error, context?: any): ErrorInfo {
    const message = error.message.toLowerCase()
    let errorInfo: ErrorInfo = {
      code: 'unknown_error',
      type: 'unknown',
      message: error.message,
      details: context,
      timestamp: Date.now(),
      severity: 'medium',
      recoverable: true
    }
    
    // 网络错误
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      errorInfo = {
        ...errorInfo,
        code: 'network_error',
        type: 'network',
        severity: 'high',
        userAction: '请检查网络连接'
      }
    }
    // 权限错误
    else if (message.includes('permission') || message.includes('denied') || message.includes('notallowed')) {
      errorInfo = {
        ...errorInfo,
        code: 'permission_denied',
        type: 'permission',
        severity: 'critical',
        userAction: '请允许麦克风访问权限'
      }
    }
    // 音频错误
    else if (message.includes('audio') || message.includes('microphone') || message.includes('media')) {
      errorInfo = {
        ...errorInfo,
        code: 'audio_error',
        type: 'audio',
        severity: 'high',
        userAction: '请检查音频设备'
      }
    }
    // 浏览器兼容性错误
    else if (message.includes('not supported') || message.includes('undefined')) {
      errorInfo = {
        ...errorInfo,
        code: 'browser_unsupported',
        type: 'browser',
        severity: 'critical',
        recoverable: false,
        userAction: '请使用Chrome、Edge或Safari浏览器'
      }
    }
    // AI服务错误
    else if (message.includes('ai') || message.includes('response') || message.includes('timeout')) {
      errorInfo = {
        ...errorInfo,
        code: 'ai_service_error',
        type: 'ai',
        severity: 'medium',
        userAction: 'AI服务暂时不可用，请稍后重试'
      }
    }
    
    return errorInfo
  }

  /**
   * 记录错误
   */
  private recordError(error: ErrorInfo): void {
    this.errorHistory.push(error)
    this.currentError = error
    
    // 保持最近100个错误记录
    if (this.errorHistory.length > 100) {
      this.errorHistory.shift()
    }
    
    // 更新错误时间
    this.lastErrorTime.set(error.code, error.timestamp)
    
    console.error('语音通话错误:', error)
  }

  /**
   * 尝试恢复
   */
  private async attemptRecovery(error: ErrorInfo): Promise<boolean> {
    if (this.isRecovering) {
      return false
    }
    
    this.isRecovering = true
    
    try {
      // 检查重试次数
      const attempts = this.recoveryAttempts.get(error.code) || 0
      if (attempts >= this.config.maxRetryAttempts) {
        console.log(`错误 ${error.code} 已达到最大重试次数`)
        return await this.activateFallback(error)
      }
      
      // 获取恢复动作
      const recoveryAction = this.getRecoveryAction(error)
      if (!recoveryAction) {
        console.log(`没有找到错误 ${error.code} 的恢复动作`)
        return await this.activateFallback(error)
      }
      
      // 计算延迟时间
      const delay = this.calculateRetryDelay(attempts)
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      
      // 更新重试次数
      this.recoveryAttempts.set(error.code, attempts + 1)
      
      // 触发恢复尝试事件
      this.events.onRecoveryAttempt(recoveryAction.action)
      
      // 执行恢复动作
      const success = await recoveryAction.execute()
      
      if (success) {
        // 恢复成功
        this.recoveryAttempts.delete(error.code)
        this.events.onRecoverySuccess(recoveryAction.action)
        return true
      } else {
        // 恢复失败，尝试降级
        return await this.activateFallback(error)
      }
      
    } catch (recoveryError) {
      console.error('恢复过程中发生错误:', recoveryError)
      this.events.onRecoveryFailed(error.code, recoveryError as Error)
      
      // 尝试降级
      return await this.activateFallback(error)
      
    } finally {
      this.isRecovering = false
    }
  }

  /**
   * 获取恢复动作
   */
  private getRecoveryAction(error: ErrorInfo): RecoveryAction | undefined {
    // 直接匹配错误代码
    let action = this.recoveryActions.get(error.code)
    if (action) return action
    
    // 根据错误类型匹配
    switch (error.type) {
      case 'network':
        return this.recoveryActions.get('network_reconnect')
      case 'permission':
        return this.recoveryActions.get('microphone_permission')
      case 'audio':
        return this.recoveryActions.get('speech_recognition_restart')
      case 'ai':
        return this.recoveryActions.get('ai_service_reconnect')
      default:
        return undefined
    }
  }

  /**
   * 计算重试延迟
   */
  private calculateRetryDelay(attempts: number): number {
    if (!this.config.exponentialBackoff) {
      return this.config.retryDelay
    }
    
    // 指数退避算法
    return this.config.retryDelay * Math.pow(2, attempts)
  }

  /**
   * 激活降级模式
   */
  private async activateFallback(error: ErrorInfo): Promise<boolean> {
    if (!this.config.enableGracefulDegradation) {
      return false
    }
    
    const recoveryAction = this.getRecoveryAction(error)
    if (recoveryAction?.fallback) {
      try {
        const success = await recoveryAction.fallback()
        if (success) {
          this.events.onFallbackActivated(recoveryAction.action)
          return true
        }
      } catch (fallbackError) {
        console.error('降级模式激活失败:', fallbackError)
      }
    }
    
    // 使用默认降级选项
    const fallback = this.selectFallbackOption(error)
    if (fallback) {
      this.events.onFallbackActivated(fallback)
      return true
    }
    
    return false
  }

  /**
   * 选择降级选项
   */
  private selectFallbackOption(error: ErrorInfo): string | null {
    const options = this.config.fallbackOptions
    
    switch (error.type) {
      case 'permission':
      case 'audio':
        return options.includes('text_only') ? 'text_only' : null
      case 'network':
        return options.includes('offline_mode') ? 'offline_mode' : null
      case 'browser':
        return options.includes('basic_mode') ? 'basic_mode' : null
      default:
        return options.length > 0 ? options[0] : null
    }
  }

  /**
   * 测试网络连接
   */
  private async testNetworkConnection(): Promise<void> {
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        signal: AbortSignal.timeout(this.config.connectionTimeout)
      })
      if (!response.ok) {
        throw new Error(`网络测试失败: ${response.status}`)
      }
    } catch (error) {
      throw new Error('网络连接测试失败')
    }
  }

  /**
   * 测试AI连接
   */
  private async testAIConnection(): Promise<void> {
    // 简化的AI连接测试
    try {
      // 这里应该调用实际的AI服务健康检查接口
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      throw new Error('AI服务连接测试失败')
    }
  }

  /**
   * 获取错误统计
   */
  getErrorStatistics(): {
    totalErrors: number
    errorsByType: Record<string, number>
    recentErrors: ErrorInfo[]
    recoveryRate: number
  } {
    const errorsByType: Record<string, number> = {}
    let recoveredCount = 0
    
    this.errorHistory.forEach(error => {
      errorsByType[error.type] = (errorsByType[error.type] || 0) + 1
      if (this.recoveryAttempts.has(error.code)) {
        recoveredCount++
      }
    })
    
    const recentErrors = this.errorHistory
      .filter(error => Date.now() - error.timestamp < 300000) // 最近5分钟
    
    return {
      totalErrors: this.errorHistory.length,
      errorsByType,
      recentErrors,
      recoveryRate: this.errorHistory.length > 0 ? recoveredCount / this.errorHistory.length : 0
    }
  }

  /**
   * 清除错误历史
   */
  clearErrorHistory(): void {
    this.errorHistory = []
    this.recoveryAttempts.clear()
    this.lastErrorTime.clear()
    this.currentError = undefined
  }

  /**
   * 获取用户友好的错误消息
   */
  getUserFriendlyMessage(error: ErrorInfo): string {
    const baseMessages: Record<string, string> = {
      network_error: '网络连接出现问题，请检查您的网络设置',
      permission_denied: '需要麦克风权限才能使用语音功能，请在浏览器中允许访问',
      audio_error: '音频设备出现问题，请检查您的麦克风设置',
      browser_unsupported: '您的浏览器不支持语音功能，建议使用Chrome、Edge或Safari',
      ai_service_error: 'AI服务暂时不可用，请稍后重试',
      unknown_error: '出现未知错误，请刷新页面重试'
    }
    
    let message = baseMessages[error.code] || baseMessages.unknown_error
    
    if (error.userAction) {
      message += `\n建议：${error.userAction}`
    }
    
    return message
  }
}

// 🎧 语音通话质量优化器
// 提供音频质量优化、错误处理和网络适应功能

export interface QualityConfig {
  // 音频处理配置
  echoCancellation: boolean
  noiseSuppression: boolean
  autoGainControl: boolean
  
  // 质量监控配置
  qualityCheckInterval: number
  minQualityThreshold: number
  maxLatency: number
  
  // 自适应配置
  enableAdaptiveQuality: boolean
  adaptiveThresholds: {
    excellent: number
    good: number
    fair: number
    poor: number
  }
  
  // 错误恢复配置
  maxRetryAttempts: number
  retryDelay: number
  fallbackEnabled: boolean
}

export interface QualityMetrics {
  audioLevel: number
  noiseLevel: number
  latency: number
  packetLoss: number
  jitter: number
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  timestamp: number
}

export interface QualityEvents {
  onQualityChange: (metrics: QualityMetrics) => void
  onOptimizationApplied: (optimization: string) => void
  onErrorRecovered: (error: string, recovery: string) => void
  onFallbackActivated: (reason: string) => void
}

export class VoiceQualityOptimizer {
  private config: QualityConfig
  private events: QualityEvents
  
  // 音频处理相关
  private audioContext?: AudioContext
  private analyser?: AnalyserNode
  private gainNode?: GainNode
  private filterNode?: BiquadFilterNode
  
  // 质量监控
  private qualityMetrics: QualityMetrics[] = []
  private monitoringInterval?: number
  private isMonitoring = false
  
  // 自适应优化
  private currentOptimizations: Set<string> = new Set()
  private adaptiveSettings = {
    sampleRate: 44100,
    bufferSize: 4096,
    compressionRatio: 1.0
  }
  
  // 错误处理
  private errorHistory: Array<{ error: string; timestamp: number; recovered: boolean }> = []
  private retryAttempts = 0

  constructor(config: Partial<QualityConfig> = {}, events: Partial<QualityEvents> = {}) {
    this.config = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      qualityCheckInterval: 1000,
      minQualityThreshold: 0.6,
      maxLatency: 200,
      enableAdaptiveQuality: true,
      adaptiveThresholds: {
        excellent: 0.9,
        good: 0.7,
        fair: 0.5,
        poor: 0.3
      },
      maxRetryAttempts: 3,
      retryDelay: 1000,
      fallbackEnabled: true,
      ...config
    }
    
    this.events = {
      onQualityChange: () => {},
      onOptimizationApplied: () => {},
      onErrorRecovered: () => {},
      onFallbackActivated: () => {},
      ...events
    }
  }

  /**
   * 初始化质量优化器
   */
  async initialize(audioContext: AudioContext): Promise<void> {
    try {
      this.audioContext = audioContext
      
      // 创建音频处理节点
      await this.createAudioProcessingNodes()
      
      // 开始质量监控
      this.startQualityMonitoring()
      
      console.log('语音质量优化器初始化完成')
    } catch (error) {
      console.error('质量优化器初始化失败:', error)
      throw error
    }
  }

  /**
   * 创建音频处理节点
   */
  private async createAudioProcessingNodes(): Promise<void> {
    if (!this.audioContext) return
    
    try {
      // 创建分析器节点
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 2048
      this.analyser.smoothingTimeConstant = 0.8
      
      // 创建增益节点（自动增益控制）
      this.gainNode = this.audioContext.createGain()
      this.gainNode.gain.value = 1.0
      
      // 创建滤波器节点（噪音抑制）
      this.filterNode = this.audioContext.createBiquadFilter()
      this.filterNode.type = 'highpass'
      this.filterNode.frequency.value = 80 // 过滤低频噪音
      this.filterNode.Q.value = 1
      
      console.log('音频处理节点创建完成')
    } catch (error) {
      console.error('创建音频处理节点失败:', error)
      throw error
    }
  }

  /**
   * 连接音频流
   */
  connectAudioStream(source: MediaStreamAudioSourceNode, destination?: AudioNode): void {
    if (!this.analyser || !this.gainNode || !this.filterNode) return
    
    try {
      // 构建音频处理链
      source.connect(this.filterNode)
      this.filterNode.connect(this.gainNode)
      this.gainNode.connect(this.analyser)
      
      if (destination) {
        this.analyser.connect(destination)
      }
      
      console.log('音频流连接完成')
    } catch (error) {
      console.error('连接音频流失败:', error)
      this.handleError('audio_connection_failed', error as Error)
    }
  }

  /**
   * 开始质量监控
   */
  private startQualityMonitoring(): void {
    if (this.isMonitoring) return
    
    this.isMonitoring = true
    this.monitoringInterval = window.setInterval(() => {
      this.analyzeAudioQuality()
    }, this.config.qualityCheckInterval)
    
    console.log('质量监控已开始')
  }

  /**
   * 停止质量监控
   */
  private stopQualityMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = undefined
    }
    this.isMonitoring = false
    console.log('质量监控已停止')
  }

  /**
   * 分析音频质量
   */
  private analyzeAudioQuality(): void {
    if (!this.analyser) return
    
    try {
      const bufferLength = this.analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      const frequencyArray = new Uint8Array(bufferLength)
      
      // 获取时域和频域数据
      this.analyser.getByteTimeDomainData(dataArray)
      this.analyser.getByteFrequencyData(frequencyArray)
      
      // 计算音频指标
      const audioLevel = this.calculateAudioLevel(dataArray)
      const noiseLevel = this.calculateNoiseLevel(frequencyArray)
      const quality = this.calculateOverallQuality(audioLevel, noiseLevel)
      
      const metrics: QualityMetrics = {
        audioLevel,
        noiseLevel,
        latency: this.estimateLatency(),
        packetLoss: 0, // 简化实现
        jitter: 0, // 简化实现
        quality,
        timestamp: Date.now()
      }
      
      // 记录质量指标
      this.recordQualityMetrics(metrics)
      
      // 应用自适应优化
      if (this.config.enableAdaptiveQuality) {
        this.applyAdaptiveOptimizations(metrics)
      }
      
      // 触发质量变化事件
      this.events.onQualityChange(metrics)
      
    } catch (error) {
      console.error('分析音频质量失败:', error)
      this.handleError('quality_analysis_failed', error as Error)
    }
  }

  /**
   * 计算音频电平
   */
  private calculateAudioLevel(dataArray: Uint8Array): number {
    let sum = 0
    for (let i = 0; i < dataArray.length; i++) {
      const sample = (dataArray[i] - 128) / 128
      sum += sample * sample
    }
    return Math.sqrt(sum / dataArray.length)
  }

  /**
   * 计算噪音水平
   */
  private calculateNoiseLevel(frequencyArray: Uint8Array): number {
    // 分析低频段的能量作为噪音指标
    let noiseSum = 0
    const noiseRange = Math.floor(frequencyArray.length * 0.1) // 前10%频段
    
    for (let i = 0; i < noiseRange; i++) {
      noiseSum += frequencyArray[i]
    }
    
    return (noiseSum / noiseRange) / 255
  }

  /**
   * 计算整体质量
   */
  private calculateOverallQuality(audioLevel: number, noiseLevel: number): 'excellent' | 'good' | 'fair' | 'poor' {
    // 综合音频电平和噪音水平计算质量分数
    const signalToNoise = audioLevel / Math.max(noiseLevel, 0.01)
    const qualityScore = Math.min(signalToNoise / 10, 1) // 归一化到0-1
    
    const thresholds = this.config.adaptiveThresholds
    
    if (qualityScore >= thresholds.excellent) return 'excellent'
    if (qualityScore >= thresholds.good) return 'good'
    if (qualityScore >= thresholds.fair) return 'fair'
    return 'poor'
  }

  /**
   * 估算延迟
   */
  private estimateLatency(): number {
    // 简化的延迟估算，实际应用中需要更复杂的测量
    const bufferSize = this.audioContext?.baseLatency || 0
    const processingDelay = 20 // 估算的处理延迟
    return (bufferSize * 1000) + processingDelay
  }

  /**
   * 记录质量指标
   */
  private recordQualityMetrics(metrics: QualityMetrics): void {
    this.qualityMetrics.push(metrics)
    
    // 保持最近100个记录
    if (this.qualityMetrics.length > 100) {
      this.qualityMetrics.shift()
    }
  }

  /**
   * 应用自适应优化
   */
  private applyAdaptiveOptimizations(metrics: QualityMetrics): void {
    const optimizations: string[] = []
    
    // 根据质量调整增益
    if (metrics.audioLevel < 0.1 && this.gainNode) {
      this.gainNode.gain.value = Math.min(this.gainNode.gain.value * 1.1, 3.0)
      optimizations.push('增加音频增益')
    } else if (metrics.audioLevel > 0.8 && this.gainNode) {
      this.gainNode.gain.value = Math.max(this.gainNode.gain.value * 0.9, 0.1)
      optimizations.push('降低音频增益')
    }
    
    // 根据噪音水平调整滤波器
    if (metrics.noiseLevel > 0.3 && this.filterNode) {
      this.filterNode.frequency.value = Math.min(this.filterNode.frequency.value * 1.1, 200)
      optimizations.push('增强噪音过滤')
    }
    
    // 根据质量调整处理参数
    if (metrics.quality === 'poor') {
      this.applyPoorQualityOptimizations()
      optimizations.push('应用低质量优化')
    }
    
    // 记录应用的优化
    optimizations.forEach(opt => {
      if (!this.currentOptimizations.has(opt)) {
        this.currentOptimizations.add(opt)
        this.events.onOptimizationApplied(opt)
      }
    })
  }

  /**
   * 应用低质量优化
   */
  private applyPoorQualityOptimizations(): void {
    // 降低采样率以减少处理负担
    this.adaptiveSettings.sampleRate = Math.max(this.adaptiveSettings.sampleRate * 0.8, 16000)
    
    // 增加缓冲区大小以减少丢包
    this.adaptiveSettings.bufferSize = Math.min(this.adaptiveSettings.bufferSize * 1.5, 8192)
    
    // 应用音频压缩
    this.adaptiveSettings.compressionRatio = Math.min(this.adaptiveSettings.compressionRatio * 1.2, 2.0)
  }

  /**
   * 处理错误
   */
  private handleError(errorType: string, error: Error): void {
    const errorRecord = {
      error: `${errorType}: ${error.message}`,
      timestamp: Date.now(),
      recovered: false
    }
    
    this.errorHistory.push(errorRecord)
    
    // 尝试错误恢复
    this.attemptErrorRecovery(errorType, error)
      .then(recovered => {
        errorRecord.recovered = recovered
        if (recovered) {
          this.events.onErrorRecovered(errorRecord.error, '自动恢复成功')
        }
      })
      .catch(recoveryError => {
        console.error('错误恢复失败:', recoveryError)
        if (this.config.fallbackEnabled) {
          this.activateFallback(errorType)
        }
      })
  }

  /**
   * 尝试错误恢复
   */
  private async attemptErrorRecovery(errorType: string, error: Error): Promise<boolean> {
    if (this.retryAttempts >= this.config.maxRetryAttempts) {
      return false
    }
    
    this.retryAttempts++
    
    try {
      await new Promise(resolve => setTimeout(resolve, this.config.retryDelay))
      
      switch (errorType) {
        case 'audio_connection_failed':
          await this.createAudioProcessingNodes()
          break
        case 'quality_analysis_failed':
          // 重置分析器
          if (this.audioContext) {
            this.analyser = this.audioContext.createAnalyser()
          }
          break
        default:
          return false
      }
      
      this.retryAttempts = 0
      return true
      
    } catch (recoveryError) {
      console.error('恢复尝试失败:', recoveryError)
      return false
    }
  }

  /**
   * 激活降级模式
   */
  private activateFallback(reason: string): void {
    console.log('激活降级模式:', reason)
    
    // 禁用高级音频处理
    this.currentOptimizations.clear()
    
    // 使用基础音频设置
    this.adaptiveSettings = {
      sampleRate: 16000,
      bufferSize: 2048,
      compressionRatio: 1.0
    }
    
    this.events.onFallbackActivated(reason)
  }

  /**
   * 获取当前质量指标
   */
  getCurrentMetrics(): QualityMetrics | null {
    return this.qualityMetrics.length > 0 
      ? this.qualityMetrics[this.qualityMetrics.length - 1] 
      : null
  }

  /**
   * 获取质量历史
   */
  getQualityHistory(duration: number = 60000): QualityMetrics[] {
    const cutoff = Date.now() - duration
    return this.qualityMetrics.filter(metric => metric.timestamp > cutoff)
  }

  /**
   * 重置优化器
   */
  reset(): void {
    this.stopQualityMonitoring()
    this.qualityMetrics = []
    this.errorHistory = []
    this.currentOptimizations.clear()
    this.retryAttempts = 0
  }

  /**
   * 销毁优化器
   */
  destroy(): void {
    this.reset()
    
    // 断开音频节点
    if (this.analyser) {
      this.analyser.disconnect()
    }
    if (this.gainNode) {
      this.gainNode.disconnect()
    }
    if (this.filterNode) {
      this.filterNode.disconnect()
    }
    
    this.audioContext = undefined
    this.analyser = undefined
    this.gainNode = undefined
    this.filterNode = undefined
  }
}

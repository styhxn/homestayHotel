// 🎤 语音活动检测(VAD)服务
// 智能检测用户说话的开始和结束，支持实时语音断句

export interface VADConfig {
  // 音量阈值配置
  volumeThreshold: number
  silenceThreshold: number
  
  // 时间配置
  minSpeechDuration: number  // 最小说话时长(ms)
  maxSilenceDuration: number // 最大静音时长(ms)
  debounceTime: number       // 防抖时间(ms)
  
  // 频率分析配置
  fftSize: number
  smoothingTimeConstant: number
  
  // 高级配置
  useFrequencyAnalysis: boolean
  speechFrequencyRange: [number, number] // 语音频率范围
}

export interface VADState {
  isSpeaking: boolean
  speechStartTime?: number
  speechEndTime?: number
  currentVolume: number
  averageVolume: number
  speechDuration: number
  silenceDuration: number
}

export interface VADEvents {
  onSpeechStart: () => void
  onSpeechEnd: () => void
  onVolumeChange: (volume: number) => void
  onStateChange: (state: VADState) => void
}

export class VoiceActivityDetection {
  private config: VADConfig
  private events: VADEvents
  private state: VADState
  
  // 音频分析相关
  private audioContext?: AudioContext
  private analyser?: AnalyserNode
  private mediaStreamSource?: MediaStreamAudioSourceNode
  
  // 检测状态
  private isActive = false
  private animationFrame?: number
  
  // 音量历史记录
  private volumeHistory: number[] = []
  private readonly historySize = 10
  
  // 定时器
  private speechTimer?: number
  private silenceTimer?: number
  
  constructor(config: Partial<VADConfig> = {}, events: Partial<VADEvents> = {}) {
    this.config = {
      volumeThreshold: 0.01,
      silenceThreshold: 0.005,
      minSpeechDuration: 300,
      maxSilenceDuration: 1500,
      debounceTime: 100,
      fftSize: 512,
      smoothingTimeConstant: 0.8,
      useFrequencyAnalysis: true,
      speechFrequencyRange: [80, 8000],
      ...config
    }
    
    this.events = {
      onSpeechStart: () => {},
      onSpeechEnd: () => {},
      onVolumeChange: () => {},
      onStateChange: () => {},
      ...events
    }
    
    this.state = {
      isSpeaking: false,
      currentVolume: 0,
      averageVolume: 0,
      speechDuration: 0,
      silenceDuration: 0
    }
  }

  /**
   * 初始化VAD
   */
  async initialize(mediaStream: MediaStream): Promise<void> {
    try {
      // 创建音频上下文
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }
      
      // 创建分析器
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = this.config.fftSize
      this.analyser.smoothingTimeConstant = this.config.smoothingTimeConstant
      
      // 连接媒体流
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(mediaStream)
      this.mediaStreamSource.connect(this.analyser)
      
      console.log('VAD初始化完成')
    } catch (error) {
      console.error('VAD初始化失败:', error)
      throw error
    }
  }

  /**
   * 开始语音活动检测
   */
  start(): void {
    if (!this.analyser || this.isActive) return
    
    this.isActive = true
    this.startDetection()
    console.log('VAD检测已开始')
  }

  /**
   * 停止语音活动检测
   */
  stop(): void {
    this.isActive = false
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = undefined
    }
    
    this.clearTimers()
    console.log('VAD检测已停止')
  }

  /**
   * 销毁VAD
   */
  destroy(): void {
    this.stop()
    
    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect()
      this.mediaStreamSource = undefined
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
      this.audioContext = undefined
    }
    
    this.analyser = undefined
  }

  /**
   * 开始检测循环
   */
  private startDetection(): void {
    if (!this.isActive || !this.analyser) return
    
    const bufferLength = this.analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const frequencyArray = new Uint8Array(bufferLength)
    
    const detect = () => {
      if (!this.isActive || !this.analyser) return
      
      // 获取时域数据（音量）
      this.analyser.getByteTimeDomainData(dataArray)
      
      // 获取频域数据（频率分析）
      if (this.config.useFrequencyAnalysis) {
        this.analyser.getByteFrequencyData(frequencyArray)
      }
      
      // 计算当前音量
      const volume = this.calculateVolume(dataArray)
      
      // 频率分析（可选）
      const speechLikelihood = this.config.useFrequencyAnalysis 
        ? this.analyzeSpeechFrequency(frequencyArray)
        : 1
      
      // 更新音量历史
      this.updateVolumeHistory(volume)
      
      // 检测语音活动
      this.detectSpeechActivity(volume, speechLikelihood)
      
      // 更新状态
      this.updateState(volume)
      
      this.animationFrame = requestAnimationFrame(detect)
    }
    
    detect()
  }

  /**
   * 计算音量
   */
  private calculateVolume(dataArray: Uint8Array): number {
    let sum = 0
    for (let i = 0; i < dataArray.length; i++) {
      const sample = (dataArray[i] - 128) / 128
      sum += sample * sample
    }
    return Math.sqrt(sum / dataArray.length)
  }

  /**
   * 分析语音频率特征
   */
  private analyzeSpeechFrequency(frequencyArray: Uint8Array): number {
    const sampleRate = this.audioContext!.sampleRate
    const binSize = sampleRate / this.config.fftSize
    
    const [minFreq, maxFreq] = this.config.speechFrequencyRange
    const minBin = Math.floor(minFreq / binSize)
    const maxBin = Math.floor(maxFreq / binSize)
    
    let speechEnergy = 0
    let totalEnergy = 0
    
    for (let i = 0; i < frequencyArray.length; i++) {
      const energy = frequencyArray[i] / 255
      totalEnergy += energy
      
      if (i >= minBin && i <= maxBin) {
        speechEnergy += energy
      }
    }
    
    return totalEnergy > 0 ? speechEnergy / totalEnergy : 0
  }

  /**
   * 更新音量历史
   */
  private updateVolumeHistory(volume: number): void {
    this.volumeHistory.push(volume)
    if (this.volumeHistory.length > this.historySize) {
      this.volumeHistory.shift()
    }
  }

  /**
   * 检测语音活动
   */
  private detectSpeechActivity(volume: number, speechLikelihood: number): void {
    const adjustedThreshold = this.config.volumeThreshold * speechLikelihood
    const isSpeechDetected = volume > adjustedThreshold
    
    if (isSpeechDetected && !this.state.isSpeaking) {
      // 检测到语音开始
      this.handleSpeechStart()
    } else if (!isSpeechDetected && this.state.isSpeaking) {
      // 检测到可能的语音结束
      this.handlePossibleSpeechEnd()
    } else if (isSpeechDetected && this.state.isSpeaking) {
      // 继续说话，重置静音计时器
      this.clearSilenceTimer()
    }
  }

  /**
   * 处理语音开始
   */
  private handleSpeechStart(): void {
    this.clearTimers()
    
    // 设置最小说话时长检查
    this.speechTimer = window.setTimeout(() => {
      if (!this.state.isSpeaking) {
        this.state.isSpeaking = true
        this.state.speechStartTime = Date.now()
        this.events.onSpeechStart()
        this.events.onStateChange(this.state)
      }
    }, this.config.debounceTime)
  }

  /**
   * 处理可能的语音结束
   */
  private handlePossibleSpeechEnd(): void {
    if (!this.state.isSpeaking) return
    
    this.clearSilenceTimer()
    
    // 设置静音检测计时器
    this.silenceTimer = window.setTimeout(() => {
      this.handleSpeechEnd()
    }, this.config.maxSilenceDuration)
  }

  /**
   * 处理语音结束
   */
  private handleSpeechEnd(): void {
    if (!this.state.isSpeaking) return
    
    const now = Date.now()
    const speechDuration = this.state.speechStartTime ? now - this.state.speechStartTime : 0
    
    // 检查是否满足最小说话时长
    if (speechDuration >= this.config.minSpeechDuration) {
      this.state.isSpeaking = false
      this.state.speechEndTime = now
      this.state.speechDuration = speechDuration
      
      this.events.onSpeechEnd()
      this.events.onStateChange(this.state)
    }
    
    this.clearTimers()
  }

  /**
   * 更新状态
   */
  private updateState(volume: number): void {
    this.state.currentVolume = volume
    this.state.averageVolume = this.volumeHistory.reduce((a, b) => a + b, 0) / this.volumeHistory.length
    
    if (this.state.isSpeaking && this.state.speechStartTime) {
      this.state.speechDuration = Date.now() - this.state.speechStartTime
    }
    
    this.events.onVolumeChange(volume)
    this.events.onStateChange(this.state)
  }

  /**
   * 清除定时器
   */
  private clearTimers(): void {
    this.clearSpeechTimer()
    this.clearSilenceTimer()
  }

  private clearSpeechTimer(): void {
    if (this.speechTimer) {
      clearTimeout(this.speechTimer)
      this.speechTimer = undefined
    }
  }

  private clearSilenceTimer(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer)
      this.silenceTimer = undefined
    }
  }

  /**
   * 获取当前状态
   */
  getState(): VADState {
    return { ...this.state }
  }

  /**
   * 动态调整阈值
   */
  adjustThreshold(threshold: number): void {
    this.config.volumeThreshold = Math.max(0, Math.min(1, threshold))
  }

  /**
   * 获取平均音量（用于自动校准）
   */
  getAverageVolume(): number {
    return this.state.averageVolume
  }
}

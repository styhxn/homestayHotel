// 🎤 实时语音通话服务
// 提供基于WebRTC的实时语音通话功能

export interface VoiceCallConfig {
  // 音频配置
  sampleRate: number
  channels: number
  bitRate: number
  
  // VAD配置
  vadEnabled: boolean
  vadThreshold: number
  vadDebounceTime: number
  
  // 音频处理配置
  echoCancellation: boolean
  noiseSuppression: boolean
  autoGainControl: boolean
  
  // AI配置
  aiResponseDelay: number
  maxSilenceTime: number
}

export interface VoiceCallState {
  isConnected: boolean
  isRecording: boolean
  isSpeaking: boolean
  isProcessing: boolean
  audioLevel: number
  networkQuality: 'excellent' | 'good' | 'fair' | 'poor'
  error?: string
}

export interface VoiceCallEvents {
  onStateChange: (state: VoiceCallState) => void
  onUserSpeechStart: () => void
  onUserSpeechEnd: (transcript: string) => void
  onAIResponseStart: () => void
  onAIResponseEnd: () => void
  onError: (error: Error) => void
  onAudioLevel: (level: number) => void
}

export class RealTimeVoiceService {
  private config: VoiceCallConfig
  private events: VoiceCallEvents
  private state: VoiceCallState
  
  // WebRTC相关
  private mediaStream?: MediaStream
  private audioContext?: AudioContext
  private analyser?: AnalyserNode
  private processor?: ScriptProcessorNode
  
  // 语音识别相关
  private recognition?: any // SpeechRecognition类型在某些环境下不可用
  private isListening = false
  
  // 语音合成相关
  private speechSynthesis?: SpeechSynthesis
  private currentUtterance?: SpeechSynthesisUtterance
  
  // VAD相关
  private vadProcessor?: AudioWorkletNode
  private silenceTimer?: number
  private speechStartTime?: number
  
  // 音频数据缓冲
  private audioBuffer: Float32Array[] = []
  private isRecordingAudio = false

  constructor(config: Partial<VoiceCallConfig> = {}, events: Partial<VoiceCallEvents> = {}) {
    this.config = {
      sampleRate: 16000,
      channels: 1,
      bitRate: 64000,
      vadEnabled: true,
      vadThreshold: 0.01,
      vadDebounceTime: 300,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      aiResponseDelay: 500,
      maxSilenceTime: 3000,
      ...config
    }
    
    this.events = {
      onStateChange: () => {},
      onUserSpeechStart: () => {},
      onUserSpeechEnd: () => {},
      onAIResponseStart: () => {},
      onAIResponseEnd: () => {},
      onError: () => {},
      onAudioLevel: () => {},
      ...events
    }
    
    this.state = {
      isConnected: false,
      isRecording: false,
      isSpeaking: false,
      isProcessing: false,
      audioLevel: 0,
      networkQuality: 'good'
    }
    
    this.initializeServices()
  }

  /**
   * 初始化语音服务
   */
  private async initializeServices() {
    try {
      // 初始化语音识别
      this.initializeSpeechRecognition()
      
      // 初始化语音合成
      this.initializeSpeechSynthesis()
      
      // 初始化音频上下文
      await this.initializeAudioContext()
      
      console.log('实时语音服务初始化完成')
    } catch (error) {
      console.error('语音服务初始化失败:', error)
      this.handleError(error as Error)
    }
  }

  /**
   * 初始化语音识别
   */
  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      this.recognition = new SpeechRecognition()
      
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = 'zh-CN'
      
      this.recognition.onstart = () => {
        this.isListening = true
        this.updateState({ isRecording: true })
        this.events.onUserSpeechStart()
      }
      
      this.recognition.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        if (finalTranscript) {
          this.handleUserSpeechEnd(finalTranscript)
        }
      }
      
      this.recognition.onerror = (event: any) => {
        console.error('语音识别错误:', event.error)
        this.handleError(new Error(`语音识别错误: ${event.error}`))
      }
      
      this.recognition.onend = () => {
        this.isListening = false
        if (this.state.isRecording && !this.state.isProcessing) {
          // 如果还在通话中，重新开始识别
          setTimeout(() => {
            if (this.state.isConnected && !this.state.isSpeaking) {
              this.startListening()
            }
          }, 100)
        }
      }
    } else {
      throw new Error('浏览器不支持语音识别功能')
    }
  }

  /**
   * 初始化语音合成
   */
  private initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis
    } else {
      throw new Error('浏览器不支持语音合成功能')
    }
  }

  /**
   * 初始化音频上下文
   */
  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }
      
      // 创建分析器节点用于音量检测
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 256
      this.analyser.smoothingTimeConstant = 0.8
      
    } catch (error) {
      throw new Error(`音频上下文初始化失败: ${error}`)
    }
  }

  /**
   * 开始语音通话
   */
  async startVoiceCall(): Promise<void> {
    try {
      // 请求麦克风权限
      await this.requestMicrophoneAccess()
      
      // 开始音频监听
      this.startAudioMonitoring()
      
      // 开始语音识别
      this.startListening()
      
      this.updateState({ isConnected: true })
      
      console.log('语音通话已开始')
    } catch (error) {
      console.error('启动语音通话失败:', error)
      this.handleError(error as Error)
    }
  }

  /**
   * 结束语音通话
   */
  async endVoiceCall(): Promise<void> {
    try {
      // 停止语音识别
      this.stopListening()
      
      // 停止语音合成
      this.stopSpeaking()
      
      // 停止音频监听
      this.stopAudioMonitoring()
      
      // 释放媒体流
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop())
        this.mediaStream = undefined
      }
      
      this.updateState({ 
        isConnected: false, 
        isRecording: false, 
        isSpeaking: false, 
        isProcessing: false 
      })
      
      console.log('语音通话已结束')
    } catch (error) {
      console.error('结束语音通话失败:', error)
      this.handleError(error as Error)
    }
  }

  /**
   * 请求麦克风访问权限
   */
  private async requestMicrophoneAccess(): Promise<void> {
    try {
      const constraints = {
        audio: {
          echoCancellation: this.config.echoCancellation,
          noiseSuppression: this.config.noiseSuppression,
          autoGainControl: this.config.autoGainControl,
          sampleRate: this.config.sampleRate,
          channelCount: this.config.channels
        }
      }
      
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('麦克风访问权限已获取')
    } catch (error) {
      throw new Error(`无法访问麦克风: ${error}`)
    }
  }

  /**
   * 开始音频监听
   */
  private startAudioMonitoring(): void {
    if (!this.audioContext || !this.analyser || !this.mediaStream) return
    
    const source = this.audioContext.createMediaStreamSource(this.mediaStream)
    source.connect(this.analyser)
    
    // 开始音量检测
    this.startVolumeDetection()
  }

  /**
   * 停止音频监听
   */
  private stopAudioMonitoring(): void {
    if (this.processor) {
      this.processor.disconnect()
      this.processor = undefined
    }
  }

  /**
   * 开始音量检测
   */
  private startVolumeDetection(): void {
    if (!this.analyser) return
    
    const bufferLength = this.analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const detectVolume = () => {
      if (!this.state.isConnected) return
      
      this.analyser!.getByteFrequencyData(dataArray)
      
      // 计算平均音量
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      const average = sum / bufferLength
      const normalizedLevel = average / 255
      
      this.updateState({ audioLevel: normalizedLevel })
      this.events.onAudioLevel(normalizedLevel)
      
      requestAnimationFrame(detectVolume)
    }
    
    detectVolume()
  }

  /**
   * AI语音回复
   */
  async speakAIResponse(text: string): Promise<void> {
    if (!this.speechSynthesis || !text.trim()) return

    try {
      this.updateState({ isSpeaking: true, isProcessing: true })
      this.events.onAIResponseStart()

      // 清理文本
      const cleanText = this.cleanTextForSpeech(text)

      await this.synthesizeSpeech(cleanText)

      this.updateState({ isSpeaking: false, isProcessing: false })
      this.events.onAIResponseEnd()

      // AI说完后，重新开始监听用户
      if (this.state.isConnected) {
        setTimeout(() => {
          this.startListening()
        }, this.config.aiResponseDelay)
      }

    } catch (error) {
      console.error('AI语音回复失败:', error)
      this.handleError(error as Error)
    }
  }

  /**
   * 语音合成
   */
  private synthesizeSpeech(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.speechSynthesis) {
        reject(new Error('语音合成不可用'))
        return
      }

      // 停止当前播放
      this.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // 配置语音参数（少年音色）
      utterance.lang = 'zh-CN'
      utterance.rate = 1.1
      utterance.pitch = 1.3
      utterance.volume = 0.8

      // 尝试使用更好的中文语音
      const voices = this.speechSynthesis.getVoices()
      const chineseVoice = voices.find(voice =>
        voice.lang.includes('zh') && voice.name.includes('Xiaoxiao')
      ) || voices.find(voice => voice.lang.includes('zh'))

      if (chineseVoice) {
        utterance.voice = chineseVoice
      }

      utterance.onstart = () => {
        console.log('AI开始说话')
      }

      utterance.onend = () => {
        console.log('AI说话结束')
        resolve()
      }

      utterance.onerror = (event) => {
        console.error('语音合成错误:', event.error)
        reject(new Error(`语音合成错误: ${event.error}`))
      }

      this.currentUtterance = utterance
      this.speechSynthesis.speak(utterance)
    })
  }

  /**
   * 清理文本用于语音合成
   */
  private cleanTextForSpeech(text: string): string {
    return text
      .replace(/🍄|🧭|🏡|📅|🍽️|☕|🌿|🎤|🗺️|💰|⭐|📍|😊|😄|🤔/g, '') // 移除emoji
      .replace(/\*\*(.*?)\*\*/g, '$1') // 移除markdown粗体
      .replace(/\n/g, ' ') // 换行替换为空格
      .replace(/\s+/g, ' ') // 多个空格合并
      .trim()
  }

  /**
   * 暂停语音通话
   */
  pauseVoiceCall(): void {
    this.stopListening()
    this.stopSpeaking()
    this.updateState({ isRecording: false, isSpeaking: false })
  }

  /**
   * 恢复语音通话
   */
  resumeVoiceCall(): void {
    if (this.state.isConnected && !this.state.isSpeaking) {
      this.startListening()
    }
  }

  /**
   * 获取当前状态
   */
  getState(): VoiceCallState {
    return { ...this.state }
  }

  /**
   * 检查浏览器支持
   */
  static checkBrowserSupport(): {
    speechRecognition: boolean
    speechSynthesis: boolean
    mediaDevices: boolean
    audioContext: boolean
  } {
    return {
      speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      speechSynthesis: 'speechSynthesis' in window,
      mediaDevices: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      audioContext: 'AudioContext' in window || 'webkitAudioContext' in window
    }
  }

  /**
   * 设置音量阈值
   */
  setVolumeThreshold(threshold: number): void {
    this.config.vadThreshold = Math.max(0, Math.min(1, threshold))
  }

  /**
   * 获取音频设备列表
   */
  async getAudioDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      return devices.filter(device => device.kind === 'audioinput')
    } catch (error) {
      console.error('获取音频设备失败:', error)
      return []
    }
  }

  /**
   * 切换音频设备
   */
  async switchAudioDevice(deviceId: string): Promise<void> {
    try {
      // 停止当前流
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop())
      }

      // 使用新设备创建流
      const constraints = {
        audio: {
          deviceId: { exact: deviceId },
          echoCancellation: this.config.echoCancellation,
          noiseSuppression: this.config.noiseSuppression,
          autoGainControl: this.config.autoGainControl
        }
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

      // 重新连接音频监听
      if (this.state.isConnected) {
        this.startAudioMonitoring()
      }

      console.log('音频设备切换成功')
    } catch (error) {
      console.error('切换音频设备失败:', error)
      this.handleError(error as Error)
    }
  }

  private updateState(newState: Partial<VoiceCallState>): void {
    this.state = { ...this.state, ...newState }
    this.events.onStateChange(this.state)
  }

  private handleError(error: Error): void {
    this.updateState({ error: error.message })
    this.events.onError(error)
  }

  private handleUserSpeechEnd(transcript: string): void {
    this.updateState({ isProcessing: true })
    this.events.onUserSpeechEnd(transcript)
  }

  private startListening(): void {
    if (this.recognition && !this.isListening && !this.state.isSpeaking) {
      try {
        this.recognition.start()
      } catch (error) {
        console.error('启动语音识别失败:', error)
      }
    }
  }

  private stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  private stopSpeaking(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel()
    }
    if (this.currentUtterance) {
      this.currentUtterance = undefined
    }
  }
}

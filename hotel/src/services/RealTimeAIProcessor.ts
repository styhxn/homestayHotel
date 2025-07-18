// 🤖 实时AI语音对话处理器
// 集成Dify AI服务，处理连续的语音对话

import { difyChatService } from './DifyChatService'

export interface AIProcessorConfig {
  // AI响应配置
  maxResponseTime: number
  responseTimeout: number
  retryAttempts: number
  
  // 对话管理
  contextWindow: number
  maxConversationLength: number
  
  // 语音合成配置
  voiceRate: number
  voicePitch: number
  voiceVolume: number
  preferredVoice?: string
  
  // 智能功能
  enableContextAwareness: boolean
  enableEmotionDetection: boolean
  enableInterruption: boolean
}

export interface ConversationTurn {
  id: string
  timestamp: number
  userInput: string
  aiResponse: string
  processingTime: number
  confidence?: number
  emotion?: string
}

export interface AIProcessorState {
  isProcessing: boolean
  isSpeaking: boolean
  currentTurn?: ConversationTurn
  conversationHistory: ConversationTurn[]
  totalTurns: number
  averageResponseTime: number
  error?: string
}

export interface AIProcessorEvents {
  onProcessingStart: (userInput: string) => void
  onProcessingComplete: (response: string, turn: ConversationTurn) => void
  onSpeechStart: (text: string) => void
  onSpeechComplete: () => void
  onError: (error: Error) => void
  onStateChange: (state: AIProcessorState) => void
}

export class RealTimeAIProcessor {
  private config: AIProcessorConfig
  private events: AIProcessorEvents
  private state: AIProcessorState
  
  // 语音合成相关
  private speechSynthesis?: SpeechSynthesis
  private currentUtterance?: SpeechSynthesisUtterance
  private availableVoices: SpeechSynthesisVoice[] = []
  
  // 对话管理
  private conversationId?: string
  private processingQueue: string[] = []
  private isInterrupted = false
  
  // 性能监控
  private responseTimeHistory: number[] = []
  private readonly maxHistorySize = 20

  constructor(config: Partial<AIProcessorConfig> = {}, events: Partial<AIProcessorEvents> = {}) {
    this.config = {
      maxResponseTime: 10000,
      responseTimeout: 15000,
      retryAttempts: 3,
      contextWindow: 10,
      maxConversationLength: 50,
      voiceRate: 1.1,
      voicePitch: 1.3,
      voiceVolume: 0.8,
      enableContextAwareness: true,
      enableEmotionDetection: false,
      enableInterruption: true,
      ...config
    }
    
    this.events = {
      onProcessingStart: () => {},
      onProcessingComplete: () => {},
      onSpeechStart: () => {},
      onSpeechComplete: () => {},
      onError: () => {},
      onStateChange: () => {},
      ...events
    }
    
    this.state = {
      isProcessing: false,
      isSpeaking: false,
      conversationHistory: [],
      totalTurns: 0,
      averageResponseTime: 0
    }
    
    this.initialize()
  }

  /**
   * 初始化处理器
   */
  private async initialize(): Promise<void> {
    try {
      // 初始化语音合成
      this.initializeSpeechSynthesis()
      
      // 获取Dify会话ID
      this.conversationId = difyChatService.getConversationId() || undefined
      
      console.log('实时AI处理器初始化完成')
    } catch (error) {
      console.error('AI处理器初始化失败:', error)
      this.handleError(error as Error)
    }
  }

  /**
   * 初始化语音合成
   */
  private initializeSpeechSynthesis(): void {
    if ('speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis
      
      // 加载可用语音
      const loadVoices = () => {
        this.availableVoices = this.speechSynthesis!.getVoices()
        console.log('可用语音数量:', this.availableVoices.length)
      }
      
      if (this.speechSynthesis.getVoices().length > 0) {
        loadVoices()
      } else {
        this.speechSynthesis.onvoiceschanged = loadVoices
      }
    } else {
      throw new Error('浏览器不支持语音合成')
    }
  }

  /**
   * 处理用户语音输入
   */
  async processUserInput(userInput: string): Promise<void> {
    if (!userInput.trim()) return
    
    try {
      // 如果正在说话且支持打断，则停止当前语音
      if (this.state.isSpeaking && this.config.enableInterruption) {
        this.interruptSpeech()
      }
      
      // 添加到处理队列
      this.processingQueue.push(userInput)
      
      // 如果当前没有在处理，开始处理
      if (!this.state.isProcessing) {
        await this.processQueue()
      }
      
    } catch (error) {
      console.error('处理用户输入失败:', error)
      this.handleError(error as Error)
    }
  }

  /**
   * 处理队列
   */
  private async processQueue(): Promise<void> {
    while (this.processingQueue.length > 0) {
      const userInput = this.processingQueue.shift()!
      await this.processSingleInput(userInput)
    }
  }

  /**
   * 处理单个输入
   */
  private async processSingleInput(userInput: string): Promise<void> {
    const startTime = Date.now()
    const turnId = `turn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      this.updateState({ isProcessing: true })
      this.events.onProcessingStart(userInput)
      
      // 获取AI回复
      const aiResponse = await this.getAIResponse(userInput)
      
      const processingTime = Date.now() - startTime
      
      // 创建对话轮次记录
      const turn: ConversationTurn = {
        id: turnId,
        timestamp: startTime,
        userInput,
        aiResponse,
        processingTime
      }
      
      // 更新对话历史
      this.updateConversationHistory(turn)
      
      // 更新性能统计
      this.updatePerformanceStats(processingTime)
      
      this.updateState({ 
        isProcessing: false, 
        currentTurn: turn 
      })
      
      this.events.onProcessingComplete(aiResponse, turn)
      
      // 开始语音合成
      await this.speakResponse(aiResponse)
      
    } catch (error) {
      console.error('处理输入失败:', error)
      this.updateState({ isProcessing: false })
      this.handleError(error as Error)
      
      // 提供错误回复
      const errorResponse = '抱歉，我暂时无法理解您的问题，请稍后再试。'
      await this.speakResponse(errorResponse)
    }
  }

  /**
   * 获取AI回复
   */
  private async getAIResponse(userInput: string): Promise<string> {
    try {
      // 构建上下文感知的输入
      const contextualInput = this.config.enableContextAwareness 
        ? this.buildContextualInput(userInput)
        : userInput
      
      // 调用Dify AI服务
      const stream = await difyChatService.sendMessage(contextualInput)
      let fullResponse = ''
      
      // 处理流式响应
      for await (const chunk of difyChatService.processStreamResponse(stream)) {
        fullResponse += chunk
        
        // 检查是否被中断
        if (this.isInterrupted) {
          this.isInterrupted = false
          throw new Error('AI处理被中断')
        }
      }
      
      if (!fullResponse.trim()) {
        throw new Error('AI返回空响应')
      }
      
      return fullResponse.trim()
      
    } catch (error) {
      console.error('获取AI回复失败:', error)
      
      // 降级到本地回复
      return this.generateFallbackResponse(userInput)
    }
  }

  /**
   * 构建上下文感知输入
   */
  private buildContextualInput(userInput: string): string {
    if (this.state.conversationHistory.length === 0) {
      return userInput
    }
    
    // 获取最近的对话上下文
    const recentHistory = this.state.conversationHistory
      .slice(-this.config.contextWindow)
      .map(turn => `用户: ${turn.userInput}\nAI: ${turn.aiResponse}`)
      .join('\n\n')
    
    return `对话历史:\n${recentHistory}\n\n当前用户输入: ${userInput}`
  }

  /**
   * 生成降级回复
   */
  private generateFallbackResponse(userInput: string): string {
    const fallbackResponses = [
      '我理解您的问题，让我为您详细解答...',
      '这是一个很好的问题，根据我的了解...',
      '感谢您的咨询，我的建议是...',
      '基于您提供的信息，我认为...'
    ]
    
    // 简单的关键词匹配
    if (userInput.includes('房间') || userInput.includes('住宿')) {
      return '我们有多种房型可供选择，包括标准间、豪华间和套房。每个房间都配备了现代化设施，让您享受舒适的住宿体验。'
    }
    
    if (userInput.includes('价格') || userInput.includes('费用')) {
      return '我们的房间价格根据房型和季节有所不同。标准间价格实惠，豪华间设施更完善。具体价格请查看房间详情页面。'
    }
    
    if (userInput.includes('预订') || userInput.includes('订房')) {
      return '预订房间很简单！您可以选择心仪的房间，填写入住信息，然后确认预订。我们支持多种支付方式。'
    }
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
  }

  /**
   * 语音合成回复
   */
  private async speakResponse(text: string): Promise<void> {
    if (!this.speechSynthesis || !text.trim()) return
    
    try {
      this.updateState({ isSpeaking: true })
      this.events.onSpeechStart(text)
      
      // 清理文本
      const cleanText = this.cleanTextForSpeech(text)
      
      await this.synthesizeSpeech(cleanText)
      
      this.updateState({ isSpeaking: false })
      this.events.onSpeechComplete()
      
    } catch (error) {
      console.error('语音合成失败:', error)
      this.updateState({ isSpeaking: false })
      this.handleError(error as Error)
    }
  }

  /**
   * 执行语音合成
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
      
      // 配置语音参数
      utterance.lang = 'zh-CN'
      utterance.rate = this.config.voiceRate
      utterance.pitch = this.config.voicePitch
      utterance.volume = this.config.voiceVolume
      
      // 选择最佳语音
      const bestVoice = this.selectBestVoice()
      if (bestVoice) {
        utterance.voice = bestVoice
      }
      
      utterance.onstart = () => {
        console.log('AI开始说话')
      }
      
      utterance.onend = () => {
        console.log('AI说话结束')
        this.currentUtterance = undefined
        resolve()
      }
      
      utterance.onerror = (event) => {
        console.error('语音合成错误:', event.error)
        this.currentUtterance = undefined
        reject(new Error(`语音合成错误: ${event.error}`))
      }
      
      this.currentUtterance = utterance
      this.speechSynthesis.speak(utterance)
    })
  }

  /**
   * 选择最佳语音
   */
  private selectBestVoice(): SpeechSynthesisVoice | null {
    if (this.availableVoices.length === 0) return null
    
    // 优先选择指定的语音
    if (this.config.preferredVoice) {
      const preferred = this.availableVoices.find(voice => 
        voice.name.includes(this.config.preferredVoice!)
      )
      if (preferred) return preferred
    }
    
    // 选择中文语音，优先选择女声或少年音
    const chineseVoices = this.availableVoices.filter(voice => 
      voice.lang.includes('zh')
    )
    
    if (chineseVoices.length > 0) {
      // 优先选择Xiaoxiao（少年音）
      const xiaoxiao = chineseVoices.find(voice => 
        voice.name.includes('Xiaoxiao')
      )
      if (xiaoxiao) return xiaoxiao
      
      // 其次选择女声
      const female = chineseVoices.find(voice => 
        voice.name.includes('Female') || voice.name.includes('女')
      )
      if (female) return female
      
      // 返回第一个中文语音
      return chineseVoices[0]
    }
    
    return null
  }

  /**
   * 清理文本用于语音合成
   */
  private cleanTextForSpeech(text: string): string {
    return text
      .replace(/🍄|🧭|🏡|📅|🍽️|☕|🌿|🎤|🗺️|💰|⭐|📍|😊|😄|🤔/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * 中断当前语音
   */
  interruptSpeech(): void {
    if (this.speechSynthesis && this.state.isSpeaking) {
      this.speechSynthesis.cancel()
      this.currentUtterance = undefined
      this.updateState({ isSpeaking: false })
      this.isInterrupted = true
      console.log('语音播放被中断')
    }
  }

  /**
   * 更新对话历史
   */
  private updateConversationHistory(turn: ConversationTurn): void {
    this.state.conversationHistory.push(turn)
    this.state.totalTurns++
    
    // 限制历史长度
    if (this.state.conversationHistory.length > this.config.maxConversationLength) {
      this.state.conversationHistory.shift()
    }
  }

  /**
   * 更新性能统计
   */
  private updatePerformanceStats(responseTime: number): void {
    this.responseTimeHistory.push(responseTime)
    
    if (this.responseTimeHistory.length > this.maxHistorySize) {
      this.responseTimeHistory.shift()
    }
    
    this.state.averageResponseTime = this.responseTimeHistory.reduce((a, b) => a + b, 0) / this.responseTimeHistory.length
  }

  /**
   * 更新状态
   */
  private updateState(newState: Partial<AIProcessorState>): void {
    this.state = { ...this.state, ...newState }
    this.events.onStateChange(this.state)
  }

  /**
   * 处理错误
   */
  private handleError(error: Error): void {
    this.updateState({ error: error.message })
    this.events.onError(error)
  }

  /**
   * 获取当前状态
   */
  getState(): AIProcessorState {
    return { ...this.state }
  }

  /**
   * 清除对话历史
   */
  clearHistory(): void {
    this.state.conversationHistory = []
    this.state.totalTurns = 0
    this.responseTimeHistory = []
    this.state.averageResponseTime = 0
    this.updateState({})
  }

  /**
   * 销毁处理器
   */
  destroy(): void {
    this.interruptSpeech()
    this.processingQueue = []
    this.clearHistory()
  }
}

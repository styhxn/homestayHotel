// 🤖 AI数字人配置文件

export interface DigitalHumanConfig {
  // 数字人平台配置
  provider: 'did' | 'heygen' | 'custom'
  apiKey: string
  baseURL?: string
  
  // 数字人形象配置
  avatarUrl?: string
  avatarId?: string
  
  // 语音配置
  voiceId: string
  voiceProvider: 'microsoft' | 'google' | 'baidu' | 'custom'
  
  // AI对话配置
  aiProvider: 'openai' | 'claude' | 'baidu' | 'custom'
  aiApiKey: string
  aiModel?: string
  
  // 语音识别配置
  asrProvider: 'web' | 'baidu' | 'google' | 'custom'
  asrApiKey?: string
  
  // 功能开关
  features: {
    voiceInput: boolean
    textInput: boolean
    videoOutput: boolean
    audioOutput: boolean
  }
  
  // 性能配置
  performance: {
    maxVideoLength: number // 秒
    videoQuality: 'low' | 'medium' | 'high'
    cacheEnabled: boolean
    preloadCommonResponses: boolean
  }
}

// 默认配置
export const defaultConfig: DigitalHumanConfig = {
  // 数字人平台 - 推荐使用D-ID
  provider: 'did',
  apiKey: import.meta.env.VUE_APP_DIGITAL_HUMAN_API_KEY || '',
  baseURL: 'https://api.d-id.com',
  
  // 数字人形象 - 使用普普正面IP形象
  avatarUrl: '/src/assets/images/IP形象/普普正面.png',
  
  // 语音配置 - 中文女声
  voiceId: 'zh-CN-XiaoxiaoNeural',
  voiceProvider: 'microsoft',
  
  // AI对话配置
  aiProvider: 'openai',
  aiApiKey: import.meta.env.VUE_APP_OPENAI_API_KEY || '',
  aiModel: 'gpt-3.5-turbo',
  
  // 语音识别配置
  asrProvider: 'web', // 使用浏览器内置语音识别
  
  // 功能开关
  features: {
    voiceInput: true,
    textInput: true,
    videoOutput: true,
    audioOutput: true
  },
  
  // 性能配置
  performance: {
    maxVideoLength: 30,
    videoQuality: 'medium',
    cacheEnabled: true,
    preloadCommonResponses: true
  }
}

// 蘑菇庄园专用配置 - 普普AI助手
export const mushroomGardenConfig: DigitalHumanConfig = {
  ...defaultConfig,

  // 使用普普IP形象
  avatarUrl: '/src/assets/images/IP形象/普普正面.png',

  // 针对普普角色优化的语音
  voiceId: 'zh-CN-XiaoxiaoNeural', // 温和亲切的女声，适合普普角色

  // 性能优化
  performance: {
    ...defaultConfig.performance,
    preloadCommonResponses: true, // 预加载常见问题的回复
    cacheEnabled: true
  }
}

// 普普AI助手常见问题预设回复
export const commonResponses = {
  greeting: '您好！欢迎来到普洱蘑菇庄园🍄！我是普普，您的专属AI小助手，很高兴为您服务。我可以帮您了解庄园信息、预订民宿、推荐茶艺体验等。有什么可以帮助您的吗？',

  roomTypes: '我们庄园有六种特色房型：🍄蘑菇森林小屋(201号)¥350/晚 - 茶园景观含早餐；☁️云雾山景房(202号)¥380/晚 - 山景阳台含早餐；🍵普洱茶香阁(203号)¥280/晚 - 茶具套装；🏞️湖畔小筑(206号)¥428/晚 - 湖景阳台垂钓设备。每种都有独特的茶文化体验！',

  booking: '预订很简单！您可以直接告诉我您的入住时间和人数，我来帮您查看可用房间和最优价格。确认后我会为您生成茶艺体验优惠码哦～',

  activities: '庄园提供丰富的茶文化体验：🍵茶艺课程学习、🌱采茶体验活动、🍄蘑菇森林探索、🏞️湖边垂钓休闲、🌅茶园日出观赏等。让您充分感受普洱茶文化的魅力！',

  location: '我们位于美丽的普洱市，庄园坐落在原生态茶园中，空气清新，茶香阵阵，是体验茶文化和享受自然的完美之地。',

  contact: '如需更多帮助，您可以随时在这里找到我普普！我24小时在线为您服务，让您的普洱蘑菇庄园之旅更加完美！🍵✨'
}

// API端点配置
export const apiEndpoints = {
  did: {
    createTalk: '/talks',
    getTalkStatus: (id: string) => `/talks/${id}`,
    getCredits: '/credits'
  },
  
  heygen: {
    generateVideo: '/v2/video/generate',
    getVideoStatus: '/v2/video_status',
    getAvatars: '/v2/avatars'
  },
  
  openai: {
    chat: '/v1/chat/completions',
    models: '/v1/models'
  },
  
  baidu: {
    token: '/oauth/2.0/token',
    ernie: '/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant',
    asr: '/server_api',
    tts: '/synthesis'
  }
}

// 错误处理配置
export const errorMessages = {
  networkError: '网络连接失败，请检查您的网络设置',
  apiKeyError: 'API密钥无效，请联系管理员',
  quotaExceeded: '今日使用次数已达上限，请明天再试',
  videoGenerationFailed: '数字人视频生成失败，将使用文字回复',
  speechRecognitionFailed: '语音识别失败，请重新录音或使用文字输入',
  aiResponseFailed: 'AI服务暂时不可用，请稍后重试'
}

// 使用示例配置
export const getConfig = (environment: 'development' | 'production' = 'development'): DigitalHumanConfig => {
  if (environment === 'production') {
    return {
      ...mushroomGardenConfig,
      // 生产环境的特殊配置
      performance: {
        ...mushroomGardenConfig.performance,
        videoQuality: 'high',
        cacheEnabled: true
      }
    }
  }
  
  return {
    ...mushroomGardenConfig,
    // 开发环境的特殊配置
    performance: {
      ...mushroomGardenConfig.performance,
      videoQuality: 'medium',
      cacheEnabled: false // 开发时不缓存，便于调试
    }
  }
}

// 验证配置
export const validateConfig = (config: DigitalHumanConfig): boolean => {
  const requiredFields = ['provider', 'apiKey', 'voiceId', 'aiProvider', 'aiApiKey']
  
  for (const field of requiredFields) {
    if (!config[field as keyof DigitalHumanConfig]) {
      console.error(`数字人配置错误：缺少必需字段 ${field}`)
      return false
    }
  }
  
  return true
}

// 导出配置管理器
export class DigitalHumanConfigManager {
  private config: DigitalHumanConfig
  
  constructor(customConfig?: Partial<DigitalHumanConfig>) {
    this.config = {
      ...getConfig(),
      ...customConfig
    }
    
    if (!validateConfig(this.config)) {
      throw new Error('数字人配置验证失败')
    }
  }
  
  getConfig(): DigitalHumanConfig {
    return { ...this.config }
  }
  
  updateConfig(updates: Partial<DigitalHumanConfig>): void {
    this.config = { ...this.config, ...updates }
    
    if (!validateConfig(this.config)) {
      throw new Error('配置更新失败：验证不通过')
    }
  }
  
  isFeatureEnabled(feature: keyof DigitalHumanConfig['features']): boolean {
    return this.config.features[feature]
  }
  
  getApiEndpoint(provider: string, endpoint: string): string {
    const endpoints = apiEndpoints[provider as keyof typeof apiEndpoints]
    if (!endpoints) {
      throw new Error(`不支持的API提供商：${provider}`)
    }
    
    return `${this.config.baseURL}${endpoints[endpoint as keyof typeof endpoints]}`
  }
}

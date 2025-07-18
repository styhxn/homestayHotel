// 🧠 智能AI对话服务

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface AIResponse {
  text: string
  confidence: number
  intent: string
  suggestions: string[]
  emotion: 'happy' | 'excited' | 'helpful' | 'concerned' | 'neutral'
}

export class IntelligentAIService {
  private apiKey: string
  private baseURL: string
  private conversationHistory: AIMessage[] = []
  private userProfile: any = {}
  
  constructor(apiKey: string, baseURL: string = 'https://api.openai.com/v1') {
    this.apiKey = apiKey
    this.baseURL = baseURL
    this.initializeSystemPrompt()
  }

  private initializeSystemPrompt() {
    const systemPrompt = `你是普洱蘑菇庄园的AI助手"小蘑菇"，具有以下特点：

🍄 角色设定：
- 名字：小蘑菇
- 性格：友善、可爱、专业、热情
- 专长：蘑菇知识、生态旅游、普洱茶文化、民宿服务

🏡 庄园信息：
- 位置：云南普洱市，原生态森林中
- 特色：蘑菇主题生态度假村
- 民宿类型：蘑菇森林小屋(388元/晚)、普洱茶香木屋(288元/晚)、生态庄园别墅(688元/晚)
- 体验活动：蘑菇采摘、茶艺学习、森林徒步、篝火晚会、有机农场参观

🎯 服务原则：
1. 始终保持友善和专业
2. 提供准确的庄园信息
3. 根据用户需求推荐合适的服务
4. 使用表情符号增加亲和力
5. 主动询问用户需求细节
6. 提供实用的建议和提示

💬 对话风格：
- 使用"🍄"等相关表情符号
- 语言温暖亲切，不过分正式
- 适当使用"呢"、"哦"、"～"等语气词
- 根据用户情绪调整回复风格

请始终以小蘑菇的身份回答问题，提供有用、准确、友善的服务。`

    this.conversationHistory = [{
      role: 'system',
      content: systemPrompt,
      timestamp: new Date()
    }]
  }

  async getIntelligentResponse(userMessage: string): Promise<AIResponse> {
    try {
      // 分析用户意图
      const intent = this.analyzeIntent(userMessage)
      
      // 更新用户画像
      this.updateUserProfile(userMessage, intent)
      
      // 添加用户消息到历史
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      })

      // 调用AI API获取回复
      const aiText = await this.callAIAPI(userMessage)
      
      // 添加AI回复到历史
      this.conversationHistory.push({
        role: 'assistant',
        content: aiText,
        timestamp: new Date()
      })

      // 生成智能建议
      const suggestions = this.generateSuggestions(intent, aiText)
      
      // 分析情感
      const emotion = this.analyzeEmotion(userMessage, aiText)

      return {
        text: aiText,
        confidence: 0.9,
        intent,
        suggestions,
        emotion
      }

    } catch (error) {
      console.error('AI服务错误:', error)
      return this.getFallbackResponse(userMessage)
    }
  }

  private async callAIAPI(message: string): Promise<string> {
    // 如果有真实API密钥，调用OpenAI API
    if (this.apiKey && this.apiKey !== 'your-api-key') {
      return await this.callOpenAI(message)
    }
    
    // 否则使用本地智能回复
    return this.getLocalIntelligentResponse(message)
  }

  private async callOpenAI(message: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: this.conversationHistory.slice(-10), // 保留最近10条消息
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API错误: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  private getLocalIntelligentResponse(message: string): string {
    const intent = this.analyzeIntent(message)
    const context = this.getConversationContext()
    
    // 基于意图和上下文生成智能回复
    const responses = this.getContextualResponses(intent, message, context)
    
    // 选择最合适的回复
    return this.selectBestResponse(responses, message)
  }

  private analyzeIntent(message: string): string {
    const intents = {
      booking: ['预订', '预约', '订房', '入住', '房间', '价格', '费用', '多少钱'],
      activities: ['活动', '体验', '采摘', '茶艺', '徒步', '娱乐', '玩', '做什么'],
      food: ['美食', '餐厅', '吃', '料理', '菜品', '特色', '饭'],
      location: ['位置', '地址', '路线', '交通', '怎么去', '在哪', '远吗'],
      facilities: ['设施', '服务', 'wifi', '停车', '游泳池', '健身'],
      weather: ['天气', '气候', '温度', '下雨', '穿什么'],
      recommendation: ['推荐', '建议', '哪个好', '选择', '适合'],
      greeting: ['你好', '您好', 'hello', 'hi', '早上好', '晚上好'],
      thanks: ['谢谢', '感谢', 'thanks', '太好了', '很棒'],
      complaint: ['问题', '不满', '投诉', '差', '不好'],
      emergency: ['紧急', '急救', '医院', '报警', '帮助']
    }

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return intent
      }
    }

    return 'general'
  }

  private updateUserProfile(message: string, intent: string) {
    // 更新用户兴趣和偏好
    if (!this.userProfile.interests) {
      this.userProfile.interests = {}
    }
    
    this.userProfile.interests[intent] = (this.userProfile.interests[intent] || 0) + 1
    this.userProfile.lastIntent = intent
    this.userProfile.messageCount = (this.userProfile.messageCount || 0) + 1
    
    // 分析用户类型
    if (intent === 'activities' && this.userProfile.interests.activities > 2) {
      this.userProfile.type = 'adventure_seeker'
    } else if (intent === 'food' && this.userProfile.interests.food > 2) {
      this.userProfile.type = 'foodie'
    } else if (intent === 'booking' && this.userProfile.interests.booking > 1) {
      this.userProfile.type = 'ready_to_book'
    }
  }

  private getConversationContext(): any {
    const recentMessages = this.conversationHistory.slice(-5)
    const topics = recentMessages.map(msg => this.analyzeIntent(msg.content))
    
    return {
      recentTopics: topics,
      conversationLength: this.conversationHistory.length,
      userType: this.userProfile.type,
      dominantInterest: this.getDominantInterest()
    }
  }

  private getDominantInterest(): string {
    if (!this.userProfile.interests) return 'general'
    
    return Object.entries(this.userProfile.interests)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'general'
  }

  private getContextualResponses(intent: string, message: string, context: any): string[] {
    const baseResponses = {
      booking: [
        '🏡 我来为您推荐最适合的民宿！根据您的需求，我建议...',
        '📅 让我查看一下可用的房间和日期，请稍等...',
        '💰 我们的价格很有竞争力，而且包含丰富的体验活动呢！'
      ],
      activities: [
        '🍄 我们的体验活动超级丰富！最受欢迎的是蘑菇采摘...',
        '🌲 如果您喜欢户外活动，我推荐森林徒步和生态探索...',
        '🍵 普洱茶文化体验也很棒，可以学到很多茶艺知识！'
      ],
      greeting: [
        '🍄 您好！我是小蘑菇，很高兴为您服务！',
        '🌿 欢迎来到普洱蘑菇庄园！有什么可以帮您的吗？',
        '🍵 您好呀！准备来我们庄园体验生态之美吗？'
      ]
    }

    let responses = baseResponses[intent as keyof typeof baseResponses] || [
      '🍄 这个问题很有趣！让我为您详细解答...',
      '🌿 我很乐意帮助您！请告诉我更多细节...'
    ]

    // 根据用户类型调整回复
    if (context.userType === 'ready_to_book') {
      responses = responses.map(r => r + ' 我可以直接帮您预订哦！')
    } else if (context.userType === 'adventure_seeker') {
      responses = responses.map(r => r + ' 我们有很多刺激的户外活动！')
    }

    return responses
  }

  private selectBestResponse(responses: string[], message: string): string {
    // 简单的响应选择逻辑，可以根据需要扩展
    return responses[Math.floor(Math.random() * responses.length)]
  }

  private generateSuggestions(intent: string, aiResponse: string): string[] {
    const suggestionMap = {
      booking: ['📅 查看可用日期', '💰 了解价格详情', '🎁 查看优惠活动', '📞 联系客服'],
      activities: ['🍄 蘑菇采摘详情', '🍵 茶艺体验', '🌲 森林徒步', '🔥 篝火晚会'],
      food: ['🍽️ 查看菜单', '🍄 蘑菇料理', '🍵 品茶体验', '🥗 素食选择'],
      location: ['🗺️ 详细路线', '🚗 交通方式', '📍 周边景点', '🏨 接送服务']
    }

    return suggestionMap[intent as keyof typeof suggestionMap] || [
      '🔍 了解更多', '💬 继续咨询', '📞 联系客服', '🎯 其他推荐'
    ]
  }

  private analyzeEmotion(userMessage: string, aiResponse: string): 'happy' | 'excited' | 'helpful' | 'concerned' | 'neutral' {
    if (userMessage.includes('谢谢') || userMessage.includes('太好了')) {
      return 'happy'
    } else if (userMessage.includes('问题') || userMessage.includes('不好')) {
      return 'concerned'
    } else if (userMessage.includes('推荐') || userMessage.includes('建议')) {
      return 'helpful'
    } else if (userMessage.includes('活动') || userMessage.includes('体验')) {
      return 'excited'
    }
    
    return 'neutral'
  }

  private getFallbackResponse(message: string): AIResponse {
    return {
      text: '🍄 抱歉，我遇到了一些技术问题。不过别担心，我还是很乐意帮助您！您可以尝试重新表述问题，或者直接告诉我您想了解什么？',
      confidence: 0.5,
      intent: 'error',
      suggestions: ['🔄 重新提问', '📞 联系客服', '💬 简化问题', '🏠 返回首页'],
      emotion: 'concerned'
    }
  }

  // 获取对话统计
  getConversationStats() {
    return {
      messageCount: this.conversationHistory.length,
      userProfile: this.userProfile,
      dominantInterest: this.getDominantInterest()
    }
  }

  // 重置对话
  resetConversation() {
    this.conversationHistory = []
    this.userProfile = {}
    this.initializeSystemPrompt()
  }

  // 导出对话历史
  exportConversation() {
    return {
      history: this.conversationHistory,
      profile: this.userProfile,
      timestamp: new Date()
    }
  }
}

// 创建单例实例
export const intelligentAI = new IntelligentAIService(
  import.meta.env.VUE_APP_OPENAI_API_KEY || 'your-api-key'
)

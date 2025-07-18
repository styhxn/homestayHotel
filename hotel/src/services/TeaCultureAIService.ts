// 🍃 AI茶文化助手服务

export interface TeaInfo {
  id: string
  name: string
  type: 'raw' | 'ripe' | 'ancient' | 'terrace'
  origin: string
  year?: number
  characteristics: string[]
  brewingTemp: number
  brewingTime: number[]
  description: string
  culturalStory: string
  healthBenefits: string[]
  price?: number
  image?: string
}

export interface BrewingStep {
  step: number
  title: string
  description: string
  duration: number
  temperature: number
  tips: string[]
  image?: string
}

export interface TeaRecognitionResult {
  confidence: number
  teaInfo: TeaInfo
  suggestions: string[]
  culturalContext: string
}

export interface BrewingGuide {
  teaType: string
  steps: BrewingStep[]
  totalTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  culturalNotes: string[]
}

export interface AIResponse {
  text: string
  confidence: number
  intent: string
  suggestions: string[]
  emotion: 'wise' | 'enthusiastic' | 'patient' | 'knowledgeable'
  culturalInsight?: string
}

export class TeaCultureAIService {
  private apiKey: string
  private baseURL: string
  private conversationHistory: any[] = []
  private teaKnowledgeBase: TeaInfo[] = []
  
  constructor(apiKey: string = '', baseURL: string = '') {
    this.apiKey = apiKey
    this.baseURL = baseURL
    this.initializeTeaKnowledge()
  }

  // 初始化茶叶知识库
  private initializeTeaKnowledge() {
    this.teaKnowledgeBase = [
      {
        id: 'puer-raw-ancient',
        name: '古树生普',
        type: 'raw',
        origin: '云南普洱',
        year: 2020,
        characteristics: ['回甘强烈', '香气持久', '汤色金黄', '叶底肥厚'],
        brewingTemp: 95,
        brewingTime: [30, 45, 60, 90],
        description: '来自百年以上古茶树的珍贵茶叶，具有独特的山野气韵',
        culturalStory: '古树茶承载着千年茶马古道的历史记忆，每一片叶子都诉说着时光的故事。这些古茶树见证了普洱茶文化的兴衰变迁，是活着的文化遗产。',
        healthBenefits: ['降脂减肥', '清热解毒', '生津止渴', '提神醒脑'],
        price: 588,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&h=300&q=80'
      },
      {
        id: 'puer-ripe-palace',
        name: '宫廷熟普',
        type: 'ripe',
        origin: '云南勐海',
        characteristics: ['汤色红浓', '滋味醇厚', '陈香浓郁', '口感顺滑'],
        brewingTemp: 100,
        brewingTime: [20, 30, 45, 60],
        description: '精选宫廷级茶料，经传统渥堆发酵工艺制成',
        culturalStory: '宫廷熟普曾是皇室专享，代表着普洱茶制作工艺的巅峰。其制作工艺融合了传统智慧与现代技术，体现了中华茶文化的博大精深。',
        healthBenefits: ['养胃护胃', '降血脂', '抗氧化', '助消化'],
        price: 288,
        image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=400&h=300&q=80'
      },
      {
        id: 'puer-raw-terrace',
        name: '台地生普',
        type: 'terrace',
        origin: '云南临沧',
        characteristics: ['清香淡雅', '回甘清甜', '汤色清亮', '性价比高'],
        brewingTemp: 90,
        brewingTime: [25, 40, 55, 80],
        description: '来自现代茶园的优质茶叶，适合日常品饮',
        culturalStory: '台地茶代表着现代茶业的发展，是普洱茶普及化的重要载体。它让更多人能够品尝到普洱茶的魅力，传承着茶文化的精神。',
        healthBenefits: ['清热降火', '提神醒脑', '抗疲劳', '美容养颜'],
        price: 128,
        image: 'https://images.unsplash.com/photo-1597318281675-0dc9d3c6c8b0?auto=format&fit=crop&w=400&h=300&q=80'
      },
      {
        id: 'puer-aged-vintage',
        name: '陈年老普洱',
        type: 'ancient',
        origin: '云南易武',
        year: 2005,
        characteristics: ['陈香浓郁', '汤色深红', '口感醇和', '回味悠长'],
        brewingTemp: 100,
        brewingTime: [15, 25, 35, 50],
        description: '经过十多年自然陈化的珍贵普洱茶，具有独特的陈香和深厚的文化底蕴',
        culturalStory: '陈年普洱如同老酒，时间赋予了它独特的魅力。每一年的陈化都是对茶文化的沉淀，体现了"越陈越香"的普洱茶精神。',
        healthBenefits: ['温胃养胃', '降血压', '抗衰老', '调节血糖'],
        price: 1288,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&h=300&q=80'
      },
      {
        id: 'puer-raw-spring',
        name: '春茶生普',
        type: 'raw',
        origin: '云南景迈',
        characteristics: ['香气清雅', '滋味鲜爽', '汤色明亮', '叶底嫩绿'],
        brewingTemp: 85,
        brewingTime: [20, 30, 45, 60],
        description: '春季采摘的新鲜茶叶，保持了茶叶最原始的香气和滋味',
        culturalStory: '春茶代表着新生和希望，是茶农一年辛勤劳作的开始。春茶的采摘时节体现了中国农耕文化与自然和谐共生的理念。',
        healthBenefits: ['清热解毒', '提神醒脑', '抗氧化', '美容护肤'],
        price: 368,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&h=300&q=80'
      },
      {
        id: 'puer-ripe-organic',
        name: '有机熟普',
        type: 'ripe',
        origin: '云南西双版纳',
        characteristics: ['口感纯净', '无农残', '汤色红润', '香气自然'],
        brewingTemp: 95,
        brewingTime: [25, 35, 50, 70],
        description: '采用有机种植方式培育的茶叶，经传统工艺发酵制成',
        culturalStory: '有机茶代表着现代人对健康生活的追求，同时也体现了对传统茶文化的尊重和传承。它是古老智慧与现代理念的完美结合。',
        healthBenefits: ['纯天然健康', '养胃护胃', '降血脂', '增强免疫力'],
        price: 458,
        image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=400&h=300&q=80'
      }
    ]
  }

  // 茶叶识别（模拟AI识别）
  async recognizeTea(imageData: string | File): Promise<TeaRecognitionResult> {
    // 模拟AI识别过程
    await this.delay(2000)
    
    // 随机选择一个茶叶信息作为识别结果
    const randomTea = this.teaKnowledgeBase[Math.floor(Math.random() * this.teaKnowledgeBase.length)]
    
    return {
      confidence: 0.85 + Math.random() * 0.1,
      teaInfo: randomTea,
      suggestions: [
        '建议使用紫砂壶冲泡以更好地展现茶香',
        '第一泡可以稍短一些，后续逐渐延长',
        '品茶时可以细品其回甘和生津'
      ],
      culturalContext: `这款${randomTea.name}体现了${randomTea.origin}地区的独特茶文化特色。${randomTea.culturalStory}`
    }
  }

  // 获取冲泡指导
  getBrewingGuide(teaType: string, userLevel: string = 'beginner'): BrewingGuide {
    const tea = this.teaKnowledgeBase.find(t => t.type === teaType || t.name.includes(teaType))
    
    if (!tea) {
      // 返回通用指导
      return this.getGenericBrewingGuide()
    }

    const steps: BrewingStep[] = [
      {
        step: 1,
        title: '温杯洁具',
        description: '用热水冲洗茶具，提高茶具温度',
        duration: 30,
        temperature: tea.brewingTemp,
        tips: ['确保茶具清洁', '预热有助于激发茶香']
      },
      {
        step: 2,
        title: '投茶醒茶',
        description: `投入适量${tea.name}，用热水快速冲洗`,
        duration: 10,
        temperature: tea.brewingTemp,
        tips: ['茶水比例约1:20', '第一泡用于醒茶，不饮用']
      },
      {
        step: 3,
        title: '正式冲泡',
        description: '按照时间序列进行多次冲泡',
        duration: tea.brewingTime[0],
        temperature: tea.brewingTemp,
        tips: [`第一泡${tea.brewingTime[0]}秒`, '后续每泡延长15-30秒', '观察汤色变化']
      },
      {
        step: 4,
        title: '品茶体验',
        description: '细品茶汤的香气、滋味和回甘',
        duration: 0,
        temperature: 0,
        tips: ['先闻香再品味', '感受茶汤在口中的变化', '体验回甘生津']
      }
    ]

    return {
      teaType: tea.name,
      steps,
      totalTime: steps.reduce((sum, step) => sum + step.duration, 0),
      difficulty: userLevel as any,
      culturalNotes: [
        tea.culturalStory,
        `${tea.name}的冲泡体现了${tea.origin}地区的茶文化传统`,
        '品茶不仅是味觉享受，更是文化体验'
      ]
    }
  }

  // 智能对话
  async chat(message: string): Promise<AIResponse> {
    const intent = this.analyzeIntent(message)
    let response: AIResponse

    switch (intent) {
      case 'tea_activities':
        response = await this.handleTeaActivities(message)
        break
      case 'tea_identification':
        response = await this.handleTeaIdentification(message)
        break
      case 'brewing_guidance':
        response = await this.handleBrewingGuidance(message)
        break
      case 'cultural_inquiry':
        response = await this.handleCulturalInquiry(message)
        break
      case 'health_benefits':
        response = await this.handleHealthBenefits(message)
        break
      case 'tea_philosophy':
        response = await this.handleTeaPhilosophy(message)
        break
      default:
        response = await this.handleGeneralChat(message)
    }

    this.conversationHistory.push({ user: message, ai: response.text })
    return response
  }

  // 意图分析
  private analyzeIntent(message: string): string {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('活动') || lowerMessage.includes('体验') || lowerMessage.includes('课程')) {
      return 'tea_activities'
    }
    if (lowerMessage.includes('识别') || lowerMessage.includes('这是什么茶')) {
      return 'tea_identification'
    }
    if (lowerMessage.includes('冲泡') || lowerMessage.includes('怎么泡')) {
      return 'brewing_guidance'
    }
    if (lowerMessage.includes('历史') || lowerMessage.includes('文化') || lowerMessage.includes('故事')) {
      return 'cultural_inquiry'
    }
    if (lowerMessage.includes('功效') || lowerMessage.includes('好处') || lowerMessage.includes('健康')) {
      return 'health_benefits'
    }
    if (lowerMessage.includes('传承') || lowerMessage.includes('精神') || lowerMessage.includes('哲学')) {
      return 'tea_philosophy'
    }

    return 'general_chat'
  }

  // 处理茶文化活动询问
  private async handleTeaActivities(message: string): Promise<AIResponse> {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('体验') || lowerMessage.includes('课程')) {
      return {
        text: '我们庄园提供丰富的茶文化体验活动！包括：🍃 茶艺表演与学习（每日10:00、15:00）、🌿 茶园采摘体验（春秋季节）、📚 茶文化讲座（周末举办）、🎭 茶马古道文化展演（节假日特别活动）。每个活动都能让您深度体验茶文化的魅力！',
        confidence: 0.95,
        intent: 'tea_activities',
        suggestions: ['茶艺表演时间', '茶园采摘预约', '文化讲座报名', '特别活动安排'],
        emotion: 'enthusiastic',
        culturalInsight: '参与茶文化活动不仅是学习，更是一种心灵的洗礼和文化的传承。'
      }
    }

    return {
      text: '我们定期举办各种茶文化推广活动，旨在传承和弘扬中华茶文化。您想了解哪种类型的活动呢？',
      confidence: 0.9,
      intent: 'tea_activities',
      suggestions: ['茶艺体验', '文化讲座', '节庆活动', '教育课程'],
      emotion: 'enthusiastic',
      culturalInsight: '茶文化活动是连接传统与现代的桥梁，让更多人感受茶文化的魅力。'
    }
  }

  // 处理茶道精神询问
  private async handleTeaPhilosophy(message: string): Promise<AIResponse> {
    return {
      text: '茶道精神体现了中华文化的深层智慧。"和、静、怡、真"是茶道的核心理念：和谐相处、内心宁静、愉悦身心、真诚待人。通过茶道修行，我们学会慢下来，感受当下，与自然和谐共处。这不仅是品茶的艺术，更是人生的哲学。',
      confidence: 0.92,
      intent: 'tea_philosophy',
      suggestions: ['茶道修行', '禅茶一味', '茶人精神', '文化传承'],
      emotion: 'wise',
      culturalInsight: '茶道不仅是技艺，更是一种生活态度和精神追求，体现了中华民族的文化智慧。'
    }
  }

  // 处理茶叶识别询问
  private async handleTeaIdentification(message: string): Promise<AIResponse> {
    return {
      text: '我可以帮您识别茶叶！请上传茶叶的照片，我会分析茶叶的品种、特征和文化背景。每种茶都承载着独特的文化故事，让我为您解读茶叶背后的文化内涵。',
      confidence: 0.9,
      intent: 'tea_identification',
      suggestions: ['上传茶叶照片', '了解茶叶文化', '学习品鉴技巧'],
      emotion: 'knowledgeable',
      culturalInsight: '茶叶识别不仅是技术，更是对茶文化的深度理解和传承。'
    }
  }

  // 处理冲泡指导
  private async handleBrewingGuidance(message: string): Promise<AIResponse> {
    return {
      text: '我很乐意为您提供专业的冲泡指导！不同的茶叶需要不同的冲泡方法。请告诉我您要冲泡什么茶，或者您的茶艺水平，我会为您量身定制冲泡方案。',
      confidence: 0.95,
      intent: 'brewing_guidance',
      suggestions: ['生普冲泡方法', '熟普冲泡技巧', '古树茶冲泡要点'],
      emotion: 'patient',
      culturalInsight: '冲泡是茶文化的精髓，正确的冲泡方法能够完美展现茶叶的品质和文化内涵。'
    }
  }

  // 处理文化询问
  private async handleCulturalInquiry(message: string): Promise<AIResponse> {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('茶马古道') || lowerMessage.includes('历史')) {
      return {
        text: '茶马古道是连接云南与西藏、四川的重要贸易通道，始于唐宋时期。马帮驮着普洱茶翻山越岭，不仅传播了茶叶，更传播了文化。这条古道见证了普洱茶从边疆走向世界的历程，每一个驿站都有着动人的故事。',
        confidence: 0.95,
        intent: 'cultural_inquiry',
        suggestions: ['马帮文化', '驿站故事', '贸易历史', '文化交流'],
        emotion: 'wise',
        culturalInsight: '茶马古道不仅是商贸之路，更是文化交流之路，它让普洱茶成为了连接不同民族、不同地区的文化纽带。'
      }
    }

    if (lowerMessage.includes('工艺') || lowerMessage.includes('制作')) {
      return {
        text: '普洱茶的制作工艺分为生茶和熟茶两种。生茶保持传统工艺：采摘→萎凋→杀青→揉捻→晒干→压制。熟茶则增加了渥堆发酵工序，这是现代工艺的创新。每个步骤都体现了茶农的智慧和对品质的追求。',
        confidence: 0.93,
        intent: 'cultural_inquiry',
        suggestions: ['生茶工艺', '熟茶发酵', '压制技术', '品质控制'],
        emotion: 'knowledgeable',
        culturalInsight: '制茶工艺是技术与艺术的结合，每一道工序都承载着制茶师傅的匠心精神和对茶文化的传承。'
      }
    }

    if (lowerMessage.includes('传说') || lowerMessage.includes('故事')) {
      return {
        text: '普洱茶有许多美丽的传说。相传孔明南征时，士兵水土不服，当地人献上茶叶，士兵饮后病愈，因此普洱茶又称"孔明茶"。还有"茶祖"的传说，说是茶神教会了当地人种茶制茶的技艺。这些传说虽然神秘，但体现了人们对茶的敬畏和感恩。',
        confidence: 0.90,
        intent: 'cultural_inquiry',
        suggestions: ['孔明茶传说', '茶祖故事', '民族传说', '茶神文化'],
        emotion: 'wise',
        culturalInsight: '传说虽然带有神话色彩，但它们反映了普洱茶在当地人心中的神圣地位，以及茶文化的深厚底蕴。'
      }
    }

    return {
      text: '普洱茶承载着深厚的文化底蕴！从茶马古道的历史传说，到现代的制茶工艺，每一个环节都蕴含着丰富的文化内涵。您想了解哪个方面的茶文化呢？',
      confidence: 0.92,
      intent: 'cultural_inquiry',
      suggestions: ['茶马古道历史', '普洱茶制作工艺', '茶文化传说', '民族茶俗'],
      emotion: 'wise',
      culturalInsight: '茶文化是中华文明的重要组成部分，普洱茶更是其中的瑰宝，承载着千年的历史记忆。'
    }
  }

  // 处理健康功效询问
  private async handleHealthBenefits(message: string): Promise<AIResponse> {
    return {
      text: '普洱茶具有丰富的健康功效！生普清热解毒、降脂减肥，熟普养胃护胃、助消化。不过，茶的功效因人而异，建议适量饮用。您想了解哪种茶的具体功效呢？',
      confidence: 0.88,
      intent: 'health_benefits',
      suggestions: ['生普健康功效', '熟普养生作用', '饮茶注意事项'],
      emotion: 'knowledgeable',
      culturalInsight: '中医认为茶有药性，不同的茶适合不同的体质，这体现了中华传统养生文化的智慧。'
    }
  }

  // 处理一般对话
  private async handleGeneralChat(message: string): Promise<AIResponse> {
    return {
      text: '您好！我是普洱蘑菇庄园民宿的AI茶文化助手。我专注于茶文化推广和传承，可以为您介绍茶艺活动、文化体验、茶叶知识等。让我们一起探索博大精深的茶文化世界吧！',
      confidence: 0.8,
      intent: 'general_chat',
      suggestions: ['茶文化活动', '茶艺体验', '文化传承', '茶道精神'],
      emotion: 'enthusiastic',
      culturalInsight: '茶文化是中华文明的瑰宝，每一次品茶都是与历史的对话，与文化的交流。'
    }
  }

  // 获取通用冲泡指导
  private getGenericBrewingGuide(): BrewingGuide {
    return {
      teaType: '普洱茶',
      steps: [
        {
          step: 1,
          title: '准备茶具',
          description: '选择合适的茶具，建议使用紫砂壶或盖碗',
          duration: 60,
          temperature: 95,
          tips: ['茶具要清洁', '紫砂壶更适合普洱茶']
        },
        {
          step: 2,
          title: '投茶冲泡',
          description: '按照茶水比例投茶，进行冲泡',
          duration: 30,
          temperature: 95,
          tips: ['茶水比例1:20', '第一泡醒茶']
        }
      ],
      totalTime: 90,
      difficulty: 'beginner',
      culturalNotes: ['普洱茶冲泡体现了云南茶文化的精髓']
    }
  }

  // 工具方法：延迟
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 获取茶叶知识库
  getTeaKnowledge(): TeaInfo[] {
    return this.teaKnowledgeBase
  }

  // 根据ID获取茶叶信息
  getTeaById(id: string): TeaInfo | undefined {
    return this.teaKnowledgeBase.find(tea => tea.id === id)
  }
}

// 导出单例实例
export const teaCultureAI = new TeaCultureAIService()

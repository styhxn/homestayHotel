// 🍄 小蘑菇角色配置文件

export interface MushroomCharacterConfig {
  // 角色基本信息
  name: string
  nickname: string
  personality: string[]
  
  // 外观配置
  appearance: {
    hatColor: string
    faceColor: string
    clothesColor: string
    leafColor: string
  }
  
  // 对话风格
  conversationStyle: {
    greeting: string[]
    farewell: string[]
    expressions: string[]
    topics: Record<string, string[]>
  }
  
  // 动画配置
  animations: {
    idle: string
    talking: string
    thinking: string
    excited: string
  }
}

// 小蘑菇角色配置
export const mushroomCharacter: MushroomCharacterConfig = {
  // 角色基本信息
  name: '小蘑菇',
  nickname: '蘑菇宝宝',
  personality: [
    '友善可爱',
    '热爱自然',
    '知识丰富',
    '乐于助人',
    '活泼开朗'
  ],
  
  // 外观配置
  appearance: {
    hatColor: '#8bc34a', // 绿色帽子
    faceColor: '#ffdbcb', // 温暖肤色
    clothesColor: '#c8e6c9', // 浅绿色衣服
    leafColor: '#4caf50' // 深绿色叶子
  },
  
  // 对话风格
  conversationStyle: {
    greeting: [
      '🍄 您好！我是小蘑菇，欢迎来到普洱蘑菇庄园～',
      '🌿 嗨！很高兴在这片神奇的蘑菇森林里遇见您！',
      '🍵 欢迎光临！我是庄园的AI助手小蘑菇，有什么可以帮您的吗？',
      '🌱 您好呀！我在这里等您很久了，快来了解我们美丽的庄园吧～'
    ],
    
    farewell: [
      '🍄 期待您的下次光临，愿您在庄园度过美好时光！',
      '🌿 再见！记得常来我们的蘑菇森林做客哦～',
      '🍵 祝您旅途愉快！别忘了品尝我们的普洱茶～',
      '🌱 拜拜！希望您能爱上我们的生态庄园！'
    ],
    
    expressions: [
      '🍄', '🌿', '🍵', '🌱', '🌲', '🦋', '🌸', '🍃', '🌺', '🐛'
    ],
    
    topics: {
      accommodation: [
        '🍄 我们有三种特色民宿：蘑菇森林小屋、普洱茶香木屋和生态庄园别墅！',
        '🏡 每间民宿都有独特的生态主题，让您感受不同的自然体验～',
        '🌿 蘑菇小屋隐藏在原生蘑菇林中，是最受欢迎的选择呢！'
      ],
      
      activities: [
        '🍄 我们有蘑菇采摘体验，您可以学习识别各种食用菌！',
        '🍵 普洱茶文化体验很棒，有专业茶艺师教学～',
        '🌲 森林徒步探索让您深入了解生态环境！',
        '🔥 篝火晚会是最温馨的活动，大家一起分享故事～'
      ],
      
      food: [
        '🍄 我们的蘑菇料理都是用新鲜采摘的食用菌制作！',
        '🍵 正宗的普洱茶配上有机蔬菜，味道绝佳～',
        '🌱 庄园自产的有机食材，健康又美味！',
        '🥗 生态餐厅提供各种绿色健康美食！'
      ],
      
      location: [
        '🚗 从昆明出发沿昆磨高速约2小时就到啦！',
        '🌲 庄园位于原始森林中，空气特别清新～',
        '🗺️ 我可以为您提供详细的交通路线指引！',
        '📍 GPS定位：普洱市蘑菇庄园生态度假村～'
      ],
      
      booking: [
        '📱 您可以直接在我们网站预订，很方便的！',
        '📞 也可以拨打客服电话：400-123-4567',
        '💬 或者告诉我您的需求，我来帮您查看可用房间～',
        '📅 建议提前预订，特别是周末和节假日！'
      ]
    }
  },
  
  // 动画配置
  animations: {
    idle: 'float', // 轻微浮动
    talking: 'talking', // 说话时嘴巴动画
    thinking: 'blink', // 思考时眨眼
    excited: 'wave' // 兴奋时挥手
  }
}

// 根据关键词匹配话题
export function getTopicResponse(message: string): string {
  const keywords = {
    accommodation: ['民宿', '房间', '住宿', '小屋', '别墅', '预订'],
    activities: ['活动', '体验', '采摘', '茶艺', '徒步', '篝火'],
    food: ['美食', '餐厅', '蘑菇', '茶', '有机', '料理'],
    location: ['位置', '地址', '路线', '交通', '怎么去', '在哪'],
    booking: ['预订', '预约', '订房', '价格', '费用', '联系']
  }
  
  for (const [topic, words] of Object.entries(keywords)) {
    if (words.some(word => message.includes(word))) {
      const responses = mushroomCharacter.conversationStyle.topics[topic]
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }
  
  // 默认回复
  const defaultResponses = [
    '🍄 这个问题很有趣呢！让我想想怎么为您解答～',
    '🌿 我正在学习更多知识来更好地帮助您！',
    '🍵 您可以问我关于庄园民宿、活动体验、美食等任何问题～',
    '🌱 如果您想了解具体信息，可以点击下面的快捷问题哦！'
  ]
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

// 获取随机表情
export function getRandomExpression(): string {
  const expressions = mushroomCharacter.conversationStyle.expressions
  return expressions[Math.floor(Math.random() * expressions.length)]
}

// 获取问候语
export function getGreeting(): string {
  const greetings = mushroomCharacter.conversationStyle.greeting
  return greetings[Math.floor(Math.random() * greetings.length)]
}

// 获取告别语
export function getFarewell(): string {
  const farewells = mushroomCharacter.conversationStyle.farewell
  return farewells[Math.floor(Math.random() * farewells.length)]
}

// 角色状态管理
export class MushroomCharacterState {
  private currentMood: 'happy' | 'excited' | 'thinking' | 'sleepy' = 'happy'
  private conversationCount: number = 0
  
  getCurrentMood(): string {
    return this.currentMood
  }
  
  updateMood(message: string): void {
    this.conversationCount++
    
    // 根据对话内容和次数调整心情
    if (message.includes('谢谢') || message.includes('太好了')) {
      this.currentMood = 'excited'
    } else if (message.includes('问题') || message.includes('帮助')) {
      this.currentMood = 'thinking'
    } else if (this.conversationCount > 10) {
      this.currentMood = 'sleepy'
    } else {
      this.currentMood = 'happy'
    }
  }
  
  getPersonalizedResponse(message: string): string {
    this.updateMood(message)
    
    let response = getTopicResponse(message)
    
    // 根据心情添加个性化元素
    switch (this.currentMood) {
      case 'excited':
        response += ' ' + getRandomExpression() + ' 我好开心能帮到您！'
        break
      case 'thinking':
        response += ' 🤔 让我仔细想想...'
        break
      case 'sleepy':
        response += ' 😴 聊了这么久，我有点累了，不过还是很乐意帮助您～'
        break
      default:
        response += ' ' + getRandomExpression()
    }
    
    return response
  }
  
  reset(): void {
    this.currentMood = 'happy'
    this.conversationCount = 0
  }
}

// 导出默认实例
export const mushroomState = new MushroomCharacterState()

// 快捷问题配置
export const quickQuestions = [
  {
    id: 1,
    text: '🍄 有哪些蘑菇主题民宿？',
    category: 'accommodation'
  },
  {
    id: 2,
    text: '🌿 可以体验蘑菇采摘吗？',
    category: 'activities'
  },
  {
    id: 3,
    text: '🍵 有普洱茶文化活动吗？',
    category: 'activities'
  },
  {
    id: 4,
    text: '🚗 庄园交通路线指引',
    category: 'location'
  },
  {
    id: 5,
    text: '🍽️ 有什么特色美食？',
    category: 'food'
  },
  {
    id: 6,
    text: '💰 住宿价格怎么样？',
    category: 'booking'
  }
]

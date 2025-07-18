// 🏡 民宿产品AI助手服务

export interface Product {
  id: string
  name: string
  category: 'food' | 'craft' | 'tea' | 'souvenir' | 'experience'
  price: number
  originalPrice?: number
  description: string
  features: string[]
  images: string[]
  origin: string
  specifications?: Record<string, string>
  inStock: boolean
  rating: number
  reviews: number
  culturalBackground: string
  recommendedUse: string[]
}

export interface ProductRecommendation {
  product: Product
  reason: string
  matchScore: number
  culturalValue: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  specifications?: Record<string, string>
}

export interface AIProductResponse {
  text: string
  confidence: number
  intent: string
  suggestions: string[]
  emotion: 'helpful' | 'enthusiastic' | 'professional' | 'friendly'
  recommendations?: ProductRecommendation[]
}

export class ProductAIService {
  private productCatalog: Product[] = []
  private conversationHistory: any[] = []
  
  constructor() {
    this.initializeProductCatalog()
  }

  // 初始化产品目录
  private initializeProductCatalog() {
    this.productCatalog = [
      {
        id: 'puer-tea-gift-set',
        name: '普洱茶礼盒装',
        category: 'tea',
        price: 288,
        originalPrice: 368,
        description: '精选普洱古树茶，传统工艺制作，适合送礼或自用',
        features: ['古树茶', '传统工艺', '精美包装', '送礼佳品'],
        images: [
          '/src/assets/images/产品/普洱茶/普洱茶摆放环境展示.jpg',
          '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研3.jpg'
        ],
        origin: '云南普洱',
        specifications: {
          '重量': '500g',
          '年份': '2022年',
          '包装': '礼盒装'
        },
        inStock: true,
        rating: 4.8,
        reviews: 156,
        culturalBackground: '普洱茶承载着深厚的茶马古道文化，是云南的文化名片',
        recommendedUse: ['商务送礼', '家庭品饮', '收藏投资']
      },
      {
        id: 'yunnan-mushroom-dried',
        name: '云南野生菌干货',
        category: 'food',
        price: 158,
        description: '精选云南高原野生菌，自然晒干，营养丰富',
        features: ['野生采摘', '自然晒干', '营养丰富', '无添加'],
        images: [
          'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&h=400&q=80'
        ],
        origin: '云南高原',
        specifications: {
          '重量': '250g',
          '保质期': '12个月',
          '储存': '阴凉干燥处'
        },
        inStock: true,
        rating: 4.7,
        reviews: 89,
        culturalBackground: '云南野生菌是大自然的馈赠，体现了人与自然和谐共生的理念',
        recommendedUse: ['煲汤炖菜', '营养补充', '健康饮食']
      },
      {
        id: 'handmade-bamboo-craft',
        name: '手工竹编工艺品',
        category: 'craft',
        price: 128,
        description: '传统手工竹编技艺制作，实用美观，具有浓郁的民族特色',
        features: ['手工制作', '天然竹材', '民族特色', '实用美观'],
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&h=400&q=80'
        ],
        origin: '云南民族地区',
        specifications: {
          '材质': '天然竹材',
          '尺寸': '30cm x 20cm',
          '工艺': '传统手工编织'
        },
        inStock: true,
        rating: 4.6,
        reviews: 67,
        culturalBackground: '竹编工艺是云南少数民族的传统技艺，承载着丰富的民族文化',
        recommendedUse: ['家居装饰', '收纳整理', '文化收藏']
      },
      {
        id: 'puer-honey-organic',
        name: '普洱有机蜂蜜',
        category: 'food',
        price: 98,
        description: '来自普洱山区的纯天然有机蜂蜜，口感醇厚，营养丰富',
        features: ['有机认证', '纯天然', '营养丰富', '口感醇厚'],
        images: [
          'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&h=400&q=80'
        ],
        origin: '普洱山区',
        specifications: {
          '重量': '500g',
          '纯度': '100%纯蜂蜜',
          '认证': '有机认证'
        },
        inStock: true,
        rating: 4.9,
        reviews: 234,
        culturalBackground: '蜂蜜是大自然的甜蜜馈赠，体现了普洱地区生态环境的优越',
        recommendedUse: ['日常保健', '美容养颜', '烘焙调味']
      },
      {
        id: 'ethnic-silver-jewelry',
        name: '民族银饰手镯',
        category: 'craft',
        price: 268,
        description: '传统民族银饰工艺，精美雕刻，具有独特的民族风情',
        features: ['纯银制作', '传统工艺', '精美雕刻', '民族风情'],
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&h=400&q=80'
        ],
        origin: '云南民族地区',
        specifications: {
          '材质': '925纯银',
          '重量': '约25g',
          '工艺': '传统手工雕刻'
        },
        inStock: true,
        rating: 4.8,
        reviews: 145,
        culturalBackground: '银饰是云南少数民族的传统装饰品，承载着深厚的民族文化内涵',
        recommendedUse: ['日常佩戴', '民族服饰搭配', '文化收藏']
      },
      {
        id: 'tea-ceremony-experience',
        name: '茶艺体验课程',
        category: 'experience',
        price: 188,
        description: '专业茶艺师指导的茶艺体验课程，学习传统茶文化',
        features: ['专业指导', '传统茶艺', '文化体验', '小班教学'],
        images: [
          'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&h=400&q=80'
        ],
        origin: '普洱蘑菇庄园',
        specifications: {
          '时长': '2小时',
          '人数': '1-6人',
          '包含': '茶具使用、茶叶品鉴'
        },
        inStock: true,
        rating: 4.9,
        reviews: 78,
        culturalBackground: '茶艺是中华文化的重要组成部分，体现了和谐、宁静的生活哲学',
        recommendedUse: ['文化学习', '休闲体验', '团队活动']
      }
    ]
  }

  // 智能产品推荐
  async getProductRecommendations(userPreferences: string[], budget?: number): Promise<ProductRecommendation[]> {
    const recommendations: ProductRecommendation[] = []
    
    for (const product of this.productCatalog) {
      if (budget && product.price > budget) continue
      
      let matchScore = 0
      let reason = ''
      
      // 根据用户偏好计算匹配分数
      if (userPreferences.includes('茶文化') && product.category === 'tea') {
        matchScore += 0.8
        reason = '符合您对茶文化的兴趣'
      }
      
      if (userPreferences.includes('手工艺品') && product.category === 'craft') {
        matchScore += 0.7
        reason = '精美的手工艺品，具有收藏价值'
      }
      
      if (userPreferences.includes('美食') && product.category === 'food') {
        matchScore += 0.6
        reason = '云南特色美食，营养健康'
      }
      
      if (userPreferences.includes('体验') && product.category === 'experience') {
        matchScore += 0.9
        reason = '独特的文化体验，值得参与'
      }
      
      if (matchScore > 0.5) {
        recommendations.push({
          product,
          reason,
          matchScore,
          culturalValue: product.culturalBackground
        })
      }
    }
    
    return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5)
  }

  // 智能对话
  async chat(message: string): Promise<AIProductResponse> {
    const intent = this.analyzeIntent(message)
    let response: AIProductResponse

    switch (intent) {
      case 'product_inquiry':
        response = await this.handleProductInquiry(message)
        break
      case 'recommendation_request':
        response = await this.handleRecommendationRequest(message)
        break
      case 'price_inquiry':
        response = await this.handlePriceInquiry(message)
        break
      case 'cultural_background':
        response = await this.handleCulturalBackground(message)
        break
      case 'order_assistance':
        response = await this.handleOrderAssistance(message)
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
    
    if (lowerMessage.includes('推荐') || lowerMessage.includes('什么好')) {
      return 'recommendation_request'
    }
    if (lowerMessage.includes('价格') || lowerMessage.includes('多少钱')) {
      return 'price_inquiry'
    }
    if (lowerMessage.includes('文化') || lowerMessage.includes('背景') || lowerMessage.includes('故事')) {
      return 'cultural_background'
    }
    if (lowerMessage.includes('订单') || lowerMessage.includes('购买') || lowerMessage.includes('下单')) {
      return 'order_assistance'
    }
    if (lowerMessage.includes('产品') || lowerMessage.includes('商品')) {
      return 'product_inquiry'
    }
    
    return 'general_chat'
  }

  // 处理产品咨询
  private async handleProductInquiry(message: string): Promise<AIProductResponse> {
    const products = this.productCatalog.slice(0, 3)
    
    return {
      text: '我们有丰富的云南普洱周边产品！包括精品普洱茶、野生菌干货、手工艺品、有机蜂蜜等。每一件产品都承载着深厚的地方文化。您对哪类产品感兴趣呢？',
      confidence: 0.9,
      intent: 'product_inquiry',
      suggestions: ['普洱茶礼盒', '野生菌干货', '手工艺品', '查看全部产品'],
      emotion: 'helpful',
      recommendations: products.map(product => ({
        product,
        reason: '热门推荐产品',
        matchScore: 0.8,
        culturalValue: product.culturalBackground
      }))
    }
  }

  // 处理推荐请求
  private async handleRecommendationRequest(message: string): Promise<AIProductResponse> {
    const recommendations = await this.getProductRecommendations(['茶文化', '美食', '手工艺品'])
    
    return {
      text: '根据您的需求，我为您推荐几款精选产品。这些都是我们的明星产品，既有实用价值，又富含文化内涵。您可以点击查看详情或直接下单购买。',
      confidence: 0.95,
      intent: 'recommendation_request',
      suggestions: ['查看详情', '了解价格', '立即购买', '更多推荐'],
      emotion: 'enthusiastic',
      recommendations: recommendations.slice(0, 3)
    }
  }

  // 处理价格咨询
  private async handlePriceInquiry(message: string): Promise<AIProductResponse> {
    return {
      text: '我们的产品价格从98元到288元不等，都是精选的高品质商品。普洱茶礼盒288元，野生菌干货158元，有机蜂蜜98元。所有产品都物超所值，而且经常有优惠活动哦！',
      confidence: 0.88,
      intent: 'price_inquiry',
      suggestions: ['查看优惠', '比较产品', '了解详情', '立即购买'],
      emotion: 'professional'
    }
  }

  // 处理文化背景咨询
  private async handleCulturalBackground(message: string): Promise<AIProductResponse> {
    return {
      text: '我们的每一件产品都有着深厚的文化底蕴。普洱茶承载着茶马古道的历史，野生菌体现了人与自然的和谐，手工艺品传承着民族文化。购买我们的产品，不仅是获得优质商品，更是在传承和支持当地文化。',
      confidence: 0.92,
      intent: 'cultural_background',
      suggestions: ['了解茶马古道', '民族文化故事', '生态保护理念', '文化传承意义'],
      emotion: 'professional'
    }
  }

  // 处理订单协助
  private async handleOrderAssistance(message: string): Promise<AIProductResponse> {
    return {
      text: '我很乐意协助您完成订单！您可以直接点击产品的"立即购买"按钮，或者告诉我您想要的产品，我来帮您快速下单。我们支持多种支付方式，并提供快速配送服务。',
      confidence: 0.9,
      intent: 'order_assistance',
      suggestions: ['选择产品', '查看购物车', '配送信息', '支付方式'],
      emotion: 'helpful'
    }
  }

  // 处理一般对话
  private async handleGeneralChat(message: string): Promise<AIProductResponse> {
    return {
      text: '您好！我是普洱蘑菇庄园民宿的产品顾问AI。我专门为您介绍云南普洱周边的特色产品，包括茶叶、美食、手工艺品等。有什么我可以帮您的吗？',
      confidence: 0.8,
      intent: 'general_chat',
      suggestions: ['产品推荐', '价格咨询', '文化介绍', '订单协助'],
      emotion: 'friendly'
    }
  }

  // 获取产品目录
  getProductCatalog(): Product[] {
    return this.productCatalog
  }

  // 根据ID获取产品
  getProductById(id: string): Product | undefined {
    return this.productCatalog.find(product => product.id === id)
  }

  // 根据分类获取产品
  getProductsByCategory(category: string): Product[] {
    return this.productCatalog.filter(product => product.category === category)
  }

  // 搜索产品
  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase()
    return this.productCatalog.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.features.some(feature => feature.toLowerCase().includes(lowerQuery))
    )
  }
}

// 导出单例实例
export const productAI = new ProductAIService()

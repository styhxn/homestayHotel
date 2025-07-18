// 智能本地AI系统 - 普普助手
export interface UserIntent {
  type: 'room_recommendation' | 'booking' | 'inquiry' | 'greeting' | 'price_query' | 'floor_query' | 'booking_confirm' | 'date_input' | 'tea_activity' | 'activity_selection'
  confidence: number
  parameters: Record<string, any>
}

export interface Room {
  id: number | string
  code: string
  name: string
  category?: string
  price: number
  area?: string
  status: string
  floor: number | string
  features?: string[]
  vrUrl?: string
  direction?: string
  type?: string
  hasWindow?: boolean
  image?: string
}

export interface BookingSession {
  step: 'room_selected' | 'dates_requested' | 'dates_provided' | 'confirmation' | 'completed'
  selectedRoom?: Room
  checkInDate?: string
  checkOutDate?: string
  guestCount?: number
  userProfile?: UserProfile
}

export interface UserProfile {
  type: 'family_with_children' | 'culture_enthusiast' | 'business' | 'couple' | 'solo'
  keywords: string[]
  preferences: string[]
}

export interface TeaActivity {
  id: string
  name: string
  description: string
  duration: string
  price: number
  maxParticipants: number
  difficulty: 'easy' | 'medium' | 'hard'
  ageLimit: string
  includes: string[]
  schedule: ActivitySchedule[]
  location: string
  instructor: string
}

export interface ActivitySchedule {
  date: string
  timeSlots: TimeSlot[]
}

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  availableSpots: number
  status: 'available' | 'full' | 'cancelled'
}

export class IntelligentAI {
  private rooms: Room[] = []
  private bookingSession: BookingSession | null = null
  private conversationHistory: string[] = []
  private teaActivities: TeaActivity[] = []
  private lastOrder: any = null // 保存最后一个订单信息

  constructor(rooms: Room[]) {
    this.rooms = rooms
    this.initializeTeaActivities()
  }

  // 初始化采茶活动数据
  private initializeTeaActivities() {
    this.teaActivities = [
      {
        id: 'tea_picking_basic',
        name: '传统采茶体验',
        description: '跟随茶农师傅学习传统采茶技艺，体验"一芽二叶"的采摘标准',
        duration: '2小时',
        price: 128,
        maxParticipants: 12,
        difficulty: 'easy',
        ageLimit: '6岁以上',
        includes: ['专业指导', '采茶工具', '茶叶品鉴', '纪念茶叶'],
        schedule: this.generateActivitySchedule(),
        location: '蘑菇庄园茶园',
        instructor: '李师傅（30年采茶经验）'
      },
      {
        id: 'tea_making_workshop',
        name: '手工制茶工坊',
        description: '从采茶到制茶的完整体验，学习普洱茶传统制作工艺',
        duration: '4小时',
        price: 268,
        maxParticipants: 8,
        difficulty: 'medium',
        ageLimit: '10岁以上',
        includes: ['采茶体验', '制茶指导', '午餐', '成品茶叶带走'],
        schedule: this.generateActivitySchedule(),
        location: '蘑菇庄园制茶坊',
        instructor: '王师傅（非遗传承人）'
      },
      {
        id: 'family_tea_adventure',
        name: '亲子采茶探险',
        description: '专为家庭设计的采茶活动，包含茶园寻宝和儿童茶艺启蒙',
        duration: '3小时',
        price: 188,
        maxParticipants: 6,
        difficulty: 'easy',
        ageLimit: '3岁以上',
        includes: ['亲子采茶', '茶园寻宝', '儿童茶艺', '家庭合影'],
        schedule: this.generateActivitySchedule(),
        location: '蘑菇庄园亲子茶园',
        instructor: '小茶老师（儿童教育专家）'
      }
    ]
  }

  // 生成活动排期
  private generateActivitySchedule(): ActivitySchedule[] {
    const schedules: ActivitySchedule[] = []
    const today = new Date()

    // 生成未来7天的排期
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]

      schedules.push({
        date: dateStr,
        timeSlots: [
          {
            id: `${dateStr}_morning`,
            startTime: '09:00',
            endTime: '11:00',
            availableSpots: Math.floor(Math.random() * 8) + 2,
            status: 'available'
          },
          {
            id: `${dateStr}_afternoon`,
            startTime: '14:30',
            endTime: '16:30',
            availableSpots: Math.floor(Math.random() * 8) + 2,
            status: 'available'
          }
        ]
      })
    }

    return schedules
  }

  // 分析用户意图
  analyzeIntent(message: string): UserIntent {
    const lowerMessage = message.toLowerCase()
    this.conversationHistory.push(message)
    
    // 预订确认检测
    if (this.bookingSession && (lowerMessage.includes('确认') || lowerMessage.includes('好的') || lowerMessage.includes('是的'))) {
      return { type: 'booking_confirm', confidence: 0.9, parameters: {} }
    }
    
    // 日期输入检测
    if (this.bookingSession && this.bookingSession.step === 'dates_requested') {
      const datePattern = /(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})|(\d{1,2}[-\/]\d{1,2})|(\d{1,2}月\d{1,2}日?)|(\d{1,2}号)/
      if (datePattern.test(message)) {
        return { type: 'date_input', confidence: 0.9, parameters: { dateText: message } }
      }
    }
    
    // 采茶活动意图
    if (this.matchKeywords(lowerMessage, ['采茶', '茶园', '制茶', '茶艺', '体验', '活动', '茶文化'])) {
      return { type: 'tea_activity', confidence: 0.9, parameters: this.extractActivityPreferences(message) }
    }

    // 活动选择意图
    if (this.matchKeywords(lowerMessage, ['选择', '报名', '参加']) && this.matchKeywords(lowerMessage, ['活动', '场次', '时间'])) {
      return { type: 'activity_selection', confidence: 0.9, parameters: this.extractActivitySelection(message) }
    }

    // 房间推荐意图
    if (this.matchKeywords(lowerMessage, ['推荐', '房间', '朝南', '窗户', '安静', '亲子'])) {
      return { type: 'room_recommendation', confidence: 0.9, parameters: this.extractRoomPreferences(message) }
    }

    // 预订意图
    if (this.matchKeywords(lowerMessage, ['预订', '预定', '帮我预定']) || /\d{3}/.test(message)) {
      const roomNumber = message.match(/(\d{3})/)?.[1]
      return { type: 'booking', confidence: 0.95, parameters: { roomNumber } }
    }

    // 问候
    if (this.matchKeywords(lowerMessage, ['你好', '您好', 'hello'])) {
      return { type: 'greeting', confidence: 0.9, parameters: {} }
    }
    
    return { type: 'inquiry', confidence: 0.6, parameters: { originalMessage: message } }
  }

  // 生成智能回复
  generateResponse(intent: UserIntent): string {
    switch (intent.type) {
      case 'room_recommendation':
        return this.generateRoomRecommendation(intent.parameters)
      case 'booking':
        return this.generateBookingResponse(intent.parameters)
      case 'booking_confirm':
        return this.handleBookingConfirmation()
      case 'date_input':
        return this.handleDateInput(intent.parameters)
      case 'tea_activity':
        return this.generateTeaActivityRecommendation(intent.parameters)
      case 'activity_selection':
        return this.handleActivitySelection(intent.parameters)
      case 'greeting':
        return '您好！我是普普，您的专属AI助手🍄 我可以帮您推荐房间、预订住宿。请问有什么可以帮助您的吗？'
      default:
        return '感谢您的咨询！我是普普，您的专属AI助手。请问有什么可以帮助您的吗？'
    }
  }

  // 智能房间推荐
  private generateRoomRecommendation(params: any): string {
    const availableRooms = this.rooms.filter(room => room.status === 'available' || room.status === 0)
    
    if (availableRooms.length === 0) {
      return '🍄 抱歉，目前没有可用房间。请稍后再试或联系客服。'
    }

    let recommendedRooms = this.filterRoomsByPreferences(availableRooms, params)
    
    if (recommendedRooms.length === 0) {
      recommendedRooms = availableRooms.slice(0, 2) // 如果没有匹配的，推荐前2个
    }

    let response = '🤔 让我为您分析一下最适合的房间...\n\n'
    
    if (params.direction && params.direction.includes('朝南')) {
      response += '🌞 您希望朝南的房间，采光会很好！\n'
    }
    if (params.hasWindow) {
      response += '🪟 您需要有窗户的房间，通风采光都很重要！\n'
    }
    if (params.quiet) {
      response += '🤫 您希望安静的环境，我理解您的需求！\n'
    }
    if (params.familyFriendly) {
      response += '👨‍👩‍👧‍👦 亲子房间，适合家庭入住！\n'
    }
    
    response += '\n我为您精心推荐以下房间：\n\n'

    recommendedRooms.slice(0, 3).forEach((room) => {
      response += `🏠 **${room.code}号房** - ${room.name}\n`
      response += `💰 价格：¥${room.price}/晚\n`
      response += `🏢 位置：${room.floor}楼\n`
      
      if (room.features && room.features.length > 0) {
        response += `✨ 特色：${room.features.join('、')}\n`
      }

      if (room.vrUrl) {
        response += `🔗 [点击查看VR全景](${room.vrUrl})\n`
      }

      response += '\n'
    })

    response += '💡 如果您对某个房间感兴趣，可以说"帮我预订XXX号房"哦！'
    
    // 触发前端显示推荐房间
    this.triggerRoomRecommendation(recommendedRooms.slice(0, 3))
    
    return response
  }

  // 预订响应
  private generateBookingResponse(params: any): string {
    if (params.roomNumber) {
      const room = this.rooms.find(r => r.code === params.roomNumber)
      if (room) {
        this.bookingSession = {
          step: 'dates_requested',
          selectedRoom: room,
          userProfile: this.analyzeUserProfile(this.conversationHistory.join(' '))
        }
        
        return `🏠 您选择了${room.code}号房 - ${room.name}，价格¥${room.price}/晚。\n\n📅 请告诉我您的入住和离开日期，格式如：\n• 1月15日入住，1月17日离开\n• 2025-01-15到2025-01-17\n• 15号到17号`
      } else {
        return `🍄 抱歉，没有找到${params.roomNumber}号房。请重新选择房间。`
      }
    }
    
    return '🏠 请告诉我您想预订哪个房间，我来为您安排！您可以说"帮我预订202号房"。'
  }

  // 处理日期输入
  private handleDateInput(params: any): string {
    if (!this.bookingSession || !this.bookingSession.selectedRoom) {
      return '🍄 请先选择要预订的房间。'
    }

    const dates = this.parseDates(params.dateText)
    if (!dates.checkIn || !dates.checkOut) {
      return '📅 抱歉，我没有理解您的日期。请重新输入，例如："1月15日到17日" 或 "2025-01-15到2025-01-17"'
    }

    this.bookingSession.checkInDate = dates.checkIn
    this.bookingSession.checkOutDate = dates.checkOut
    this.bookingSession.step = 'confirmation'

    const room = this.bookingSession.selectedRoom
    const nights = this.calculateNights(dates.checkIn, dates.checkOut)
    const totalAmount = room.price * nights

    return `🏨 **订单信息确认**\n\n🏠 房间：${room.code}号房 - ${room.name}\n📅 入住：${dates.checkIn}\n📅 离开：${dates.checkOut}\n🌙 住宿：${nights}晚\n💰 房费：¥${room.price}/晚 × ${nights}晚 = ¥${totalAmount}\n\n请确认以上信息是否正确？回复"确认"即可完成预订！`
  }

  // 处理预订确认
  private handleBookingConfirmation(): string {
    console.log('🎯 开始处理预订确认')

    if (!this.bookingSession || this.bookingSession.step !== 'confirmation') {
      console.log('❌ 没有待确认的订单')
      return '🍄 没有待确认的订单。'
    }

    try {
      const room = this.bookingSession.selectedRoom!
      const checkIn = this.bookingSession.checkInDate!
      const checkOut = this.bookingSession.checkOutDate!

      console.log('📊 基本信息:', { roomCode: room.code, checkIn, checkOut })

      const nights = this.calculateNights(checkIn, checkOut)
      const totalAmount = room.price * nights

      console.log('📊 订单计算完成:', { nights, totalAmount })

      // 创建订单
      const orderData = {
        roomId: room.id,
        roomCode: room.code,
        roomName: room.name,
        roomPrice: room.price,
        roomImage: room.image || this.getRoomImage(room.code),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights: nights,
        totalAmount: totalAmount,
        status: 'confirmed',
        userProfile: this.bookingSession.userProfile
      }

      console.log('📋 订单数据准备完成:', orderData)

      // 触发前端创建订单
      try {
        this.triggerOrderCreation(orderData)
        console.log('✅ 订单创建触发成功')
      } catch (orderError) {
        console.error('❌ 订单创建触发失败:', orderError)
        // 继续执行，不因为订单面板显示失败而中断整个流程
      }

      // 生成成功消息
      const roomCode = room.code || '未知'
      const successMessage = `🎉 付款成功！您的蘑菇屋已准备好啦～

电子入住单已发送至您的微信，包含：
✅ ${roomCode}号房电子门锁二维码
✅ 庄园地图与Wi-Fi密码
✅ 24小时管家热线

🏨 到店后只需对门口的小蘑菇说："普普，我到了！"
就会自动播放开门指引哦～

祝您在雨林中的蘑菇庄园度过奇幻的时光！
(有任何需要随时召唤普普🍄)`

      console.log('📝 成功消息生成完成')

      // 根据用户画像推荐套餐
      let packageRecommendation = ''
      try {
        const userProfile = this.bookingSession.userProfile
        packageRecommendation = this.generatePackageRecommendation(userProfile) || ''
        console.log('🎁 套餐推荐生成完成')
      } catch (packageError) {
        console.error('❌ 套餐推荐生成失败:', packageError)
        packageRecommendation = ''
      }

      // 重置预订会话
      this.bookingSession = null

      console.log('✅ 预订确认处理完成')

      const finalMessage = packageRecommendation ?
        successMessage + '\n\n' + packageRecommendation :
        successMessage

      return finalMessage

    } catch (error) {
      console.error('❌ 预订确认处理失败:', error)
      // 重置预订会话
      this.bookingSession = null
      return '🍄 抱歉，预订确认时出现了问题。请重新开始预订流程。'
    }
  }

  // 关键词匹配
  private matchKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword))
  }

  // 提取房间偏好
  private extractRoomPreferences(message: string): any {
    const params: any = {}
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('朝南')) params.direction = '朝南'
    if (lowerMessage.includes('窗户')) params.hasWindow = true
    if (lowerMessage.includes('安静')) params.quiet = true
    if (lowerMessage.includes('亲子')) params.familyFriendly = true
    
    return params
  }

  // 根据偏好筛选房间
  private filterRoomsByPreferences(rooms: Room[], params: any): Room[] {
    let filtered = [...rooms]
    
    if (params.familyFriendly) {
      filtered = filtered.filter(room => 
        room.type?.includes('亲子') || 
        room.name?.includes('亲子') || 
        room.category?.includes('亲子')
      )
    }
    
    if (params.quiet) {
      filtered = filtered.filter(room => {
        const floor = typeof room.floor === 'string' ? parseInt(room.floor) : room.floor
        return floor >= 2
      })
    }
    
    return filtered
  }

  // 解析日期
  private parseDates(dateText: string): { checkIn: string, checkOut: string } {
    const today = new Date()
    const currentYear = today.getFullYear()

    console.log('🗓️ 解析日期文本:', dateText)

    // 更精确的日期解析模式
    const patterns = [
      // 入住时间7月20日，离开时间7月25日
      /入住时间.*?(\d{1,2})月(\d{1,2})日.*?离开时间.*?(\d{1,2})月(\d{1,2})日/,
      // 7月20日入住，7月25日离开
      /(\d{1,2})月(\d{1,2})日.*?入住.*?(\d{1,2})月(\d{1,2})日.*?离开/,
      // 7月20日到7月25日
      /(\d{1,2})月(\d{1,2})日.*?到.*?(\d{1,2})月(\d{1,2})日/,
      // 20号到25号
      /(\d{1,2})号.*?到.*?(\d{1,2})号/,
      // 2025-07-20到2025-07-25
      /(\d{4})-(\d{1,2})-(\d{1,2}).*?到.*?(\d{4})-(\d{1,2})-(\d{1,2})/
    ]

    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      const match = dateText.match(pattern)
      if (match) {
        console.log('🎯 匹配到模式 ' + i + ':', pattern.source, '结果:', match)

        if (i === 0) {
          // 入住时间7月20日，离开时间7月25日
          const checkInMonth = match[1].padStart(2, '0')
          const checkInDay = match[2].padStart(2, '0')
          const checkOutMonth = match[3].padStart(2, '0')
          const checkOutDay = match[4].padStart(2, '0')
          return {
            checkIn: `${currentYear}-${checkInMonth}-${checkInDay}`,
            checkOut: `${currentYear}-${checkOutMonth}-${checkOutDay}`
          }
        } else if (i === 1) {
          // 7月20日入住，7月25日离开
          const checkInMonth = match[1].padStart(2, '0')
          const checkInDay = match[2].padStart(2, '0')
          const checkOutMonth = match[3].padStart(2, '0')
          const checkOutDay = match[4].padStart(2, '0')
          return {
            checkIn: `${currentYear}-${checkInMonth}-${checkInDay}`,
            checkOut: `${currentYear}-${checkOutMonth}-${checkOutDay}`
          }
        } else if (i === 2) {
          // 7月20日到7月25日
          const checkInMonth = match[1].padStart(2, '0')
          const checkInDay = match[2].padStart(2, '0')
          const checkOutMonth = match[3].padStart(2, '0')
          const checkOutDay = match[4].padStart(2, '0')
          return {
            checkIn: `${currentYear}-${checkInMonth}-${checkInDay}`,
            checkOut: `${currentYear}-${checkOutMonth}-${checkOutDay}`
          }
        } else if (i === 3) {
          // 20号到25号 - 假设是当前月
          const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0')
          const day1 = match[1].padStart(2, '0')
          const day2 = match[2].padStart(2, '0')
          return {
            checkIn: `${currentYear}-${currentMonth}-${day1}`,
            checkOut: `${currentYear}-${currentMonth}-${day2}`
          }
        } else if (i === 4) {
          // 完整日期格式 2025-07-20到2025-07-25
          return {
            checkIn: `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`,
            checkOut: `${match[4]}-${match[5].padStart(2, '0')}-${match[6].padStart(2, '0')}`
          }
        }
      }
    }

    console.log('❌ 未能解析日期')
    return { checkIn: '', checkOut: '' }
  }

  // 计算住宿天数
  private calculateNights(checkIn: string, checkOut: string): number {
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const diffTime = checkOutDate.getTime() - checkInDate.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // 分析用户画像
  private analyzeUserProfile(text: string): UserProfile {
    const lowerText = text.toLowerCase()
    
    if (this.matchKeywords(lowerText, ['带孩子', '家庭出游', '亲子'])) {
      return { type: 'family_with_children', keywords: ['亲子'], preferences: ['安全', '宽敞'] }
    }
    
    if (this.matchKeywords(lowerText, ['茶文化', '传统工艺'])) {
      return { type: 'culture_enthusiast', keywords: ['茶文化'], preferences: ['文化体验'] }
    }
    
    return { type: 'solo', keywords: [], preferences: [] }
  }

  // 生成套餐推荐
  private generatePackageRecommendation(userProfile?: UserProfile): string {
    if (!userProfile) return ''
    
    if (userProfile.type === 'family_with_children') {
      return `🎁 **特别为您推荐亲子套餐**\n\n🏨 **"蘑菇森林亲子奇遇"套餐**\n• 民宿住宿 + 儿童茶艺启蒙课 + 蘑菇森林探索\n• 原价：¥680，套餐价：¥578 (优惠15%)\n• 包含数字孪生场景路线图导览`
    }
    
    if (userProfile.type === 'culture_enthusiast') {
      return `🎁 **特别为您推荐文化体验套餐**\n\n🏨 **"普洱茶文化深度体验"套餐**\n• 民宿住宿 + 手工制茶体验 + 普洱茶品鉴课程\n• 原价：¥580，套餐价：¥464 (优惠20%)\n• 联动周边非遗工坊资源`
    }
    
    return ''
  }

  // 触发前端房间推荐显示
  private triggerRoomRecommendation(rooms: Room[]) {
    if (typeof window !== 'undefined' && (window as any).showRoomRecommendations) {
      (window as any).showRoomRecommendations(rooms)
    }
  }

  // 获取房间图片
  private getRoomImage(roomCode: string): string {
    const room = this.rooms.find(r => r.code === roomCode)
    if (room?.floor === '1楼' || room?.floor === 1) {
      return '/src/assets/images/实地调研/房间调研/房间调研1.jpg'
    } else if (room?.floor === '2楼' || room?.floor === 2) {
      return '/src/assets/images/实地调研/房间调研/房间调研2.jpg'
    } else if (room?.floor === '3楼' || room?.floor === 3) {
      return '/src/assets/images/实地调研/房间调研/房间调研3.jpg'
    }
    return '/src/assets/images/实地调研/房间调研/房间调研1.jpg'
  }

  // 获取房间图片
  private getRoomImage(roomCode: string): string {
    const room = this.rooms.find(r => r.code === roomCode)
    if (room?.floor === '1楼' || room?.floor === 1) {
      return '/src/assets/images/实地调研/房间调研/房间调研1.jpg'
    } else if (room?.floor === '2楼' || room?.floor === 2) {
      return '/src/assets/images/实地调研/房间调研/房间调研2.jpg'
    } else if (room?.floor === '3楼' || room?.floor === 3) {
      return '/src/assets/images/实地调研/房间调研/房间调研3.jpg'
    }
    return '/src/assets/images/实地调研/房间调研/房间调研1.jpg'
  }

  // 生成采茶活动推荐
  private generateTeaActivityRecommendation(params: any): string {
    console.log('🍵 生成采茶活动推荐:', params)

    // 获取用户入住时间
    const checkInDate = this.lastOrder?.checkInDate || this.getDefaultCheckInDate()
    const checkOutDate = this.lastOrder?.checkOutDate || this.getDefaultCheckOutDate()

    console.log('📅 用户入住时间:', { checkInDate, checkOutDate })

    // 根据用户偏好筛选活动
    let recommendedActivities = this.filterActivitiesByPreferences(this.teaActivities, params)

    // 根据入住时间筛选可用场次
    recommendedActivities = this.filterActivitiesByStayDates(recommendedActivities, checkInDate, checkOutDate)

    if (recommendedActivities.length === 0) {
      return '🍵 抱歉，您的入住期间暂无可用的采茶活动。请联系客服了解更多信息。'
    }

    let response = '🍵 太好了！根据您的入住时间，我为您推荐以下采茶活动：\n\n'

    recommendedActivities.forEach((activity, index) => {
      response += `🌿 **${activity.name}**\n`
      response += `📝 ${activity.description}\n`
      response += `⏰ 时长：${activity.duration} | 💰 价格：¥${activity.price}/人\n`
      response += `👥 适合：${activity.ageLimit} | 🎯 难度：${this.getDifficultyText(activity.difficulty)}\n`
      response += `📍 地点：${activity.location}\n`
      response += `👨‍🏫 指导：${activity.instructor}\n`

      // 显示可用场次
      const availableSlots = this.getAvailableSlots(activity, checkInDate, checkOutDate)
      if (availableSlots.length > 0) {
        response += `📅 可选场次：\n`
        availableSlots.forEach((slot, slotIndex) => {
          response += `   ${slotIndex + 1}. ${slot.date} ${slot.startTime}-${slot.endTime} (余${slot.availableSpots}位)\n`
        })
      }

      response += `✨ 包含：${activity.includes.join('、')}\n\n`
    })

    response += '💡 如果您想参加某个活动，可以说"我要参加传统采茶体验"或"报名第1个活动的第2场次"'

    return response
  }

  // 处理活动选择
  private handleActivitySelection(params: any): string {
    console.log('🎯 处理活动选择:', params)

    // 这里可以解析用户的选择并创建活动预订
    return '✅ 活动报名成功！我们会在入住前1天通过微信联系您确认具体安排。\n\n📱 如需修改或取消，请提前24小时联系客服。'
  }

  // 提取活动偏好
  private extractActivityPreferences(message: string): any {
    const params: any = {}
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('亲子') || lowerMessage.includes('家庭') || lowerMessage.includes('孩子')) {
      params.familyFriendly = true
    }

    if (lowerMessage.includes('简单') || lowerMessage.includes('容易') || lowerMessage.includes('初学')) {
      params.difficulty = 'easy'
    }

    if (lowerMessage.includes('深度') || lowerMessage.includes('专业') || lowerMessage.includes('制茶')) {
      params.advanced = true
    }

    return params
  }

  // 提取活动选择
  private extractActivitySelection(message: string): any {
    const params: any = {}

    // 解析活动名称或序号
    const activityMatch = message.match(/第?(\d+)个?活动|(\w+体验|\w+工坊|\w+探险)/)
    if (activityMatch) {
      params.activityIndex = activityMatch[1] ? parseInt(activityMatch[1]) - 1 : null
      params.activityName = activityMatch[2] || null
    }

    // 解析场次
    const slotMatch = message.match(/第?(\d+)场?次?|(\d+)号场次/)
    if (slotMatch) {
      params.slotIndex = parseInt(slotMatch[1] || slotMatch[2]) - 1
    }

    return params
  }

  // 根据偏好筛选活动
  private filterActivitiesByPreferences(activities: TeaActivity[], params: any): TeaActivity[] {
    let filtered = [...activities]

    if (params.familyFriendly) {
      filtered = filtered.filter(activity =>
        activity.name.includes('亲子') ||
        activity.ageLimit.includes('3岁') ||
        activity.id === 'family_tea_adventure'
      )
    }

    if (params.difficulty) {
      filtered = filtered.filter(activity => activity.difficulty === params.difficulty)
    }

    if (params.advanced) {
      filtered = filtered.filter(activity =>
        activity.name.includes('制茶') ||
        activity.difficulty === 'medium' ||
        activity.id === 'tea_making_workshop'
      )
    }

    return filtered
  }

  // 根据入住时间筛选活动
  private filterActivitiesByStayDates(activities: TeaActivity[], checkInDate: string, checkOutDate: string): TeaActivity[] {
    return activities.map(activity => ({
      ...activity,
      schedule: activity.schedule.filter(schedule =>
        schedule.date >= checkInDate && schedule.date < checkOutDate
      )
    })).filter(activity => activity.schedule.length > 0)
  }

  // 获取可用场次
  private getAvailableSlots(activity: TeaActivity, checkInDate: string, checkOutDate: string): any[] {
    const slots: any[] = []

    activity.schedule.forEach(schedule => {
      if (schedule.date >= checkInDate && schedule.date < checkOutDate) {
        schedule.timeSlots.forEach(slot => {
          if (slot.status === 'available' && slot.availableSpots > 0) {
            slots.push({
              date: schedule.date,
              startTime: slot.startTime,
              endTime: slot.endTime,
              availableSpots: slot.availableSpots,
              slotId: slot.id
            })
          }
        })
      }
    })

    return slots
  }

  // 获取难度文本
  private getDifficultyText(difficulty: string): string {
    const difficultyMap = {
      'easy': '简单',
      'medium': '中等',
      'hard': '困难'
    }
    return difficultyMap[difficulty] || '未知'
  }

  // 获取默认入住日期
  private getDefaultCheckInDate(): string {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // 获取默认离开日期
  private getDefaultCheckOutDate(): string {
    const today = new Date()
    today.setDate(today.getDate() + 2)
    return today.toISOString().split('T')[0]
  }

  // 触发前端订单创建
  private triggerOrderCreation(orderData: any) {
    console.log('🎯 触发订单创建:', orderData)
    // 保存订单信息用于后续活动推荐
    this.lastOrder = orderData

    if (typeof window !== 'undefined' && (window as any).createOrder) {
      console.log('✅ 调用全局createOrder函数')
      (window as any).createOrder(orderData)
    } else {
      console.error('❌ 全局createOrder函数不存在')
    }
  }
}

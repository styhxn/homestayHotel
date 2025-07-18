// 订单服务 - 处理AI创建的真实订单
import request from '../utils/request'

export interface OrderCreateData {
  roomId: number
  roomCode: string
  checkInDate: string
  checkOutDate: string
  guests: number
  totalPrice: number
  nights: number
  source: 'ai' | 'manual'
  aiSessionId?: string
  aiMessageId?: string
  specialRequests?: string
}

export interface OrderResponse {
  success: boolean
  orderId?: string
  message: string
  data?: any
}

export class OrderService {
  
  // 创建AI订单
  static async createAIOrder(orderData: OrderCreateData): Promise<OrderResponse> {
    try {
      console.log('🛒 创建AI订单:', orderData)

      // 验证订单数据
      const validation = this.validateOrderData(orderData)
      if (!validation.valid) {
        return {
          success: false,
          message: validation.message
        }
      }

      // 准备订单数据
      const requestData = {
        roomId: orderData.roomId,
        checkInDate: orderData.checkInDate,
        checkOutDate: orderData.checkOutDate,
        guests: orderData.guests,
        totalPrice: orderData.totalPrice,
        source: 'AI智能助手',
        remark: `AI助手创建订单 - 会话ID: ${orderData.aiSessionId || 'unknown'}`,
        status: '预订' // 默认状态为预订
      }

      // 调用后端API创建订单
      const response = await request.post('/h/order/create', requestData)
      
      if (response.data.code === '200') {
        console.log('✅ AI订单创建成功:', response.data.data)
        return {
          success: true,
          orderId: response.data.data.id || response.data.data.orderNo,
          message: '订单创建成功！',
          data: response.data.data
        }
      } else {
        throw new Error(response.data.msg || '订单创建失败')
      }

    } catch (error: any) {
      console.error('❌ AI订单创建失败:', error)
      return {
        success: false,
        message: error.message || '订单创建失败，请稍后重试'
      }
    }
  }

  // 验证订单数据
  private static validateOrderData(orderData: OrderCreateData): { valid: boolean; message: string } {
    // 检查必填字段
    if (!orderData.roomId) {
      return { valid: false, message: '房间ID不能为空' }
    }

    if (!orderData.checkInDate || !orderData.checkOutDate) {
      return { valid: false, message: '入住和退房日期不能为空' }
    }

    // 检查日期格式和逻辑
    const checkIn = new Date(orderData.checkInDate)
    const checkOut = new Date(orderData.checkOutDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return { valid: false, message: '日期格式不正确' }
    }

    if (checkIn < today) {
      return { valid: false, message: '入住日期不能早于今天' }
    }

    if (checkOut <= checkIn) {
      return { valid: false, message: '退房日期必须晚于入住日期' }
    }

    // 检查住宿天数（最多30天）
    const maxNights = 30
    if (orderData.nights > maxNights) {
      return { valid: false, message: `住宿天数不能超过${maxNights}天` }
    }

    // 检查客人数量
    if (orderData.guests < 1 || orderData.guests > 10) {
      return { valid: false, message: '客人数量必须在1-10人之间' }
    }

    // 检查价格
    if (orderData.totalPrice <= 0) {
      return { valid: false, message: '订单总价必须大于0' }
    }

    return { valid: true, message: '验证通过' }
  }

  // 获取房间详细信息
  static async getRoomDetails(roomCode: string): Promise<any> {
    try {
      const response = await request.get(`/h/room/detail/${roomCode}`)
      if (response.data.code === '200') {
        return response.data.data
      }
      throw new Error('房间信息获取失败')
    } catch (error) {
      console.error('❌ 获取房间详情失败:', error)
      return null
    }
  }

  // 检查房间可用性
  static async checkRoomAvailability(roomId: number, checkIn: string, checkOut: string): Promise<boolean> {
    try {
      const response = await request.post('/h/room/check-availability', {
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut
      })
      
      return response.data.code === '200' && response.data.data === true
    } catch (error) {
      console.error('❌ 检查房间可用性失败:', error)
      return false
    }
  }

  // 计算订单价格
  static calculateOrderPrice(roomPrice: number, nights: number, guests: number = 1): number {
    let totalPrice = roomPrice * nights
    
    // 如果超过2人，可能需要加收费用
    if (guests > 2) {
      const extraGuestFee = 50 // 每增加一人加收50元/晚
      totalPrice += (guests - 2) * extraGuestFee * nights
    }
    
    return totalPrice
  }

  // 格式化订单摘要
  static formatOrderSummary(orderData: OrderCreateData, orderId: string): string {
    const checkInDate = new Date(orderData.checkInDate).toLocaleDateString('zh-CN')
    const checkOutDate = new Date(orderData.checkOutDate).toLocaleDateString('zh-CN')
    
    return `🎉 订单创建成功！\n\n` +
           `📋 **订单详情**\n` +
           `• 订单号：${orderId}\n` +
           `• 房间：${orderData.roomCode}号房\n` +
           `• 入住：${checkInDate}\n` +
           `• 退房：${checkOutDate}\n` +
           `• 住宿：${orderData.nights}晚\n` +
           `• 客人：${orderData.guests}人\n` +
           `• 总价：¥${orderData.totalPrice}元\n\n` +
           `🎁 **包含服务**\n` +
           `• 免费早餐\n` +
           `• 免费WiFi\n` +
           `• 茶艺体验\n` +
           `• 24小时热水\n\n` +
           `📱 您可以在"我的订单"中查看详情\n` +
           `📞 如有疑问，请联系客服：400-123-4567`
  }

  // 获取用户订单列表
  static async getUserOrders(userId?: string): Promise<any[]> {
    try {
      const response = await request.get('/h/order/my-orders')
      if (response.data.code === '200') {
        return response.data.data || []
      }
      return []
    } catch (error) {
      console.error('❌ 获取用户订单失败:', error)
      return []
    }
  }

  // 取消订单
  static async cancelOrder(orderId: string, reason?: string): Promise<OrderResponse> {
    try {
      const response = await request.post(`/h/order/cancel/${orderId}`, {
        reason: reason || 'AI助手取消'
      })
      
      if (response.data.code === '200') {
        return {
          success: true,
          message: '订单取消成功'
        }
      } else {
        throw new Error(response.data.msg || '订单取消失败')
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '订单取消失败'
      }
    }
  }

  // 修改订单
  static async modifyOrder(orderId: string, modifications: Partial<OrderCreateData>): Promise<OrderResponse> {
    try {
      const response = await request.put(`/h/order/modify/${orderId}`, modifications)
      
      if (response.data.code === '200') {
        return {
          success: true,
          message: '订单修改成功',
          data: response.data.data
        }
      } else {
        throw new Error(response.data.msg || '订单修改失败')
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '订单修改失败'
      }
    }
  }
}

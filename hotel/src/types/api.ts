// API响应类型定义

export interface ApiResponse<T = any> {
  code: number | string
  message?: string
  msg?: string
  data?: T
  success?: boolean
}

export interface PaginationData<T = any> {
  records: T[]
  total: number
  pages: number
  current: number
  size: number
}

// 用户相关类型
export interface User {
  id?: number
  username?: string
  email: string
  name?: string
  token: string
  role?: string
  status?: number
  avatar?: string
  phone?: string
  createTime?: string
  updateTime?: string
}

// 房间相关类型
export interface Room {
  id: number | string
  code: string
  name: string
  category: string
  price: number
  area?: string
  status: string | number
  floor: number | string
  features?: string[]
  vrUrl?: string
  image?: string
  maxGuests?: number
  seat?: number
  banner?: string
  description?: string
  rating?: number
  recommendReason?: string
  // AI房间选择页面额外属性
  roomType?: string
  height?: string
  hasWindow?: boolean
  windowDirection?: string
  direction?: string
  type?: string
}

// 订单相关类型
export interface Order {
  id: number
  orderNo: string
  userId: number
  roomId: number
  checkInDate: string
  checkOutDate: string
  totalPrice: number
  status: string | number
  guestName: string
  guestPhone: string
  guestCount: number
  createTime: string
  updateTime?: string
  room?: Room
  user?: User
  // 管理页面额外属性
  days?: number
  username?: string
  phone?: string
  idCard?: string
  roomCode?: string
  startDate?: string
  endDate?: string
  total?: number
  payState?: number
  state?: string
}

// 产品相关类型
export interface Product {
  id: number
  name: string
  description: string
  fullDescription?: string
  image: string
  gallery?: string[]
  price: number
  originalPrice?: number
  badge?: string
  categoryId?: string
  rating?: number
  reviews?: number
  specs?: string[]
  tags?: string[]
  isNew?: boolean
  isHot?: boolean
}

// 房间类型数据
export interface RoomType {
  name: string
  category: string
  price: number
  describe: string
  image: string
  features: string[]
  rating: number
  rooms: Array<{
    id: number
    code: string
    status: string
  }>
}

// 房间数据映射类型
export interface RoomDataMap {
  [key: string]: RoomType
}

// 简单房间数据类型（用于BookingView）
export interface SimpleRoomData {
  [key: number]: {
    name: string
    type: string
    price: number
    image: string
    code: string
  }
}

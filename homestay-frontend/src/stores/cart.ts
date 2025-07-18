import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export interface CartItem {
  id: number
  name: string
  description: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
  category: string
  specs?: string[]
}

export interface CartOrder {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  status: string
  createdAt: string
  shippingAddress?: string
  contactPhone?: string
  remarks?: string
}

export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore()
  
  // 购物车商品
  const items = ref<CartItem[]>([])
  
  // 订单历史
  const orders = ref<CartOrder[]>([])

  // 计算属性
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalAmount = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const originalTotalAmount = computed(() => {
    return items.value.reduce((total, item) => {
      const price = item.originalPrice || item.price
      return total + (price * item.quantity)
    }, 0)
  })

  const savedAmount = computed(() => {
    return originalTotalAmount.value - totalAmount.value
  })

  // 添加商品到购物车
  const addToCart = (product: any, quantity: number = 1) => {
    if (!authStore.isAuthenticated) {
      throw new Error('请先登录')
    }

    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity,
        category: product.category,
        specs: product.specs
      }
      items.value.push(cartItem)
    }

    // 保存到localStorage
    saveCartToStorage()
  }

  // 更新商品数量
  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveCartToStorage()
      }
    }
  }

  // 从购物车移除商品
  const removeFromCart = (productId: number) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveCartToStorage()
    }
  }

  // 清空购物车
  const clearCart = () => {
    items.value = []
    saveCartToStorage()
  }

  // 创建订单
  const createOrder = async (orderInfo: {
    shippingAddress: string
    contactPhone: string
    remarks?: string
  }) => {
    if (!authStore.isAuthenticated) {
      throw new Error('请先登录')
    }

    if (items.value.length === 0) {
      throw new Error('购物车为空')
    }

    const order: CartOrder = {
      id: 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11),
      userId: String(authStore.user?.id || authStore.user?.username || 'unknown'),
      items: [...items.value],
      totalAmount: totalAmount.value,
      status: '待发货',
      createdAt: new Date().toISOString(),
      shippingAddress: orderInfo.shippingAddress,
      contactPhone: orderInfo.contactPhone,
      remarks: orderInfo.remarks
    }

    // 添加到订单历史
    orders.value.unshift(order)
    
    // 清空购物车
    clearCart()
    
    // 保存订单到localStorage
    saveOrdersToStorage()

    // 模拟发送到后端API
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.user?.token || ''}`
        },
        body: JSON.stringify({
          orderNo: order.id,
          userId: order.userId,
          items: order.items,
          totalAmount: order.totalAmount,
          status: order.status,
          shippingAddress: order.shippingAddress,
          contactPhone: order.contactPhone,
          remarks: order.remarks,
          orderType: 'product' // 区分产品订单和房间订单
        })
      })

      if (response.ok) {
        console.log('订单已同步到后端')
      }
    } catch (error) {
      console.log('后端同步失败，订单已保存到本地:', error)
    }

    return order
  }

  // 获取用户订单
  const getUserOrders = () => {
    if (!authStore.isAuthenticated) {
      return []
    }
    
    const userId = authStore.user?.id || authStore.user?.username
    return orders.value.filter(order => order.userId === userId)
  }

  // 保存购物车到localStorage
  const saveCartToStorage = () => {
    if (authStore.isAuthenticated) {
      const userId = authStore.user?.id || authStore.user?.username
      localStorage.setItem(`cart_${userId}`, JSON.stringify(items.value))
    }
  }

  // 从localStorage加载购物车
  const loadCartFromStorage = () => {
    if (authStore.isAuthenticated) {
      const userId = authStore.user?.id || authStore.user?.username
      const savedCart = localStorage.getItem(`cart_${userId}`)
      if (savedCart) {
        items.value = JSON.parse(savedCart)
      }
    }
  }

  // 保存订单到localStorage
  const saveOrdersToStorage = () => {
    localStorage.setItem('product_orders', JSON.stringify(orders.value))
  }

  // 从localStorage加载订单
  const loadOrdersFromStorage = () => {
    const savedOrders = localStorage.getItem('product_orders')
    if (savedOrders) {
      orders.value = JSON.parse(savedOrders)
    }
  }

  // 用户登录时加载数据
  const initializeUserData = () => {
    loadCartFromStorage()
    loadOrdersFromStorage()
  }

  // 用户登出时清空数据
  const clearUserData = () => {
    items.value = []
  }

  return {
    // 状态
    items,
    orders,
    
    // 计算属性
    totalItems,
    totalAmount,
    originalTotalAmount,
    savedAmount,
    
    // 方法
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    getUserOrders,
    initializeUserData,
    clearUserData,
    saveCartToStorage,
    loadCartFromStorage
  }
})

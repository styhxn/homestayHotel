// 聊天记录持久化存储
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: string
  roomRecommendations?: any[]
  orderInfo?: any
}

export interface ChatSession {
  id: string
  userId: string
  sessionName: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
  context: {
    selectedRoom?: any
    bookingState?: any
    userPreferences?: any
  }
}

export const useChatHistoryStore = defineStore('chatHistory', () => {
  const authStore = useAuthStore()
  const sessions = ref<ChatSession[]>([])
  const currentSessionId = ref<string>('')
  const isLoading = ref(false)

  // 获取当前会话
  const getCurrentSession = (): ChatSession | null => {
    return sessions.value.find(s => s.id === currentSessionId.value) || null
  }

  // 创建新会话
  const createSession = (userId: string, sessionName?: string): string => {
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
    const newSession: ChatSession = {
      id: sessionId,
      userId,
      sessionName: sessionName || `AI选房会话 ${new Date().toLocaleString()}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      context: {}
    }
    
    sessions.value.unshift(newSession)
    currentSessionId.value = sessionId
    
    // 保存到localStorage
    saveToStorage()
    
    console.log('🆕 创建新会话:', sessionId)
    return sessionId
  }

  // 添加消息到当前会话
  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>): void => {
    const session = getCurrentSession()
    if (!session) {
      console.warn('⚠️ 没有活动会话，无法添加消息')
      return
    }

    const newMessage: ChatMessage = {
      ...message,
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toLocaleTimeString()
    }

    session.messages.push(newMessage)
    session.updatedAt = new Date().toISOString()
    
    // 保存到localStorage
    saveToStorage()
    
    console.log('💬 添加消息到会话:', session.id, newMessage)
  }

  // 更新会话上下文
  const updateSessionContext = (context: Partial<ChatSession['context']>): void => {
    const session = getCurrentSession()
    if (!session) return

    session.context = { ...session.context, ...context }
    session.updatedAt = new Date().toISOString()
    
    saveToStorage()
  }

  // 获取用户的所有会话
  const getUserSessions = (userId: string): ChatSession[] => {
    return sessions.value.filter(s => s.userId === userId)
  }

  // 切换到指定会话
  const switchToSession = (sessionId: string): boolean => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      currentSessionId.value = sessionId
      console.log('🔄 切换到会话:', sessionId)
      return true
    }
    return false
  }

  // 删除会话
  const deleteSession = (sessionId: string): void => {
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index > -1) {
      sessions.value.splice(index, 1)
      if (currentSessionId.value === sessionId) {
        currentSessionId.value = ''
      }
      saveToStorage()
      console.log('🗑️ 删除会话:', sessionId)
    }
  }

  // 清空所有会话
  const clearAllSessions = (): void => {
    sessions.value = []
    currentSessionId.value = ''
    localStorage.removeItem('chat_history')
    console.log('🧹 清空所有会话')
  }

  // 获取当前用户的存储键
  const getUserStorageKey = (): string => {
    const userId = authStore.user?.id || authStore.user?.username || 'guest'
    return `chat_history_${userId}`
  }

  // 保存到localStorage
  const saveToStorage = (): void => {
    if (!authStore.isAuthenticated) {
      return // 未登录不保存
    }

    try {
      const data = {
        sessions: sessions.value,
        currentSessionId: currentSessionId.value,
        userId: authStore.user?.id || authStore.user?.username
      }
      localStorage.setItem(getUserStorageKey(), JSON.stringify(data))
      console.log('💾 保存聊天记录:', sessions.value.length, '个会话')
    } catch (error) {
      console.error('❌ 保存聊天记录失败:', error)
    }
  }

  // 从localStorage加载
  const loadFromStorage = (): void => {
    if (!authStore.isAuthenticated) {
      return // 未登录不加载
    }

    try {
      const data = localStorage.getItem(getUserStorageKey())
      if (data) {
        const parsed = JSON.parse(data)
        // 验证数据是否属于当前用户
        const currentUserId = authStore.user?.id || authStore.user?.username
        if (parsed.userId === currentUserId) {
          sessions.value = parsed.sessions || []
          currentSessionId.value = parsed.currentSessionId || ''
          console.log('📂 加载聊天记录:', sessions.value.length, '个会话')
        } else {
          // 用户不匹配，清空数据
          sessions.value = []
          currentSessionId.value = ''
          console.log('🔄 用户不匹配，重置聊天记录')
        }
      }
    } catch (error) {
      console.error('❌ 加载聊天记录失败:', error)
    }
  }

  // 清空当前用户的聊天记录
  const clearUserData = (): void => {
    sessions.value = []
    currentSessionId.value = ''
    if (authStore.isAuthenticated) {
      localStorage.removeItem(getUserStorageKey())
    }
    console.log('🧹 清空用户聊天记录')
  }

  // 用户登录时初始化数据
  const initializeUserData = (): void => {
    loadFromStorage()
  }

  // 用户登出时清空数据
  const onUserLogout = (): void => {
    clearUserData()
  }

  // 导出会话数据
  const exportSession = (sessionId: string): string | null => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (!session) return null

    return JSON.stringify(session, null, 2)
  }

  // 获取会话统计
  const getSessionStats = (sessionId: string) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (!session) return null

    return {
      totalMessages: session.messages.length,
      userMessages: session.messages.filter(m => m.type === 'user').length,
      aiMessages: session.messages.filter(m => m.type === 'ai').length,
      roomRecommendations: session.messages.filter(m => m.roomRecommendations && m.roomRecommendations.length > 0).length,
      orders: session.messages.filter(m => m.orderInfo).length,
      duration: new Date(session.updatedAt).getTime() - new Date(session.createdAt).getTime()
    }
  }

  // 搜索消息
  const searchMessages = (query: string, sessionId?: string): ChatMessage[] => {
    const targetSessions = sessionId 
      ? sessions.value.filter(s => s.id === sessionId)
      : sessions.value

    const results: ChatMessage[] = []
    targetSessions.forEach(session => {
      session.messages.forEach(message => {
        if (message.content.toLowerCase().includes(query.toLowerCase())) {
          results.push(message)
        }
      })
    })

    return results
  }

  // 初始化时加载数据
  loadFromStorage()

  return {
    // 状态
    sessions,
    currentSessionId,
    isLoading,
    
    // 方法
    getCurrentSession,
    createSession,
    addMessage,
    updateSessionContext,
    getUserSessions,
    switchToSession,
    deleteSession,
    clearAllSessions,
    saveToStorage,
    loadFromStorage,
    exportSession,
    getSessionStats,
    searchMessages,
    clearUserData,
    initializeUserData,
    onUserLogout,
    getUserStorageKey
  }
})

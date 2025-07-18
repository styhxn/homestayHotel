// Dify聊天服务
export interface DifyChatMessage {
  inputs?: any
  query: string
  response_mode: string
  conversation_id?: string
  user: string
}

export interface DifyChatResponse {
  event: string
  data: any
  conversation_id?: string
  message_id?: string
}

export class DifyChatService {
  private baseURL: string
  private conversationId: string | null = null
  private token: string

  constructor() {
    // 使用统一的 Dify 服务地址
    this.baseURL = 'http://4295a4ce.r28.cpolar.top/v1'
    this.token = 'app-oaUwvb7k2zbC8Bi03EO977nN'
  }

  /**
   * 发送聊天消息
   */
  async sendMessage(message: string, userId: string = 'user'): Promise<ReadableStream> {
    const chatMessage: DifyChatMessage = {
      inputs: {},
      query: message,
      response_mode: 'streaming',
      conversation_id: this.conversationId || undefined,
      user: userId
    }

    console.log('🚀 发送 Dify 消息:', { message, userId, baseURL: this.baseURL })

    try {
      const response = await fetch(`${this.baseURL}/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(chatMessage)
      })

      console.log('📡 Dify 响应状态:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Dify API 错误:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      return response.body!
    } catch (error) {
      console.error('❌ 发送消息失败:', error)
      throw error
    }
  }

  /**
   * 处理SSE流式响应
   */
  async *processStreamResponse(stream: ReadableStream): AsyncGenerator<string, void, unknown> {
    const reader = stream.getReader()
    const decoder = new TextDecoder()

    console.log('🔄 开始处理 Dify 流式响应...')

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          console.log('✅ Dify 流式响应处理完成')
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.trim() === '') continue

          console.log('📝 处理行:', line)

          // 处理SSE格式的数据
          if (line.startsWith('data: ')) {
            const data = line.slice(6)

            if (data === '[DONE]') {
              console.log('🏁 收到结束信号')
              return
            }

            try {
              const parsed = JSON.parse(data)
              console.log('📊 解析的数据:', parsed)

              // 更新会话ID
              if (parsed.conversation_id) {
                this.conversationId = parsed.conversation_id
                console.log('🆔 更新会话ID:', this.conversationId)
              }

              // 处理不同类型的事件
              if (parsed.event === 'message' && parsed.answer) {
                // Dify 返回的完整消息
                console.log('💬 收到完整消息:', parsed.answer)
                yield parsed.answer
              } else if (parsed.event === 'agent_message' && parsed.answer) {
                // Agent 消息
                console.log('🤖 收到 Agent 消息:', parsed.answer)
                yield parsed.answer
              } else if (parsed.event === 'message_replace' && parsed.answer) {
                // 消息替换
                console.log('🔄 消息替换:', parsed.answer)
                yield parsed.answer
              } else if (parsed.event === 'message_end') {
                console.log('🏁 消息结束')
                return
              } else if (parsed.answer) {
                // 其他包含 answer 的情况
                console.log('📨 其他消息:', parsed.answer)
                yield parsed.answer
              }
            } catch (e) {
              console.log('⚠️ JSON 解析失败，直接返回文本:', data)
              // 如果不是JSON格式，直接返回文本
              if (data && data !== '[DONE]') {
                yield data
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * 重置会话
   */
  resetConversation() {
    this.conversationId = null
  }

  /**
   * 获取当前会话ID
   */
  getConversationId(): string | null {
    return this.conversationId
  }
}

// 创建单例实例
export const difyChatService = new DifyChatService()

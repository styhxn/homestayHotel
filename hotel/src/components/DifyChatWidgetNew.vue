<template>
  <div class="dify-chat-widget">
    <!-- 自定义聊天界面 -->
    <div class="chat-container">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <div class="ai-avatar-section">
          <div class="ai-avatar-circle">
            <video
              :src="'/src/assets/images/IP形象/37b48b40dbc80e2a44dce0f626120357_raw.mp4'"
              alt="普普AI助手"
              class="ai-character-video"
              autoplay
              loop
              muted
              playsinline
            ></video>
            <div class="status-indicator" :class="{ 'online': isDifyConnected }"></div>
          </div>
          <div class="ai-info-section">
            <h3 class="ai-name">普普 AI助手</h3>
            <p class="ai-title">专属选房顾问</p>
            <div class="connection-status">
              <span class="status-dot" :class="{ 'online': isDifyConnected }"></span>
              <span class="status-text">{{ isDifyConnected ? '在线' : '连接中...' }}</span>
              <button v-if="!isDifyConnected" @click="initializeDify" class="reconnect-btn">
                重新连接
              </button>
              <button v-if="isDifyConnected && conversationId" @click="resetConversation" class="reset-btn">
                新对话
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 聊天消息区域 -->
      <div class="chat-messages" ref="chatMessages">
        <!-- 调试信息 -->
        <div style="padding: 10px; background: #f0f0f0; margin: 5px; border-radius: 5px; font-size: 12px;">
          聊天历史总数: {{ chatHistory.length }}
          <br>
          消息列表: {{ chatHistory.map(m => `${m.type}-${m.id}`).join(', ') }}
        </div>

        <div v-for="message in chatHistory" :key="message.id" class="message" :class="message.type">
          <!-- 消息类型标识 -->
          <div style="position: absolute; top: -15px; left: 0; font-size: 10px; color: red; background: yellow; padding: 2px;">
            {{ message.type }}
          </div>

          <div class="message-avatar" v-if="message.type === 'assistant'">
            <video
              :src="'/src/assets/images/IP形象/37b48b40dbc80e2a44dce0f626120357_raw.mp4'"
              class="avatar-video"
              autoplay
              loop
              muted
              playsinline
            ></video>
          </div>

          <!-- 用户消息头像 -->
          <div class="message-avatar user-avatar" v-if="message.type === 'user'" style="background: #d4af37; display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-user" style="color: white;"></i>
          </div>

          <div class="message-content">
            <div class="message-text" v-html="formatMessageContent(message.content)"></div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
        
        <!-- AI正在输入指示器 -->
        <div v-if="isAITyping" class="message assistant typing-indicator">
          <div class="message-avatar">
            <video
              :src="'/src/assets/images/IP形象/37b48b40dbc80e2a44dce0f626120357_raw.mp4'"
              class="avatar-video"
              autoplay
              loop
              muted
              playsinline
            ></video>
          </div>
          <div class="message-content">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input">
        <div class="input-container">
          <input
            v-model="userInput"
            @keypress.enter="sendMessage"
            placeholder="请输入您的需求，比如：推荐便宜的房间..."
            class="message-input"
            :disabled="!isDifyConnected || isAITyping"
          />
          <button @click="sendMessage" class="send-button" :disabled="!userInput.trim() || !isDifyConnected || isAITyping">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// Props
interface Props {
  containerId?: string
  autoLoad?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  containerId: 'dify-chat-container',
  autoLoad: true
})

// Emits
const emit = defineEmits<{
  loaded: []
  error: [message: string]
  message: [data: any]
}>()

// 响应式数据
const chatHistory = ref<any[]>([])
const userInput = ref('')
const isAITyping = ref(false)
const isDifyConnected = ref(false)
const conversationId = ref('')
const chatMessages = ref<HTMLElement | null>(null)

// Dify配置
const DIFY_CONFIG = {
  apiKey: 'app-oaUwvb7k2zbC8Bi03EO977nN',
  baseUrl: 'http://4295a4ce.r28.cpolar.top/v1',
  chatUrl: 'http://4295a4ce.r28.cpolar.top/v1/chat-messages'
}

// 初始化Dify连接
const initializeDify = async () => {
  try {
    console.log('正在连接Dify服务...')
    console.log('使用API Key:', DIFY_CONFIG.apiKey)
    console.log('Base URL:', DIFY_CONFIG.baseUrl)

    // 先测试基础连接
    const baseResponse = await fetch(`${DIFY_CONFIG.baseUrl}/parameters`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DIFY_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('基础连接测试状态:', baseResponse.status)

    if (baseResponse.ok) {
      // 基础连接成功，测试聊天API
      const testResponse = await fetch(DIFY_CONFIG.chatUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DIFY_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {},
          query: 'hello',
          response_mode: 'blocking',
          user: 'test-user'
        })
      })

      console.log('聊天API测试状态:', testResponse.status)

      if (testResponse.ok) {
        isDifyConnected.value = true
        console.log('🎉 Dify服务连接成功！聊天API正常工作')

        // 添加欢迎消息
        addWelcomeMessage()
        emit('loaded')
      } else {
        console.error('聊天API测试失败:', testResponse.status)
        const errorText = await testResponse.text()
        console.error('聊天API错误详情:', errorText)
        throw new Error(`聊天API错误: ${testResponse.status}`)
      }
    } else {
      console.error('基础连接失败:', baseResponse.status)
      throw new Error(`基础连接失败: ${baseResponse.status}`)
    }
  } catch (error) {
    console.error('Dify连接失败:', error)

    // 连接失败时的处理
    isDifyConnected.value = false
    emit('error', `无法连接到Dify服务: ${error instanceof Error ? error.message : String(error)}`)

    // 仍然添加欢迎消息，但标明离线状态
    console.log('Dify连接失败，但仍可使用基本功能')
    addWelcomeMessage()
  }
}

// 添加欢迎消息
const addWelcomeMessage = () => {
  const welcomeMessage = {
    id: Date.now(),
    type: 'assistant',
    content: '您好！我是普普AI助手，您的专属选房顾问。我可以根据您的需求为您推荐最适合的房间。请告诉我您的需求，比如预算、房型偏好等。',
    timestamp: new Date().toISOString()
  }
  chatHistory.value.push(welcomeMessage)
  scrollToBottom()
}

// 重置会话
const resetConversation = () => {
  console.log('重置会话，清空聊天历史和会话ID')
  conversationId.value = ''
  chatHistory.value = []
  addWelcomeMessage()
}



// 发送消息到Dify
const sendMessage = async () => {
  if (!userInput.value.trim() || !isDifyConnected.value || isAITyping.value) return
  
  const message = userInput.value.trim()
  
  // 添加用户消息
  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: message,
    timestamp: new Date().toISOString()
  }
  chatHistory.value.push(userMessage)
  userInput.value = ''
  scrollToBottom()
  
  // 显示AI正在输入
  isAITyping.value = true
  
  try {
    console.log('发送消息到Dify:', message)

    if (!isDifyConnected.value) {
      throw new Error('Dify服务未连接')
    }

    // 准备请求体
    const requestBody: any = {
      inputs: {},
      query: message,
      response_mode: 'blocking',
      user: 'user-' + Date.now()
    }

    // 只有在有有效会话ID时才添加conversation_id
    if (conversationId.value && conversationId.value.trim()) {
      requestBody.conversation_id = conversationId.value
      console.log('使用现有会话ID:', conversationId.value)
    } else {
      console.log('开始新会话（无会话ID）')
    }

    console.log('发送请求体:', JSON.stringify(requestBody, null, 2))

    // 调用Dify API
    const response = await fetch(DIFY_CONFIG.chatUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('Dify API响应状态:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('Dify响应数据:', data)

      // 更新会话ID
      if (data.conversation_id) {
        conversationId.value = data.conversation_id
      }

      // 添加AI回复
      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.answer || '抱歉，我没有理解您的问题，请重新描述。',
        timestamp: new Date().toISOString()
      }
      chatHistory.value.push(aiMessage)

      // 发送消息给父组件进行解析
      emit('message', {
        type: 'ai',
        content: aiMessage.content,
        timestamp: aiMessage.timestamp
      })

    } else {
      // API调用失败
      const errorText = await response.text()
      console.error(`Dify API调用失败 (${response.status}):`, errorText)

      // 如果是404错误且提到会话不存在，重置会话ID
      if (response.status === 404 && errorText.includes('Conversation Not Exists')) {
        console.log('会话不存在，重置会话ID并重试')
        conversationId.value = ''

        // 重试一次（不带会话ID）
        try {
          const retryResponse = await fetch(DIFY_CONFIG.chatUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${DIFY_CONFIG.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              inputs: {},
              query: message,
              response_mode: 'blocking',
              user: 'user-' + Date.now()
            })
          })

          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            console.log('重试成功，Dify响应数据:', retryData)

            // 更新会话ID
            if (retryData.conversation_id) {
              conversationId.value = retryData.conversation_id
              console.log('新会话ID:', conversationId.value)
            }

            // 添加AI回复
            const aiMessage = {
              id: Date.now() + 1,
              type: 'assistant',
              content: retryData.answer || '抱歉，我没有理解您的问题，请重新描述。',
              timestamp: new Date().toISOString()
            }
            chatHistory.value.push(aiMessage)

            // 发送消息给父组件进行解析
            emit('message', {
              type: 'ai',
              content: aiMessage.content,
              timestamp: aiMessage.timestamp
            })

            return // 重试成功，直接返回
          }
        } catch (retryError) {
          console.error('重试失败:', retryError)
        }
      }

      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `抱歉，AI服务暂时不可用（错误代码：${response.status}）。请稍后再试或联系管理员。`,
        timestamp: new Date().toISOString()
      }
      chatHistory.value.push(errorMessage)
    }
  } catch (error) {
    console.error('发送消息失败:', error)

    const errorMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: `抱歉，发送消息时出现错误：${error instanceof Error ? error.message : String(error)}。请检查网络连接或稍后再试。`,
      timestamp: new Date().toISOString()
    }
    chatHistory.value.push(errorMessage)
  } finally {
    isAITyping.value = false
    scrollToBottom()
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight
    }
  })
}

// 格式化时间
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 格式化消息内容，将Markdown链接转换为HTML链接
const formatMessageContent = (content: string) => {
  if (!content) return ''

  console.log('原始消息内容:', content)

  // 最彻底的解决方案：使用正则表达式完全清除所有错误的HTML片段
  let formattedContent = content
    // 清除所有形式的错误HTML片段
    .replace(/🏠 查看房型"[^>]*>🏠 查看房型/g, '')
    .replace(/- 🏠 查看房型"[^>]*>🏠 查看房型/g, '')
    .replace(/查看房型"[^>]*>🏠 查看房型/g, '')
    .replace(/查看房型"[^>]*>查看房型/g, '')
    .replace(/查看房间"[^>]*>查看房间/g, '')
    .replace(/查看详情"[^>]*>查看详情/g, '')
    // 清除任何包含target="_blank"的片段
    .replace(/[^<]*" target="_blank"[^>]*>[^<]*/g, '')
    // 清除任何包含rel="noopener noreferrer"的片段
    .replace(/[^<]*rel="noopener noreferrer"[^>]*>[^<]*/g, '')
    // 清除任何包含class="message-link"的片段
    .replace(/[^<]*class="message-link"[^>]*>[^<]*/g, '')
    // 清除异常的链接格式，如：🏠 查看房型'}, '*')" class="message-link">🏠 查看房型
    .replace(/🏠 查看房型[^<]*class="message-link"[^>]*>🏠 查看房型/g, '')
    .replace(/查看房型[^<]*\*\)[^>]*>[^<]*/g, '')

  console.log('清理后内容:', formattedContent)

  // 在每个房间信息的价格行后添加链接
  formattedContent = formattedContent.replace(
    /(💰\d+元\/晚)/g,
    '$1\n<a href="javascript:void(0)" onclick="window.parent.postMessage({type: \'viewRoom\', roomCode: \'201\'}, \'*\')" class="message-link">🏠 查看房型</a>'
  )

  // 处理特殊的链接格式：查看房间：[点击前往](URL)
  formattedContent = formattedContent.replace(
    /查看房间[：:]\s*\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="javascript:void(0)" onclick="window.parent.postMessage({type: \'viewRoom\', url: \'$2\'}, \'*\')" class="message-link">🏠 查看房型</a>'
  )

  // 处理一般的Markdown链接格式 [文本](URL)
  formattedContent = formattedContent.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (match, text, url) => {
      let linkText = '🏠 查看房型'
      if (text === 'book now' || text === 'Book Now' || text === '立即预订') {
        linkText = '📝 立即预订'
      }

      console.log(`链接转换: "${text}" → "${linkText}"`)
      return `<a href="javascript:void(0)" onclick="window.parent.postMessage({type: 'viewRoom', url: '${url}'}, '*')" class="message-link">${linkText}</a>`
    }
  )

  // 处理纯URL链接
  formattedContent = formattedContent.replace(
    /(https?:\/\/[^\s<>"']+)/g,
    '<a href="javascript:void(0)" onclick="window.parent.postMessage({type: \'viewRoom\', url: \'$1\'}, \'*\')" class="message-link">🏠 查看房型</a>'
  )

  // 清理多余的空行
  formattedContent = formattedContent.replace(/\n\s*\n/g, '\n')

  // 处理换行符
  formattedContent = formattedContent.replace(/\n/g, '<br>')

  console.log('最终格式化内容:', formattedContent)
  return formattedContent
}

// 组件挂载时初始化
onMounted(() => {
  if (props.autoLoad) {
    setTimeout(() => {
      initializeDify()
    }, 1000)
  }
})

// 暴露方法给父组件
defineExpose({
  initializeDify,
  isDifyConnected: () => isDifyConnected.value,
  sendMessage,
  resetConversation
})
</script>

<style scoped>
.dify-chat-widget {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 600px;
}

.chat-header {
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  padding: 1.5rem;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 2px 10px rgba(212, 175, 55, 0.2);
}

.ai-avatar-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ai-avatar-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.ai-character-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid white;
  transition: all 0.3s ease;
}

.status-indicator.online {
  background: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.ai-info-section {
  color: white;
}

.ai-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.ai-title {
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  opacity: 0.9;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  transition: all 0.3s ease;
}

.status-dot.online {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.status-text {
  opacity: 0.9;
}

.reconnect-btn {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reconnect-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.reset-btn {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 聊天消息区域 */
.chat-messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
}

.message {
  display: flex;
  gap: 0.75rem;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.assistant {
  align-self: flex-start;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid #d4af37;
}

.user-avatar {
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.avatar-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.message-text {
  padding: 0.75rem 1rem;
  border-radius: 18px;
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.message.assistant .message-text {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: #1f2937;
  border-bottom-left-radius: 6px;
}

.message.user .message-text {
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: white;
  border-bottom-right-radius: 6px;
}

/* 消息中的链接样式 */
.message-link {
  color: #3b82f6;
  text-decoration: underline;
  transition: all 0.3s ease;
  font-weight: 500;
}

.message-link:hover {
  color: #1d4ed8;
  text-decoration: none;
  background: rgba(59, 130, 246, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
}

/* 用户消息中的链接样式 */
.message.user .message-link {
  color: #fef3c7;
  text-decoration: underline;
}

.message.user .message-link:hover {
  color: #fbbf24;
  background: rgba(255, 255, 255, 0.2);
}

/* AI消息中的链接样式 */
.message.assistant .message-link {
  color: #059669;
  font-weight: 600;
}

.message.assistant .message-link:hover {
  color: #047857;
  background: rgba(5, 150, 105, 0.1);
}

.message-time {
  font-size: 0.75rem;
  color: #6b7280;
  padding: 0 0.5rem;
}

.message.user .message-time {
  text-align: right;
}

/* 正在输入指示器 */
.typing-indicator .message-content {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 18px;
  border-bottom-left-radius: 6px;
}

.typing-dots {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d4af37;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 输入区域 */
.chat-input {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 20px 20px;
}

.input-container {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 25px;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
}

.message-input:focus {
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.message-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.send-button {
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>

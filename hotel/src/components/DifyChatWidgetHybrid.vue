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
        <div v-for="message in chatHistory" :key="message.id" class="message" :class="message.type">
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
          <div class="message-avatar user-avatar" v-if="message.type === 'user'">
            <i class="fas fa-user"></i>
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
            :disabled="isAITyping"
          />
          <button @click="sendMessage" class="send-button" :disabled="!userInput.trim() || isAITyping">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, defineExpose } from 'vue'
import { IntelligentAI } from '../utils/intelligentAI'
import { callDifyPublicAPI, callDifyBackendAPI } from '../api/difyProxy'

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

// 智能AI实例
let intelligentAI: IntelligentAI | null = null

// 初始化AI（使用本地智能AI或尝试Dify）
const initializeDify = async () => {
  try {
    console.log('初始化AI助手...')
    
    // 首先尝试连接Dify
    const difyConnected = await tryConnectDify()
    
    if (!difyConnected) {
      // Dify连接失败，使用本地智能AI
      console.log('Dify连接失败，使用本地智能AI')
      // 创建模拟房间数据
      const mockRooms = [
        {
          id: 202,
          code: '202',
          name: '亲子蘑菇屋',
          category: '亲子房',
          price: 488,
          area: '40㎡',
          status: 'available',
          floor: 2,
          direction: '朝南',
          hasWindow: true,
          type: '亲子房',
          features: ['安静环境', '儿童设施', '朝南采光', '有窗户'],
          vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
        },
        {
          id: 201,
          code: '201',
          name: '雨林景观蘑菇屋',
          category: '大床房',
          price: 288,
          area: '30㎡',
          status: 'available',
          floor: 2,
          direction: '朝南',
          hasWindow: true,
          type: '标准间',
          features: ['安静环境', '观景窗', '朝南采光'],
          vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
        },
        {
          id: 301,
          code: '301',
          name: '云端亲子蘑菇屋',
          category: '亲子房',
          price: 588,
          area: '45㎡',
          status: 'available',
          floor: 3,
          direction: '朝南',
          hasWindow: true,
          type: '亲子房',
          features: ['安静环境', '儿童设施', '游戏区', '朝南采光'],
          vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
        },
        {
          id: 101,
          code: '101',
          name: '雨林景观蘑菇屋',
          category: '单人间',
          price: 188,
          area: '25㎡',
          status: 'available',
          floor: 1,
          direction: '朝东',
          hasWindow: true,
          type: '标准间',
          features: ['观景窗', '独立卫浴'],
          vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
        }
      ]
      intelligentAI = new IntelligentAI(mockRooms)
      isDifyConnected.value = false // 标记Dify为不可用，使用本地AI
      console.log('✅ 本地智能AI初始化成功')
    }
    
    // 添加欢迎消息
    addWelcomeMessage()
    emit('loaded')
    
  } catch (error) {
    console.error('AI初始化失败:', error)
    emit('error', `AI初始化失败: ${error instanceof Error ? error.message : String(error)}`)
    
    // 仍然添加欢迎消息
    addWelcomeMessage()
  }
}

// 尝试连接Dify
const tryConnectDify = async (): Promise<boolean> => {
  try {
    console.log('🔄 尝试连接Dify服务...')

    // 设置连接超时时间（5秒）
    const timeout = 5000

    // 使用Promise.race实现超时控制
    const testWithTimeout = async (testFunc: () => Promise<any>) => {
      return Promise.race([
        testFunc(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('连接超时')), timeout)
        )
      ])
    }

    // 尝试公网API
    try {
      const testResult = await testWithTimeout(() => callDifyPublicAPI('你好'))
      if (testResult.success) {
        isDifyConnected.value = true
        console.log('✅ Dify公网API连接成功！')
        return true
      }
    } catch (error) {
      console.log('❌ Dify公网API连接失败:', error.message)
    }

    // 尝试后端API
    try {
      const backendResult = await testWithTimeout(() => callDifyBackendAPI('你好'))
      if (backendResult.success) {
        isDifyConnected.value = true
        console.log('✅ Dify后端API连接成功！')
        return true
      }
    } catch (error) {
      console.log('❌ Dify后端API连接失败:', error.message)
    }

    console.log('❌ 所有Dify服务都不可用，自动切换到本地AI')
    return false

  } catch (error) {
    console.log('❌ Dify连接异常:', error)
    return false
  }
}

// 调用Dify API
const callDifyAPI = async (message: string): Promise<string> => {
  try {
    console.log('🔄 调用Dify API:', message)

    // 首先尝试公网API
    let result = await callDifyPublicAPI(message)

    if (result.success && result.data) {
      console.log('✅ Dify公网API调用成功')
      console.log('📄 Dify响应数据:', result.data)

      // 直接获取Dify的原始回复内容
      const rawResponse = result.data.answer || result.data.response || result.data.message || '收到您的消息，正在为您处理...'

      // 确保Unicode字符正确显示
      const aiResponse = typeof rawResponse === 'string' ? rawResponse : JSON.stringify(rawResponse)

      console.log('🎯 Dify原始回复:', aiResponse)

      // 更新会话ID（如果有）
      if (result.data.conversation_id) {
        conversationId.value = result.data.conversation_id
        console.log('更新会话ID:', conversationId.value)
      }

      return aiResponse
    }

    console.log('❌ 公网API失败，尝试后端API...')

    // 尝试后端API
    result = await callDifyBackendAPI(message)

    if (result.success && result.data) {
      console.log('✅ Dify后端API调用成功')
      console.log('📄 Dify响应数据:', result.data)

      // 直接获取Dify的原始回复内容
      const rawResponse = result.data.answer || result.data.response || result.data.message || '收到您的消息，正在为您处理...'

      // 确保Unicode字符正确显示
      const aiResponse = typeof rawResponse === 'string' ? rawResponse : JSON.stringify(rawResponse)

      console.log('🎯 Dify原始回复:', aiResponse)

      // 更新会话ID（如果有）
      if (result.data.conversation_id) {
        conversationId.value = result.data.conversation_id
        console.log('更新会话ID:', conversationId.value)
      }

      return aiResponse
    }

    console.error('❌ 所有Dify API都调用失败')
    console.error('公网API错误:', result.error)
    throw new Error('Dify API调用失败')

  } catch (error) {
    console.error('❌ Dify API调用异常:', error)
    throw error
  }
}

// 添加欢迎消息
const addWelcomeMessage = () => {
  const welcomeMessage = {
    id: Date.now(),
    type: 'assistant',
    content: '您好！我是普普AI助手，您的专属选房顾问。我可以根据您的需求为您推荐最适合的房间。请告诉我您的需求，比如预算、房型偏好、楼层要求等。',
    timestamp: new Date().toISOString()
  }
  chatHistory.value.push(welcomeMessage)
  scrollToBottom()
}

// 重置会话
const resetConversation = () => {
  console.log('重置会话')
  conversationId.value = ''
  chatHistory.value = []
  addWelcomeMessage()
}

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim() || isAITyping.value) return
  
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
    let aiResponse = ''

    if (isDifyConnected.value) {
      try {
        // 尝试使用Dify API
        aiResponse = await callDifyAPI(message)
        console.log('✅ Dify API响应成功')
      } catch (error) {
        console.log('❌ Dify API调用失败，自动切换到本地AI:', error.message)
        isDifyConnected.value = false // 标记Dify为不可用

        // 自动切换到本地AI
        if (intelligentAI) {
          const intent = intelligentAI.analyzeIntent(message)
          aiResponse = intelligentAI.generateResponse(intent)
          console.log('✅ 已自动切换到本地AI')
        } else {
          aiResponse = getFallbackResponse(message)
          console.log('✅ 使用降级回复')
        }
      }
    } else if (intelligentAI) {
      // 使用本地智能AI
      console.log('🤖 分析用户意图:', message)
      const intent = intelligentAI.analyzeIntent(message)
      console.log('🎯 识别意图:', intent)
      aiResponse = intelligentAI.generateResponse(intent)
      console.log('✅ 使用本地智能AI，回复:', aiResponse)
    } else {
      // 最终降级回复
      aiResponse = getFallbackResponse(message)
      console.log('✅ 使用最终降级回复')
    }
    
    // 添加AI回复
    const aiMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString()
    }
    chatHistory.value.push(aiMessage)
    
    // 发送消息给父组件进行解析
    emit('message', {
      type: 'ai',
      content: aiMessage.content,
      timestamp: aiMessage.timestamp
    })
    
  } catch (error) {
    console.error('发送消息失败:', error)
    
    const errorMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: `抱歉，发送消息时出现错误。请稍后再试。`,
      timestamp: new Date().toISOString()
    }
    chatHistory.value.push(errorMessage)
  } finally {
    isAITyping.value = false
    scrollToBottom()
  }
}

// 获取降级回复
const getFallbackResponse = (message: string): string => {
  // 简单的关键词匹配
  if (message.includes('房间') || message.includes('住宿')) {
    return '我们有多种房型可供选择，包括标准间、豪华间和套房。每个房间都配备了现代化设施，让您享受舒适的住宿体验。您可以查看房间详情页面了解更多信息。'
  }

  if (message.includes('价格') || message.includes('费用') || message.includes('多少钱')) {
    return '我们的房间价格根据房型和季节有所不同。标准间价格实惠，豪华间设施更完善。具体价格请查看房间详情页面，或联系前台咨询。'
  }

  if (message.includes('预订') || message.includes('订房') || message.includes('预约')) {
    return '预订房间很简单！您可以选择心仪的房间，填写入住信息，然后确认预订。我们支持多种支付方式，预订成功后会立即确认。'
  }

  if (message.includes('茶') || message.includes('茶文化')) {
    return '我们的茶文化体验非常丰富，包括茶艺表演、茶叶品鉴、制茶工艺学习等。您可以深入了解普洱茶的历史文化，体验传统茶道的魅力。'
  }

  if (message.includes('活动') || message.includes('庄园')) {
    return '庄园内有丰富的活动项目，包括生态观光、农事体验、文化活动等。您可以参与采茶、制茶、品茶等特色活动，感受田园生活的乐趣。'
  }

  if (message.includes('你好') || message.includes('您好')) {
    return '您好！我是普普，您的专属AI助手。虽然目前网络连接有些问题，但我仍然很乐意为您介绍我们的民宿服务。请问有什么可以帮助您的吗？'
  }

  return '感谢您的咨询！我是普普，您的专属AI助手。虽然目前网络连接有些问题，但我仍然很乐意为您介绍我们的民宿服务。您可以浏览页面了解更多信息，或稍后再试。'
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

// 格式化消息内容
const formatMessageContent = (content: string) => {
  if (!content) return ''

  // 处理换行符
  let formattedContent = content.replace(/\n/g, '<br>')

  // 处理Markdown链接 [文本](URL)
  formattedContent = formattedContent.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" class="vr-link">$1</a>'
  )

  // 处理房间链接
  formattedContent = formattedContent.replace(
    /(💰\d+元\/晚)/g,
    '$1<br><a href="javascript:void(0)" onclick="window.parent.postMessage({type: \'viewRoom\', roomCode: \'201\'}, \'*\')" class="message-link">🏠 查看房型</a>'
  )

  // 处理粗体文本 **文本**
  formattedContent = formattedContent.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong>$1</strong>'
  )

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

<script lang="ts">
export default {
  name: 'DifyChatWidgetHybrid'
}
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

.reconnect-btn, .reset-btn {
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

.reconnect-btn:hover, .reset-btn:hover {
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
  color: #059669;
  text-decoration: underline;
  transition: all 0.3s ease;
  font-weight: 600;
  display: inline-block;
  margin-top: 0.5rem;
}

.message-link:hover {
  color: #047857;
  background: rgba(5, 150, 105, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
  text-decoration: none;
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

/* VR链接样式 */
.vr-link {
  color: #d4af37;
  text-decoration: none;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(244, 208, 63, 0.1));
  border: 1px solid rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
  display: inline-block;
  margin: 2px 0;
}

.vr-link:hover {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(244, 208, 63, 0.2));
  border-color: rgba(212, 175, 55, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.vr-link:active {
  transform: translateY(0);
}

/* VR链接样式 */
.vr-link {
  color: #D4AF37;
  text-decoration: none;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.2));
  border: 1px solid rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 4px 0;
}

.vr-link:hover {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.3));
  border-color: rgba(212, 175, 55, 0.5);
  color: #B8941F;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.vr-link:active {
  transform: translateY(0);
}

/* 消息链接样式 */
.message-link {
  color: #2D5016;
  text-decoration: none;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(45, 80, 22, 0.1);
  transition: all 0.2s ease;
}

.message-link:hover {
  background: rgba(45, 80, 22, 0.2);
  color: #2D5016;
}
</style>

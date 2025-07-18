<template>
  <div class="global-ip-assistant">
    <!-- IP形象按钮 -->
    <div 
      class="ip-avatar-container"
      @click="toggleChat"
      :class="{ active: showChat }"
    >
      <video 
        ref="ipVideo"
        class="ip-avatar"
        :src="currentVideoSrc"
        autoplay
        loop
        muted
        playsinline
      ></video>
      <div class="status-indicator" :class="{ online: isOnline }"></div>
    </div>

    <!-- 对话框 -->
    <div v-if="showChat" class="chat-dialog">
      <div class="chat-header">
        <div class="header-info">
          <h4>🍵 普普助手</h4>
          <span class="subtitle">普洱蘑菇庄园民宿</span>
        </div>
        <button @click="toggleChat" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- 快捷导航 -->
      <div class="quick-nav">
        <button 
          v-for="nav in quickNavs" 
          :key="nav.key"
          @click="handleQuickNav(nav)"
          class="nav-btn"
        >
          <i :class="nav.icon"></i>
          {{ nav.label }}
        </button>
      </div>

      <!-- 聊天区域 -->
      <div class="chat-messages" ref="chatContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          class="message"
          :class="message.type"
        >
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(message.content)"></div>
            <div class="message-time">{{ message.timestamp }}</div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input-area">
        <div class="input-container">
          <input
            v-model="inputMessage"
            @keyup.enter="sendMessage"
            placeholder="问问茶文化、周边产品或民宿活动..."
            class="chat-input"
            :disabled="isLoading"
          />
          <button
            @click="sendMessage"
            class="send-btn"
            :disabled="isLoading || !inputMessage.trim()"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'GlobalIPAssistant',
  setup() {
    const router = useRouter()

// 响应式数据
const showChat = ref(false)
const isOnline = ref(true)
const isLoading = ref(false)
const inputMessage = ref('')
const messages = ref([
  {
    type: 'ai',
    content: '🍵 您好！我是普普，普洱蘑菇庄园的AI助手！我可以为您介绍茶文化、推荐周边产品和民宿活动。',
    timestamp: new Date().toLocaleTimeString()
  }
])

const ipVideo = ref<HTMLVideoElement>()
const chatContainer = ref<HTMLElement>()

// IP形象视频源
const videoSources = [
  '/src/assets/images/IP形象/37b48b40dbc80e2a44dce0f626120357_raw.mp4',
  '/src/assets/images/IP形象/4e8a0e0ab4bdb3d1738dc2f6bf7fb411_raw.mp4'
]
const currentVideoSrc = ref(videoSources[0])

// 快捷导航
const quickNavs = [
  { key: 'rooms', label: '房间预订', icon: 'fas fa-bed', route: '/ai-room-selection' },
  { key: 'products', label: '周边产品', icon: 'fas fa-shopping-bag', route: '/products' },
  { key: 'tea', label: '茶文化', icon: 'fas fa-leaf', action: 'tea-culture' },
  { key: 'activities', label: '民宿活动', icon: 'fas fa-calendar-alt', action: 'activities' }
]

// 切换对话框显示
const toggleChat = () => {
  showChat.value = !showChat.value
  if (showChat.value) {
    // 切换视频源
    currentVideoSrc.value = videoSources[1]
    nextTick(() => {
      scrollToBottom()
    })
  } else {
    currentVideoSrc.value = videoSources[0]
  }
}

// 处理快捷导航
const handleQuickNav = (nav: any) => {
  if (nav.route) {
    router.push(nav.route)
    showChat.value = false
  } else if (nav.action) {
    handleSpecialAction(nav.action)
  }
}

// 处理特殊操作
const handleSpecialAction = (action: string) => {
  switch (action) {
    case 'tea-culture':
      addAIMessage(getTeaCultureInfo())
      break
    case 'activities':
      addAIMessage(getActivitiesInfo())
      break
  }
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage = inputMessage.value.trim()
  
  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: userMessage,
    timestamp: new Date().toLocaleTimeString()
  })

  inputMessage.value = ''
  isLoading.value = true

  // 滚动到底部
  await nextTick()
  scrollToBottom()

  // 生成AI回复
  setTimeout(() => {
    const aiResponse = generateAIResponse(userMessage)
    addAIMessage(aiResponse)
    isLoading.value = false
  }, 1000)
}

// 添加AI消息
const addAIMessage = (content: string) => {
  messages.value.push({
    type: 'ai',
    content,
    timestamp: new Date().toLocaleTimeString()
  })
  nextTick(() => {
    scrollToBottom()
  })
}

// 生成AI回复
const generateAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()

  // 茶文化相关
  if (lowerMessage.includes('茶') || lowerMessage.includes('普洱')) {
    return getTeaCultureInfo()
  }

  // 周边产品相关
  if (lowerMessage.includes('产品') || lowerMessage.includes('购买') || lowerMessage.includes('纪念品')) {
    return getProductsInfo()
  }

  // 活动相关
  if (lowerMessage.includes('活动') || lowerMessage.includes('体验') || lowerMessage.includes('娱乐')) {
    return getActivitiesInfo()
  }

  // 房间相关
  if (lowerMessage.includes('房间') || lowerMessage.includes('预订') || lowerMessage.includes('住宿')) {
    return '🏠 我可以为您推荐合适的房间！点击上方"房间预订"按钮，我会为您提供专业的选房服务。'
  }

  // 默认回复
  return '🍵 您好！我是普普，很高兴为您服务！我可以为您介绍：\n\n' +
         '🍃 **茶文化知识** - 普洱茶的历史和制作工艺\n' +
         '🛍️ **周边产品** - 精美的茶具和纪念品\n' +
         '🎉 **民宿活动** - 茶艺体验和文化活动\n' +
         '🏠 **房间预订** - 专业的选房建议\n\n' +
         '请告诉我您想了解什么！'
}

// 获取茶文化信息
const getTeaCultureInfo = (): string => {
  return '🍃 **普洱茶文化介绍**\n\n' +
         '🌿 **历史渊源**\n' +
         '普洱茶有着1700多年的历史，是云南特有的地理标志产品。我们庄园位于普洱茶的核心产区，拥有得天独厚的自然条件。\n\n' +
         '🍵 **制作工艺**\n' +
         '• 采摘：清晨采摘嫩叶\n' +
         '• 杀青：高温破坏酶活性\n' +
         '• 揉捻：形成茶叶条索\n' +
         '• 晒干：自然阳光干燥\n\n' +
         '🎯 **茶艺体验**\n' +
         '我们提供专业的茶艺表演和体验课程，让您深度了解普洱茶文化。\n\n' +
         '想了解更多茶文化知识吗？'
}

// 获取产品信息
const getProductsInfo = (): string => {
  return '🛍️ **精选周边产品**\n\n' +
         '🍵 **茶叶系列**\n' +
         '• 精品普洱茶饼\n' +
         '• 散装普洱茶\n' +
         '• 特色茶叶礼盒\n\n' +
         '🎨 **IP衍生产品**\n' +
         '• 普普主题帆布包\n' +
         '• 精美茶具套装\n' +
         '• 纪念品挂坠\n' +
         '• 主题服装\n\n' +
         '🏆 **特色纪念品**\n' +
         '• 庄园专属勋章\n' +
         '• 定制水杯\n' +
         '• 平板保护套\n\n' +
         '点击"周边产品"查看详细信息和购买！'
}

// 获取活动信息
const getActivitiesInfo = (): string => {
  return '🎉 **民宿特色活动**\n\n' +
         '🍵 **茶艺体验**\n' +
         '• 专业茶艺师指导\n' +
         '• 学习泡茶技巧\n' +
         '• 品鉴不同茶叶\n\n' +
         '🍄 **蘑菇采摘**\n' +
         '• 有机蘑菇园参观\n' +
         '• 亲手采摘体验\n' +
         '• 蘑菇料理制作\n\n' +
         '🌿 **自然探索**\n' +
         '• 茶园漫步\n' +
         '• 生态摄影\n' +
         '• 日出日落观赏\n\n' +
         '🎨 **文化体验**\n' +
         '• 传统手工艺\n' +
         '• 民族文化表演\n' +
         '• 篝火晚会\n\n' +
         '想参加哪个活动呢？我可以为您安排！'
}

// 格式化消息
const formatMessage = (content: string): string => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}

// 滚动到底部
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

onMounted(() => {
  // 确保视频自动播放
  if (ipVideo.value) {
    ipVideo.value.play().catch(console.error)
  }
})

    return {
      showChat,
      isOnline,
      isLoading,
      inputMessage,
      messages,
      ipVideo,
      chatContainer,
      currentVideoSrc,
      quickNavs,
      toggleChat,
      handleQuickNav,
      handleSpecialAction,
      sendMessage,
      addAIMessage,
      generateAIResponse,
      getTeaCultureInfo,
      getProductsInfo,
      getActivitiesInfo,
      formatMessage,
      scrollToBottom
    }
  }
})
</script>

<style scoped>
.global-ip-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.ip-avatar-container {
  position: relative;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ip-avatar-container:hover {
  transform: scale(1.1);
}

.ip-avatar-container.active {
  transform: scale(1.2);
}

.ip-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.status-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #6c757d;
  border: 2px solid #fff;
  transition: all 0.3s ease;
}

.status-indicator.online {
  background: #28a745;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.chat-dialog {
  position: absolute;
  bottom: 100px;
  right: 0;
  width: 320px;
  height: 450px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-info h4 {
  margin: 0;
  font-size: 16px;
}

.subtitle {
  font-size: 12px;
  opacity: 0.8;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.quick-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 11px;
}

.nav-btn:hover {
  background: #e3f2fd;
  border-color: #2196f3;
  transform: translateY(-1px);
}

.nav-btn i {
  font-size: 14px;
  color: #007bff;
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #fafafa;
}

.message {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}

.message.user {
  align-items: flex-end;
}

.message.ai {
  align-items: flex-start;
}

.message-content {
  max-width: 85%;
  padding: 10px 12px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message.user .message-content {
  background: #007bff;
  color: white;
  border-bottom-right-radius: 5px;
}

.message.ai .message-content {
  background: white;
  color: #333;
  border: 1px solid #e9ecef;
  border-bottom-left-radius: 5px;
}

.message-text {
  line-height: 1.4;
  font-size: 13px;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}

.message.ai .message-time {
  text-align: left;
}

.chat-input-area {
  padding: 12px;
  border-top: 1px solid #e9ecef;
  background: white;
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chat-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  font-size: 13px;
  outline: none;
  transition: all 0.3s ease;
}

.chat-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.send-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .global-ip-assistant {
    bottom: 15px;
    right: 15px;
  }

  .ip-avatar-container {
    width: 60px;
    height: 60px;
  }

  .chat-dialog {
    width: 280px;
    height: 400px;
    bottom: 80px;
  }
}
</style>

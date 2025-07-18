<template>
  <div class="tea-ai-assistant">
    <!-- AI助手触发按钮 -->
    <div class="ai-trigger" @click="toggleAssistant" :class="{ active: isOpen }">
      <div class="ai-avatar">
        <img src="/src/assets/images/IP形象/普普正面.png" alt="茶文化AI助手" class="ai-avatar-image" />
        <div class="ai-status" :class="statusClass"></div>
      </div>
      <div class="ai-label" v-if="!isOpen">茶文化AI助手</div>
    </div>

    <!-- AI助手对话窗口 -->
    <transition name="slide-up">
      <div v-if="isOpen" class="ai-chat-window">
        <!-- 头部 -->
        <div class="chat-header">
          <div class="ai-info">
            <div class="ai-avatar-small">
              <img src="/src/assets/images/IP形象/普普正面.png" alt="茶文化AI助手" class="ai-avatar-small-image" />
            </div>
            <div class="ai-details">
              <h3>茶文化AI助手</h3>
              <p>专业的普洱茶文化顾问</p>
            </div>
          </div>
          <button @click="toggleAssistant" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- 功能选项卡 -->
        <div class="function-tabs">
          <button 
            v-for="tab in functionTabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
          >
            <i :class="tab.icon"></i>
            {{ tab.name }}
          </button>
        </div>

        <!-- 聊天对话区域 -->
        <div v-if="activeTab === 'chat'" class="chat-content">
          <div class="messages-container" ref="messagesContainer">
            <div v-for="message in messages" :key="message.id" :class="['message', message.type]">
              <div v-if="message.type === 'ai'" class="ai-message">
                <div class="ai-avatar-tiny">🍃</div>
                <div class="message-content">
                  <p>{{ message.text }}</p>
                  <div v-if="message.culturalInsight" class="cultural-insight">
                    <i class="fas fa-lightbulb"></i>
                    <span>{{ message.culturalInsight }}</span>
                  </div>
                  <div v-if="message.suggestions?.length" class="suggestions">
                    <button 
                      v-for="suggestion in message.suggestions" 
                      :key="suggestion"
                      @click="sendMessage(suggestion)"
                      class="suggestion-btn"
                    >
                      {{ suggestion }}
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="user-message">
                <div class="message-content">
                  <p>{{ message.text }}</p>
                </div>
              </div>
            </div>
            <div v-if="isTyping" class="typing-indicator">
              <div class="ai-avatar-tiny">🍃</div>
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="chat-input">
            <input 
              v-model="inputMessage"
              @keypress.enter="handleSendMessage"
              placeholder="询问茶文化相关问题..."
              :disabled="isTyping"
            />
            <button @click="handleSendMessage" :disabled="!inputMessage.trim() || isTyping">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>

        <!-- 茶叶识别区域 -->
        <div v-if="activeTab === 'recognition'" class="recognition-content">
          <div class="upload-area" @click="triggerFileUpload" @drop="handleDrop" @dragover.prevent>
            <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" style="display: none">
            <div v-if="!selectedImage" class="upload-placeholder">
              <i class="fas fa-camera"></i>
              <p>上传茶叶照片进行AI识别</p>
              <span>支持 JPG、PNG 格式</span>
            </div>
            <div v-else class="image-preview">
              <img :src="selectedImage" alt="茶叶照片">
              <button @click.stop="clearImage" class="clear-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <button 
            v-if="selectedImage" 
            @click="recognizeTea" 
            :disabled="isRecognizing"
            class="recognize-btn"
          >
            <i class="fas fa-search" v-if="!isRecognizing"></i>
            <i class="fas fa-spinner fa-spin" v-else></i>
            {{ isRecognizing ? '识别中...' : '开始识别' }}
          </button>

          <!-- 识别结果 -->
          <div v-if="recognitionResult" class="recognition-result">
            <div class="result-header">
              <h4>识别结果</h4>
              <div class="confidence">
                置信度: {{ Math.round(recognitionResult.confidence * 100) }}%
              </div>
            </div>
            <div class="tea-info">
              <h5>{{ recognitionResult.teaInfo.name }}</h5>
              <p class="tea-type">{{ getTeaTypeLabel(recognitionResult.teaInfo.type) }}</p>
              <p class="tea-origin">产地: {{ recognitionResult.teaInfo.origin }}</p>
              <p class="tea-description">{{ recognitionResult.teaInfo.description }}</p>
              
              <div class="cultural-context">
                <h6>文化背景</h6>
                <p>{{ recognitionResult.culturalContext }}</p>
              </div>

              <div class="suggestions">
                <h6>冲泡建议</h6>
                <ul>
                  <li v-for="suggestion in recognitionResult.suggestions" :key="suggestion">
                    {{ suggestion }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 冲泡指导区域 -->
        <div v-if="activeTab === 'brewing'" class="brewing-content">
          <div class="tea-selector">
            <h4>选择茶叶类型</h4>
            <div class="tea-options">
              <button 
                v-for="tea in teaOptions" 
                :key="tea.id"
                @click="selectTea(tea)"
                :class="['tea-option', { selected: selectedTea?.id === tea.id }]"
              >
                <div class="tea-name">{{ tea.name }}</div>
                <div class="tea-type">{{ getTeaTypeLabel(tea.type) }}</div>
              </button>
            </div>
          </div>

          <div v-if="brewingGuide" class="brewing-guide">
            <div class="guide-header">
              <h4>{{ brewingGuide.teaType }} 冲泡指导</h4>
              <div class="difficulty">
                难度: {{ getDifficultyLabel(brewingGuide.difficulty) }}
              </div>
            </div>

            <div class="brewing-steps">
              <div 
                v-for="step in brewingGuide.steps" 
                :key="step.step"
                :class="['step-item', { active: currentStep === step.step }]"
                @click="setCurrentStep(step.step)"
              >
                <div class="step-number">{{ step.step }}</div>
                <div class="step-content">
                  <h5>{{ step.title }}</h5>
                  <p>{{ step.description }}</p>
                  <div v-if="step.duration > 0" class="step-timing">
                    <i class="fas fa-clock"></i>
                    {{ step.duration }}秒 | {{ step.temperature }}°C
                  </div>
                  <div v-if="step.tips.length" class="step-tips">
                    <div class="tips-header">💡 小贴士:</div>
                    <ul>
                      <li v-for="tip in step.tips" :key="tip">{{ tip }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="cultural-notes">
              <h5>文化内涵</h5>
              <ul>
                <li v-for="note in brewingGuide.culturalNotes" :key="note">{{ note }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- AI茶艺师区域 -->
        <div v-if="activeTab === 'master'" class="tea-master-content">
          <div class="master-intro">
            <div class="master-avatar">
              <div class="avatar-image">
                <img src="/src/assets/images/IP形象/普普正面.png" alt="AI茶艺大师" class="master-avatar-image" />
              </div>
              <div class="master-status">在线</div>
            </div>
            <div class="master-info">
              <h4>AI茶艺大师</h4>
              <p>拥有30年茶艺经验的虚拟茶艺师，为您提供专业的茶艺指导</p>
            </div>
          </div>

          <div class="master-services">
            <h5>茶艺师服务</h5>
            <div class="service-grid">
              <div class="service-item" @click="startTeaCeremony">
                <i class="fas fa-play-circle"></i>
                <span>开始茶艺表演</span>
              </div>
              <div class="service-item" @click="personalizedGuidance">
                <i class="fas fa-user-check"></i>
                <span>个性化指导</span>
              </div>
              <div class="service-item" @click="teaCultureLesson">
                <i class="fas fa-graduation-cap"></i>
                <span>茶文化课堂</span>
              </div>
              <div class="service-item" @click="teaEtiquette">
                <i class="fas fa-hands"></i>
                <span>茶礼仪教学</span>
              </div>
            </div>
          </div>

          <div v-if="masterSession" class="master-session">
            <div class="session-header">
              <h5>{{ masterSession.title }}</h5>
              <div class="session-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: masterSession.progress + '%' }"></div>
                </div>
                <span>{{ masterSession.progress }}%</span>
              </div>
            </div>

            <div class="session-content">
              <div class="master-instruction">
                <div class="instruction-text">
                  <p>{{ masterSession.currentInstruction }}</p>
                </div>
                <div v-if="masterSession.tips" class="instruction-tips">
                  <h6>💡 茶艺师提醒：</h6>
                  <ul>
                    <li v-for="tip in masterSession.tips" :key="tip">{{ tip }}</li>
                  </ul>
                </div>
              </div>

              <div class="session-controls">
                <button @click="previousStep" :disabled="masterSession.currentStep === 0" class="control-btn">
                  <i class="fas fa-step-backward"></i>
                  上一步
                </button>
                <button @click="pauseSession" class="control-btn pause">
                  <i class="fas fa-pause"></i>
                  暂停
                </button>
                <button @click="nextStep" :disabled="masterSession.currentStep >= masterSession.totalSteps - 1" class="control-btn">
                  下一步
                  <i class="fas fa-step-forward"></i>
                </button>
              </div>

              <div class="cultural-wisdom">
                <h6>🌿 茶文化智慧：</h6>
                <p>{{ masterSession.culturalWisdom }}</p>
              </div>
            </div>
          </div>

          <div v-if="!masterSession" class="master-welcome">
            <div class="welcome-message">
              <h5>欢迎来到AI茶艺师课堂</h5>
              <p>我是您的专属茶艺师，将为您提供专业的茶艺指导和文化传授。选择上方的服务开始您的茶艺之旅吧！</p>
            </div>
            <div class="master-features">
              <div class="feature-item">
                <i class="fas fa-video"></i>
                <span>实时茶艺演示</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-comments"></i>
                <span>互动式教学</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-certificate"></i>
                <span>专业认证指导</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 知识库区域 -->
        <div v-if="activeTab === 'knowledge'" class="knowledge-content">
          <div class="knowledge-categories">
            <button 
              v-for="category in knowledgeCategories" 
              :key="category.id"
              @click="activeKnowledge = category.id"
              :class="['category-btn', { active: activeKnowledge === category.id }]"
            >
              <i :class="category.icon"></i>
              {{ category.name }}
            </button>
          </div>

          <div class="knowledge-display">
            <div v-if="activeKnowledge === 'history'" class="knowledge-section">
              <h4>普洱茶历史</h4>
              <div class="history-timeline">
                <div class="timeline-item">
                  <div class="timeline-marker">汉</div>
                  <div class="timeline-content">
                    <h5>东汉时期</h5>
                    <p>普洱茶的起源可追溯到东汉时期，云南地区开始种植茶叶。</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker">唐</div>
                  <div class="timeline-content">
                    <h5>唐宋时期</h5>
                    <p>茶马古道兴起，普洱茶成为重要的贸易商品。</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker">清</div>
                  <div class="timeline-content">
                    <h5>清朝时期</h5>
                    <p>普洱茶被列为贡茶，享有"茶中之王"的美誉。</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeKnowledge === 'craft'" class="knowledge-section">
              <h4>制茶工艺</h4>
              <div class="craft-steps">
                <div class="craft-item">
                  <h5>采摘</h5>
                  <p>选择合适的茶叶，通常采摘一芽二叶或一芽三叶。</p>
                </div>
                <div class="craft-item">
                  <h5>萎凋</h5>
                  <p>让茶叶失水，为后续加工做准备。</p>
                </div>
                <div class="craft-item">
                  <h5>杀青</h5>
                  <p>通过高温破坏酶活性，保持茶叶绿色。</p>
                </div>
                <div class="craft-item">
                  <h5>揉捻</h5>
                  <p>破坏茶叶细胞，促进茶汁渗出。</p>
                </div>
                <div class="craft-item">
                  <h5>干燥</h5>
                  <p>去除多余水分，定型茶叶外观。</p>
                </div>
              </div>
            </div>

            <div v-if="activeKnowledge === 'culture'" class="knowledge-section">
              <h4>茶文化传统</h4>
              <div class="culture-content">
                <div class="culture-item">
                  <h5>茶马古道</h5>
                  <p>连接云南与西藏、四川的重要贸易通道，承载着深厚的历史文化。</p>
                </div>
                <div class="culture-item">
                  <h5>茶艺精神</h5>
                  <p>体现了中华民族"和、静、怡、真"的茶道精神。</p>
                </div>
                <div class="culture-item">
                  <h5>民族特色</h5>
                  <p>融合了汉族、彝族、哈尼族等多民族的茶文化传统。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { teaCultureAI, type TeaInfo, type BrewingGuide, type TeaRecognitionResult, type AIResponse } from '@/services/TeaCultureAIService'

// 响应式数据
const isOpen = ref(false)
const activeTab = ref('chat')
const isTyping = ref(false)
const inputMessage = ref('')
const messages = ref<any[]>([])
const messagesContainer = ref<HTMLElement>()

// 茶叶识别相关
const selectedImage = ref<string>()
const isRecognizing = ref(false)
const recognitionResult = ref<TeaRecognitionResult>()
const fileInput = ref<HTMLInputElement>()

// 冲泡指导相关
const selectedTea = ref<TeaInfo>()
const brewingGuide = ref<BrewingGuide>()
const currentStep = ref(1)

// 知识库相关
const activeKnowledge = ref('history')

// AI茶艺师相关
const masterSession = ref<any>(null)

// 功能选项卡
const functionTabs = [
  { id: 'chat', name: '智能对话', icon: 'fas fa-comments' },
  { id: 'recognition', name: '茶叶识别', icon: 'fas fa-camera' },
  { id: 'brewing', name: '冲泡指导', icon: 'fas fa-coffee' },
  { id: 'master', name: 'AI茶艺师', icon: 'fas fa-user-graduate' },
  { id: 'knowledge', name: '知识库', icon: 'fas fa-book' }
]

// 茶叶选项
const teaOptions = ref<TeaInfo[]>([])

// 知识分类
const knowledgeCategories = [
  { id: 'history', name: '历史文化', icon: 'fas fa-history' },
  { id: 'craft', name: '制茶工艺', icon: 'fas fa-cogs' },
  { id: 'culture', name: '茶道精神', icon: 'fas fa-yin-yang' }
]

// 计算属性
const statusClass = ref('online')

// 方法
const toggleAssistant = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && messages.value.length === 0) {
    addWelcomeMessage()
  }
}

const addWelcomeMessage = () => {
  const welcomeMessage = {
    id: Date.now(),
    type: 'ai',
    text: '您好！我是普洱蘑菇庄园的AI茶文化助手。我可以帮您识别茶叶、指导冲泡、讲解茶文化知识。有什么关于茶的问题，尽管问我吧！',
    suggestions: ['茶叶识别', '冲泡指导', '茶文化知识', '健康功效'],
    culturalInsight: '茶不仅是饮品，更是文化的载体，让我们一起探索茶的奥秘吧！'
  }
  messages.value.push(welcomeMessage)
}

const sendMessage = async (text: string) => {
  inputMessage.value = text
  await handleSendMessage()
}

const handleSendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return

  const userMessage = {
    id: Date.now(),
    type: 'user',
    text: inputMessage.value
  }
  messages.value.push(userMessage)

  const messageText = inputMessage.value
  inputMessage.value = ''
  isTyping.value = true

  await nextTick()
  scrollToBottom()

  try {
    const response = await teaCultureAI.chat(messageText)
    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      text: response.text,
      suggestions: response.suggestions,
      culturalInsight: response.culturalInsight
    }
    messages.value.push(aiMessage)
  } catch (error) {
    console.error('AI对话失败:', error)
    const errorMessage = {
      id: Date.now() + 1,
      type: 'ai',
      text: '抱歉，我暂时无法回答您的问题。请稍后再试。'
    }
    messages.value.push(errorMessage)
  } finally {
    isTyping.value = false
    await nextTick()
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 茶叶识别相关方法
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const clearImage = () => {
  selectedImage.value = undefined
  recognitionResult.value = undefined
}

const recognizeTea = async () => {
  if (!selectedImage.value) return

  isRecognizing.value = true
  try {
    const result = await teaCultureAI.recognizeTea(selectedImage.value)
    recognitionResult.value = result
  } catch (error) {
    console.error('茶叶识别失败:', error)
  } finally {
    isRecognizing.value = false
  }
}

// 冲泡指导相关方法
const selectTea = (tea: TeaInfo) => {
  selectedTea.value = tea
  brewingGuide.value = teaCultureAI.getBrewingGuide(tea.type)
  currentStep.value = 1
}

const setCurrentStep = (step: number) => {
  currentStep.value = step
}

// 工具方法
const getTeaTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'raw': '生普',
    'ripe': '熟普',
    'ancient': '古树茶',
    'terrace': '台地茶'
  }
  return labels[type] || type
}

const getDifficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    'beginner': '初级',
    'intermediate': '中级',
    'advanced': '高级'
  }
  return labels[difficulty] || difficulty
}

// AI茶艺师相关方法
const startTeaCeremony = () => {
  masterSession.value = {
    title: '传统普洱茶艺表演',
    currentStep: 0,
    totalSteps: 6,
    progress: 0,
    currentInstruction: '欢迎来到普洱茶艺表演！首先，我们要准备茶具。选择一套干净的紫砂壶或盖碗，准备好茶叶、热水和品茗杯。',
    tips: ['确保茶具清洁无异味', '水温控制在95-100°C', '选择优质的普洱茶叶'],
    culturalWisdom: '茶具的选择体现了茶人的品味和对茶的尊重。紫砂壶因其独特的透气性，被誉为泡茶的最佳器具。',
    steps: [
      {
        title: '准备茶具',
        instruction: '选择合适的茶具，清洁并预热',
        tips: ['茶具要清洁', '预热有助于激发茶香'],
        wisdom: '工欲善其事，必先利其器。好的茶具是泡好茶的基础。'
      },
      {
        title: '温杯洁具',
        instruction: '用热水冲洗茶具，提高茶具温度',
        tips: ['水温要适中', '每个茶具都要冲洗到'],
        wisdom: '温杯洁具不仅是为了卫生，更是对茶的敬意和仪式感的体现。'
      },
      {
        title: '投茶醒茶',
        instruction: '将茶叶放入茶具，用热水快速冲洗',
        tips: ['茶叶用量要适中', '第一泡用于醒茶'],
        wisdom: '醒茶如唤醒沉睡的精灵，让茶叶在热水中舒展，释放其内在的香气。'
      },
      {
        title: '正式冲泡',
        instruction: '按照时间控制进行多次冲泡',
        tips: ['注意出汤时间', '观察汤色变化'],
        wisdom: '冲泡是茶艺的核心，每一泡都有其独特的韵味，需要用心感受。'
      },
      {
        title: '品茶赏味',
        instruction: '细品茶汤的香气、滋味和回甘',
        tips: ['先闻香再品味', '感受茶汤在口中的变化'],
        wisdom: '品茶不仅是味觉的享受，更是心灵的净化和文化的传承。'
      },
      {
        title: '茶艺总结',
        instruction: '回顾整个茶艺过程，分享心得体会',
        tips: ['总结学习要点', '记录品茶感受'],
        wisdom: '茶艺是一门艺术，需要不断的练习和感悟才能达到炉火纯青的境界。'
      }
    ]
  }
  updateSessionProgress()
}

const personalizedGuidance = () => {
  masterSession.value = {
    title: '个性化茶艺指导',
    currentStep: 0,
    totalSteps: 4,
    progress: 0,
    currentInstruction: '让我了解您的茶艺水平和喜好，为您量身定制学习计划。请告诉我您是茶艺初学者还是有一定基础？',
    tips: ['诚实回答有助于制定合适的学习计划', '不同水平有不同的学习重点'],
    culturalWisdom: '因材施教是中华文化的传统智慧，茶艺学习也需要根据个人特点来调整。',
    steps: [
      {
        title: '水平评估',
        instruction: '评估您的茶艺基础和经验',
        tips: ['如实回答问题', '分享您的茶艺经历'],
        wisdom: '知己知彼，方能制定最适合的学习路径。'
      },
      {
        title: '目标设定',
        instruction: '确定您的学习目标和期望',
        tips: ['明确学习目的', '设定可达成的目标'],
        wisdom: '有目标的学习才能事半功倍，茶艺学习也是如此。'
      },
      {
        title: '定制方案',
        instruction: '为您制定专属的学习计划',
        tips: ['循序渐进', '理论与实践结合'],
        wisdom: '每个人都有自己的茶道，找到适合自己的方式最重要。'
      },
      {
        title: '实践指导',
        instruction: '开始个性化的茶艺实践',
        tips: ['多练习', '及时反馈'],
        wisdom: '纸上得来终觉浅，绝知此事要躬行。茶艺需要在实践中不断提升。'
      }
    ]
  }
  updateSessionProgress()
}

const teaCultureLesson = () => {
  masterSession.value = {
    title: '茶文化深度课堂',
    currentStep: 0,
    totalSteps: 5,
    progress: 0,
    currentInstruction: '欢迎来到茶文化课堂！今天我们将深入了解普洱茶的历史文化、制作工艺和品鉴技巧。',
    tips: ['认真听讲', '可以随时提问', '记录重要知识点'],
    culturalWisdom: '茶文化博大精深，每一片茶叶都承载着深厚的历史和文化内涵。',
    steps: [
      {
        title: '历史起源',
        instruction: '了解普洱茶的历史起源和发展',
        tips: ['记住关键时间节点', '理解历史背景'],
        wisdom: '了解历史，才能更好地理解茶文化的深层含义。'
      },
      {
        title: '制作工艺',
        instruction: '学习普洱茶的传统制作工艺',
        tips: ['理解每个工序的作用', '注意工艺细节'],
        wisdom: '工艺是文化的载体，每一道工序都体现着先人的智慧。'
      },
      {
        title: '品种分类',
        instruction: '认识不同种类的普洱茶',
        tips: ['区分生茶和熟茶', '了解各自特点'],
        wisdom: '茶有千种，各有其韵，学会分辨是品茶的基本功。'
      },
      {
        title: '品鉴技巧',
        instruction: '掌握专业的品茶技巧',
        tips: ['用心感受', '多练习品鉴'],
        wisdom: '品茶如品人生，需要用心体会其中的酸甜苦辣。'
      },
      {
        title: '文化传承',
        instruction: '理解茶文化的传承意义',
        tips: ['思考文化价值', '传承茶道精神'],
        wisdom: '文化需要传承，每一个茶人都是茶文化的传播者。'
      }
    ]
  }
  updateSessionProgress()
}

const teaEtiquette = () => {
  masterSession.value = {
    title: '茶礼仪教学',
    currentStep: 0,
    totalSteps: 4,
    progress: 0,
    currentInstruction: '茶礼仪是茶文化的重要组成部分，体现了对茶和客人的尊重。让我们学习正确的茶礼仪。',
    tips: ['注意姿态优雅', '动作要轻柔', '保持专注'],
    culturalWisdom: '礼仪不仅是外在的表现，更是内心修养的体现。',
    steps: [
      {
        title: '坐姿礼仪',
        instruction: '学习正确的茶席坐姿',
        tips: ['背部挺直', '双手自然放置', '保持优雅'],
        wisdom: '端正的坐姿体现了对茶艺的尊重和个人的修养。'
      },
      {
        title: '手势礼仪',
        instruction: '掌握标准的茶艺手势',
        tips: ['动作要轻柔', '手势要优美', '避免急躁'],
        wisdom: '优美的手势如行云流水，是茶艺美学的重要体现。'
      },
      {
        title: '奉茶礼仪',
        instruction: '学习正确的奉茶方式',
        tips: ['双手奉茶', '面带微笑', '表达敬意'],
        wisdom: '奉茶是一种礼仪，更是一种情感的传递和文化的交流。'
      },
      {
        title: '品茶礼仪',
        instruction: '了解品茶时的礼仪规范',
        tips: ['细品慢饮', '适当赞美', '保持安静'],
        wisdom: '品茶时的礼仪体现了对茶艺师劳动的尊重和对茶文化的理解。'
      }
    ]
  }
  updateSessionProgress()
}

const updateSessionProgress = () => {
  if (masterSession.value) {
    masterSession.value.progress = Math.round((masterSession.value.currentStep / masterSession.value.totalSteps) * 100)
    const currentStepData = masterSession.value.steps[masterSession.value.currentStep]
    if (currentStepData) {
      masterSession.value.currentInstruction = currentStepData.instruction
      masterSession.value.tips = currentStepData.tips
      masterSession.value.culturalWisdom = currentStepData.wisdom
    }
  }
}

const nextStep = () => {
  if (masterSession.value && masterSession.value.currentStep < masterSession.value.totalSteps - 1) {
    masterSession.value.currentStep++
    updateSessionProgress()
  }
}

const previousStep = () => {
  if (masterSession.value && masterSession.value.currentStep > 0) {
    masterSession.value.currentStep--
    updateSessionProgress()
  }
}

const pauseSession = () => {
  // 暂停功能的实现
  if (masterSession.value) {
    // 可以添加暂停逻辑，比如保存当前状态等
    console.log('茶艺课程已暂停')
  }
}

// 生命周期
onMounted(() => {
  teaOptions.value = teaCultureAI.getTeaKnowledge()
})
</script>

<style scoped>
/* AI助手容器 */
.tea-ai-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

/* 触发按钮 */
.ai-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
  user-select: none;
}

.ai-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(212, 175, 55, 0.4);
}

.ai-trigger.active {
  border-radius: 12px;
  padding: 8px 12px;
}

.ai-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  overflow: hidden;
}

.ai-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.ai-avatar-small-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.master-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.tea-leaf-icon {
  font-size: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.ai-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.ai-status.online {
  background: #10b981;
}

.ai-label {
  font-weight: 500;
  white-space: nowrap;
}

/* 对话窗口 */
.ai-chat-window {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 头部 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  color: white;
}

.ai-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar-small {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.ai-details h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.ai-details p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 功能选项卡 */
.function-tabs {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.tab-btn {
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: none;
  color: #6b7280;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.tab-btn:hover {
  background: #e9ecef;
}

.tab-btn.active {
  color: #d4af37;
  background: white;
  border-bottom: 2px solid #d4af37;
}

.tab-btn i {
  font-size: 1rem;
}

/* 聊天内容 */
.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.message {
  margin-bottom: 16px;
}

.ai-message {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.ai-avatar-tiny {
  width: 24px;
  height: 24px;
  background: #d4af37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: white;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 12px;
  border-top-left-radius: 4px;
}

.user-message .message-content {
  background: #d4af37;
  color: white;
  margin-left: 40px;
  border-radius: 12px;
  border-top-right-radius: 4px;
}

.cultural-insight {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(212, 175, 55, 0.1);
  border-left: 3px solid #d4af37;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.cultural-insight i {
  color: #d4af37;
  margin-top: 2px;
}

.suggestions {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-btn {
  background: white;
  border: 1px solid #d4af37;
  color: #d4af37;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-btn:hover {
  background: #d4af37;
  color: white;
}

/* 输入区域 */
.chat-input {
  display: flex;
  padding: 16px;
  border-top: 1px solid #e9ecef;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  outline: none;
  font-size: 0.9rem;
}

.chat-input input:focus {
  border-color: #d4af37;
}

.chat-input button {
  width: 36px;
  height: 36px;
  background: #d4af37;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.chat-input button:hover:not(:disabled) {
  background: #b8941f;
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 打字指示器 */
.typing-indicator {
  display: flex;
  gap: 8px;
  align-items: center;
}

.typing-dots {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border-top-left-radius: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 过渡动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-chat-window {
    width: 350px;
    height: 500px;
  }

  .ai-trigger {
    bottom: 80px;
  }
}

@media (max-width: 480px) {
  .ai-chat-window {
    width: calc(100vw - 40px);
    height: 70vh;
    right: 20px;
    left: 20px;
  }

  .ai-trigger {
    right: 20px;
    bottom: 20px;
  }

  .ai-label {
    display: none;
  }
}

/* 茶叶识别样式 */
.recognition-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.upload-area:hover {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.05);
}

.upload-placeholder i {
  font-size: 3rem;
  color: #9ca3af;
  margin-bottom: 12px;
}

.upload-placeholder p {
  font-size: 1.1rem;
  color: #4b5563;
  margin-bottom: 4px;
}

.upload-placeholder span {
  font-size: 0.9rem;
  color: #9ca3af;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.clear-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.recognize-btn {
  width: 100%;
  padding: 12px;
  background: #d4af37;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.recognize-btn:hover:not(:disabled) {
  background: #b8941f;
}

.recognize-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.recognition-result {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-header h4 {
  color: #1f2937;
  margin: 0;
}

.confidence {
  background: #d4af37;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tea-info h5 {
  color: #d4af37;
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.tea-type {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.tea-origin {
  color: #4b5563;
  margin-bottom: 12px;
}

.tea-description {
  color: #374151;
  line-height: 1.5;
  margin-bottom: 16px;
}

.cultural-context {
  background: rgba(212, 175, 55, 0.1);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.cultural-context h6 {
  color: #d4af37;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.cultural-context p {
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

.suggestions h6 {
  color: #1f2937;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.suggestions ul {
  margin: 0;
  padding-left: 16px;
}

.suggestions li {
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 4px;
}

/* 冲泡指导样式 */
.brewing-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.tea-selector h4 {
  color: #1f2937;
  margin-bottom: 16px;
}

.tea-options {
  display: grid;
  gap: 8px;
  margin-bottom: 20px;
}

.tea-option {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.tea-option:hover {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.05);
}

.tea-option.selected {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
}

.tea-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.tea-type {
  font-size: 0.8rem;
  color: #6b7280;
}

.brewing-guide {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.guide-header h4 {
  color: #1f2937;
  margin: 0;
}

.difficulty {
  background: #10b981;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.brewing-steps {
  margin-bottom: 20px;
}

.step-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.step-item:hover {
  background: rgba(212, 175, 55, 0.05);
}

.step-item.active {
  background: rgba(212, 175, 55, 0.1);
  border-color: #d4af37;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #d4af37;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h5 {
  color: #1f2937;
  margin-bottom: 4px;
  font-size: 1rem;
}

.step-content p {
  color: #4b5563;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.step-timing {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #d4af37;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.step-tips {
  background: rgba(16, 185, 129, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #10b981;
}

.tips-header {
  font-size: 0.8rem;
  font-weight: 500;
  color: #10b981;
  margin-bottom: 4px;
}

.step-tips ul {
  margin: 0;
  padding-left: 16px;
}

.step-tips li {
  font-size: 0.8rem;
  color: #4b5563;
  line-height: 1.3;
  margin-bottom: 2px;
}

.cultural-notes {
  background: rgba(212, 175, 55, 0.1);
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #d4af37;
}

.cultural-notes h5 {
  color: #d4af37;
  margin-bottom: 8px;
  font-size: 1rem;
}

.cultural-notes ul {
  margin: 0;
  padding-left: 16px;
}

.cultural-notes li {
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 4px;
}

/* AI茶艺师样式 */
.tea-master-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.master-intro {
  display: flex;
  gap: 16px;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.master-avatar {
  position: relative;
  text-align: center;
}

.avatar-image {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 8px;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.master-status {
  background: #10b981;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

.master-info {
  flex: 1;
}

.master-info h4 {
  color: #1f2937;
  margin-bottom: 8px;
  font-size: 1.2rem;
}

.master-info p {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

.master-services {
  margin-bottom: 20px;
}

.master-services h5 {
  color: #1f2937;
  margin-bottom: 12px;
  font-size: 1rem;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.service-item:hover {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.05);
  transform: translateY(-1px);
}

.service-item i {
  color: #d4af37;
  width: 16px;
}

.master-session {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.session-header h5 {
  color: #1f2937;
  margin: 0;
  font-size: 1.1rem;
}

.session-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  width: 100px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #b8941f);
  transition: width 0.3s ease;
}

.session-progress span {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.master-instruction {
  margin-bottom: 20px;
}

.instruction-text p {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 16px;
}

.instruction-tips {
  background: rgba(16, 185, 129, 0.1);
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid #10b981;
}

.instruction-tips h6 {
  color: #10b981;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.instruction-tips ul {
  margin: 0;
  padding-left: 16px;
}

.instruction-tips li {
  color: #4b5563;
  font-size: 0.8rem;
  line-height: 1.3;
  margin-bottom: 4px;
}

.session-controls {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
}

.control-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #4b5563;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
}

.control-btn:hover:not(:disabled) {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.05);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.pause {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.control-btn.pause:hover {
  background: #dc2626;
}

.cultural-wisdom {
  background: rgba(212, 175, 55, 0.1);
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid #d4af37;
}

.cultural-wisdom h6 {
  color: #d4af37;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.cultural-wisdom p {
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
  font-style: italic;
}

.master-welcome {
  text-align: center;
  padding: 40px 20px;
}

.welcome-message h5 {
  color: #1f2937;
  margin-bottom: 12px;
  font-size: 1.2rem;
}

.welcome-message p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 30px;
}

.master-features {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.feature-item i {
  color: #d4af37;
  font-size: 1.5rem;
}

.feature-item span {
  color: #4b5563;
  font-size: 0.8rem;
  text-align: center;
}

/* 知识库样式 */
.knowledge-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.knowledge-categories {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

.category-btn:hover {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.05);
}

.category-btn.active {
  background: #d4af37;
  color: white;
  border-color: #d4af37;
}

.knowledge-display {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.knowledge-section h4 {
  color: #1f2937;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

/* 历史时间线 */
.history-timeline {
  position: relative;
  padding-left: 40px;
}

.history-timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #d4af37, #b8941f);
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.timeline-marker {
  position: absolute;
  left: -32px;
  top: 0;
  width: 32px;
  height: 32px;
  background: #d4af37;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.timeline-content {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline-content h5 {
  color: #d4af37;
  margin-bottom: 8px;
  font-size: 1rem;
}

.timeline-content p {
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

/* 制茶工艺 */
.craft-steps {
  display: grid;
  gap: 16px;
}

.craft-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #d4af37;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.craft-item h5 {
  color: #d4af37;
  margin-bottom: 8px;
  font-size: 1rem;
}

.craft-item p {
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

/* 茶文化传统 */
.culture-content {
  display: grid;
  gap: 16px;
}

.culture-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.culture-item h5 {
  color: #d4af37;
  margin-bottom: 8px;
  font-size: 1rem;
}

.culture-item p {
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

/* 滚动条样式 */
.messages-container::-webkit-scrollbar,
.recognition-content::-webkit-scrollbar,
.brewing-content::-webkit-scrollbar,
.knowledge-content::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track,
.recognition-content::-webkit-scrollbar-track,
.brewing-content::-webkit-scrollbar-track,
.knowledge-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb,
.recognition-content::-webkit-scrollbar-thumb,
.brewing-content::-webkit-scrollbar-thumb,
.knowledge-content::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover,
.recognition-content::-webkit-scrollbar-thumb:hover,
.brewing-content::-webkit-scrollbar-thumb:hover,
.knowledge-content::-webkit-scrollbar-thumb:hover {
  background: #b8941f;
}
</style>

<template>
  <div class="smart-ai-assistant">
    <!-- AI角色展示 -->
    <div class="ai-character-display" @click="toggleVoice">
      <div class="ai-character-container">
        <img src="/src/assets/images/IP形象/普普正面.png" alt="AI助手" :class="['ai-character', currentState]">
        <div class="ai-expression-overlay">
          <div :class="['ai-expression', currentExpression]">{{ getExpressionEmoji() }}</div>
        </div>
        <div v-if="isSpeaking" class="ai-speaking-indicator">
          <div class="sound-wave"></div>
          <div class="sound-wave"></div>
          <div class="sound-wave"></div>
        </div>
      </div>
      <div class="ai-status-text">{{ statusText }}</div>
    </div>

    <!-- 语音控制按钮 -->
    <div class="ai-controls">
      <button @click="toggleVoice" :class="['voice-toggle-btn', { active: voiceEnabled }]">
        <i :class="voiceEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute'"></i>
      </button>
      <button @click="startListening" :class="['listen-btn', { active: isListening }]" :disabled="!speechSupported">
        <i :class="isListening ? 'fas fa-stop' : 'fas fa-microphone'"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Props
interface Props {
  initialMessage?: string
  autoSpeak?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialMessage: '您好！我是您的AI助手',
  autoSpeak: true
})

// Emits
const emit = defineEmits<{
  voiceInput: [text: string]
  stateChange: [state: string]
  expressionChange: [expression: string]
}>()

// 响应式数据
const currentExpression = ref('happy')
const currentState = ref('idle')
const isSpeaking = ref(false)
const voiceEnabled = ref(true)
const statusText = ref(props.initialMessage)
const isListening = ref(false)
const speechSupported = ref(false)

// 语音相关
let recognition: any = null
let speechSynthesis: any = null

// 表情映射
const getExpressionEmoji = () => {
  const expressions = {
    happy: '😊',
    thinking: '🤔',
    excited: '😄',
    surprised: '😮',
    sad: '😔',
    listening: '👂',
    sleeping: '😴'
  }
  return expressions[currentExpression.value as keyof typeof expressions] || '😊'
}

// 改变表情
const changeExpression = (expression: string) => {
  currentExpression.value = expression
  emit('expressionChange', expression)
}

// 改变状态
const changeState = (state: string) => {
  currentState.value = state
  emit('stateChange', state)
  
  // 根据状态自动改变表情和状态文本
  switch (state) {
    case 'listening':
      changeExpression('listening')
      statusText.value = '正在聆听...'
      break
    case 'thinking':
      changeExpression('thinking')
      statusText.value = '正在思考...'
      break
    case 'speaking':
      changeExpression('excited')
      statusText.value = '正在回复...'
      break
    case 'idle':
    default:
      changeExpression('happy')
      statusText.value = props.initialMessage
      break
  }
}

// 语音合成
const speakText = async (text: string) => {
  if (!voiceEnabled.value || !speechSynthesis) return false
  
  const cleanText = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\n/g, ' ')
    .replace(/[🍄💰🏠⭐📍😊😄🤔]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.volume = 0.8
    
    utterance.onstart = () => {
      isSpeaking.value = true
      changeState('speaking')
    }
    
    utterance.onend = () => {
      isSpeaking.value = false
      changeState('idle')
      resolve(true)
    }
    
    utterance.onerror = () => {
      isSpeaking.value = false
      changeState('idle')
      resolve(false)
    }
    
    speechSynthesis.speak(utterance)
  })
}

// 语音识别
const initializeSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    speechSupported.value = true
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'zh-CN'

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      isListening.value = false
      changeState('thinking')
      emit('voiceInput', transcript)
    }

    recognition.onerror = (event: any) => {
      console.error('语音识别错误:', event.error)
      isListening.value = false
      changeState('idle')
      changeExpression('sad')
      setTimeout(() => changeExpression('happy'), 2000)
    }

    recognition.onend = () => {
      isListening.value = false
      if (currentState.value === 'listening') {
        changeState('idle')
      }
    }
  }
}

// 开始监听
const startListening = () => {
  if (!speechSupported.value || !recognition) return
  
  if (isListening.value) {
    recognition.stop()
    isListening.value = false
    changeState('idle')
  } else {
    recognition.start()
    isListening.value = true
    changeState('listening')
  }
}

// 切换语音
const toggleVoice = () => {
  voiceEnabled.value = !voiceEnabled.value
  
  if (!voiceEnabled.value && isSpeaking.value) {
    speechSynthesis?.cancel()
    isSpeaking.value = false
    changeState('idle')
  }
  
  // 表情反馈
  if (voiceEnabled.value) {
    changeExpression('excited')
    setTimeout(() => changeExpression('happy'), 1000)
  } else {
    changeExpression('sad')
    setTimeout(() => changeExpression('happy'), 1000)
  }
}

// 初始化
onMounted(() => {
  if ('speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis
  }
  initializeSpeechRecognition()
  
  // 初始问候
  if (props.autoSpeak) {
    setTimeout(() => {
      speakText(props.initialMessage)
    }, 1000)
  }
})

onUnmounted(() => {
  if (recognition) {
    recognition.stop()
  }
  if (speechSynthesis) {
    speechSynthesis.cancel()
  }
})

// 暴露方法给父组件
defineExpose({
  speakText,
  changeExpression,
  changeState,
  toggleVoice,
  startListening
})
</script>

<style scoped>
.smart-ai-assistant {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.ai-character-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.ai-character-container {
  position: relative;
  margin-bottom: 10px;
}

.ai-character {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0,123,255,0.3);
  transition: all 0.3s ease;
}

.ai-character.idle {
  transform: scale(1);
  filter: brightness(1);
}

.ai-character.listening {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(40,167,69,0.6);
  filter: brightness(1.1);
}

.ai-character.thinking {
  animation: thinking 1.5s ease-in-out infinite;
  filter: brightness(0.9);
}

.ai-character.speaking {
  animation: speaking 0.8s ease-in-out infinite;
  box-shadow: 0 0 25px rgba(255,193,7,0.8);
  filter: brightness(1.2);
}

.ai-character-container:hover .ai-character {
  transform: scale(1.1);
}

.ai-expression-overlay {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 2;
}

.ai-expression {
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.ai-speaking-indicator {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 3px;
  z-index: 2;
}

.sound-wave {
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  animation: soundWave 1s ease-in-out infinite;
}

.sound-wave:nth-child(2) {
  animation-delay: 0.2s;
}

.sound-wave:nth-child(3) {
  animation-delay: 0.4s;
}

.ai-status-text {
  font-size: 0.9rem;
  color: #6c757d;
  text-align: center;
  max-width: 150px;
}

.ai-controls {
  display: flex;
  gap: 10px;
}

.voice-toggle-btn,
.listen-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.voice-toggle-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.voice-toggle-btn.active {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.listen-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.listen-btn.active {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  animation: pulse 1s infinite;
}

.listen-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

@keyframes thinking {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.02) rotate(1deg); }
}

@keyframes speaking {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

@keyframes soundWave {
  0%, 100% { height: 8px; opacity: 0.3; }
  50% { height: 20px; opacity: 1; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>

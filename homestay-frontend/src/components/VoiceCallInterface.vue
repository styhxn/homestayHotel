<template>
  <div class="voice-call-interface" :class="{ 'active': isActive }">
    <!-- 语音通话主界面 -->
    <div class="call-container">
      <!-- AI角色显示 -->
      <div class="ai-avatar-section">
        <div class="avatar-container" :class="aiState">
          <img src="/src/assets/images/IP形象/普普正面.png" alt="AI助手" class="ai-avatar" />
          <div class="avatar-glow" v-if="isAISpeaking"></div>
          <div class="listening-indicator" v-if="isListening">
            <div class="pulse-ring"></div>
            <div class="pulse-ring delay-1"></div>
            <div class="pulse-ring delay-2"></div>
          </div>
        </div>
        
        <!-- AI状态文字 -->
        <div class="ai-status">
          <h3>普普1.0</h3>
          <p class="status-text">{{ statusText }}</p>
        </div>
      </div>

      <!-- 音量可视化 -->
      <div class="audio-visualizer" v-if="showVisualizer">
        <div class="volume-bars">
          <div 
            v-for="(bar, index) in volumeBars" 
            :key="index"
            class="volume-bar"
            :style="{ height: `${bar}%` }"
          ></div>
        </div>
        <div class="volume-level">
          <span>音量: {{ Math.round(currentVolume * 100) }}%</span>
        </div>
      </div>

      <!-- 实时对话显示 -->
      <div class="conversation-display" v-if="showConversation">
        <div class="current-speech">
          <div v-if="currentUserSpeech" class="user-speech">
            <span class="speaker">您:</span>
            <span class="text">{{ currentUserSpeech }}</span>
          </div>
          <div v-if="currentAIResponse" class="ai-speech">
            <span class="speaker">普普:</span>
            <span class="text">{{ currentAIResponse }}</span>
          </div>
        </div>
      </div>

      <!-- 控制按钮区域 -->
      <div class="call-controls">
        <!-- 主要控制按钮 -->
        <div class="primary-controls">
          <button 
            class="call-button"
            :class="{ 'active': isActive, 'connecting': isConnecting }"
            @click="toggleCall"
            :disabled="isConnecting"
          >
            <i class="icon" :class="callButtonIcon"></i>
            <span>{{ callButtonText }}</span>
          </button>
        </div>

        <!-- 次要控制按钮 -->
        <div class="secondary-controls" v-if="isActive">
          <button 
            class="control-btn mute-btn"
            :class="{ 'active': isMuted }"
            @click="toggleMute"
            :title="isMuted ? '取消静音' : '静音'"
          >
            <i :class="isMuted ? 'icon-mic-off' : 'icon-mic'"></i>
          </button>

          <button 
            class="control-btn speaker-btn"
            :class="{ 'active': speakerEnabled }"
            @click="toggleSpeaker"
            :title="speakerEnabled ? '关闭扬声器' : '开启扬声器'"
          >
            <i :class="speakerEnabled ? 'icon-volume-up' : 'icon-volume-off'"></i>
          </button>

          <button 
            class="control-btn settings-btn"
            @click="showSettings = !showSettings"
            title="设置"
          >
            <i class="icon-settings"></i>
          </button>
        </div>
      </div>

      <!-- 网络状态指示器 -->
      <div class="network-status" v-if="isActive">
        <div class="status-indicator" :class="networkQuality">
          <div class="signal-bars">
            <div class="bar" v-for="i in 4" :key="i"></div>
          </div>
          <span class="status-label">{{ networkStatusText }}</span>
        </div>
      </div>

      <!-- 错误提示 -->
      <div class="error-message" v-if="errorMessage">
        <i class="icon-warning"></i>
        <span>{{ errorMessage }}</span>
        <button @click="clearError" class="close-btn">×</button>
      </div>
    </div>

    <!-- 设置面板 -->
    <div class="settings-panel" v-if="showSettings" @click.self="showSettings = false">
      <div class="settings-content">
        <h4>语音通话设置</h4>
        
        <!-- 音频设备选择 -->
        <div class="setting-group">
          <label>麦克风设备</label>
          <select v-model="selectedMicrophone" @change="changeMicrophone">
            <option value="">默认设备</option>
            <option 
              v-for="device in audioDevices" 
              :key="device.deviceId"
              :value="device.deviceId"
            >
              {{ device.label || '未知设备' }}
            </option>
          </select>
        </div>

        <!-- 音量阈值调节 -->
        <div class="setting-group">
          <label>语音检测灵敏度</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            v-model="volumeThreshold"
            @input="updateVolumeThreshold"
            class="threshold-slider"
          />
          <span class="threshold-value">{{ volumeThreshold }}%</span>
        </div>

        <!-- 语音速度调节 -->
        <div class="setting-group">
          <label>AI语音速度</label>
          <input 
            type="range" 
            min="50" 
            max="200" 
            v-model="speechRate"
            @input="updateSpeechRate"
            class="rate-slider"
          />
          <span class="rate-value">{{ speechRate }}%</span>
        </div>

        <!-- 功能开关 -->
        <div class="setting-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="enableInterruption"
              @change="updateInterruption"
            />
            <span>允许打断AI说话</span>
          </label>
        </div>

        <div class="setting-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="showVisualizer"
            />
            <span>显示音量可视化</span>
          </label>
        </div>

        <div class="settings-actions">
          <button @click="resetSettings" class="reset-btn">重置设置</button>
          <button @click="showSettings = false" class="close-btn">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { RealTimeVoiceService, type VoiceCallState } from '../services/RealTimeVoiceService'
import { VoiceActivityDetection } from '../services/VoiceActivityDetection'
import { RealTimeAIProcessor } from '../services/RealTimeAIProcessor'

// 响应式数据
const isActive = ref(false)
const isConnecting = ref(false)
const isListening = ref(false)
const isAISpeaking = ref(false)
const isMuted = ref(false)
const speakerEnabled = ref(true)
const showSettings = ref(false)
const showVisualizer = ref(true)
const showConversation = ref(true)

// 状态数据
const currentVolume = ref(0)
const networkQuality = ref<'excellent' | 'good' | 'fair' | 'poor'>('good')
const errorMessage = ref('')
const currentUserSpeech = ref('')
const currentAIResponse = ref('')

// 设置数据
const selectedMicrophone = ref('')
const audioDevices = ref<MediaDeviceInfo[]>([])
const volumeThreshold = ref(30)
const speechRate = ref(110)
const enableInterruption = ref(true)

// 音量可视化
const volumeBars = ref<number[]>(new Array(20).fill(0))

// 服务实例
let voiceService: RealTimeVoiceService | null = null
let vadService: VoiceActivityDetection | null = null
let aiProcessor: RealTimeAIProcessor | null = null

// 计算属性
const aiState = computed(() => {
  if (isAISpeaking.value) return 'speaking'
  if (isListening.value) return 'listening'
  return 'idle'
})

const statusText = computed(() => {
  if (isConnecting.value) return '正在连接...'
  if (isAISpeaking.value) return '正在说话'
  if (isListening.value) return '正在聆听'
  if (isActive.value) return '通话中'
  return '点击开始语音通话'
})

const callButtonIcon = computed(() => {
  if (isConnecting.value) return 'icon-loading'
  if (isActive.value) return 'icon-phone-off'
  return 'icon-phone'
})

const callButtonText = computed(() => {
  if (isConnecting.value) return '连接中...'
  if (isActive.value) return '结束通话'
  return '开始通话'
})

const networkStatusText = computed(() => {
  const statusMap = {
    excellent: '网络优秀',
    good: '网络良好',
    fair: '网络一般',
    poor: '网络较差'
  }
  return statusMap[networkQuality.value]
})

// 方法
const toggleCall = async () => {
  if (isActive.value) {
    await endCall()
  } else {
    await startCall()
  }
}

const startCall = async () => {
  try {
    isConnecting.value = true
    clearError()

    // 检查浏览器支持
    const support = RealTimeVoiceService.checkBrowserSupport()
    if (!support.speechRecognition || !support.speechSynthesis || !support.mediaDevices) {
      throw new Error('您的浏览器不支持语音通话功能，请使用Chrome、Edge或Safari浏览器')
    }

    // 初始化服务
    await initializeServices()

    // 开始语音通话
    await voiceService?.startVoiceCall()

    isActive.value = true
    isConnecting.value = false

    console.log('语音通话已开始')
  } catch (error) {
    console.error('启动语音通话失败:', error)
    isConnecting.value = false
    showError(error instanceof Error ? error.message : '启动语音通话失败')
  }
}

const endCall = async () => {
  try {
    await voiceService?.endVoiceCall()
    
    // 清理服务
    cleanupServices()
    
    isActive.value = false
    isListening.value = false
    isAISpeaking.value = false
    currentUserSpeech.value = ''
    currentAIResponse.value = ''
    
    console.log('语音通话已结束')
  } catch (error) {
    console.error('结束语音通话失败:', error)
    showError('结束语音通话失败')
  }
}

const initializeServices = async () => {
  // 初始化语音服务
  voiceService = new RealTimeVoiceService(
    {
      vadEnabled: true,
      vadThreshold: volumeThreshold.value / 100,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    },
    {
      onStateChange: handleVoiceStateChange,
      onUserSpeechStart: handleUserSpeechStart,
      onUserSpeechEnd: handleUserSpeechEnd,
      onError: handleVoiceError,
      onAudioLevel: handleAudioLevel
    }
  )

  // 初始化AI处理器
  aiProcessor = new RealTimeAIProcessor(
    {
      voiceRate: speechRate.value / 100,
      enableInterruption: enableInterruption.value
    },
    {
      onProcessingStart: handleAIProcessingStart,
      onProcessingComplete: handleAIProcessingComplete,
      onSpeechStart: handleAISpeechStart,
      onSpeechComplete: handleAISpeechComplete,
      onError: handleAIError
    }
  )
}

const cleanupServices = () => {
  vadService?.destroy()
  aiProcessor?.destroy()
  voiceService = null
  vadService = null
  aiProcessor = null
}

// 事件处理器
const handleVoiceStateChange = (state: VoiceCallState) => {
  isListening.value = state.isRecording
  networkQuality.value = state.networkQuality
  if (state.error) {
    showError(state.error)
  }
}

const handleUserSpeechStart = () => {
  currentUserSpeech.value = ''
  currentAIResponse.value = ''
}

const handleUserSpeechEnd = async (transcript: string) => {
  currentUserSpeech.value = transcript
  await aiProcessor?.processUserInput(transcript)
}

const handleAIProcessingStart = (userInput: string) => {
  console.log('AI开始处理:', userInput)
}

const handleAIProcessingComplete = (response: string) => {
  currentAIResponse.value = response
}

const handleAISpeechStart = (text: string) => {
  isAISpeaking.value = true
}

const handleAISpeechComplete = () => {
  isAISpeaking.value = false
}

const handleVoiceError = (error: Error) => {
  showError(error.message)
}

const handleAIError = (error: Error) => {
  showError(`AI处理错误: ${error.message}`)
}

const handleAudioLevel = (level: number) => {
  currentVolume.value = level
  updateVolumeVisualization(level)
}

// 音量可视化更新
const updateVolumeVisualization = (level: number) => {
  if (!showVisualizer.value) return
  
  // 更新音量条
  const normalizedLevel = Math.min(level * 100, 100)
  for (let i = 0; i < volumeBars.value.length; i++) {
    const threshold = (i / volumeBars.value.length) * 100
    volumeBars.value[i] = normalizedLevel > threshold ? normalizedLevel : 0
  }
}

// 控制方法
const toggleMute = () => {
  isMuted.value = !isMuted.value
  // 实现静音逻辑
}

const toggleSpeaker = () => {
  speakerEnabled.value = !speakerEnabled.value
  // 实现扬声器控制逻辑
}

// 设置方法
const changeMicrophone = async () => {
  if (voiceService && selectedMicrophone.value) {
    await voiceService.switchAudioDevice(selectedMicrophone.value)
  }
}

const updateVolumeThreshold = () => {
  voiceService?.setVolumeThreshold(volumeThreshold.value / 100)
}

const updateSpeechRate = () => {
  // 更新AI语音速度
}

const updateInterruption = () => {
  // 更新打断设置
}

const resetSettings = () => {
  volumeThreshold.value = 30
  speechRate.value = 110
  enableInterruption.value = true
  showVisualizer.value = true
  showConversation.value = true
}

// 错误处理
const showError = (message: string) => {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}

const clearError = () => {
  errorMessage.value = ''
}

// 生命周期
onMounted(async () => {
  // 获取音频设备列表
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    audioDevices.value = devices.filter(device => device.kind === 'audioinput')
  } catch (error) {
    console.error('获取音频设备失败:', error)
  }
})

onUnmounted(() => {
  if (isActive.value) {
    endCall()
  }
  cleanupServices()
})
</script>

<style scoped>
.voice-call-interface {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  max-width: 90vw;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.voice-call-interface.active {
  opacity: 1;
  visibility: visible;
  pointer-events: all;
}

.call-container {
  padding: 30px 20px;
  color: white;
  text-align: center;
}

/* AI角色显示 */
.ai-avatar-section {
  margin-bottom: 30px;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.3s ease;
}

.avatar-container.speaking {
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
}

.avatar-container.listening {
  animation: pulse 2s infinite;
}

.ai-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: glow 1.5s ease-in-out infinite alternate;
}

.listening-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
}

.pulse-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: pulse-ring 2s ease-out infinite;
}

.pulse-ring.delay-1 {
  animation-delay: 0.5s;
}

.pulse-ring.delay-2 {
  animation-delay: 1s;
}

.ai-status h3 {
  margin: 0 0 10px;
  font-size: 24px;
  font-weight: 600;
}

.status-text {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

/* 音量可视化 */
.audio-visualizer {
  margin: 20px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.volume-bars {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 60px;
  gap: 3px;
  margin-bottom: 10px;
}

.volume-bar {
  width: 4px;
  background: linear-gradient(to top, #4CAF50, #8BC34A, #CDDC39);
  border-radius: 2px;
  transition: height 0.1s ease;
  min-height: 2px;
}

.volume-level {
  font-size: 14px;
  opacity: 0.8;
}

/* 对话显示 */
.conversation-display {
  margin: 20px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  min-height: 80px;
}

.current-speech {
  text-align: left;
}

.user-speech, .ai-speech {
  margin: 10px 0;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.user-speech {
  background: rgba(33, 150, 243, 0.3);
}

.ai-speech {
  background: rgba(76, 175, 80, 0.3);
}

.speaker {
  font-weight: 600;
  margin-right: 8px;
}

/* 控制按钮 */
.call-controls {
  margin: 30px 0 20px;
}

.primary-controls {
  margin-bottom: 20px;
}

.call-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.call-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
}

.call-button.active {
  background: linear-gradient(135deg, #f44336, #d32f2f);
}

.call-button.connecting {
  background: linear-gradient(135deg, #ff9800, #f57c00);
  animation: pulse 1.5s infinite;
}

.call-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.control-btn.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.7);
}

/* 网络状态 */
.network-status {
  margin-top: 20px;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  opacity: 0.8;
}

.signal-bars {
  display: flex;
  gap: 2px;
  align-items: flex-end;
}

.signal-bars .bar {
  width: 3px;
  background: currentColor;
  border-radius: 1px;
}

.signal-bars .bar:nth-child(1) { height: 8px; }
.signal-bars .bar:nth-child(2) { height: 12px; }
.signal-bars .bar:nth-child(3) { height: 16px; }
.signal-bars .bar:nth-child(4) { height: 20px; }

.status-indicator.excellent .signal-bars .bar { opacity: 1; }
.status-indicator.good .signal-bars .bar:nth-child(n+2) { opacity: 0.3; }
.status-indicator.fair .signal-bars .bar:nth-child(n+3) { opacity: 0.3; }
.status-indicator.poor .signal-bars .bar:nth-child(n+4) { opacity: 0.3; }

/* 错误提示 */
.error-message {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  background: rgba(244, 67, 54, 0.9);
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  backdrop-filter: blur(10px);
}

.error-message .close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  margin-left: auto;
}

/* 设置面板 */
.settings-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  backdrop-filter: blur(5px);
}

.settings-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  width: 400px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.settings-content h4 {
  margin: 0 0 25px;
  color: #333;
  font-size: 20px;
  text-align: center;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.setting-group select,
.setting-group input[type="range"] {
  width: 100%;
  padding: 8px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.threshold-slider,
.rate-slider {
  -webkit-appearance: none;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  outline: none;
}

.threshold-slider::-webkit-slider-thumb,
.rate-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
}

.threshold-value,
.rate-value {
  display: inline-block;
  margin-left: 10px;
  color: #667eea;
  font-weight: 600;
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
}

.settings-actions {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

.reset-btn,
.close-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn {
  background: #f5f5f5;
  color: #666;
}

.close-btn {
  background: #667eea;
  color: white;
}

.reset-btn:hover {
  background: #e0e0e0;
}

.close-btn:hover {
  background: #5a6fd8;
}

/* 动画 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes glow {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

/* 图标样式 */
.icon-phone::before { content: "📞"; }
.icon-phone-off::before { content: "📵"; }
.icon-loading::before { content: "⏳"; animation: spin 1s linear infinite; }
.icon-mic::before { content: "🎤"; }
.icon-mic-off::before { content: "🔇"; }
.icon-volume-up::before { content: "🔊"; }
.icon-volume-off::before { content: "🔈"; }
.icon-settings::before { content: "⚙️"; }
.icon-warning::before { content: "⚠️"; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .voice-call-interface {
    width: 95vw;
    margin: 10px;
  }

  .call-container {
    padding: 20px 15px;
  }

  .avatar-container {
    width: 100px;
    height: 100px;
  }

  .call-button {
    width: 70px;
    height: 70px;
    font-size: 14px;
  }

  .control-btn {
    width: 45px;
    height: 45px;
  }
}
</style>

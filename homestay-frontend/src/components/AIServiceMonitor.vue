<template>
  <div class="ai-service-monitor" v-if="showMonitor">
    <div class="monitor-header">
      <span class="monitor-title">🤖 AI服务状态</span>
      <button @click="toggleMonitor" class="toggle-btn">
        {{ isExpanded ? '收起' : '展开' }}
      </button>
    </div>
    
    <div v-if="isExpanded" class="monitor-content">
      <!-- Dify服务状态 -->
      <div class="service-item">
        <div class="service-name">
          <span class="service-icon">🌐</span>
          Dify AI服务
        </div>
        <div class="service-status" :class="difyStatus.class">
          {{ difyStatus.text }}
        </div>
        <button @click="testDifyConnection" class="test-btn" :disabled="testing">
          {{ testing ? '测试中...' : '测试连接' }}
        </button>
      </div>
      
      <!-- 本地AI状态 -->
      <div class="service-item">
        <div class="service-name">
          <span class="service-icon">🏠</span>
          本地AI服务
        </div>
        <div class="service-status status-online">
          正常运行
        </div>
        <span class="service-note">始终可用</span>
      </div>
      
      <!-- 当前使用的服务 -->
      <div class="current-service">
        <span class="current-label">当前使用:</span>
        <span class="current-value" :class="currentServiceClass">
          {{ currentService }}
        </span>
      </div>
      
      <!-- 自动切换设置 -->
      <div class="auto-switch">
        <label class="switch-label">
          <input 
            type="checkbox" 
            v-model="autoSwitchEnabled" 
            @change="updateAutoSwitch"
          >
          <span class="switch-text">自动切换到本地AI</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Props
interface Props {
  showMonitor?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showMonitor: true
})

// Emits
const emit = defineEmits<{
  statusChange: [status: { difyConnected: boolean, currentService: string }]
}>()

// 响应式数据
const isExpanded = ref(false)
const testing = ref(false)
const difyConnected = ref(false)
const autoSwitchEnabled = ref(true)
const lastTestTime = ref<Date | null>(null)

// 计算属性
const difyStatus = computed(() => {
  if (difyConnected.value) {
    return {
      text: '连接正常',
      class: 'status-online'
    }
  } else {
    return {
      text: '连接失败',
      class: 'status-offline'
    }
  }
})

const currentService = computed(() => {
  return difyConnected.value ? 'Dify AI' : '本地AI'
})

const currentServiceClass = computed(() => {
  return difyConnected.value ? 'service-dify' : 'service-local'
})

// 方法
const toggleMonitor = () => {
  isExpanded.value = !isExpanded.value
}

const testDifyConnection = async () => {
  testing.value = true
  
  try {
    // 测试Dify连接
    const response = await fetch('/api/dify/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: '测试连接',
        user: 'test-user'
      }),
      signal: AbortSignal.timeout(5000) // 5秒超时
    })
    
    if (response.ok) {
      difyConnected.value = true
      console.log('✅ Dify连接测试成功')
    } else {
      difyConnected.value = false
      console.log('❌ Dify连接测试失败:', response.status)
    }
  } catch (error) {
    difyConnected.value = false
    console.log('❌ Dify连接测试异常:', error)
  } finally {
    testing.value = false
    lastTestTime.value = new Date()
    
    // 发送状态变化事件
    emit('statusChange', {
      difyConnected: difyConnected.value,
      currentService: currentService.value
    })
  }
}

const updateAutoSwitch = () => {
  console.log('自动切换设置:', autoSwitchEnabled.value ? '启用' : '禁用')
  localStorage.setItem('ai-auto-switch', autoSwitchEnabled.value.toString())
}

// 定期检测Dify连接状态
const startPeriodicCheck = () => {
  // 每30秒检测一次
  setInterval(async () => {
    if (autoSwitchEnabled.value && difyConnected.value) {
      await testDifyConnection()
    }
  }, 30000)
}

// 初始化
onMounted(() => {
  // 读取自动切换设置
  const savedAutoSwitch = localStorage.getItem('ai-auto-switch')
  if (savedAutoSwitch !== null) {
    autoSwitchEnabled.value = savedAutoSwitch === 'true'
  }
  
  // 初始连接测试
  testDifyConnection()
  
  // 开始定期检测
  startPeriodicCheck()
})
</script>

<style scoped>
.ai-service-monitor {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 280px;
  backdrop-filter: blur(10px);
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.monitor-title {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.toggle-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background-color: #f5f5f5;
}

.monitor-content {
  padding: 16px;
}

.service-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 8px;
}

.service-name {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
}

.service-icon {
  margin-right: 8px;
}

.service-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.status-online {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-offline {
  background: #ffebee;
  color: #c62828;
}

.test-btn {
  background: #1976d2;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.test-btn:hover:not(:disabled) {
  background: #1565c0;
}

.test-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.service-note {
  font-size: 11px;
  color: #666;
}

.current-service {
  margin: 16px 0 12px 0;
  padding: 8px;
  background: #f0f7ff;
  border-radius: 6px;
  font-size: 13px;
}

.current-label {
  color: #666;
  margin-right: 8px;
}

.current-value {
  font-weight: 600;
}

.service-dify {
  color: #1976d2;
}

.service-local {
  color: #2e7d32;
}

.auto-switch {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.switch-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 13px;
}

.switch-label input[type="checkbox"] {
  margin-right: 8px;
}

.switch-text {
  color: #333;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .ai-service-monitor {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
  }
  
  .service-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .test-btn {
    align-self: flex-end;
  }
}
</style>

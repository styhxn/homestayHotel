<template>
  <div class="chat-history-manager">
    <!-- 聊天记录按钮 -->
    <button 
      @click="showHistory = !showHistory" 
      class="history-toggle-btn"
      :class="{ active: showHistory }"
    >
      <i class="fas fa-history"></i>
      聊天记录
      <span v-if="totalSessions > 0" class="badge">{{ totalSessions }}</span>
    </button>

    <!-- 聊天记录面板 -->
    <div v-if="showHistory" class="history-panel">
      <div class="history-header">
        <h3>💬 聊天记录</h3>
        <div class="header-actions">
          <button @click="refreshHistory" class="btn-icon" title="刷新">
            <i class="fas fa-sync-alt"></i>
          </button>
          <button @click="clearAllHistory" class="btn-icon btn-danger" title="清空所有">
            <i class="fas fa-trash"></i>
          </button>
          <button @click="showHistory = false" class="btn-icon" title="关闭">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="history-content">
        <!-- 会话列表 -->
        <div v-if="sessions.length === 0" class="empty-state">
          <i class="fas fa-comments"></i>
          <p>暂无聊天记录</p>
        </div>

        <div v-else class="sessions-list">
          <div 
            v-for="session in sessions" 
            :key="session.id"
            class="session-item"
            :class="{ active: session.id === currentSessionId }"
            @click="switchSession(session.id)"
          >
            <div class="session-info">
              <div class="session-name">{{ session.sessionName }}</div>
              <div class="session-meta">
                <span class="message-count">{{ session.messages.length }}条消息</span>
                <span class="session-time">{{ formatTime(session.updatedAt) }}</span>
              </div>
            </div>
            
            <div class="session-actions">
              <button 
                @click.stop="exportSession(session.id)" 
                class="btn-mini" 
                title="导出"
              >
                <i class="fas fa-download"></i>
              </button>
              <button 
                @click.stop="deleteSession(session.id)" 
                class="btn-mini btn-danger" 
                title="删除"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 会话详情 -->
        <div v-if="selectedSession" class="session-details">
          <div class="details-header">
            <h4>{{ selectedSession.sessionName }}</h4>
            <div class="session-stats">
              <span>创建时间：{{ formatDateTime(selectedSession.createdAt) }}</span>
              <span>消息数量：{{ selectedSession.messages.length }}</span>
            </div>
          </div>

          <div class="messages-preview">
            <div 
              v-for="message in selectedSession.messages.slice(-5)" 
              :key="message.id"
              class="message-preview"
              :class="message.type"
            >
              <div class="message-header">
                <span class="message-type">{{ message.type === 'user' ? '用户' : 'AI' }}</span>
                <span class="message-time">{{ message.timestamp }}</span>
              </div>
              <div class="message-content">{{ truncateText(message.content, 100) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChatHistoryStore } from '../stores/chatHistory'
import { useAuthStore } from '../stores/auth'

const chatHistory = useChatHistoryStore()
const auth = useAuthStore()

const showHistory = ref(false)
const selectedSessionId = ref('')

// 计算属性
const sessions = computed(() => {
  const userId = auth.user?.id?.toString() || 'guest'
  return chatHistory.getUserSessions(userId)
})

const totalSessions = computed(() => sessions.value.length)

const currentSessionId = computed(() => chatHistory.currentSessionId)

const selectedSession = computed(() => {
  return sessions.value.find(s => s.id === selectedSessionId.value) || null
})

// 方法
const refreshHistory = () => {
  chatHistory.loadFromStorage()
  console.log('🔄 刷新聊天记录')
}

const clearAllHistory = () => {
  if (confirm('确定要清空所有聊天记录吗？此操作不可恢复。')) {
    chatHistory.clearAllSessions()
    showHistory.value = false
    console.log('🧹 清空所有聊天记录')
  }
}

const switchSession = (sessionId: string) => {
  selectedSessionId.value = sessionId
  chatHistory.switchToSession(sessionId)
  console.log('🔄 切换到会话:', sessionId)
  
  // 可以触发页面刷新或重新加载聊天内容
  window.location.reload()
}

const deleteSession = (sessionId: string) => {
  if (confirm('确定要删除这个聊天会话吗？')) {
    chatHistory.deleteSession(sessionId)
    if (selectedSessionId.value === sessionId) {
      selectedSessionId.value = ''
    }
    console.log('🗑️ 删除会话:', sessionId)
  }
}

const exportSession = (sessionId: string) => {
  const sessionData = chatHistory.exportSession(sessionId)
  if (sessionData) {
    const blob = new Blob([sessionData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat_session_${sessionId}.json`
    a.click()
    URL.revokeObjectURL(url)
    console.log('📥 导出会话:', sessionId)
  }
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return Math.floor(diff / 86400000) + '天前'
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

onMounted(() => {
  refreshHistory()
})
</script>

<style scoped>
.chat-history-manager {
  position: relative;
}

.history-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.history-toggle-btn:hover,
.history-toggle-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.badge {
  background: #dc3545;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  min-width: 20px;
  text-align: center;
}

.history-panel {
  position: absolute;
  top: 100%;
  left: 0;
  width: 400px;
  max-height: 600px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  z-index: 1000;
  overflow: hidden;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.history-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background: #e9ecef;
}

.btn-icon.btn-danger:hover {
  background: #f8d7da;
  color: #dc3545;
}

.history-content {
  max-height: 500px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.sessions-list {
  padding: 12px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 8px;
}

.session-item:hover {
  background: #f8f9fa;
}

.session-item.active {
  background: #e3f2fd;
  border: 1px solid #2196f3;
}

.session-info {
  flex: 1;
}

.session-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.session-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6c757d;
}

.session-actions {
  display: flex;
  gap: 4px;
}

.btn-mini {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.btn-mini:hover {
  background: #e9ecef;
}

.btn-mini.btn-danger:hover {
  background: #f8d7da;
  color: #dc3545;
}

.session-details {
  border-top: 1px solid #dee2e6;
  padding: 16px;
  background: #f8f9fa;
}

.details-header h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.session-stats {
  font-size: 12px;
  color: #6c757d;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.messages-preview {
  margin-top: 12px;
}

.message-preview {
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 12px;
}

.message-preview.user {
  background: #e3f2fd;
}

.message-preview.ai {
  background: #f3e5f5;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-weight: 500;
}

.message-content {
  color: #555;
  line-height: 1.4;
}
</style>

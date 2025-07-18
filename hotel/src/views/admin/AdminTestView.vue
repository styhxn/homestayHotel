<template>
  <div class="admin-test admin-gradient-bg">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-flask"></i>
        功能测试
      </h1>
      <p class="page-description">测试普洱蘑菇庄园管理后台的各项功能</p>
    </div>

    <!-- 通知测试 -->
    <div class="test-section admin-card">
      <div class="admin-card-header">
        <h3>通知系统测试</h3>
      </div>
      <div class="admin-card-body">
        <div class="button-grid">
          <button @click="testSuccess" class="admin-btn admin-btn-success">
            <i class="fas fa-check"></i>
            成功通知
          </button>
          <button @click="testError" class="admin-btn admin-btn-danger">
            <i class="fas fa-times"></i>
            错误通知
          </button>
          <button @click="testWarning" class="admin-btn admin-btn-warning">
            <i class="fas fa-exclamation-triangle"></i>
            警告通知
          </button>
          <button @click="testInfo" class="admin-btn admin-btn-primary">
            <i class="fas fa-info-circle"></i>
            信息通知
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态测试 -->
    <div class="test-section admin-card">
      <div class="admin-card-header">
        <h3>加载状态测试</h3>
      </div>
      <div class="admin-card-body">
        <div class="button-grid">
          <button @click="testLoading" class="admin-btn admin-btn-secondary">
            <i class="fas fa-spinner"></i>
            显示加载
          </button>
          <button @click="testLoadingWithData" class="admin-btn admin-btn-secondary">
            <i class="fas fa-database"></i>
            模拟数据加载
          </button>
        </div>
        
        <!-- 加载组件 -->
        <div v-if="showLoading" class="loading-placeholder">
          <h3>{{ loadingTitle }}</h3>
          <p>{{ loadingMessage }}</p>
        </div>
      </div>
    </div>

    <!-- 确认对话框测试 -->
    <div class="test-section admin-card">
      <div class="admin-card-header">
        <h3>确认对话框测试</h3>
      </div>
      <div class="admin-card-body">
        <div class="button-grid">
          <button @click="testConfirmInfo" class="admin-btn admin-btn-primary">
            <i class="fas fa-question-circle"></i>
            信息确认
          </button>
          <button @click="testConfirmWarning" class="admin-btn admin-btn-warning">
            <i class="fas fa-exclamation-triangle"></i>
            警告确认
          </button>
          <button @click="testConfirmDanger" class="admin-btn admin-btn-danger">
            <i class="fas fa-trash"></i>
            危险确认
          </button>
        </div>
        
        <!-- 确认对话框 -->
        <div v-if="showConfirm" class="confirm-placeholder">
          <h3>{{ confirmTitle }}</h3>
          <p>{{ confirmMessage }}</p>
          <button @click="handleConfirm" :disabled="confirmLoading">确认</button>
          <button @click="handleCancel">取消</button>
        </div>
      </div>
    </div>

    <!-- 空状态测试 -->
    <div class="test-section admin-card">
      <div class="admin-card-header">
        <h3>空状态组件测试</h3>
      </div>
      <div class="admin-card-body">
        <div class="button-grid">
          <button @click="showEmptyDefault" class="admin-btn admin-btn-secondary">
            <i class="fas fa-inbox"></i>
            默认空状态
          </button>
          <button @click="showEmptySearch" class="admin-btn admin-btn-secondary">
            <i class="fas fa-search"></i>
            搜索空状态
          </button>
          <button @click="showEmptyError" class="admin-btn admin-btn-secondary">
            <i class="fas fa-exclamation-triangle"></i>
            错误空状态
          </button>
        </div>
        
        <!-- 空状态组件 -->
        <div v-if="showEmpty" class="empty-placeholder">
          <h3>{{ emptyTitle }}</h3>
          <p>{{ emptyDescription }}</p>
          <button @click="hideEmpty" class="admin-btn admin-btn-primary">
            <i class="fas fa-redo"></i>
            重新加载
          </button>
        </div>
      </div>
    </div>

    <!-- API测试 -->
    <div class="test-section admin-card">
      <div class="admin-card-header">
        <h3>API连接测试</h3>
      </div>
      <div class="admin-card-body">
        <div class="button-grid">
          <button @click="testRoomAPI" class="admin-btn admin-btn-primary">
            <i class="fas fa-bed"></i>
            测试房间API
          </button>
          <button @click="testOrderAPI" class="admin-btn admin-btn-primary">
            <i class="fas fa-clipboard-list"></i>
            测试订单API
          </button>
          <button @click="testUserAPI" class="admin-btn admin-btn-primary">
            <i class="fas fa-users"></i>
            测试用户API
          </button>
        </div>
        
        <!-- API测试结果 -->
        <div v-if="apiResults.length > 0" class="api-results">
          <h4>测试结果：</h4>
          <div v-for="result in apiResults" :key="result.id" class="api-result">
            <span :class="['status', result.success ? 'success' : 'error']">
              <i :class="result.success ? 'fas fa-check' : 'fas fa-times'"></i>
            </span>
            <span class="api-name">{{ result.name }}</span>
            <span class="api-message">{{ result.message }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主题样式展示 -->
    <div class="test-section admin-card">
      <div class="admin-card-header">
        <h3>主题样式展示</h3>
      </div>
      <div class="admin-card-body">
        <div class="theme-showcase">
          <div class="color-palette">
            <div class="color-item">
              <div class="color-box primary"></div>
              <span>主色调</span>
            </div>
            <div class="color-item">
              <div class="color-box secondary"></div>
              <span>辅助色</span>
            </div>
            <div class="color-item">
              <div class="color-box success"></div>
              <span>成功色</span>
            </div>
            <div class="color-item">
              <div class="color-box warning"></div>
              <span>警告色</span>
            </div>
            <div class="color-item">
              <div class="color-box danger"></div>
              <span>危险色</span>
            </div>
          </div>
          
          <div class="badge-showcase">
            <span class="admin-badge admin-badge-primary">主要</span>
            <span class="admin-badge admin-badge-success">成功</span>
            <span class="admin-badge admin-badge-warning">警告</span>
            <span class="admin-badge admin-badge-danger">危险</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ApiResponse } from '@/types/api'
// import { notification } from '../../utils/notification'

// 简单的通知替代方案
const notification = {
  success: (message: string, title?: string) => {
    console.log(`✅ ${title || '成功'}: ${message}`)
    alert(`✅ ${message}`)
  },
  error: (message: string, title?: string) => {
    console.error(`❌ ${title || '错误'}: ${message}`)
    alert(`❌ ${message}`)
  },
  warning: (message: string, title?: string) => {
    console.warn(`⚠️ ${title || '警告'}: ${message}`)
    alert(`⚠️ ${message}`)
  },
  info: (message: string, title?: string) => {
    console.info(`ℹ️ ${title || '信息'}: ${message}`)
    alert(`ℹ️ ${message}`)
  }
}
import request from '../../utils/request'
// import AdminLoading from '../../components/admin/AdminLoading.vue'
// import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog.vue'
// import AdminEmptyState from '../../components/admin/AdminEmptyState.vue'

// 加载状态
const showLoading = ref(false)
const loadingTitle = ref('加载中')
const loadingMessage = ref('请稍候...')

// 确认对话框状态
const showConfirm = ref(false)
const confirmType = ref<'info' | 'warning' | 'danger'>('info')
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmLoading = ref(false)

// 空状态
const showEmpty = ref(false)
const emptyType = ref<'default' | 'search' | 'error'>('default')
const emptyTitle = ref('')
const emptyDescription = ref('')

// API测试结果
const apiResults = ref<Array<{
  id: number
  name: string
  success: boolean
  message: string
}>>([])

// 通知测试
const testSuccess = () => {
  notification.success('这是一个成功通知', '操作成功')
}

const testError = () => {
  notification.error('这是一个错误通知', '操作失败')
}

const testWarning = () => {
  notification.warning('这是一个警告通知', '注意事项')
}

const testInfo = () => {
  notification.info('这是一个信息通知', '系统提示')
}

// 加载测试
const testLoading = () => {
  showLoading.value = true
  loadingTitle.value = '加载中'
  loadingMessage.value = '正在处理您的请求...'
  
  setTimeout(() => {
    showLoading.value = false
    notification.success('加载完成', '测试成功')
  }, 3000)
}

const testLoadingWithData = () => {
  showLoading.value = true
  loadingTitle.value = '获取数据'
  loadingMessage.value = '正在从服务器获取最新数据...'
  
  setTimeout(() => {
    showLoading.value = false
    notification.success('数据获取成功', '测试完成')
  }, 2000)
}

// 确认对话框测试
const testConfirmInfo = () => {
  showConfirm.value = true
  confirmType.value = 'info'
  confirmTitle.value = '信息确认'
  confirmMessage.value = '您确定要执行此操作吗？'
}

const testConfirmWarning = () => {
  showConfirm.value = true
  confirmType.value = 'warning'
  confirmTitle.value = '警告确认'
  confirmMessage.value = '此操作可能会影响系统性能，确定继续吗？'
}

const testConfirmDanger = () => {
  showConfirm.value = true
  confirmType.value = 'danger'
  confirmTitle.value = '危险操作'
  confirmMessage.value = '此操作不可撤销，确定要删除所有数据吗？'
}

const handleConfirm = () => {
  confirmLoading.value = true
  
  setTimeout(() => {
    confirmLoading.value = false
    showConfirm.value = false
    notification.success('操作确认成功', '测试完成')
  }, 1500)
}

const handleCancel = () => {
  showConfirm.value = false
  confirmLoading.value = false
  notification.info('操作已取消', '测试取消')
}

// 空状态测试
const showEmptyDefault = () => {
  showEmpty.value = true
  emptyType.value = 'default'
  emptyTitle.value = '暂无数据'
  emptyDescription.value = '当前没有可显示的内容，请稍后再试'
}

const showEmptySearch = () => {
  showEmpty.value = true
  emptyType.value = 'search'
  emptyTitle.value = '未找到结果'
  emptyDescription.value = '没有找到符合条件的数据，请尝试其他搜索条件'
}

const showEmptyError = () => {
  showEmpty.value = true
  emptyType.value = 'error'
  emptyTitle.value = '加载失败'
  emptyDescription.value = '数据加载时发生错误，请检查网络连接'
}

const hideEmpty = () => {
  showEmpty.value = false
  notification.success('重新加载成功', '测试完成')
}

// API测试
const testRoomAPI = async () => {
  try {
    const response = await request.get('/h/room', {
      params: { pageNum: 1, pageSize: 1 }
    })
    
    apiResults.value.unshift({
      id: Date.now(),
      name: '房间API',
      success: response.code === 200,
      message: response.code === 200 ? '连接成功' : `错误: ${response.message || response.msg || '未知错误'}`
    })
  } catch (error) {
    apiResults.value.unshift({
      id: Date.now(),
      name: '房间API',
      success: false,
      message: `连接失败: ${error}`
    })
  }
}

const testOrderAPI = async () => {
  try {
    const response = await request.get('/h/order', {
      params: { pageNum: 1, pageSize: 1 }
    })
    
    apiResults.value.unshift({
      id: Date.now(),
      name: '订单API',
      success: response.code === 200,
      message: response.code === 200 ? '连接成功' : `错误: ${response.message || response.msg || '未知错误'}`
    })
  } catch (error) {
    apiResults.value.unshift({
      id: Date.now(),
      name: '订单API',
      success: false,
      message: `连接失败: ${error}`
    })
  }
}

const testUserAPI = async () => {
  try {
    const response = await request.get('/h/user', {
      params: { pageNum: 1, pageSize: 1 }
    })
    
    apiResults.value.unshift({
      id: Date.now(),
      name: '用户API',
      success: response.code === 200,
      message: response.code === 200 ? '连接成功' : `错误: ${response.message || response.msg || '未知错误'}`
    })
  } catch (error) {
    apiResults.value.unshift({
      id: Date.now(),
      name: '用户API',
      success: false,
      message: `连接失败: ${error}`
    })
  }
}
</script>

<style scoped>
.admin-test {
  padding: 24px;
  min-height: 100vh;
  position: relative;
}

/* 页面标题 */
.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  color: var(--admin-gray-800);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.page-title i {
  color: var(--admin-primary);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.page-description {
  color: var(--admin-gray-600);
  font-size: 1.1rem;
  margin: 0;
}

/* 测试区域 */
.test-section {
  margin-bottom: 32px;
  position: relative;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

/* API测试结果 */
.api-results {
  margin-top: 24px;
  padding: 20px;
  background: var(--admin-gray-50);
  border-radius: var(--admin-radius);
  border: 1px solid var(--admin-gray-200);
}

.api-results h4 {
  margin: 0 0 16px 0;
  color: var(--admin-gray-700);
}

.api-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--admin-gray-200);
}

.api-result:last-child {
  border-bottom: none;
}

.status {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
}

.status.success {
  background: var(--admin-secondary);
}

.status.error {
  background: var(--admin-danger);
}

.api-name {
  font-weight: 600;
  color: var(--admin-gray-700);
  min-width: 80px;
}

.api-message {
  color: var(--admin-gray-600);
  flex: 1;
}

/* 主题展示 */
.theme-showcase {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.color-palette {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.color-box {
  width: 60px;
  height: 60px;
  border-radius: var(--admin-radius);
  box-shadow: var(--admin-shadow);
}

.color-box.primary {
  background: var(--admin-primary);
}

.color-box.secondary {
  background: var(--admin-secondary);
}

.color-box.success {
  background: var(--admin-secondary);
}

.color-box.warning {
  background: var(--admin-warning);
}

.color-box.danger {
  background: var(--admin-danger);
}

.color-item span {
  font-size: 14px;
  color: var(--admin-gray-600);
  font-weight: 500;
}

.badge-showcase {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-test {
    padding: 16px;
  }

  .page-title {
    font-size: 2rem;
  }

  .button-grid {
    grid-template-columns: 1fr;
  }

  .color-palette {
    justify-content: center;
  }

  .badge-showcase {
    justify-content: center;
  }
}
</style>

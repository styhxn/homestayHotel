<template>
  <div class="user-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-users"></i>
        用户管理
      </h1>
      <p class="page-description">管理普洱蘑菇庄园民宿的所有用户信息</p>
    </div>

    <!-- 操作工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button @click="refreshData" class="btn btn-secondary">
          <i class="fas fa-sync-alt"></i>
          刷新
        </button>
        <div class="filter-tabs">
          <button 
            v-for="tab in statusTabs" 
            :key="tab.value"
            @click="setStatusFilter(tab.value)"
            :class="['tab-btn', { active: currentStatus === tab.value }]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
      <div class="toolbar-right">
        <div class="search-box">
          <select v-model="searchType" class="search-type">
            <option value="">全部</option>
            <option value="username">用户名</option>
            <option value="realName">真实姓名</option>
            <option value="phonenumber">手机号</option>
            <option value="email">邮箱</option>
          </select>
          <input 
            v-model="searchKeyword" 
            @keyup.enter="searchUsers"
            type="text" 
            placeholder="搜索用户..." 
            class="search-input"
          >
          <button @click="searchUsers" class="btn btn-search">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 用户统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <h3>{{ userStats.total }}</h3>
          <p>总用户数</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon active">
          <i class="fas fa-user-check"></i>
        </div>
        <div class="stat-content">
          <h3>{{ userStats.active }}</h3>
          <p>活跃用户</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon inactive">
          <i class="fas fa-user-times"></i>
        </div>
        <div class="stat-content">
          <h3>{{ userStats.inactive }}</h3>
          <p>禁用用户</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon new">
          <i class="fas fa-user-plus"></i>
        </div>
        <div class="stat-content">
          <h3>{{ userStats.newToday }}</h3>
          <p>今日新增</p>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="user-list">
      <div class="list-header">
        <h2>用户列表</h2>
        <div class="list-controls">
          <span class="total-count">共 {{ pagination.total }} 个用户</span>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        加载中...
      </div>

      <!-- 用户表格 -->
      <div v-else class="user-table">
        <table>
          <thead>
            <tr>
              <th>用户信息</th>
              <th>联系方式</th>
              <th>身份信息</th>
              <th>注册时间</th>
              <th>最后登录</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="user-row">
              <td class="user-info">
                <div class="user-basic">
                  <div class="avatar">
                    <img v-if="user.avatar" :src="user.avatar" :alt="user.realName">
                    <i v-else class="fas fa-user"></i>
                  </div>
                  <div class="user-details">
                    <h4>{{ user.realName || user.username }}</h4>
                    <p class="username">@{{ user.username }}</p>
                    <p class="user-id">ID: {{ user.id }}</p>
                  </div>
                </div>
              </td>
              <td class="contact-info">
                <div class="contact-details">
                  <p class="phone">
                    <i class="fas fa-phone"></i>
                    {{ user.phonenumber || '-' }}
                  </p>
                  <p class="email">
                    <i class="fas fa-envelope"></i>
                    {{ user.email || '-' }}
                  </p>
                </div>
              </td>
              <td class="identity-info">
                <div class="identity-details">
                  <p class="gender">
                    <i :class="user.gender === '男' ? 'fas fa-mars' : 'fas fa-venus'"></i>
                    {{ user.gender || '-' }}
                  </p>
                  <p class="id-card">{{ user.idCard || '-' }}</p>
                  <p class="address">{{ user.address || '-' }}</p>
                </div>
              </td>
              <td class="date-info">
                {{ formatDate(user.createTime) }}
              </td>
              <td class="date-info">
                {{ formatDate(user.loginDate) }}
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(user.status)]">
                  {{ getStatusText(user.status) }}
                </span>
              </td>
              <td class="actions">
                <button @click="viewUser(user)" class="btn btn-sm btn-info">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="editUser(user)" class="btn btn-sm btn-warning">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="toggleUserStatus(user)" class="btn btn-sm" 
                        :class="user.status === 0 ? 'btn-danger' : 'btn-success'">
                  <i :class="user.status === 0 ? 'fas fa-ban' : 'fas fa-check'"></i>
                </button>
                <button @click="resetPassword(user)" class="btn btn-sm btn-secondary">
                  <i class="fas fa-key"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 空状态 -->
        <div v-if="users.length === 0" class="empty-state">
          <i class="fas fa-users"></i>
          <h3>暂无用户数据</h3>
          <p>当前筛选条件下没有找到用户</p>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="users.length > 0" class="pagination">
        <button 
          @click="changePage(pagination.current - 1)"
          :disabled="pagination.current <= 1"
          class="btn btn-secondary"
        >
          <i class="fas fa-chevron-left"></i>
          上一页
        </button>
        
        <span class="page-info">
          第 {{ pagination.current }} 页，共 {{ pagination.pages }} 页
        </span>
        
        <button 
          @click="changePage(pagination.current + 1)"
          :disabled="pagination.current >= pagination.pages"
          class="btn btn-secondary"
        >
          下一页
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- 用户详情模态框 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeModals">
      <div class="modal modal-large" @click.stop>
        <div class="modal-header">
          <h3>用户详情</h3>
          <button @click="closeModals" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- 用户详情将在这里实现 -->
          <p>用户详情功能开发中...</p>
        </div>
      </div>
    </div>

    <!-- 编辑用户模态框 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>编辑用户</h3>
          <button @click="closeModals" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- 用户编辑表单将在这里实现 -->
          <p>用户编辑功能开发中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import request from '../../utils/request'
import type { ApiResponse, PaginationData, User } from '@/types/api'
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

// 响应式数据
const loading = ref(false)
const users = ref<any[]>([])
const searchKeyword = ref('')
const searchType = ref('')
const currentStatus = ref('')

// 模态框状态
const showDetailModal = ref(false)
const showEditModal = ref(false)
const currentUser = ref<any>(null)

// 状态筛选标签
const statusTabs = [
  { label: '全部', value: '' },
  { label: '正常', value: '0' },
  { label: '禁用', value: '1' }
]

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  pages: 0
})

// 用户统计
const userStats = reactive({
  total: 0,
  active: 0,
  inactive: 0,
  newToday: 0
})

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await request.get('/sys/user', {
      params: {
        pageNum: pagination.current,
        pageSize: pagination.size,
        search: searchKeyword.value,
        searchType: searchType.value
      }
    })
    
    if (response.code === 200 || response.code === "200") {
      users.value = response.data?.records || []
      pagination.total = response.data?.total || 0
      pagination.pages = response.data?.pages || 0

      // 计算统计数据
      calculateStats()
      notification.success('用户数据加载成功', '数据加载')
    } else {
      notification.error(response.message || response.msg || '获取用户列表失败', '加载失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    notification.error('网络错误，请稍后重试', '加载失败')
  } finally {
    loading.value = false
  }
}

// 计算用户统计
const calculateStats = () => {
  userStats.total = users.value.length
  userStats.active = users.value.filter(user => user.status === 0).length
  userStats.inactive = users.value.filter(user => user.status === 1).length
  
  // 计算今日新增用户
  const today = new Date().toDateString()
  userStats.newToday = users.value.filter(user => {
    if (!user.createTime) return false
    return new Date(user.createTime).toDateString() === today
  }).length
}

// 设置状态筛选
const setStatusFilter = (status: string) => {
  currentStatus.value = status
  searchKeyword.value = status
  searchType.value = 'status'
  pagination.current = 1
  fetchUsers()
}

// 搜索用户
const searchUsers = () => {
  pagination.current = 1
  fetchUsers()
}

// 刷新数据
const refreshData = () => {
  fetchUsers()
}

// 分页切换
const changePage = (page: number) => {
  pagination.current = page
  fetchUsers()
}

// 查看用户详情
const viewUser = (user: any) => {
  currentUser.value = user
  showDetailModal.value = true
}

// 编辑用户
const editUser = (user: any) => {
  currentUser.value = user
  showEditModal.value = true
}

// 切换用户状态
const toggleUserStatus = async (user: User) => {
  try {
    const newStatus = user.status === 0 ? 1 : 0
    const response = await request.put('/sys/user/status', {
      id: user.id,
      status: newStatus
    })
    if (response.code === 200 || response.code === "200") {
      user.status = newStatus
      calculateStats()
      notification.success(
        newStatus === 0 ? '用户已启用' : '用户已禁用',
        '状态更新'
      )
    } else {
      notification.error(response.message || response.msg || '状态更新失败', '操作失败')
    }
  } catch (error) {
    console.error('切换用户状态失败:', error)
    notification.error('网络错误，请稍后重试', '操作失败')
  }
}

// 重置密码
const resetPassword = async (user: User) => {
  if (confirm(`确定要重置用户"${user.username}"的密码吗？`)) {
    try {
      const response = await request.post('/h/user/resetPassword', {
        phone: user.phone,
        username: user.username
      })
      if (response.code === 200 || response.code === "200") {
        notification.success(`密码重置成功，新密码为：${response.data}`, '重置成功')
      } else {
        notification.error(response.message || response.msg || '重置密码失败', '操作失败')
      }
    } catch (error) {
      console.error('重置密码失败:', error)
      notification.error('网络错误，请稍后重试', '重置失败')
    }
  }
}

// 关闭模态框
const closeModals = () => {
  showDetailModal.value = false
  showEditModal.value = false
  currentUser.value = null
}

// 获取状态样式类
const getStatusClass = (status: number) => {
  switch (status) {
    case 0: return 'active'
    case 1: return 'inactive'
    default: return 'unknown'
  }
}

// 获取状态文本
const getStatusText = (status: number) => {
  switch (status) {
    case 0: return '正常'
    case 1: return '禁用'
    default: return '未知'
  }
}

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

// 组件挂载时获取数据
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* 页面标题 */
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title i {
  color: #8b4513;
}

.page-description {
  color: #7f8c8d;
  margin: 0;
  font-size: 16px;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.filter-tabs {
  display: flex;
  gap: 4px;
}

.tab-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #f8f9fa;
}

.tab-btn.active {
  background: #8b4513;
  color: white;
  border-color: #8b4513;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-type {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 200px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #8b4513;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: #8b4513;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-search {
  background: #17a2b8;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: #8b4513;
  color: white;
}

.stat-icon.active {
  background: #28a745;
}

.stat-icon.inactive {
  background: #dc3545;
}

.stat-icon.new {
  background: #17a2b8;
}

.stat-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #2c3e50;
}

.stat-content p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

/* 用户列表 */
.user-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.list-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.total-count {
  color: #7f8c8d;
  font-size: 14px;
}

/* 加载状态 */
.loading {
  padding: 40px;
  text-align: center;
  color: #7f8c8d;
  font-size: 16px;
}

.loading i {
  margin-right: 8px;
}

/* 表格样式 */
.user-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  background: #f8f9fa;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #dee2e6;
}

tbody td {
  padding: 16px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.user-row:hover {
  background: #f8f9fa;
}

.user-info {
  min-width: 200px;
}

.user-basic {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar i {
  color: #6c757d;
  font-size: 18px;
}

.user-details h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.username {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #6c757d;
}

.user-id {
  margin: 0;
  font-size: 12px;
  color: #7f8c8d;
}

.contact-info {
  min-width: 150px;
}

.contact-details p {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-details p:last-child {
  margin-bottom: 0;
}

.contact-details i {
  width: 12px;
  color: #7f8c8d;
}

.identity-info {
  min-width: 150px;
}

.identity-details p {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 6px;
}

.identity-details p:last-child {
  margin-bottom: 0;
}

.identity-details i {
  width: 12px;
  color: #7f8c8d;
}

.date-info {
  font-size: 12px;
  color: #7f8c8d;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.unknown {
  background: #e2e3e5;
  color: #383d41;
}

.actions {
  display: flex;
  gap: 4px;
}

/* 空状态 */
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #7f8c8d;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 分页 */
.pagination {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  border-top: 1px solid #eee;
}

.page-info {
  color: #7f8c8d;
  font-size: 14px;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
}

.modal-large {
  max-width: 800px;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #7f8c8d;
  padding: 4px;
}

.close-btn:hover {
  color: #2c3e50;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-management {
    padding: 16px;
  }

  .toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }

  .filter-tabs {
    flex-wrap: wrap;
    justify-content: center;
  }

  .search-box {
    flex-direction: column;
    gap: 8px;
  }

  .search-input {
    width: 100%;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .user-table {
    font-size: 14px;
  }

  .user-basic {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .actions {
    flex-direction: column;
  }
}
</style>

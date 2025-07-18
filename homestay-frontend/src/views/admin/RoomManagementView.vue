<template>
  <div class="room-management fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-bed"></i>
        房间管理
      </h1>
      <p class="page-description">管理普洱蘑菇庄园民宿的所有房间信息</p>
    </div>

    <!-- 操作工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button @click="showAddModal = true" class="btn btn-primary">
          <i class="fas fa-plus"></i>
          添加房间
        </button>
        <button @click="refreshData" class="btn btn-secondary">
          <i class="fas fa-sync-alt"></i>
          刷新
        </button>
      </div>
      <div class="toolbar-right">
        <div class="search-box">
          <select v-model="searchType" class="search-type">
            <option value="">全部</option>
            <option value="name">房间名称</option>
            <option value="category">房间类型</option>
            <option value="city">城市</option>
          </select>
          <input 
            v-model="searchKeyword" 
            @keyup.enter="searchRooms"
            type="text" 
            placeholder="搜索房间..." 
            class="search-input"
          >
          <button @click="searchRooms" class="btn btn-search">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 房间统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card slide-in-left" style="animation-delay: 0.1s">
        <div class="stat-icon">
          <i class="fas fa-bed"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-number" :data-target="roomStats.total">{{ animatedStats.total }}</h3>
          <p>总房间数</p>
        </div>
      </div>
      <div class="stat-card slide-in-left" style="animation-delay: 0.2s">
        <div class="stat-icon available">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-number" :data-target="roomStats.available">{{ animatedStats.available }}</h3>
          <p>空闲房间</p>
        </div>
      </div>
      <div class="stat-card slide-in-left" style="animation-delay: 0.3s">
        <div class="stat-icon occupied">
          <i class="fas fa-user"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-number" :data-target="roomStats.occupied">{{ animatedStats.occupied }}</h3>
          <p>已入住</p>
        </div>
      </div>
      <div class="stat-card slide-in-left" style="animation-delay: 0.4s">
        <div class="stat-icon reserved">
          <i class="fas fa-calendar-check"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-number" :data-target="roomStats.reserved">{{ animatedStats.reserved }}</h3>
          <p>已预订</p>
        </div>
      </div>
    </div>

    <!-- 房间列表 -->
    <div class="room-list">
      <div class="list-header">
        <h2>房间列表</h2>
        <div class="list-controls">
          <span class="total-count">共 {{ pagination.total }} 间房间</span>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        加载中...
      </div>

      <!-- 房间表格 -->
      <div v-else class="room-table">
        <table>
          <thead>
            <tr>
              <th>房间信息</th>
              <th>类型</th>
              <th>价格</th>
              <th>状态</th>
              <th>城市</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in rooms" :key="room.id" class="room-row">
              <td class="room-info">
                <div class="room-basic">
                  <h4>{{ room.name }}</h4>
                  <p class="room-code">房间号: {{ room.code }}</p>
                  <p class="room-address">{{ room.address }}</p>
                </div>
              </td>
              <td>
                <span class="category-tag">{{ room.category }}</span>
              </td>
              <td class="price">
                <span class="price-amount">¥{{ room.price }}</span>
                <span class="price-unit">/晚</span>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(room.state)]">
                  {{ getStatusText(room.state) }}
                </span>
              </td>
              <td>{{ room.city }}</td>
              <td>{{ formatDate(room.createTime) }}</td>
              <td class="actions">
                <div class="action-buttons">
                  <button @click="viewRoom(room)" class="btn btn-sm btn-info action-btn"
                          title="查看房间详情" data-tooltip="查看详情">
                    <i class="fas fa-eye"></i>
                    <span class="btn-text">查看</span>
                  </button>
                  <button @click="editRoom(room)" class="btn btn-sm btn-warning action-btn"
                          title="编辑房间信息" data-tooltip="编辑房间">
                    <i class="fas fa-edit"></i>
                    <span class="btn-text">编辑</span>
                  </button>
                  <button @click="toggleRoomStatus(room)" class="btn btn-sm action-btn"
                          :class="room.status === 0 ? 'btn-danger' : 'btn-success'"
                          :title="room.status === 0 ? '启用房间' : '禁用房间'"
                          :data-tooltip="room.status === 0 ? '启用' : '禁用'">
                    <i :class="room.status === 0 ? 'fas fa-ban' : 'fas fa-check'"></i>
                    <span class="btn-text">{{ room.status === 0 ? '启用' : '禁用' }}</span>
                  </button>
                  <button @click="deleteRoom(room)" class="btn btn-sm btn-danger action-btn"
                          title="删除房间（不可恢复）" data-tooltip="删除房间">
                    <i class="fas fa-trash"></i>
                    <span class="btn-text">删除</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 空状态 -->
        <div v-if="rooms.length === 0" class="empty-state">
          <i class="fas fa-bed"></i>
          <h3>暂无房间数据</h3>
          <p>点击"添加房间"按钮创建第一个房间</p>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="rooms.length > 0" class="pagination">
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

    <!-- 添加/编辑房间模态框 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? '添加房间' : '编辑房间' }}</h3>
          <button @click="closeModals" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm" class="room-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">房间名称 *</label>
                <input
                  v-model="roomForm.name"
                  type="text"
                  id="name"
                  required
                  placeholder="请输入房间名称"
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label for="code">房间号 *</label>
                <input
                  v-model="roomForm.code"
                  type="text"
                  id="code"
                  required
                  placeholder="请输入房间号"
                  class="form-input"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="category">房间类型 *</label>
                <select v-model="roomForm.category" id="category" required class="form-input">
                  <option value="">请选择房间类型</option>
                  <option value="豪华海景房">豪华海景房</option>
                  <option value="普洱茶香木屋">普洱茶香木屋</option>
                  <option value="庄园豪华套房">庄园豪华套房</option>
                  <option value="竹林雅居">竹林雅居</option>
                  <option value="山景别墅">山景别墅</option>
                </select>
              </div>
              <div class="form-group">
                <label for="price">价格 *</label>
                <input
                  v-model="roomForm.price"
                  type="number"
                  id="price"
                  required
                  min="0"
                  step="0.01"
                  placeholder="请输入价格"
                  class="form-input"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city">所在城市 *</label>
                <input
                  v-model="roomForm.city"
                  type="text"
                  id="city"
                  required
                  placeholder="请输入城市"
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label for="seat">床位数 *</label>
                <input
                  v-model="roomForm.seat"
                  type="number"
                  id="seat"
                  required
                  min="1"
                  placeholder="请输入床位数"
                  class="form-input"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="address">详细地址 *</label>
              <input
                v-model="roomForm.address"
                type="text"
                id="address"
                required
                placeholder="请输入详细地址"
                class="form-input"
              >
            </div>

            <div class="form-group">
              <label for="device">配套设施</label>
              <input
                v-model="roomForm.device"
                type="text"
                id="device"
                placeholder="请输入配套设施，用逗号分隔"
                class="form-input"
              >
            </div>

            <div class="form-group">
              <label for="banner">封面图片URL</label>
              <input
                v-model="roomForm.banner"
                type="url"
                id="banner"
                placeholder="请输入图片URL"
                class="form-input"
              >
            </div>

            <div class="form-group">
              <label for="describe">房间描述</label>
              <textarea
                v-model="roomForm.describe"
                id="describe"
                rows="4"
                placeholder="请输入房间描述"
                class="form-input"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="remark">备注</label>
              <textarea
                v-model="roomForm.remark"
                id="remark"
                rows="3"
                placeholder="请输入备注信息"
                class="form-input"
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeModals" class="btn btn-secondary">
                取消
              </button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
                {{ submitting ? '提交中...' : (showAddModal ? '添加房间' : '更新房间') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 房间详情模态框 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeModals">
      <div class="modal modal-large" @click.stop>
        <div class="modal-header">
          <h3>房间详情</h3>
          <button @click="closeModals" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- 房间详情将在这里实现 -->
          <p>房间详情功能开发中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import request from '../../utils/request'
import { useNotification } from '../../utils/notification'
import type { ApiResponse, PaginationData, Room } from '@/types/api'

// 使用美化的通知系统
const notification = useNotification()

// 响应式数据
const loading = ref(false)
const rooms = ref<any[]>([])
const searchKeyword = ref('')
const searchType = ref('')

// 模态框状态
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const currentRoom = ref<any>(null)
const submitting = ref(false)

// 房间表单数据
const roomForm = reactive({
  id: null,
  name: '',
  code: '',
  category: '',
  price: '',
  city: '',
  seat: '',
  address: '',
  device: '',
  banner: '',
  describe: '',
  remark: '',
  status: 0,
  state: '空闲',
  weight: 0
})

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  pages: 0
})

// 房间统计
const roomStats = reactive({
  total: 0,
  available: 0,
  occupied: 0,
  reserved: 0
})

// 动画统计数据
const animatedStats = reactive({
  total: 0,
  available: 0,
  occupied: 0,
  reserved: 0
})

// 获取房间列表
const fetchRooms = async () => {
  loading.value = true
  try {
    const response = await request.get<PaginationData<Room>>('/h/room', {
      params: {
        pageNum: pagination.current,
        pageSize: pagination.size,
        search: searchKeyword.value,
        searchType: searchType.value
      }
    })

    if (response.code === 200 || response.code === "200") {
      rooms.value = response.data?.records || []
      pagination.total = response.data?.total || 0
      pagination.pages = response.data?.pages || 0

      // 计算统计数据
      calculateStats()
      notification.success('房间数据加载成功', '数据加载')
    } else {
      notification.error(response.message || response.msg || '获取房间列表失败', '加载失败')
    }
  } catch (error) {
    console.error('获取房间列表失败:', error)
    notification.error('网络错误，请稍后重试', '加载失败')
  } finally {
    loading.value = false
  }
}

// 数字动画函数
const animateNumber = (target: number, current: number, key: keyof typeof animatedStats) => {
  const increment = Math.ceil((target - current) / 20)
  if (current < target) {
    animatedStats[key] = current + increment
    setTimeout(() => animateNumber(target, current + increment, key), 50)
  } else {
    animatedStats[key] = target
  }
}

// 计算房间统计
const calculateStats = () => {
  const newStats = {
    total: rooms.value.length,
    available: rooms.value.filter(room => room.state === '空闲').length,
    occupied: rooms.value.filter(room => room.state === '入住').length,
    reserved: rooms.value.filter(room => room.state === '预订').length
  }

  // 更新实际数据
  Object.assign(roomStats, newStats)

  // 启动动画
  Object.keys(newStats).forEach(key => {
    const typedKey = key as keyof typeof animatedStats
    animateNumber(newStats[typedKey], animatedStats[typedKey], typedKey)
  })
}

// 搜索房间
const searchRooms = () => {
  pagination.current = 1
  fetchRooms()
}

// 刷新数据
const refreshData = () => {
  fetchRooms()
}

// 分页切换
const changePage = (page: number) => {
  pagination.current = page
  fetchRooms()
}

// 查看房间详情
const viewRoom = (room: any) => {
  currentRoom.value = room
  showDetailModal.value = true
}

// 编辑房间
const editRoom = (room: any) => {
  currentRoom.value = room
  // 填充表单数据
  Object.assign(roomForm, {
    id: room.id,
    name: room.name || '',
    code: room.code || '',
    category: room.category || '',
    price: room.price || '',
    city: room.city || '',
    seat: room.seat || '',
    address: room.address || '',
    device: room.device || '',
    banner: room.banner || '',
    describe: room.describe || '',
    remark: room.remark || '',
    status: room.status || 0,
    state: room.state || '空闲',
    weight: room.weight || 0
  })
  showEditModal.value = true
}

// 切换房间状态
const toggleRoomStatus = async (room: any) => {
  const action = room.status === 0 ? '启用' : '禁用'
  const confirmMessage = `确定要${action}房间"${room.name}"吗？\n\n${action === '禁用' ? '⚠️ 禁用后该房间将无法被预订' : '✅ 启用后该房间可正常预订'}`

  const confirmed = await notification.confirm({
    title: `确认${action}房间`,
    message: confirmMessage,
    confirmText: `确认${action}`,
    cancelText: '取消'
  })

  if (!confirmed) {
    return
  }

  try {
    // 显示加载状态
    notification.info(`正在${action}房间...`, '处理中')

    const response = await request.put('/h/room/status', room)
    if (response.code === 200 || response.code === "200") {
      room.status = room.status === 0 ? 1 : 0
      notification.success(`房间"${room.name}"已${action}`, `${action}成功`)
      calculateStats()
    } else {
      notification.error(response.message || response.msg || `${action}失败，请稍后重试`, '操作失败')
    }
  } catch (error) {
    console.error('切换房间状态失败:', error)
    notification.error('网络连接异常，请检查网络后重试', '操作失败')
  }
}

// 删除房间
const deleteRoom = async (room: any) => {
  // 显示更友好的确认对话框
  const confirmMessage = `房间信息：\n• 房间名称：${room.name}\n• 房间编号：${room.roomNumber || '未设置'}\n• 房间类型：${room.category || '未设置'}\n\n此操作不可恢复，确定要删除吗？`

  const confirmed = await notification.confirm({
    title: '⚠️ 确认删除操作',
    message: confirmMessage,
    icon: 'fas fa-exclamation-triangle',
    confirmText: '确认删除',
    cancelText: '取消'
  })

  if (confirmed) {
    // 添加加载状态
    const deleteBtn = event?.target as HTMLElement
    if (deleteBtn) {
      deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 删除中...'
      deleteBtn.style.pointerEvents = 'none'
    }

    try {
      const response = await request.delete(`/h/room/${room.id}`)
      if (response.code === 200 || response.code === "200") {
        notification.success(`房间"${room.name}"已成功删除`, '删除成功')
        await fetchRooms()
      } else {
        notification.error(response.message || response.msg || '删除失败，请稍后重试', '操作失败')
      }
    } catch (error) {
      console.error('删除房间失败:', error)
      notification.error('网络连接异常，请检查网络后重试', '删除失败')
    } finally {
      // 恢复按钮状态
      if (deleteBtn) {
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> <span class="btn-text">删除</span>'
        deleteBtn.style.pointerEvents = 'auto'
      }
    }
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(roomForm, {
    id: null,
    name: '',
    code: '',
    category: '',
    price: '',
    city: '',
    seat: '',
    address: '',
    device: '',
    banner: '',
    describe: '',
    remark: '',
    status: 0,
    state: '空闲',
    weight: 0
  })
}

// 关闭模态框
const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDetailModal.value = false
  currentRoom.value = null
  resetForm()
}

// 提交表单
const submitForm = async () => {
  submitting.value = true
  try {
    let response
    if (showAddModal.value) {
      // 添加房间
      response = await request.post('/h/room', roomForm)
    } else {
      // 编辑房间
      response = await request.put('/h/room', roomForm)
    }

    if (response.code === 200 || response.code === "200") {
      notification.success(
        showAddModal.value ? '房间添加成功' : '房间更新成功',
        '操作成功'
      )
      closeModals()
      await fetchRooms()
    } else {
      notification.error(response.message || response.msg || '操作失败', '提交失败')
    }
  } catch (error) {
    console.error('提交表单失败:', error)
    notification.error('网络错误，请稍后重试', '提交失败')
  } finally {
    submitting.value = false
  }
}

// 获取状态样式类
const getStatusClass = (state: string) => {
  switch (state) {
    case '空闲': return 'available'
    case '入住': return 'occupied'
    case '预订': return 'reserved'
    default: return 'unknown'
  }
}

// 获取状态文本
const getStatusText = (state: string) => {
  return state || '未知'
}

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

// 组件挂载时获取数据
onMounted(() => {
  fetchRooms()
})
</script>

<style scoped>
.room-management {
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
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
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
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-card:hover::before {
  left: 100%;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: #10b981;
  color: white;
  transition: all 0.3s ease;
  position: relative;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.stat-icon.available {
  background: #28a745;
}

.stat-icon.occupied {
  background: #dc3545;
}

.stat-icon.reserved {
  background: #ffc107;
  color: #212529;
}

.stat-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #2c3e50;
}

.stat-number {
  transition: all 0.3s ease;
  position: relative;
}

.stat-card:hover .stat-number {
  transform: scale(1.1);
  color: #10b981;
}

.stat-content p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
  transition: color 0.3s ease;
}

.stat-card:hover .stat-content p {
  color: #5a6c7d;
}

/* 房间列表 */
.room-list {
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
.room-table {
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
  transition: all 0.3s ease;
}

.room-row {
  transition: all 0.3s ease;
  position: relative;
}

.room-row:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  transform: translateX(4px);
  box-shadow: 4px 0 12px rgba(16, 185, 129, 0.1);
}

.room-row:hover td {
  border-bottom-color: #10b981;
}

.room-info {
  min-width: 200px;
}

.room-basic h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.room-code {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #6c757d;
}

.room-address {
  margin: 0;
  font-size: 12px;
  color: #7f8c8d;
}

.category-tag {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.price {
  text-align: right;
}

.price-amount {
  font-size: 18px;
  font-weight: 600;
  color: #8b4513;
}

.price-unit {
  font-size: 12px;
  color: #7f8c8d;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.available {
  background: #d4edda;
  color: #155724;
}

.status-badge.occupied {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.reserved {
  background: #fff3cd;
  color: #856404;
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

/* 房间表单样式 */
.room-form {
  max-width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--admin-gray-700);
  font-size: 14px;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid var(--admin-gray-300);
  border-radius: var(--admin-radius);
  font-size: 14px;
  transition: var(--admin-transition);
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--admin-primary);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.form-input:invalid {
  border-color: var(--admin-danger);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--admin-gray-200);
}

/* 操作按钮美化 */
.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  overflow: hidden;
  min-width: 70px;
  justify-content: center;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn .btn-text {
  font-size: 12px;
  font-weight: 500;
  opacity: 0;
  max-width: 0;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
}

.action-btn:hover .btn-text {
  opacity: 1;
  max-width: 50px;
  margin-left: 4px;
}

.action-btn i {
  transition: transform 0.3s ease;
}

.action-btn:hover i {
  transform: scale(1.1);
}

/* 按钮特定颜色动画 */
.btn-info:hover {
  background: linear-gradient(135deg, #17a2b8, #138496);
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
}

.btn-warning:hover {
  background: linear-gradient(135deg, #ffc107, #e0a800);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.btn-success:hover {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-danger:hover {
  background: linear-gradient(135deg, #dc3545, #c82333);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* 工具提示 */
.action-btn::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

.action-btn::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

.action-btn:hover::before,
.action-btn:hover::after {
  opacity: 1;
}

/* 页面动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

.slide-in-left {
  animation: slideInLeft 0.6s ease-out;
  animation-fill-mode: both;
}

.slide-in-up {
  animation: slideInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .room-management {
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

  .room-table {
    font-size: 14px;
  }

  .actions {
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>

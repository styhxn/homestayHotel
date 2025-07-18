<template>
  <div class="admin-dashboard">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span>🍄</span>
          <span>蘑菇庄园管理系统</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 class="nav-title">主要功能</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/admin" class="nav-link">
                <i class="fas fa-tachometer-alt"></i>
                <span>控制台</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/rooms" class="nav-link active">
                <i class="fas fa-bed"></i>
                <span>房间管理</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/orders" class="nav-link">
                <i class="fas fa-clipboard-list"></i>
                <span>订单管理</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 顶部导航栏 -->
      <header class="top-header">
        <div class="header-left">
          <h1 class="page-title">民宿管理</h1>
          <p class="page-subtitle">管理庄园民宿信息</p>
        </div>
        <div class="header-right">
          <button @click="showAddModal = true" class="btn btn-primary">
            <i class="fas fa-plus"></i>
            添加民宿
          </button>
          <button @click="handleLogout" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i>
            退出登录
          </button>
        </div>
      </header>

      <!-- 房间管理内容 -->
      <div class="rooms-content">
        <!-- 搜索和筛选 -->
        <div class="filters-section">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="搜索房间名称或编号..."
              class="search-input"
            >
          </div>
          
          <div class="filters">
            <select v-model="statusFilter" class="filter-select">
              <option value="">全部状态</option>
              <option value="0">可用</option>
              <option value="1">已预订</option>
              <option value="2">维护中</option>
            </select>
            
            <select v-model="typeFilter" class="filter-select">
              <option value="">全部类型</option>
              <option value="标准间">标准间</option>
              <option value="豪华间">豪华间</option>
              <option value="套房">套房</option>
              <option value="总统套房">总统套房</option>
            </select>
          </div>
        </div>

        <!-- 房间列表 -->
        <div class="rooms-table-section">
          <div v-if="loading" class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>加载中...</span>
          </div>
          
          <div v-else class="table-container">
            <table class="rooms-table">
              <thead>
                <tr>
                  <th>房间图片</th>
                  <th>房间名称</th>
                  <th>房间类型</th>
                  <th>价格/晚</th>
                  <th>状态</th>
                  <th>权重</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="room in filteredRooms" :key="room.id">
                  <td>
                    <img :src="room.image || '/src/assets/images/实地调研/房间参观/房间参观1.jpg'" :alt="room.name" class="room-thumbnail">
                  </td>
                  <td>
                    <div class="room-info">
                      <h4>{{ room.name }}</h4>
                      <p>{{ room.description }}</p>
                    </div>
                  </td>
                  <td>{{ room.type }}</td>
                  <td class="price">¥{{ room.price }}</td>
                  <td>
                    <span class="status-badge" :class="getStatusClass(room.status)">
                      {{ getStatusText(room.status) }}
                    </span>
                  </td>
                  <td>{{ room.weight || 0 }}</td>
                  <td>{{ formatDate(room.createTime) }}</td>
                  <td>
                    <div class="action-buttons">
                      <button @click="editRoom(room)" class="btn btn-sm btn-outline">
                        <i class="fas fa-edit"></i>
                        编辑
                      </button>
                      <button @click="toggleRoomStatus(room)" class="btn btn-sm" :class="room.status === 0 ? 'btn-warning' : 'btn-success'">
                        <i class="fas" :class="room.status === 0 ? 'fa-pause' : 'fa-play'"></i>
                        {{ room.status === 0 ? '下架' : '上架' }}
                      </button>
                      <button @click="deleteRoom(room)" class="btn btn-sm btn-danger">
                        <i class="fas fa-trash"></i>
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- 添加/编辑房间模态框 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? '添加房间' : '编辑房间' }}</h3>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveRoom">
            <div class="form-group">
              <label>房间名称</label>
              <input type="text" v-model="roomForm.name" required class="form-input">
            </div>
            
            <div class="form-group">
              <label>房间描述</label>
              <textarea v-model="roomForm.description" class="form-textarea"></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>房间类型</label>
                <select v-model="roomForm.type" required class="form-select">
                  <option value="">请选择类型</option>
                  <option value="标准间">标准间</option>
                  <option value="豪华间">豪华间</option>
                  <option value="套房">套房</option>
                  <option value="总统套房">总统套房</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>价格/晚</label>
                <input type="number" v-model="roomForm.price" required class="form-input">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>权重</label>
                <input type="number" v-model="roomForm.weight" class="form-input">
              </div>
              
              <div class="form-group">
                <label>状态</label>
                <select v-model="roomForm.status" class="form-select">
                  <option value="0">可用</option>
                  <option value="1">已预订</option>
                  <option value="2">维护中</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label>房间图片URL</label>
              <input type="url" v-model="roomForm.image" class="form-input">
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn btn-outline">取消</button>
              <button type="submit" class="btn btn-primary">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import request from '../../utils/request'
import type { ApiResponse } from '@/types/api'

const router = useRouter()
const auth = useAuthStore()

// 响应式数据
const loading = ref(false)
const rooms = ref<any[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingRoom = ref<any>(null)

const roomForm = reactive({
  name: '',
  description: '',
  type: '',
  price: 0,
  weight: 0,
  status: 0,
  image: ''
})

// 计算属性
const filteredRooms = computed(() => {
  let result = [...rooms.value]
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(room => 
      room.name.toLowerCase().includes(query) ||
      room.description.toLowerCase().includes(query)
    )
  }
  
  // 状态筛选
  if (statusFilter.value !== '') {
    result = result.filter(room => room.status.toString() === statusFilter.value)
  }
  
  // 类型筛选
  if (typeFilter.value) {
    result = result.filter(room => room.type === typeFilter.value)
  }
  
  return result
})

// 方法
const fetchRooms = async () => {
  loading.value = true
  try {
    const response = await request.get('/h/room?pageNum=1&pageSize=50')
    if (response.code === 200 || response.code === "200") {
      rooms.value = response.data?.records || []
    } else {
      throw new Error(response.msg || response.message || '获取房间列表失败')
    }
  } catch (error) {
    console.error('获取房间列表失败:', error)
    // 模拟数据
    rooms.value = [
      {
        id: 1,
        name: '豪华海景套房',
        description: '享受无敌海景，配备豪华设施的顶级套房',
        type: '套房',
        price: 888,
        status: 0,
        weight: 100,
        image: '/src/assets/images/实地调研/房间参观/房间参观1.jpg',
        createTime: '2025-01-01 10:00:00'
      },
      {
        id: 2,
        name: '商务标准间',
        description: '适合商务出行的舒适标准间',
        type: '标准间',
        price: 288,
        status: 0,
        weight: 80,
        image: '/src/assets/images/实地调研/房间参观/房间参观2.jpg',
        createTime: '2025-01-01 11:00:00'
      }
    ]
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status: number) => {
  const statusMap: Record<number, string> = {
    0: 'available',
    1: 'booked',
    2: 'maintenance'
  }
  return statusMap[status] || 'available'
}

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '可用',
    1: '已预订',
    2: '维护中'
  }
  return statusMap[status] || '未知'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

const editRoom = (room: any) => {
  editingRoom.value = room
  Object.assign(roomForm, room)
  showEditModal.value = true
}

const deleteRoom = async (room: any) => {
  if (confirm(`确定要删除房间"${room.name}"吗？`)) {
    try {
      await request.delete(`/room/${room.id}`)
      rooms.value = rooms.value.filter(r => r.id !== room.id)
      alert('删除成功')
    } catch (error) {
      console.error('删除房间失败:', error)
      alert('删除失败，请稍后重试')
    }
  }
}

const toggleRoomStatus = async (room: any) => {
  try {
    const newStatus = room.status === 0 ? 2 : 0
    await request.put(`/room/${room.id}/status`, { status: newStatus })
    room.status = newStatus
    alert(newStatus === 0 ? '房间已上架' : '房间已下架')
  } catch (error) {
    console.error('更新房间状态失败:', error)
    alert('操作失败，请稍后重试')
  }
}

const saveRoom = async () => {
  try {
    if (showAddModal.value) {
      const response = await request.post('/room', roomForm)
      rooms.value.push(response.data)
      alert('添加成功')
    } else {
      await request.put(`/room/${editingRoom.value.id}`, roomForm)
      Object.assign(editingRoom.value, roomForm)
      alert('更新成功')
    }
    closeModal()
  } catch (error) {
    console.error('保存房间失败:', error)
    alert('保存失败，请稍后重试')
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingRoom.value = null
  Object.assign(roomForm, {
    name: '',
    description: '',
    type: '',
    price: 0,
    weight: 0,
    status: 0,
    image: ''
  })
}

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

// 生命周期
onMounted(() => {
  fetchRooms()
})
</script>

<style scoped>
/* 复用管理员仪表板的基础样式 */
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.sidebar {
  width: 280px;
  background: #1f2937;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #374151;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: bold;
}

.logo i {
  color: #d4af37;
  font-size: 1.5rem;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 0;
}

.nav-section {
  margin-bottom: 32px;
}

.nav-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin-bottom: 16px;
  padding: 0 24px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.3s ease;
  border-right: 3px solid transparent;
}

.nav-link:hover {
  background: #374151;
  color: white;
}

.nav-link.active {
  background: #374151;
  color: #d4af37;
  border-right-color: #d4af37;
}

.nav-link i {
  width: 20px;
  text-align: center;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
}

.top-header {
  background: white;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

.page-subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #d4af37;
  color: white;
  border: 1px solid #d4af37;
}

.btn-primary:hover {
  background: #b8941f;
  border-color: #b8941f;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* 房间管理内容 */
.rooms-content {
  flex: 1;
  padding: 32px;
}

.filters-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  display: flex;
  gap: 24px;
  align-items: center;
}

.search-bar {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-bar i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.filters {
  display: flex;
  gap: 16px;
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: #d4af37;
}

/* 房间表格 */
.rooms-table-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.loading {
  text-align: center;
  padding: 60px 0;
  color: #6b7280;
}

.loading i {
  font-size: 2rem;
  margin-bottom: 16px;
  display: block;
}

.table-container {
  overflow-x: auto;
}

.rooms-table {
  width: 100%;
  border-collapse: collapse;
}

.rooms-table th,
.rooms-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.rooms-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.room-thumbnail {
  width: 60px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}

.room-info h4 {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.room-info p {
  color: #6b7280;
  font-size: 0.875rem;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price {
  font-weight: 600;
  color: #d4af37;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.available {
  background: #d1fae5;
  color: #059669;
}

.status-badge.booked {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.maintenance {
  background: #fee2e2;
  color: #dc2626;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.75rem;
}

.btn-outline {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  background: #f3f4f6;
  color: #374151;
}

.btn-success {
  background: #10b981;
  color: white;
  border: 1px solid #10b981;
}

.btn-success:hover {
  background: #059669;
}

.btn-warning {
  background: #f59e0b;
  color: white;
  border: 1px solid #f59e0b;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: 1px solid #ef4444;
}

.btn-danger:hover {
  background: #dc2626;
}

/* 模态框样式 */
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
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.form-textarea {
  min-height: 80px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .main-content {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar {
    max-width: none;
  }

  .filters {
    flex-direction: column;
  }

  .filter-select {
    min-width: auto;
  }

  .rooms-table {
    font-size: 0.75rem;
  }

  .rooms-table th,
  .rooms-table td {
    padding: 8px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal {
    width: 95%;
    margin: 20px;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>

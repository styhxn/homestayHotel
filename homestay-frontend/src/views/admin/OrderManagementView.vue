<template>
  <div class="order-management fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-clipboard-list"></i>
        订单管理
      </h1>
      <p class="page-description">管理普洱蘑菇庄园民宿的所有订单信息</p>
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
            <option value="phone">手机号</option>
            <option value="roomCode">房间号</option>
          </select>
          <input 
            v-model="searchKeyword" 
            @keyup.enter="searchOrders"
            type="text" 
            placeholder="搜索订单..." 
            class="search-input"
          >
          <button @click="searchOrders" class="btn btn-search">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 订单统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-clipboard-list"></i>
        </div>
        <div class="stat-content">
          <h3>{{ orderStats.total }}</h3>
          <p>总订单数</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon pending">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <h3>{{ orderStats.pending }}</h3>
          <p>待处理</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon confirmed">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <h3>{{ orderStats.confirmed }}</h3>
          <p>已确认</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon completed">
          <i class="fas fa-star"></i>
        </div>
        <div class="stat-content">
          <h3>{{ orderStats.completed }}</h3>
          <p>已完成</p>
        </div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <div class="list-header">
        <h2>订单列表</h2>
        <div class="list-controls">
          <span class="total-count">共 {{ pagination.total }} 个订单</span>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        加载中...
      </div>

      <!-- 订单表格 -->
      <div v-else class="order-table">
        <table>
          <thead>
            <tr>
              <th>订单信息</th>
              <th>客户信息</th>
              <th>房间信息</th>
              <th>入住时间</th>
              <th>订单金额</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="order-row">
              <td class="order-info">
                <div class="order-basic">
                  <h4>订单 #{{ order.id }}</h4>
                  <p class="order-date">{{ formatDate(order.createTime) }}</p>
                  <p class="order-days">{{ order.days }} 晚</p>
                </div>
              </td>
              <td class="customer-info">
                <div class="customer-basic">
                  <h4>{{ order.username }}</h4>
                  <p class="customer-phone">{{ order.phone }}</p>
                  <p class="customer-id">{{ order.idCard }}</p>
                </div>
              </td>
              <td class="room-info">
                <div class="room-basic">
                  <h4>房间 {{ order.roomCode }}</h4>
                  <p class="room-id">ID: {{ order.roomId }}</p>
                </div>
              </td>
              <td class="date-info">
                <div class="date-range">
                  <p class="check-in">入住: {{ order.startDate ? formatDate(order.startDate) : '未设置' }}</p>
                  <p class="check-out">离店: {{ order.endDate ? formatDate(order.endDate) : '未设置' }}</p>
                </div>
              </td>
              <td class="amount-info">
                <div class="amount-details">
                  <h4 class="total-amount">¥{{ order.total }}</h4>
                  <p :class="['pay-status', order.payState === 1 ? 'paid' : 'unpaid']">
                    {{ order.payState === 1 ? '已支付' : '未支付' }}
                  </p>
                </div>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(order.state || '')]">
                  {{ order.state }}
                </span>
              </td>
              <td class="actions">
                <div class="action-buttons">
                  <button @click="viewOrder(order)" class="btn btn-sm btn-info action-btn"
                          title="查看订单详情" data-tooltip="查看详情">
                    <i class="fas fa-eye"></i>
                    <span class="btn-text">查看</span>
                  </button>
                  <button
                    v-if="order.state === '预订'"
                    @click="confirmOrder(order)"
                    class="btn btn-sm btn-success action-btn"
                    title="确认订单，客户可入住" data-tooltip="确认入住"
                  >
                    <i class="fas fa-check"></i>
                    <span class="btn-text">确认</span>
                  </button>
                  <button
                    v-if="order.payState === 0"
                    @click="markAsPaid(order)"
                    class="btn btn-sm btn-warning action-btn"
                    title="标记为已支付" data-tooltip="标记支付"
                  >
                    <i class="fas fa-credit-card"></i>
                    <span class="btn-text">支付</span>
                  </button>
                  <button
                    v-if="order.state === '入住'"
                    @click="checkoutOrder(order)"
                    class="btn btn-sm btn-primary action-btn"
                    title="办理退房手续" data-tooltip="办理退房"
                  >
                    <i class="fas fa-sign-out-alt"></i>
                    <span class="btn-text">退房</span>
                  </button>
                  <button @click="deleteOrder(order)" class="btn btn-sm btn-danger action-btn"
                          title="删除订单（不可恢复）" data-tooltip="删除订单">
                    <i class="fas fa-trash"></i>
                    <span class="btn-text">删除</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 空状态 -->
        <div v-if="orders.length === 0" class="empty-state">
          <i class="fas fa-clipboard-list"></i>
          <h3>暂无订单数据</h3>
          <p>当前筛选条件下没有找到订单</p>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="orders.length > 0" class="pagination">
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

    <!-- 订单详情模态框 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeModals">
      <div class="modal modal-large" @click.stop>
        <div class="modal-header">
          <h3>订单详情</h3>
          <button @click="closeModals" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- 订单详情将在这里实现 -->
          <p>订单详情功能开发中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import request from '../../utils/request'
import type { ApiResponse, PaginationData, Order } from '@/types/api'
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
const orders = ref<Order[]>([])
const searchKeyword = ref('')
const searchType = ref('')
const currentStatus = ref('')

// 模态框状态
const showDetailModal = ref(false)
const currentOrder = ref<Order | null>(null)

// 状态筛选标签
const statusTabs = [
  { label: '全部', value: '' },
  { label: '预订', value: '预订' },
  { label: '入住', value: '入住' },
  { label: '完成', value: '完成' },
  { label: '取消', value: '取消' }
]

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  pages: 0
})

// 订单统计
const orderStats = reactive({
  total: 0,
  pending: 0,
  confirmed: 0,
  completed: 0
})

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  try {
    const response = await request.get<PaginationData<Order>>('/h/order', {
      params: {
        pageNum: pagination.current,
        pageSize: pagination.size,
        search: searchKeyword.value,
        searchType: searchType.value
      }
    })

    if (response.code === 200 || response.code === "200") {
      orders.value = response.data?.records || []
      pagination.total = response.data?.total || 0
      pagination.pages = response.data?.pages || 0

      // 计算统计数据
      calculateStats()
      notification.success('订单数据加载成功', '数据加载')
    } else {
      notification.error(response.message || response.msg || '获取订单列表失败', '加载失败')
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    notification.error('网络错误，请稍后重试', '加载失败')
  } finally {
    loading.value = false
  }
}

// 计算订单统计
const calculateStats = () => {
  orderStats.total = orders.value.length
  orderStats.pending = orders.value.filter(order => order.state === '预订').length
  orderStats.confirmed = orders.value.filter(order => order.state === '入住').length
  orderStats.completed = orders.value.filter(order => order.state === '完成').length
}

// 设置状态筛选
const setStatusFilter = (status: string) => {
  currentStatus.value = status
  searchKeyword.value = status
  searchType.value = 'state'
  pagination.current = 1
  fetchOrders()
}

// 搜索订单
const searchOrders = () => {
  pagination.current = 1
  fetchOrders()
}

// 刷新数据
const refreshData = () => {
  fetchOrders()
}

// 分页切换
const changePage = (page: number) => {
  pagination.current = page
  fetchOrders()
}

// 查看订单详情
const viewOrder = (order: any) => {
  currentOrder.value = order
  showDetailModal.value = true
}

// 确认订单
const confirmOrder = async (order: Order) => {
  try {
    const updatedOrder = { ...order, state: '入住' }
    const response = await request.put('/h/order', updatedOrder)
    if (response.code === 200 || response.code === "200") {
      notification.success('订单确认成功', '操作成功')
      await fetchOrders()
    } else {
      notification.error(response.message || response.msg || '确认订单失败', '操作失败')
    }
  } catch (error) {
    console.error('确认订单失败:', error)
    notification.error('网络错误，请稍后重试', '操作失败')
  }
}

// 标记为已支付
const markAsPaid = async (order: Order) => {
  try {
    const response = await request.post('/h/order/pay', order.id)
    if (response.code === 200 || response.code === "200") {
      notification.success('订单支付成功', '操作成功')
      await fetchOrders()
    } else {
      notification.error(response.message || response.msg || '支付失败', '操作失败')
    }
  } catch (error) {
    console.error('标记支付失败:', error)
    notification.error('网络错误，请稍后重试', '操作失败')
  }
}

// 退房
const checkoutOrder = async (order: Order) => {
  try {
    const response = await request.post('/h/order/checkout', order)
    if (response.code === 200 || response.code === "200") {
      notification.success('退房成功', '操作成功')
      await fetchOrders()
    } else {
      notification.error(response.message || response.msg || '退房失败', '操作失败')
    }
  } catch (error) {
    console.error('退房失败:', error)
    notification.error('网络错误，请稍后重试', '操作失败')
  }
}

// 删除订单
const deleteOrder = async (order: Order) => {
  if (confirm(`确定要删除订单 #${order.id} 吗？`)) {
    try {
      const response = await request.delete(`/h/order/del/${order.id}`)
      if (response.code === 200 || response.code === "200") {
        notification.success('订单删除成功', '删除成功')
        await fetchOrders()
      } else {
        notification.error(response.message || response.msg || '删除失败', '操作失败')
      }
    } catch (error) {
      console.error('删除订单失败:', error)
      notification.error('网络错误，请稍后重试', '删除失败')
    }
  }
}

// 关闭模态框
const closeModals = () => {
  showDetailModal.value = false
  currentOrder.value = null
}

// 获取状态样式类
const getStatusClass = (state: string) => {
  switch (state) {
    case '预订': return 'pending'
    case '入住': return 'confirmed'
    case '完成': return 'completed'
    case '取消': return 'cancelled'
    default: return 'unknown'
  }
}

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

// 组件挂载时获取数据
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-management {
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

.stat-icon.pending {
  background: #ffc107;
  color: #212529;
}

.stat-icon.confirmed {
  background: #28a745;
}

.stat-icon.completed {
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

/* 订单列表 */
.order-list {
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
.order-table {
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

.order-row:hover {
  background: #f8f9fa;
}

.order-info {
  min-width: 120px;
}

.order-basic h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.order-date {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #6c757d;
}

.order-days {
  margin: 0;
  font-size: 12px;
  color: #7f8c8d;
}

.customer-info {
  min-width: 150px;
}

.customer-basic h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.customer-phone {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #6c757d;
}

.customer-id {
  margin: 0;
  font-size: 12px;
  color: #7f8c8d;
}

.room-info {
  min-width: 120px;
}

.room-basic h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.room-id {
  margin: 0;
  font-size: 12px;
  color: #7f8c8d;
}

.date-info {
  min-width: 150px;
}

.check-in {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #28a745;
}

.check-out {
  margin: 0;
  font-size: 12px;
  color: #dc3545;
}

.amount-info {
  text-align: right;
  min-width: 100px;
}

.total-amount {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #8b4513;
}

.pay-status {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
}

.pay-status.paid {
  color: #28a745;
}

.pay-status.unpaid {
  color: #dc3545;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.confirmed {
  background: #d4edda;
  color: #155724;
}

.status-badge.completed {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.cancelled {
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
  .order-management {
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

  .order-table {
    font-size: 14px;
  }

  .actions {
    flex-direction: column;
  }
}

/* 操作按钮美化 */
.action-buttons {
  display: flex;
  gap: 6px;
  align-items: center;
}

.action-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  overflow: hidden;
  min-width: 60px;
  justify-content: center;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn .btn-text {
  font-size: 11px;
  font-weight: 500;
  opacity: 0;
  max-width: 0;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
}

.action-btn:hover .btn-text {
  opacity: 1;
  max-width: 40px;
  margin-left: 3px;
}

.action-btn i {
  transition: transform 0.3s ease;
}

.action-btn:hover i {
  transform: scale(1.1);
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
  padding: 4px 6px;
  border-radius: 3px;
  font-size: 10px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

.action-btn:hover::before {
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

.fade-in {
  animation: fadeIn 0.6s ease-out;
}
</style>

<template>
  <div class="admin-dashboard-simple">
    <h1>管理员后台 - 简化版</h1>
    
    <div class="debug-info">
      <h2>调试信息</h2>
      <p>认证状态: {{ auth.isAuthenticated ? '已登录' : '未登录' }}</p>
      <p>用户角色: {{ auth.userRole || '无' }}</p>
      <p>当前路径: {{ $route.path }}</p>
    </div>

    <div class="test-icons">
      <h2>图标测试</h2>
      <div class="icons">
        <i class="fas fa-home"></i>
        <i class="fas fa-user"></i>
        <i class="fas fa-cog"></i>
        <i class="fas fa-chart-bar"></i>
      </div>
    </div>

    <div class="actions">
      <button @click="testLogin" class="btn">模拟登录</button>
      <button @click="goToDebug" class="btn">调试页面</button>
      <button @click="goToHome" class="btn">返回首页</button>
    </div>

    <div class="content">
      <h2>管理功能</h2>
      <div class="menu-items">
        <div class="menu-item" @click="activeTab = 'dashboard'">
          <i class="fas fa-tachometer-alt"></i>
          <span>仪表板</span>
        </div>
        <div class="menu-item" @click="activeTab = 'rooms'">
          <i class="fas fa-bed"></i>
          <span>房间管理</span>
        </div>
        <div class="menu-item" @click="activeTab = 'orders'">
          <i class="fas fa-clipboard-list"></i>
          <span>订单管理</span>
        </div>
        <div class="menu-item" @click="activeTab = 'users'">
          <i class="fas fa-users"></i>
          <span>用户管理</span>
        </div>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 'dashboard'">
          <h3>仪表板</h3>
          <p>这里是仪表板内容</p>
        </div>
        <div v-else-if="activeTab === 'rooms'">
          <h3>房间管理</h3>
          <p>这里是房间管理内容</p>
        </div>
        <div v-else-if="activeTab === 'orders'">
          <h3>订单管理</h3>
          <p>这里是订单管理内容</p>
        </div>
        <div v-else-if="activeTab === 'users'">
          <h3>用户管理</h3>
          <p>这里是用户管理内容</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const activeTab = ref('dashboard')

const testLogin = () => {
  auth.login('admin@test.com', 'test-token', 'Admin User')
  auth.setUserRole('admin')
  alert('模拟登录成功')
}

const goToDebug = () => {
  router.push('/debug')
}

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.admin-dashboard-simple {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.debug-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #dee2e6;
}

.debug-info h2 {
  margin-top: 0;
  color: #495057;
}

.test-icons {
  background: #e9ecef;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.test-icons h2 {
  margin-top: 0;
  color: #495057;
}

.icons {
  display: flex;
  gap: 20px;
  font-size: 24px;
}

.icons i {
  color: #007bff;
  padding: 10px;
  border: 1px solid #007bff;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn:hover {
  background: #0056b3;
}

.content {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.content h2 {
  margin: 0;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
}

.menu-items {
  display: flex;
  border-bottom: 1px solid #dee2e6;
}

.menu-item {
  flex: 1;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  border-right: 1px solid #dee2e6;
  transition: background-color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.menu-item:last-child {
  border-right: none;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-item i {
  font-size: 20px;
  color: #007bff;
}

.tab-content {
  padding: 20px;
  min-height: 200px;
}

.tab-content h3 {
  margin-top: 0;
  color: #495057;
}

@media (max-width: 768px) {
  .admin-dashboard-simple {
    padding: 10px;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
  
  .menu-items {
    flex-direction: column;
  }
  
  .menu-item {
    border-right: none;
    border-bottom: 1px solid #dee2e6;
  }
  
  .menu-item:last-child {
    border-bottom: none;
  }
}
</style>

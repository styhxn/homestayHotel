<template>
  <div class="admin-debug">
    <div class="debug-container">
      <h1>管理员登录调试页面</h1>
      
      <!-- 数据库检查 -->
      <div class="debug-section">
        <h2>1. 检查管理员账号是否存在</h2>
        <button @click="checkAdmin" class="debug-btn">检查管理员账号</button>
        <div v-if="checkResult" class="result">
          <pre>{{ checkResult }}</pre>
        </div>
      </div>

      <!-- 创建管理员 -->
      <div class="debug-section">
        <h2>2. 创建管理员账号</h2>
        <button @click="createAdmin" class="debug-btn">创建管理员账号</button>
        <div v-if="createResult" class="result">
          <pre>{{ createResult }}</pre>
        </div>
      </div>

      <!-- 测试登录 -->
      <div class="debug-section">
        <h2>3. 测试管理员登录</h2>
        <div class="login-form">
          <input v-model="loginForm.username" placeholder="用户名" />
          <input v-model="loginForm.password" type="password" placeholder="密码" />
          <button @click="testLogin" class="debug-btn">测试登录</button>
        </div>
        <div v-if="loginResult" class="result">
          <pre>{{ loginResult }}</pre>
        </div>
      </div>

      <!-- API测试 -->
      <div class="debug-section">
        <h2>4. API连接测试</h2>
        <button @click="testConnection" class="debug-btn">测试后端连接</button>
        <div v-if="connectionResult" class="result">
          <pre>{{ connectionResult }}</pre>
        </div>
      </div>

      <!-- 数据库信息 -->
      <div class="debug-section">
        <h2>5. 系统信息</h2>
        <div class="info">
          <p><strong>前端地址:</strong> {{ location.origin }}</p>
          <p><strong>后端地址:</strong> http://localhost:8091</p>
          <p><strong>登录接口:</strong> /sys/user/login</p>
          <p><strong>默认账号:</strong> root / root123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import request from '../../utils/request'

// 获取location对象
const location = window.location

// 响应式数据
const checkResult = ref('')
const createResult = ref('')
const loginResult = ref('')
const connectionResult = ref('')

const loginForm = reactive({
  username: 'root',
  password: 'root123'
})

// 检查管理员账号
const checkAdmin = async () => {
  try {
    checkResult.value = '检查中...'
    const response = await request.get('/admin/init/check-admin')
    checkResult.value = JSON.stringify(response, null, 2)
  } catch (error: any) {
    checkResult.value = `错误: ${error.message}\n详情: ${JSON.stringify(error.response?.data || error, null, 2)}`
  }
}

// 创建管理员账号
const createAdmin = async () => {
  try {
    createResult.value = '创建中...'
    const response = await request.post('/admin/init/create-admin')
    createResult.value = JSON.stringify(response, null, 2)
  } catch (error: any) {
    createResult.value = `错误: ${error.message}\n详情: ${JSON.stringify(error.response?.data || error, null, 2)}`
  }
}

// 测试登录
const testLogin = async () => {
  try {
    loginResult.value = '登录中...'
    console.log('发送登录请求:', {
      username: loginForm.username,
      password: loginForm.password
    })
    
    const response = await request.post('/sys/user/login', {
      username: loginForm.username,
      password: loginForm.password
    })
    
    console.log('登录响应:', response)
    loginResult.value = JSON.stringify(response, null, 2)
  } catch (error: any) {
    console.error('登录错误:', error)
    loginResult.value = `错误: ${error.message}\n详情: ${JSON.stringify(error.response?.data || error, null, 2)}`
  }
}

// 测试连接
const testConnection = async () => {
  try {
    connectionResult.value = '测试中...'
    const response = await request.get('/admin/init/list-admins')
    connectionResult.value = `连接成功!\n管理员列表: ${JSON.stringify(response, null, 2)}`
  } catch (error: any) {
    connectionResult.value = `连接失败: ${error.message}\n详情: ${JSON.stringify(error.response?.data || error, null, 2)}`
  }
}
</script>

<style scoped>
.admin-debug {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.debug-container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.debug-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.debug-section h2 {
  color: #666;
  margin-bottom: 15px;
}

.debug-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.debug-btn:hover {
  background: #0056b3;
}

.login-form {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
}

.login-form input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 150px;
}

.result {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.result pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  color: #333;
}

.info {
  background: #e7f3ff;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.info p {
  margin: 5px 0;
  color: #333;
}

.info strong {
  color: #007bff;
}
</style>

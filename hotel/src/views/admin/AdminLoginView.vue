<template>
  <div class="admin-login-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <i class="fas fa-seedling"></i>
          普洱蘑菇庄园民宿 - 管理后台
        </div>
        <div class="nav-actions">
          <router-link to="/" class="nav-link">返回首页</router-link>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="main-content">
      <!-- 背景图片 -->
      <div class="login-background">
        <img src="@/assets/images/swiper/swiper01.JPG" alt="管理后台背景">
        <div class="background-overlay"></div>
      </div>

      <!-- 登录表单容器 -->
      <div class="login-container">
        <div class="login-form-wrapper">
          <!-- 表单头部 -->
          <div class="login-header">
            <div class="admin-icon">
              <i class="fas fa-user-shield"></i>
            </div>
            <h1 class="login-title">管理员登录</h1>
            <p class="login-subtitle">普洱蘑菇庄园民宿管理系统</p>
          </div>

          <!-- 登录表单 -->
          <form @submit.prevent="handleLogin" class="login-form">
            <!-- 用户名输入 -->
            <div class="form-group">
              <label for="username" class="form-label">管理员账号</label>
              <div class="input-wrapper">
                <i class="fas fa-user-shield input-icon"></i>
                <input
                  type="text"
                  id="username"
                  v-model="loginForm.username"
                  class="form-input"
                  placeholder="请输入管理员账号"
                  required
                >
              </div>
            </div>

            <!-- 密码输入 -->
            <div class="form-group">
              <label for="password" class="form-label">密码</label>
              <div class="input-wrapper">
                <i class="fas fa-lock input-icon"></i>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="loginForm.password"
                  class="form-input"
                  placeholder="请输入密码"
                  required
                >
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- 记住登录 -->
            <div class="form-group">
              <label class="checkbox-wrapper">
                <input
                  type="checkbox"
                  v-model="loginForm.remember"
                  class="checkbox-input"
                >
                <span class="checkbox-label">记住登录状态</span>
              </label>
            </div>

            <!-- 登录按钮 -->
            <button type="submit" class="login-btn" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? '登录中...' : '管理员登录' }}
            </button>
          </form>


        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import request from '../../utils/request'

const router = useRouter()
const auth = useAuthStore()

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 状态管理
const showPassword = ref(false)
const isLoading = ref(false)

// 登录处理
const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    alert('请填写完整的登录信息')
    return
  }

  console.log('开始管理员登录:', {
    username: loginForm.username,
    password: loginForm.password
  })

  isLoading.value = true
  try {
    console.log('发送登录请求到:', '/sys/user/login')

    const response: any = await request.post('/sys/user/login', {
      username: loginForm.username,
      password: loginForm.password
    })

    console.log('管理员登录响应:', response)
    console.log('响应类型:', typeof response)
    console.log('响应内容:', JSON.stringify(response, null, 2))

    if (response.code === 200 || response.code === "200") {
      // 登录成功，存储管理员信息
      const responseData = response.data
      const user = responseData.user
      const tokenInfo = responseData.tokenInfo

      console.log('用户信息:', user)
      console.log('Token信息:', tokenInfo)

      if (!user || !tokenInfo) {
        alert('登录响应数据异常，请重试')
        return
      }

      // 存储用户信息
      auth.login(
        user.email || user.username,
        tokenInfo.tokenValue,
        user.realName,
        user.phonenumber,
        user.gender,
        user.idCard,
        user.avatar,
        undefined, // total
        user.username,
        user.realName
      )

      // 设置管理员角色
      auth.setUserRole('admin')

      console.log('登录后的认证状态:', {
        isAuthenticated: auth.isAuthenticated,
        userRole: auth.userRole,
        user: auth.user
      })

      alert('管理员登录成功！即将跳转到管理后台...')

      // 延迟跳转，确保状态更新完成
      setTimeout(() => {
        console.log('准备跳转到 /admin')
        router.push('/admin').then(() => {
          console.log('跳转成功')
        }).catch((error) => {
          console.error('跳转失败:', error)
          // 如果路由跳转失败，尝试直接修改location
          window.location.href = '/admin'
        })
      }, 500)
    } else {
      alert(response.msg || '登录失败，请检查账号密码')
    }
  } catch (error: any) {
    console.error('管理员登录失败:', error)
    console.error('错误详情:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data
    })

    if (error.response) {
      // 服务器响应了错误状态码
      const status = error.response.status
      const data = error.response.data

      if (status === 500) {
        alert('服务器内部错误，请稍后重试')
      } else if (status === 404) {
        alert('登录接口不存在，请检查后端服务')
      } else if (status === 401) {
        alert('用户名或密码错误')
      } else {
        alert(`登录失败: ${data?.msg || error.message}`)
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('网络请求失败:', error.request)
      alert('网络连接失败，请检查网络或后端服务是否启动')
    } else {
      // 其他错误
      alert(`登录失败: ${error.message}`)
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 基础样式 */
.admin-login-page {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 导航栏样式 */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-actions .nav-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-actions .nav-link:hover {
  color: #dc2626;
}

/* 主要内容 */
.main-content {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 70px;
}

/* 背景图片 */
.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.login-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(153, 27, 27, 0.9) 100%);
}

/* 登录容器 */
.login-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 450px;
  padding: 0 24px;
}

.login-form-wrapper {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 表单头部 */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.admin-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
}

.admin-icon i {
  font-size: 2rem;
  color: white;
}

.login-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.login-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 1rem;
}

/* 表单样式 */
.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.1rem;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #dc2626;
}

/* 复选框样式 */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: #dc2626;
}

.checkbox-label {
  color: #6b7280;
  font-size: 0.9rem;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
}

.login-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}



/* 响应式设计 */
@media (max-width: 768px) {
  .login-form-wrapper {
    padding: 32px 24px;
    margin: 0 16px;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
  
  .admin-icon {
    width: 60px;
    height: 60px;
  }
  
  .admin-icon i {
    font-size: 1.5rem;
  }
}
</style>

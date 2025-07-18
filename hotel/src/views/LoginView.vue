<template>
  <div class="login-page">
    <AppNavbar />

    <!-- 动态背景 -->
    <div class="animated-background">
      <div class="floating-particles">
        <div class="particle" v-for="i in 15" :key="i" :style="getParticleStyle(i)"></div>
      </div>
      <div class="gradient-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
      <div class="floating-elements">
        <div class="floating-element mushroom-1">🍄</div>
        <div class="floating-element mushroom-2">🌿</div>
        <div class="floating-element mushroom-3">🍃</div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="login-main">

      <!-- 登录表单容器 -->
      <div class="login-container">
        <div class="login-card" data-aos="fade-up" data-aos-duration="800">
          <!-- 表单头部 -->
          <div class="login-header" data-aos="fade-down" data-aos-delay="200">
            <div class="login-icon">
              <span class="mushroom-icon">🍄</span>
            </div>
            <h1 class="login-title">普洱蘑菇庄园民宿</h1>
            <p class="login-subtitle">登录您的账户，体验自然生态之美</p>
          </div>

          <!-- 登录表单 -->
          <form class="login-form" @submit.prevent="handleLogin" data-aos="fade-up" data-aos-delay="300">

            <div class="form-group" data-aos="fade-right" data-aos-delay="400">
              <label for="email" class="form-label">用户名</label>
              <div class="input-wrapper">
                <i class="fas fa-user input-icon"></i>
                <input
                  type="text"
                  id="username"
                  v-model="loginForm.username"
                  class="form-input"
                  placeholder="请输入您的用户名"
                  required
                >
              </div>
            </div>

            <div class="form-group" data-aos="fade-right" data-aos-delay="500">
              <label for="password" class="form-label">密码</label>
              <div class="input-wrapper">
                <i class="fas fa-lock input-icon"></i>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="loginForm.password"
                  class="form-input"
                  placeholder="请输入您的密码"
                  required
                >
                <button
                  type="button"
                  class="password-toggle"
                  @click="togglePassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-options" data-aos="fade-up" data-aos-delay="600">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="loginForm.remember">
                <span class="checkmark"></span>
                <span class="checkbox-text">记住我</span>
              </label>
              <a href="#" class="forgot-link">忘记密码？</a>
            </div>

            <button type="submit" class="login-btn" :disabled="isLoading" data-aos="zoom-in" data-aos-delay="700">
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? '登录中...' : '登录' }}
            </button>
          </form>

          <!-- 分割线 -->
          <div class="divider" data-aos="fade-up" data-aos-delay="800">
            <span class="divider-text">或</span>
          </div>

          <!-- 手机号验证登录 -->
          <div class="phone-login" data-aos="fade-up" data-aos-delay="900">
            <button
              type="button"
              class="phone-login-btn"
              @click="togglePhoneLogin"
            >
              <i class="fas fa-mobile-alt"></i>
              <span>手机号验证登录</span>
            </button>
          </div>

          <!-- 手机号验证表单 -->
          <div v-if="showPhoneLogin" class="phone-form">
            <div class="form-group">
              <label for="phone" class="form-label">手机号</label>
              <div class="input-wrapper">
                <i class="fas fa-mobile-alt input-icon"></i>
                <input
                  type="tel"
                  id="phone"
                  v-model="phoneForm.phone"
                  class="form-input"
                  placeholder="请输入手机号"
                  maxlength="11"
                  @input="validatePhone"
                >
              </div>
              <div v-if="phoneError" class="error-message">{{ phoneError }}</div>
            </div>

            <div class="form-group">
              <label for="verifyCode" class="form-label">验证码</label>
              <div class="input-wrapper verify-wrapper">
                <i class="fas fa-shield-alt input-icon"></i>
                <input
                  type="text"
                  id="verifyCode"
                  v-model="phoneForm.verifyCode"
                  class="form-input verify-input"
                  placeholder="请输入验证码"
                  maxlength="6"
                >
                <button
                  type="button"
                  class="verify-btn"
                  :disabled="!isPhoneValid || isCodeSending || countdown > 0"
                  @click="sendVerifyCode"
                >
                  {{ getVerifyButtonText }}
                </button>
              </div>
            </div>

            <button
              type="button"
              class="phone-submit-btn"
              :disabled="!isPhoneFormValid || isPhoneLoading"
              @click="handlePhoneLogin"
            >
              <span v-if="isPhoneLoading" class="loading-spinner"></span>
              {{ isPhoneLoading ? '验证中...' : '验证登录' }}
            </button>
          </div>

          <!-- 注册链接 -->
          <div class="register-link">
            <span>还没有账户？</span>
            <router-link to="/register" class="register-btn">立即注册</router-link>
          </div>


        </div>

        <!-- 侧边信息 -->
        <div class="login-info" data-aos="fade-left" data-aos-delay="400">
          <div class="info-content">
            <h2 class="info-title" data-aos="fade-down" data-aos-delay="600">尊享会员特权</h2>
            <ul class="privilege-list">
              <li class="privilege-item" data-aos="fade-left" data-aos-delay="700">
                <i class="fas fa-crown"></i>
                <span>专属会员价格</span>
              </li>
              <li class="privilege-item" data-aos="fade-left" data-aos-delay="800">
                <i class="fas fa-gift"></i>
                <span>生日专属礼遇</span>
              </li>
              <li class="privilege-item" data-aos="fade-left" data-aos-delay="900">
                <i class="fas fa-concierge-bell"></i>
                <span>优先预订服务</span>
              </li>
              <li class="privilege-item" data-aos="fade-left" data-aos-delay="1000">
                <i class="fas fa-star"></i>
                <span>积分奖励计划</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '../utils/request'
import { useAuthStore } from '../stores/auth'
import { notifyLoginSuccess, notifyLoginError, notifySuccess, notifyError, notifyWarning } from '../utils/notification'
import AppNavbar from '../components/AppNavbar.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const router = useRouter()
const auth = useAuthStore()

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 手机号验证表单数据
const phoneForm = reactive({
  phone: '',
  verifyCode: ''
})

// 状态管理
const showPassword = ref(false)
const isLoading = ref(false)
const showPhoneLogin = ref(false)
const isPhoneLoading = ref(false)
const isCodeSending = ref(false)
const countdown = ref(0)
const phoneError = ref('')

// 切换密码显示
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 处理登录
const handleLogin = async () => {
  isLoading.value = true

  try {
    // 普通用户登录接口
    const response = await request.post('/h/user/login', {
      username: loginForm.username,
      password: loginForm.password
    })

    // 存储用户信息和token
    console.log('登录响应:', response)

    // 检查响应结构 (response已经是response.data了)
    if ((response as any).code !== '200') {
      throw new Error((response as any).msg || '登录失败')
    }

    const responseData = (response as any).data || response
    const userData = responseData.user || responseData
    const tokenInfo = responseData.tokenInfo || { tokenValue: responseData.token }

    auth.login(
      loginForm.username,
      tokenInfo.tokenValue || 'temp-token',
      userData.realName || userData.name || userData.username,
      userData.phonenumber || userData.phone,
      userData.gender,
      userData.idCard,
      userData.avatar,
      userData.total,
      userData.username,
      userData.realName
    )

    // 设置为普通用户角色
    auth.setUserRole('user')

    // 显示成功提示
    notifyLoginSuccess(userData.username || '用户')

    // 跳转到AI选房页面
    router.push('/ai-rooms')
  } catch (error) {
    console.error('登录失败:', error)
    notifyLoginError('用户名或密码错误')
  } finally {
    isLoading.value = false
  }
}

// 计算属性
const isPhoneValid = computed(() => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phoneForm.phone)
})

const isPhoneFormValid = computed(() => {
  return isPhoneValid.value && phoneForm.verifyCode.length === 6
})

const getVerifyButtonText = computed(() => {
  if (countdown.value > 0) {
    return `${countdown.value}s后重发`
  }
  if (isCodeSending.value) {
    return '发送中...'
  }
  return '获取验证码'
})

// 手机号验证相关方法
const togglePhoneLogin = () => {
  showPhoneLogin.value = !showPhoneLogin.value
  if (showPhoneLogin.value) {
    // 清空表单
    phoneForm.phone = ''
    phoneForm.verifyCode = ''
    phoneError.value = ''
  }
}

const validatePhone = () => {
  phoneError.value = ''
  if (phoneForm.phone && !isPhoneValid.value) {
    phoneError.value = '请输入正确的手机号格式'
  }
}

const sendVerifyCode = async () => {
  if (!isPhoneValid.value) {
    phoneError.value = '请输入正确的手机号'
    return
  }

  isCodeSending.value = true
  try {
    // 这里调用发送验证码的API
    // const response = await request.post('/api/send-sms-code', {
    //   phone: phoneForm.phone
    // })

    // 模拟发送验证码
    console.log('发送验证码到:', phoneForm.phone)
    notifySuccess('验证码已发送', `验证码已发送到 ${phoneForm.phone}，请注意查收`)

    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)

  } catch (error) {
    console.error('发送验证码失败:', error)
    notifyError('发送失败', '发送验证码失败，请稍后重试')
  } finally {
    isCodeSending.value = false
  }
}

const handlePhoneLogin = async () => {
  if (!isPhoneFormValid.value) {
    notifyWarning('信息不完整', '请填写完整的手机号和验证码')
    return
  }

  isPhoneLoading.value = true
  try {
    // 这里调用手机号验证登录的API
    // const response = await request.post('/api/phone-login', {
    //   phone: phoneForm.phone,
    //   verifyCode: phoneForm.verifyCode
    // })

    // 模拟验证成功
    console.log('手机号验证登录:', phoneForm.phone, phoneForm.verifyCode)

    // 模拟用户数据
    const userData = {
      username: phoneForm.phone,
      realName: '手机用户',
      phone: phoneForm.phone,
      token: 'phone-login-token-' + Date.now()
    }

    // 登录成功，存储用户信息
    auth.login(
      userData.username,
      userData.token,
      userData.realName,
      userData.phone,
      undefined, // gender
      undefined, // idCard
      undefined, // avatar
      undefined, // total
      userData.username,
      userData.realName
    )

    auth.setUserRole('user')

    notifyLoginSuccess(userData.phone || '用户')
    router.push('/ai-rooms')

  } catch (error) {
    console.error('手机号验证登录失败:', error)
    notifyError('验证失败', '验证码错误或已过期，请重试')
  } finally {
    isPhoneLoading.value = false
  }
}

// 生成粒子样式
const getParticleStyle = (index: number) => {
  const size = Math.random() * 4 + 2
  const left = Math.random() * 100
  const animationDelay = Math.random() * 20
  const animationDuration = Math.random() * 10 + 10

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`
  }
}

// 生命周期
onMounted(() => {
  // 初始化AOS动画库
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50
  })
})
</script>

<style scoped>
/* 页面容器 */
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg,
    #2E7D32 0%,     /* 深绿色 - 森林绿 */
    #388E3C 25%,    /* 中绿色 - 茶园绿 */
    #66BB6A 50%,    /* 亮绿色 - 新叶绿 */
    #81C784 75%,    /* 浅绿色 - 嫩芽绿 */
    #C8E6C9 100%);  /* 淡绿色 - 清新绿 */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* 动态背景 */
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: particleFloat 20s infinite linear;
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

.gradient-orbs {
  position: absolute;
  width: 100%;
  height: 100%;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: orbFloat 15s infinite ease-in-out;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.4) 0%, transparent 70%);  /* 金黄色 */
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, transparent 70%);  /* 茶叶绿 */
  top: 60%;
  right: 20%;
  animation-delay: -5s;
}

.orb-3 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 235, 59, 0.25) 0%, transparent 70%);  /* 亮金色 */
  bottom: 30%;
  left: 60%;
  animation-delay: -10s;
}

@keyframes orbFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 28px;
  font-weight: bold;
  color: #FFD700;  /* 金黄色 */
  font-family: 'Pacifico', cursive;
}

.nav-menu {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #FFD700;  /* 金黄色 */
}

/* 主要内容区域 */
.login-main {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px 20px;
  z-index: 1;
}

/* 浮动装饰元素 */
.floating-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  font-size: 3rem;
  animation: float 6s ease-in-out infinite;
  opacity: 0.7;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.mushroom-1 {
  top: 15%;
  left: 8%;
  animation-delay: 0s;
  font-size: 4rem;
}

.mushroom-2 {
  top: 65%;
  right: 12%;
  animation-delay: 2s;
  font-size: 3.5rem;
}

.mushroom-3 {
  bottom: 25%;
  left: 15%;
  animation-delay: 4s;
  font-size: 2.5rem;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
}

/* 登录容器 */
.login-container {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 60px;
  max-width: 1000px;
  width: 100%;
  align-items: center;
}

/* 登录卡片 */
.login-card {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.1) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(212, 175, 55, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  width: 100%;
  max-width: 460px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  transition: all 0.3s ease;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FFD700, #4CAF50, #FFD700);  /* 金色到绿色渐变 */
  animation: decorationShimmer 3s infinite;
}

@keyframes decorationShimmer {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.login-card:hover {
  transform: translateY(-5px);
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.35) 0%,
    rgba(255, 255, 255, 0.25) 50%,
    rgba(255, 255, 255, 0.2) 100%);
  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.2),
    0 20px 40px rgba(212, 175, 55, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

/* 表单头部 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow:
    0 8px 32px rgba(76, 175, 80, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  position: relative;
}

.login-icon::before {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
}

.mushroom-icon {
  font-size: 2.5rem;
  z-index: 1;
  position: relative;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.login-title {
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.login-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.5;
}

/* 表单样式 */
.login-form {
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.125rem;
}

.form-input {
  width: 100%;
  padding: 18px 20px 18px 52px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
}

.form-input:focus {
  outline: none;
  border-color: #4caf50;
  background: white;
  box-shadow:
    0 0 0 4px rgba(76, 175, 80, 0.1),
    inset 0 1px 3px rgba(0, 0, 0, 0.05),
    0 4px 12px rgba(76, 175, 80, 0.15);
  transform: translateY(-1px);
}

.form-input:hover {
  border-color: #d1d5db;
  background: white;
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
  font-size: 1.125rem;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #6b7280;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6b7280;
}

.checkbox-wrapper input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-wrapper input[type="checkbox"]:checked + .checkmark {
  background-color: #FFD700;  /* 金黄色 */
  border-color: #FFD700;
}

.checkbox-wrapper input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-link {
  color: #FFD700;  /* 金黄色 */
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #b8941f;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  padding: 18px 24px;
  background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 8px 25px rgba(76, 175, 80, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  letter-spacing: 0.02em;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #388e3c 0%, #4caf50 100%);
  transform: translateY(-3px);
  box-shadow:
    0 12px 35px rgba(76, 175, 80, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.login-btn:hover:not(:disabled)::before {
  left: 100%;
}

.login-btn:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 6px 20px rgba(76, 175, 80, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%);
  box-shadow: none;
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

/* 分割线 */
.divider {
  position: relative;
  text-align: center;
  margin: 32px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider-text {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 16px;
  color: #9ca3af;
  font-size: 0.875rem;
}

/* 手机号验证登录 */
.phone-login {
  margin-bottom: 24px;
}

.phone-login-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border: 2px solid #4caf50;
  border-radius: 12px;
  background: linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%);
  color: #4caf50;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.phone-login-btn:hover {
  background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.phone-login-btn i {
  font-size: 1.1rem;
}

/* 手机号验证表单 */
.phone-form {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.1) 100%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.verify-wrapper {
  position: relative;
}

.verify-input {
  padding-right: 120px !important;
}

.verify-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.verify-btn:hover:not(:disabled) {
  background: #45a049;
}

.verify-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.phone-submit-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.phone-submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #388e3c 0%, #4caf50 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.phone-submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 4px;
}

/* 注册链接 */
.register-link {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.register-btn {
  color: #FFD700;  /* 金黄色 */
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
  transition: color 0.3s ease;
}

.register-btn:hover {
  color: #b8941f;
}





/* 侧边信息 */
.login-info {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.1) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  color: white;
  max-width: 320px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.login-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FFD700, #4CAF50, #FFD700);  /* 金色到绿色渐变 */
  animation: decorationShimmer 3s infinite;
}

.info-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
}

.privilege-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.privilege-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.privilege-item:last-child {
  border-bottom: none;
}

.privilege-item i {
  color: #FFD700;  /* 金黄色 */
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.privilege-item span {
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr;
    gap: 40px;
    justify-items: center;
  }

  .login-info {
    order: -1;
    max-width: 420px;
  }
}

@media (max-width: 768px) {
  .login-main {
    padding: 100px 16px 20px;
  }

  .login-card {
    padding: 32px 24px;
  }

  .login-title {
    font-size: 2rem;
  }

  .login-info {
    padding: 32px 24px;
  }

  .info-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 16px;
  }

  .login-card {
    padding: 24px 20px;
  }

  .login-title {
    font-size: 1.75rem;
  }

  .social-login {
    grid-template-columns: 1fr;
  }

  .login-info {
    padding: 24px 20px;
  }
}
</style>
<template>
  <div class="register-page">
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
    <main class="register-main">

      <!-- 注册表单容器 -->
      <div class="register-container">
        <div class="register-card" data-aos="fade-up" data-aos-duration="800">
          <!-- 表单头部 -->
          <div class="register-header" data-aos="fade-down" data-aos-delay="200">
            <div class="register-icon">
              <span class="mushroom-icon">🍄</span>
            </div>
            <h1 class="register-title">加入蘑菇庄园</h1>
            <p class="register-subtitle">创建账户，开启专属生态民宿体验</p>
          </div>

          <!-- 注册表单 -->
          <form class="register-form" @submit.prevent="handleRegister" data-aos="fade-up" data-aos-delay="300">
            <div class="form-row" data-aos="fade-right" data-aos-delay="400">
              <div class="form-group">
                <label for="firstName" class="form-label">姓</label>
                <div class="input-wrapper">
                  <i class="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    id="firstName"
                    v-model="registerForm.firstName"
                    class="form-input"
                    placeholder="请输入您的姓"
                    required
                  >
                </div>
              </div>
              <div class="form-group">
                <label for="lastName" class="form-label">名</label>
                <div class="input-wrapper">
                  <i class="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    id="lastName"
                    v-model="registerForm.lastName"
                    class="form-input"
                    placeholder="请输入您的名"
                    required
                  >
                </div>
              </div>
            </div>

            <div class="form-group" data-aos="fade-right" data-aos-delay="500">
              <label for="email" class="form-label">邮箱地址</label>
              <div class="input-wrapper">
                <i class="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  id="email"
                  v-model="registerForm.email"
                  class="form-input"
                  placeholder="请输入您的邮箱地址"
                  required
                >
              </div>
            </div>

            <div class="form-group" data-aos="fade-right" data-aos-delay="600">
              <label for="phone" class="form-label">手机号码</label>
              <div class="input-wrapper">
                <i class="fas fa-phone input-icon"></i>
                <input
                  type="tel"
                  id="phone"
                  v-model="registerForm.phone"
                  class="form-input"
                  placeholder="请输入您的手机号码"
                  required
                >
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">密码</label>
              <div class="input-wrapper">
                <i class="fas fa-lock input-icon"></i>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="registerForm.password"
                  class="form-input"
                  placeholder="请设置您的密码"
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
              <div class="password-strength">
                <div class="strength-bar">
                  <div class="strength-fill" :class="passwordStrength.class" :style="{ width: passwordStrength.width }"></div>
                </div>
                <span class="strength-text">{{ passwordStrength.text }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">确认密码</label>
              <div class="input-wrapper">
                <i class="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="registerForm.confirmPassword"
                  class="form-input"
                  placeholder="请再次输入密码"
                  required
                >
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="registerForm.agreeTerms" required>
                <span class="checkmark"></span>
                <span class="checkbox-text">
                  我同意 <a href="#" class="terms-link">服务条款</a> 和 <a href="#" class="terms-link">隐私政策</a>
                </span>
              </label>
            </div>

            <div class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="registerForm.newsletter">
                <span class="checkmark"></span>
                <span class="checkbox-text">订阅我们的优惠信息和活动通知</span>
              </label>
            </div>

            <button type="submit" class="register-btn" :disabled="isLoading || !isFormValid">
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? '注册中...' : '创建账户' }}
            </button>
          </form>

          <!-- 登录链接 -->
          <div class="login-link">
            <span>已有账户？</span>
            <router-link to="/login" class="login-btn-link">立即登录</router-link>
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
import { notifySuccess, notifyError } from '../utils/notification'
import AppNavbar from '../components/AppNavbar.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const router = useRouter()

// 表单数据
const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
  newsletter: false
})

// 状态管理
const showPassword = ref(false)
const isLoading = ref(false)

// 密码强度计算
const passwordStrength = computed(() => {
  const password = registerForm.password
  if (!password) return { width: '0%', class: '', text: '' }
  
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  
  if (score <= 2) return { width: '33%', class: 'weak', text: '弱' }
  if (score <= 3) return { width: '66%', class: 'medium', text: '中等' }
  return { width: '100%', class: 'strong', text: '强' }
})

// 表单验证
const isFormValid = computed(() => {
  return registerForm.firstName &&
         registerForm.lastName &&
         registerForm.email &&
         registerForm.phone &&
         registerForm.password &&
         registerForm.confirmPassword &&
         registerForm.password === registerForm.confirmPassword &&
         registerForm.agreeTerms
})

// 切换密码显示
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 处理注册
const handleRegister = async () => {
  if (!isFormValid.value) return
  
  isLoading.value = true
  
  try {
    const response = await request.post('/h/user', {
      username: registerForm.email,
      password: registerForm.password,
      phone: registerForm.phone,
      // 其他可选字段
      firstName: registerForm.firstName,
      lastName: registerForm.lastName
    })
    
    // 显示成功提示
    notifySuccess('注册成功！', '您的账户已创建成功，现在可以登录了')

    // 注册成功后跳转到登录页
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
    notifyError('注册失败', '请检查输入信息是否正确，或稍后重试')
  } finally {
    isLoading.value = false
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
.register-page {
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
  color: #d4af37;
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
  color: #d4af37;
}

/* 主要内容区域 */
.register-main {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px 20px;
  z-index: 1;
}

/* 注册容器 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 600px;
}

/* 注册卡片 */
.register-card {
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
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.register-card::before {
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

.register-card:hover {
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
.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #FFD700 0%, #4CAF50 100%);  /* 金色到绿色渐变 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow:
    0 8px 32px rgba(212, 175, 55, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  position: relative;
}

.register-icon::before {
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

.register-title {
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.register-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.5;
}

/* 表单样式 */
.register-form {
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
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
  padding: 18px 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  color: white;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input-wrapper .form-input {
  padding-left: 52px;
}

.form-input:focus {
  outline: none;
  border-color: #d4af37;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%);
  box-shadow:
    0 0 0 4px rgba(212, 175, 55, 0.1),
    inset 0 1px 3px rgba(0, 0, 0, 0.05),
    0 4px 12px rgba(212, 175, 55, 0.15);
  transform: translateY(-1px);
}

.form-input:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%);
}

.form-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
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

/* 密码强度指示器 */
.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  background-color: #ef4444;
}

.strength-fill.medium {
  background-color: #f59e0b;
}

.strength-fill.strong {
  background-color: #10b981;
}

.strength-text {
  font-size: 0.75rem;
  font-weight: 500;
  min-width: 24px;
}

/* 表单选项 */
.form-options {
  margin-bottom: 20px;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.checkbox-wrapper input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  margin-right: 12px;
  margin-top: 2px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.checkbox-wrapper input[type="checkbox"]:checked + .checkmark {
  background-color: #d4af37;
  border-color: #d4af37;
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

.terms-link {
  color: #d4af37;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

/* 注册按钮 */
.register-btn {
  width: 100%;
  padding: 16px;
  background-color: #d4af37;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.register-btn:hover:not(:disabled) {
  background-color: #b8941f;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.register-btn:disabled {
  opacity: 0.7;
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

/* 登录链接 */
.login-link {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.login-btn-link {
  color: #d4af37;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
  transition: color 0.3s ease;
}

.login-btn-link:hover {
  color: #b8941f;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-main {
    padding: 100px 16px 20px;
  }

  .register-card {
    padding: 32px 24px;
  }

  .register-title {
    font-size: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
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

  .register-card {
    padding: 24px 20px;
  }

  .register-title {
    font-size: 1.75rem;
  }
}
</style>
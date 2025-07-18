<template>
  <div class="profile-page">
    <AppNavbar />

    <!-- 动态背景 -->
    <div class="animated-background">
      <div class="floating-particles">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
      <div class="gradient-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
    </div>

    <!-- 主要内容 -->
    <main class="profile-main">
      <div class="profile-container">
        <!-- 页面标题 -->
        <div class="page-header" data-aos="fade-down" data-aos-duration="800">
          <div class="header-decoration">
            <div class="decoration-line"></div>
            <div class="decoration-icon">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="decoration-line"></div>
          </div>
          <h1 class="page-title">
            <span class="title-text">个人中心</span>
            <div class="title-underline"></div>
          </h1>
          <p class="page-subtitle">管理您在普洱蘑菇庄园的个人资料</p>
        </div>

        <div class="profile-content">
          <!-- 个人信息卡片 -->
          <div class="profile-card" data-aos="fade-up" data-aos-delay="200">
            <!-- 卡片装饰 -->
            <div class="card-decoration">
              <div class="decoration-pattern"></div>
              <div class="card-glow"></div>
            </div>

            <div class="profile-header">
              <div class="avatar-section" data-aos="zoom-in" data-aos-delay="400">
                <div class="avatar-container">
                  <div class="avatar-frame">
                    <img :src="userInfo.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&h=400&q=80'" alt="头像" class="avatar">
                    <div class="avatar-ring"></div>
                    <div class="avatar-pulse"></div>
                  </div>
                  <div class="avatar-overlay" @click="showAvatarModal = true">
                    <div class="overlay-content">
                      <i class="fas fa-camera"></i>
                      <span>更换头像</span>
                    </div>
                  </div>
                </div>
                <div class="avatar-actions">
                  <button class="change-avatar-btn" @click="showAvatarModal = true">
                    <i class="fas fa-edit"></i>
                    <span>更换头像</span>
                    <div class="btn-ripple"></div>
                  </button>
                </div>
              </div>
              <div class="user-basic-info" data-aos="fade-left" data-aos-delay="600">
                <div class="user-name-section">
                  <h2 class="user-name">{{ userInfo.realName || userInfo.username }}</h2>
                  <div class="user-badge">
                    <i class="fas fa-crown"></i>
                    <span>VIP会员</span>
                  </div>
                </div>
                <div class="user-contact">
                  <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>{{ userInfo.phone || '未设置手机号' }}</span>
                  </div>
                  <div class="contact-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>注册时间：{{ formatDate(userInfo.createTime) }}</span>
                  </div>
                </div>
                <div class="user-stats">
                  <div class="stat-item">
                    <div class="stat-number">¥{{ userInfo.total || 0 }}</div>
                    <div class="stat-label">总消费</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">{{ getOrderCount() }}</div>
                    <div class="stat-label">订单数</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">{{ getMemberDays() }}</div>
                    <div class="stat-label">会员天数</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 详细信息区域 -->
            <div class="profile-details">
              <!-- 基本信息 -->
              <div class="detail-section" data-aos="fade-up" data-aos-delay="300">
                <div class="section-header">
                  <div class="section-icon">
                    <i class="fas fa-user"></i>
                  </div>
                  <h3>基本信息</h3>
                  <div class="section-decoration"></div>
                </div>
                <div class="detail-grid">
                  <div class="detail-item" data-aos="fade-right" data-aos-delay="400">
                    <div class="item-icon">
                      <i class="fas fa-id-card"></i>
                    </div>
                    <div class="item-content">
                      <label>用户名</label>
                      <span>{{ userInfo.username }}</span>
                    </div>
                    <div class="item-decoration"></div>
                  </div>
                  <div class="detail-item" data-aos="fade-right" data-aos-delay="500">
                    <div class="item-icon">
                      <i class="fas fa-signature"></i>
                    </div>
                    <div class="item-content">
                      <label>真实姓名</label>
                      <span>{{ userInfo.realName || '未设置' }}</span>
                    </div>
                    <div class="item-decoration"></div>
                  </div>
                  <div class="detail-item" data-aos="fade-right" data-aos-delay="600">
                    <div class="item-icon">
                      <i class="fas fa-mobile-alt"></i>
                    </div>
                    <div class="item-content">
                      <label>手机号</label>
                      <span>{{ userInfo.phone || '未设置' }}</span>
                    </div>
                    <div class="item-decoration"></div>
                  </div>
                  <div class="detail-item" data-aos="fade-right" data-aos-delay="700">
                    <div class="item-icon">
                      <i class="fas fa-venus-mars"></i>
                    </div>
                    <div class="item-content">
                      <label>性别</label>
                      <span>{{ userInfo.gender || '未设置' }}</span>
                    </div>
                    <div class="item-decoration"></div>
                  </div>
                  <div class="detail-item" data-aos="fade-right" data-aos-delay="800">
                    <div class="item-icon">
                      <i class="fas fa-address-card"></i>
                    </div>
                    <div class="item-content">
                      <label>身份证号</label>
                      <span>{{ maskIdCard(userInfo.idCard) }}</span>
                    </div>
                    <div class="item-decoration"></div>
                  </div>
                </div>
              </div>

              <!-- 账户信息 -->
              <div class="detail-section" data-aos="fade-up" data-aos-delay="400">
                <div class="section-header">
                  <div class="section-icon">
                    <i class="fas fa-shield-alt"></i>
                  </div>
                  <h3>账户信息</h3>
                  <div class="section-decoration"></div>
                </div>
                <div class="detail-grid">
                  <div class="detail-item" data-aos="fade-left" data-aos-delay="500">
                    <div class="item-icon">
                      <i class="fas fa-calendar-plus"></i>
                    </div>
                    <div class="item-content">
                      <label>注册时间</label>
                      <span>{{ formatDate(userInfo.createTime) }}</span>
                    </div>
                    <div class="item-decoration"></div>
                  </div>
                  <div class="detail-item" data-aos="fade-left" data-aos-delay="600">
                    <div class="item-icon">
                      <i class="fas fa-clock"></i>
                    </div>
                    <div class="item-content">
                      <label>最后登录</label>
                      <span>{{ formatDate(userInfo.loginTime) }}</span>
                    </div>
                    <div class="item-decoration"></div>
                  </div>
                  <div class="detail-item" data-aos="fade-left" data-aos-delay="700">
                    <div class="item-icon">
                      <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="item-content">
                      <label>账户状态</label>
                      <span class="status-badge" :class="userInfo.status === 0 ? 'active' : 'inactive'">
                        <div class="status-indicator"></div>
                        {{ userInfo.status === 0 ? '正常' : '已停用' }}
                      </span>
                    </div>
                    <div class="item-decoration"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="profile-actions" data-aos="fade-up" data-aos-delay="500">
              <div class="actions-container">
                <router-link to="/edit-profile" class="btn btn-primary btn-animated">
                  <div class="btn-icon">
                    <i class="fas fa-edit"></i>
                  </div>
                  <span class="btn-text">编辑资料</span>
                  <div class="btn-shine"></div>
                  <div class="btn-ripple"></div>
                </router-link>
                <button @click="changePassword" class="btn btn-outline btn-animated">
                  <div class="btn-icon">
                    <i class="fas fa-key"></i>
                  </div>
                  <span class="btn-text">修改密码</span>
                  <div class="btn-shine"></div>
                  <div class="btn-ripple"></div>
                </button>
                <router-link to="/orders" class="btn btn-secondary btn-animated">
                  <div class="btn-icon">
                    <i class="fas fa-list-alt"></i>
                  </div>
                  <span class="btn-text">我的订单</span>
                  <div class="btn-shine"></div>
                  <div class="btn-ripple"></div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 头像更换模态框 -->
    <div v-if="showAvatarModal" class="modal-overlay" @click="showAvatarModal = false">
      <div class="modal-content" @click.stop data-aos="zoom-in" data-aos-duration="300">
        <!-- 模态框装饰 -->
        <div class="modal-decoration">
          <div class="decoration-pattern"></div>
        </div>

        <div class="modal-header">
          <div class="modal-title-section">
            <div class="modal-icon">
              <i class="fas fa-camera"></i>
            </div>
            <h3>更换头像</h3>
          </div>
          <button class="close-btn" @click="showAvatarModal = false">
            <i class="fas fa-times"></i>
            <div class="close-ripple"></div>
          </button>
        </div>

        <div class="modal-body">
          <div class="current-avatar-preview">
            <div class="preview-container">
              <img :src="userInfo.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'" alt="当前头像" class="preview-img">
              <div class="preview-frame"></div>
              <div class="preview-glow"></div>
            </div>
            <p class="preview-label">当前头像</p>
          </div>

          <div class="upload-section">
            <div class="upload-method">
              <h4>
                <i class="fas fa-upload"></i>
                上传新头像
              </h4>
              <div class="file-upload-area" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  style="display: none"
                >
                <div class="upload-content">
                  <div class="upload-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <div class="upload-pulse"></div>
                  </div>
                  <div class="upload-text">
                    <p class="upload-main">点击上传或拖拽图片到此处</p>
                    <p class="upload-hint">支持 JPG、PNG 格式，建议尺寸 200x200px，最大5MB</p>
                  </div>
                </div>
              </div>
              <div v-if="uploadProgress > 0" class="upload-progress">
                <div class="progress-container">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
                    <div class="progress-glow" :style="{ left: uploadProgress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ uploadProgress }}%</span>
                </div>
                <div class="progress-status">
                  <i class="fas fa-spinner fa-spin" v-if="uploadProgress < 100"></i>
                  <i class="fas fa-check-circle" v-else></i>
                  <span>{{ uploadProgress < 100 ? '上传中...' : '上传完成' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline btn-animated" @click="showAvatarModal = false">
            <span>取消</span>
            <div class="btn-ripple"></div>
          </button>
          <button class="btn btn-primary btn-animated" @click="saveAvatar" :disabled="!newAvatar">
            <span>保存头像</span>
            <div class="btn-ripple"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import request from '../utils/request'
import AppNavbar from '../components/AppNavbar.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const router = useRouter()
const auth = useAuthStore()

// 响应式数据
const loading = ref(false)
const showAvatarModal = ref(false)
const uploadProgress = ref(0)
const newAvatar = ref('')
const fileInput = ref<HTMLInputElement>()
const userInfo = reactive({
  username: '',
  realName: '',
  email: '',
  phone: '',
  gender: '',
  idCard: '',
  avatar: '',
  total: 0,
  status: 0,
  createTime: '',
  loginTime: ''
})

// 方法
const fetchUserInfo = async () => {
  loading.value = true
  try {
    const response: any = await request.get('/h/user/getUserInfo')
    if (response.code === 200 || response.code === "200") {
      Object.assign(userInfo, response.data)
    } else {
      throw new Error(response.msg || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 使用auth store中的用户信息作为备用
    if (auth.user) {
      Object.assign(userInfo, auth.user)
    }
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
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

// 获取订单数量
const getOrderCount = () => {
  // 这里可以从实际的订单数据中获取
  return Math.floor(Math.random() * 20) + 1
}

// 获取会员天数
const getMemberDays = () => {
  if (!userInfo.createTime) return 0
  const createDate = new Date(userInfo.createTime)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - createDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// 身份证号脱敏
const maskIdCard = (idCard: string) => {
  if (!idCard) return '未设置'
  if (idCard.length < 8) return idCard
  return idCard.substring(0, 4) + '****' + idCard.substring(idCard.length - 4)
}

const changePassword = () => {
  // 修改密码功能
  alert('修改密码功能开发中...')
}

// handleLogout 现在由 AppNavbar 组件处理

// 头像上传相关方法
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    await uploadFile(file)
  }
}

const handleFileDrop = async (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    await uploadFile(files[0])
  }
}

const uploadFile = async (file: File) => {
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  // 验证文件大小 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过5MB')
    return
  }

  try {
    uploadProgress.value = 0
    const formData = new FormData()
    formData.append('file', file)

    // 模拟上传进度
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)

    const response: any = await request.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (response.code === 200 || response.code === "200") {
      newAvatar.value = response.data
      setTimeout(() => {
        uploadProgress.value = 0
      }, 1000)
    } else {
      throw new Error(response.msg || '上传失败')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    alert('头像上传失败，请稍后重试')
    uploadProgress.value = 0
  }
}

const saveAvatar = async () => {
  if (!newAvatar.value) return

  try {
    const response: any = await request.put('/h/user/updateInfo', {
      avatar: newAvatar.value
    })

    if (response.code === 200 || response.code === "200") {
      userInfo.avatar = newAvatar.value
      if (auth.user) {
        auth.user.avatar = newAvatar.value
      }
      showAvatarModal.value = false
      newAvatar.value = ''
      alert('头像更新成功！')
    } else {
      throw new Error(response.msg || '保存失败')
    }
  } catch (error) {
    console.error('保存头像失败:', error)
    alert('保存失败，请稍后重试')
  }
}

// 生命周期
onMounted(() => {
  fetchUserInfo()

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
.profile-page {
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
  background: radial-gradient(circle, rgba(255, 193, 7, 0.4) 0%, transparent 70%);  /* 金黄色 - 普洱茶汤色 */
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
  background: radial-gradient(circle, rgba(255, 235, 59, 0.25) 0%, transparent 70%);  /* 亮金色 - 阳光色 */
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
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
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
  color: #FFD700;  /* 金黄色 */
}

.nav-menu {
  display: flex;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
}

.nav-link:hover,
.nav-link.active {
  color: #FFD700;  /* 金黄色 */
  border-bottom-color: #FFD700;
}

.nav-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-welcome {
  color: #6b7280;
  font-weight: 500;
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

.btn-outline {
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
}

.btn-outline:hover {
  background: #d4af37;
  color: white;
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

/* 主要内容 */
.profile-main {
  padding: 40px 0;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
}

/* 个人信息卡片 */
.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-header {
  display: flex;
  gap: 24px;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay i {
  color: white;
  font-size: 1.5rem;
}

.change-avatar-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.change-avatar-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.user-basic-info {
  flex: 1;
}

.user-basic-info h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.user-email {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 8px;
}

.member-since {
  opacity: 0.8;
  font-size: 0.875rem;
}

.profile-details {
  padding: 32px;
}

.detail-section {
  margin-bottom: 32px;
}

.detail-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.detail-item label {
  font-weight: 500;
  color: #6b7280;
}

.detail-item span {
  color: #1f2937;
  font-weight: 500;
}

.total-amount {
  color: #d4af37;
  font-weight: 600;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background: #d1fae5;
  color: #059669;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #dc2626;
}

.profile-actions {
  padding: 24px 32px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .profile-actions {
    flex-direction: column;
  }
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

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
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

.current-avatar-preview {
  text-align: center;
  margin-bottom: 24px;
}

.preview-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e5e7eb;
}

.upload-section h4 {
  margin: 0 0 16px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.file-upload-area:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.upload-content i {
  font-size: 2rem;
  color: #9ca3af;
  margin-bottom: 12px;
  display: block;
}

.upload-content p {
  margin: 0;
  color: #6b7280;
}

.upload-hint {
  font-size: 0.875rem;
  color: #9ca3af !important;
  margin-top: 4px !important;
}

.upload-progress {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #667eea;
  min-width: 40px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .modal-footer {
    flex-direction: column;
  }
}

/* ===== 新的现代化样式 ===== */

/* 个人信息卡片 */
.profile-card {
  position: relative;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.1) 100%);
  border-radius: 24px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

/* 卡片装饰 */
.card-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FFD700, #4CAF50, #FFD700);  /* 金色到绿色渐变 */
  animation: decorationShimmer 3s infinite;
}

.decoration-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.2) 0%, transparent 70%);  /* 金黄色 */
  border-radius: 50%;
  transform: translate(50px, -50px);
}

.card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg,
    rgba(255, 193, 7, 0.3),     /* 金黄色 */
    rgba(76, 175, 80, 0.2),     /* 茶叶绿 */
    rgba(255, 193, 7, 0.3));
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.profile-card:hover {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.35) 0%,
    rgba(255, 255, 255, 0.25) 50%,
    rgba(255, 255, 255, 0.2) 100%);
  transform: translateY(-5px);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.profile-card:hover .card-glow {
  opacity: 1;
}

@keyframes decorationShimmer {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* 个人信息头部 */
.profile-header {
  display: flex;
  gap: 40px;
  padding: 40px;
  align-items: center;
  position: relative;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
    transparent 0%,
    rgba(212, 175, 55, 0.05) 50%,
    transparent 100%);
  pointer-events: none;
}

/* 头像区域 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.avatar-container {
  position: relative;
  cursor: pointer;
}

.avatar-frame {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #FFD700, #4CAF50);  /* 金色到绿色渐变 */
  padding: 4px;
  box-shadow:
    0 10px 30px rgba(255, 193, 7, 0.4),     /* 金色阴影 */
    0 0 0 3px rgba(200, 230, 201, 0.4),     /* 淡绿色边框 */
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.avatar-container:hover .avatar {
  transform: scale(1.05);
}

.avatar-ring {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: avatarRing 3s infinite;
}

.avatar-pulse {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 50%;
  animation: avatarPulse 2s infinite;
}

@keyframes avatarRing {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes avatarPulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.2); opacity: 0; }
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 600;
  text-align: center;
}

.overlay-content i {
  font-size: 1.5rem;
}

.overlay-content span {
  font-size: 0.9rem;
}

.avatar-actions {
  display: flex;
  justify-content: center;
}

.change-avatar-btn {
  position: relative;
  padding: 10px 20px;
  background: linear-gradient(135deg, #8B4513, #CD853F);  /* 普洱茶色到蘑菇色 */
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.change-avatar-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.4);  /* 普洱茶色阴影 */
}

/* 用户基本信息 */
.user-basic-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-name-section {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.user-name {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #d4af37, #f7e98e);
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.user-badge i {
  font-size: 0.9rem;
  animation: crownGlow 2s infinite alternate;
}

@keyframes crownGlow {
  0% { filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5)); }
  100% { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)); }
}

.user-contact {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6b7280;
  font-size: 1rem;
}

.contact-item i {
  color: #d4af37;
  width: 16px;
  text-align: center;
}

/* 用户统计 */
.user-stats {
  display: flex;
  gap: 30px;
  margin-top: 10px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: linear-gradient(135deg,
    rgba(212, 175, 55, 0.15) 0%,
    rgba(247, 233, 142, 0.1) 50%,
    rgba(255, 255, 255, 0.1) 100%);
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  min-width: 80px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.1);
}

.stat-item:hover {
  transform: translateY(-3px);
  background: linear-gradient(135deg,
    rgba(212, 175, 55, 0.25) 0%,
    rgba(247, 233, 142, 0.2) 50%,
    rgba(255, 255, 255, 0.15) 100%);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  border-color: rgba(212, 175, 55, 0.4);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 5px;
  text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
  animation: statGlow 3s ease-in-out infinite alternate;
}

.stat-label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@keyframes statGlow {
  0% { text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3); }
  100% { text-shadow: 0 2px 20px rgba(212, 175, 55, 0.6); }
}

/* 详细信息区域 */
.profile-details {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 0 40px 40px;
}

.detail-section {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.1) 100%);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
}

.detail-section:hover {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.15) 100%);
  transform: translateY(-2px);
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  position: relative;
}

.section-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #d4af37, #f7e98e);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.section-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.section-decoration {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.3), transparent);
  margin-left: 20px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.detail-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.1) 100%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.detail-item:hover {
  transform: translateX(5px);
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.2) 100%);
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.2);
}

.item-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(247, 233, 142, 0.1));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d4af37;
  font-size: 1rem;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.item-content label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-content span {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
}

.item-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(10px, -10px);
}

/* 状态徽章 */
.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #059669;
}

.status-badge.inactive {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: statusPulse 2s infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

/* 操作按钮 */
.profile-actions {
  padding: 0 40px 40px;
}

.actions-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  position: relative;
  padding: 15px 30px;
  border-radius: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  letter-spacing: 0.3px;
  overflow: hidden;
  min-width: 150px;
  justify-content: center;
}

.btn-animated {
  overflow: hidden;
}

.btn-icon {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.btn:hover .btn-icon {
  transform: scale(1.1);
}

.btn-text {
  font-weight: 600;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.btn-animated:hover .btn-shine {
  left: 100%;
}

.btn-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: btnRipple 0.6s linear;
  pointer-events: none;
}

@keyframes btnRipple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37, #f7e98e);
  color: white;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #b8941f, #d4af37);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
}

.btn-outline {
  background: transparent;
  color: #d4af37;
  border: 2px solid #d4af37;
  backdrop-filter: blur(10px);
}

.btn-outline:hover {
  background: #d4af37;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, #6b7280, #9ca3af);
  color: white;
  box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #4b5563, #6b7280);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(107, 114, 128, 0.4);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  position: relative;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.15) 100%);
  border-radius: 24px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #d4af37, #f7e98e, #d4af37);
  border-radius: 24px 24px 0 0;
}

.decoration-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(30px, -30px);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 30px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.modal-title-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.modal-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #d4af37, #f7e98e);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.modal-title-section h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  position: relative;
  width: 40px;
  height: 40px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.close-btn:hover {
  background: #ef4444;
  color: white;
  transform: scale(1.1);
}

.close-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: closeRipple 0.6s linear;
  pointer-events: none;
}

@keyframes closeRipple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* 模态框内容 */
.modal-body {
  padding: 20px 30px;
}

.current-avatar-preview {
  text-align: center;
  margin-bottom: 30px;
}

.preview-container {
  position: relative;
  display: inline-block;
  margin-bottom: 15px;
}

.preview-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.preview-frame {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border: 2px solid #d4af37;
  border-radius: 50%;
  animation: previewRing 3s infinite;
}

.preview-glow {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: previewGlow 2s infinite;
}

@keyframes previewRing {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes previewGlow {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.2); opacity: 0; }
}

.preview-label {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
}

.upload-section h4 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

.upload-section h4 i {
  color: #d4af37;
}

.file-upload-area {
  border: 2px dashed rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg,
    rgba(212, 175, 55, 0.08) 0%,
    rgba(247, 233, 142, 0.05) 50%,
    rgba(255, 255, 255, 0.1) 100%);
  backdrop-filter: blur(10px);
}

.file-upload-area:hover {
  border-color: #d4af37;
  background: linear-gradient(135deg,
    rgba(212, 175, 55, 0.15) 0%,
    rgba(247, 233, 142, 0.1) 50%,
    rgba(255, 255, 255, 0.15) 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.2);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.upload-icon {
  position: relative;
  font-size: 3rem;
  color: #d4af37;
}

.upload-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 2px solid #d4af37;
  border-radius: 50%;
  animation: uploadPulse 2s infinite;
}

@keyframes uploadPulse {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

.upload-text {
  text-align: center;
}

.upload-main {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 5px;
}

.upload-hint {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

/* 上传进度 */
.upload-progress {
  margin-top: 20px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.progress-bar {
  position: relative;
  flex: 1;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #f7e98e);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-glow {
  position: absolute;
  top: 0;
  width: 20px;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  transform: translateX(-10px);
  animation: progressGlow 1s infinite;
}

@keyframes progressGlow {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.progress-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #d4af37;
  min-width: 40px;
  text-align: right;
}

.progress-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #6b7280;
}

.progress-status i {
  color: #d4af37;
}

/* 模态框底部 */
.modal-footer {
  padding: 20px 30px 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }

  .user-stats {
    justify-content: center;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 0 16px;
  }

  .page-header {
    padding: 30px 0;
    margin-bottom: 40px;
  }

  .title-text {
    font-size: 2.5rem;
  }

  .profile-card {
    border-radius: 20px;
  }

  .profile-header {
    padding: 30px 20px;
  }

  .profile-details {
    padding: 0 20px 30px;
  }

  .profile-actions {
    padding: 0 20px 30px;
  }

  .actions-container {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }

  .user-stats {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .stat-item {
    width: 200px;
  }

  .detail-section {
    padding: 20px;
  }

  .section-header {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .section-decoration {
    display: none;
  }

  .detail-item {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .modal-header {
    padding: 20px 20px 15px;
  }

  .modal-body {
    padding: 15px 20px;
  }

  .modal-footer {
    padding: 15px 20px 20px;
    flex-direction: column;
  }

  .modal-footer .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .title-text {
    font-size: 2rem;
  }

  .avatar-frame {
    width: 120px;
    height: 120px;
  }

  .user-name {
    font-size: 1.5rem;
  }

  .user-name-section {
    flex-direction: column;
    gap: 10px;
  }

  .profile-header {
    padding: 20px 15px;
  }

  .profile-details {
    padding: 0 15px 20px;
  }

  .profile-actions {
    padding: 0 15px 20px;
  }

  .detail-section {
    padding: 15px;
  }
}
</style>

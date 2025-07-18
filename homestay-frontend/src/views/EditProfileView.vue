<template>
  <div class="edit-profile-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <i class="fas fa-seedling"></i>
          普洱蘑菇庄园
        </div>
        <div class="nav-menu">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/ai-rooms" class="nav-link">AI选房</router-link>
          <router-link to="/orders" class="nav-link">订单</router-link>
          <router-link to="/profile" class="nav-link">个人信息</router-link>
        </div>
        <div class="nav-buttons">
          <span class="user-welcome">欢迎，{{ auth.user?.name || auth.user?.email }}</span>
          <button @click="handleLogout" class="btn btn-outline">退出</button>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="edit-profile-main">
      <div class="edit-profile-container">
        <div class="page-header">
          <h1 class="page-title">编辑个人信息</h1>
          <p class="page-subtitle">更新您的个人资料</p>
        </div>

        <div class="edit-profile-content">
          <div class="edit-profile-card">
            <form @submit.prevent="saveProfile">
              <div class="form-section">
                <h3>基本信息</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label for="realName">真实姓名</label>
                    <input 
                      type="text" 
                      id="realName"
                      v-model="profileForm.realName" 
                      class="form-input"
                      placeholder="请输入真实姓名"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="phone">手机号</label>
                    <input 
                      type="tel" 
                      id="phone"
                      v-model="profileForm.phone" 
                      class="form-input"
                      placeholder="请输入手机号"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="gender">性别</label>
                    <select id="gender" v-model="profileForm.gender" class="form-select">
                      <option value="">请选择性别</option>
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label for="idCard">身份证号</label>
                    <input 
                      type="text" 
                      id="idCard"
                      v-model="profileForm.idCard" 
                      class="form-input"
                      placeholder="请输入身份证号"
                    >
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>头像设置</h3>
                <div class="avatar-section">
                  <div class="current-avatar">
                    <img :src="profileForm.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'" alt="当前头像" class="avatar-preview">
                  </div>
                  <div class="avatar-upload">
                    <div class="upload-options">
                      <div class="upload-method">
                        <h4>方式一：上传图片文件</h4>
                        <div class="file-upload-area" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
                          <input
                            ref="fileInput"
                            type="file"
                            accept="image/*"
                            @change="handleFileUpload"
                            style="display: none"
                          >
                          <div class="upload-content">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>点击上传或拖拽图片到此处</p>
                            <p class="upload-hint">支持 JPG、PNG 格式，建议尺寸 200x200px</p>
                          </div>
                        </div>
                        <div v-if="uploadProgress > 0" class="upload-progress">
                          <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
                          </div>
                          <span class="progress-text">{{ uploadProgress }}%</span>
                        </div>
                      </div>

                      <div class="upload-divider">或</div>

                      <div class="upload-method">
                        <h4>方式二：输入图片URL</h4>
                        <div class="form-group">
                          <input
                            type="url"
                            v-model="profileForm.avatar"
                            class="form-input"
                            placeholder="请输入头像图片URL"
                          >
                        </div>
                        <p class="help-text">请输入有效的图片URL地址</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <router-link to="/profile" class="btn btn-outline">取消</router-link>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="loading-spinner"></span>
                  {{ loading ? '保存中...' : '保存更改' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import request from '../utils/request'

const router = useRouter()
const auth = useAuthStore()

// 响应式数据
const loading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref<HTMLInputElement>()
const profileForm = reactive({
  realName: '',
  phone: '',
  gender: '',
  idCard: '',
  avatar: ''
})

// 方法
const fetchUserInfo = async () => {
  try {
    const response: any = await request.get('/h/user/getUserInfo')
    if (response.code === 200 || response.code === "200") {
      Object.assign(profileForm, response.data)
    } else {
      throw new Error(response.msg || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 使用auth store中的用户信息作为备用
    if (auth.user) {
      Object.assign(profileForm, {
        realName: auth.user.realName || '',
        phone: auth.user.phone || '',
        gender: auth.user.gender || '',
        idCard: auth.user.idCard || '',
        avatar: auth.user.avatar || ''
      })
    }
  }
}

const saveProfile = async () => {
  loading.value = true
  try {
    const response: any = await request.put('/h/user/updateInfo', profileForm)
    if (response.code === 200 || response.code === "200") {
      // 更新auth store中的用户信息
      if (auth.user) {
        Object.assign(auth.user, profileForm)
      }

      alert('个人信息更新成功！')
      router.push('/profile')
    } else {
      throw new Error(response.msg || '更新失败')
    }
  } catch (error) {
    console.error('更新个人信息失败:', error)
    alert('更新失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

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
      profileForm.avatar = response.data
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

// 生命周期
onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
/* 页面容器 */
.edit-profile-page {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  color: #d4af37;
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
  color: #d4af37;
  border-bottom-color: #d4af37;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 主要内容 */
.edit-profile-main {
  padding: 40px 0;
}

.edit-profile-container {
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

/* 编辑表单 */
.edit-profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 32px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-select {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

/* 头像设置 */
.avatar-section {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.current-avatar {
  flex-shrink: 0;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f3f4f6;
}

.avatar-upload {
  flex: 1;
}

.upload-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload-method h4 {
  margin: 0 0 12px 0;
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

.upload-divider {
  text-align: center;
  color: #9ca3af;
  font-weight: 500;
  position: relative;
  margin: 16px 0;
}

.upload-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
  z-index: 1;
}

.upload-divider::after {
  content: '或';
  background: white;
  padding: 0 12px;
  position: relative;
  z-index: 2;
}

.help-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
}

/* 表单操作 */
.form-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .avatar-section {
    flex-direction: column;
    text-align: center;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>

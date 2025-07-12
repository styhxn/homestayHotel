# 🤖 AI数字人部署完整指南

## 📋 快速开始

### 第一步：选择数字人平台并注册

#### 推荐方案：D-ID平台
1. **访问官网**：https://www.d-id.com/
2. **注册账号**：使用邮箱注册
3. **获取API密钥**：
   - 登录后台 → API Keys → Create New Key
   - 复制API密钥备用

#### 备选方案：HeyGen平台
1. **访问官网**：https://www.heygen.com/
2. **注册账号**：支持Google登录
3. **获取API密钥**：
   - 进入Dashboard → API → Generate Key

### 第二步：准备数字人形象

#### 方案A：使用照片（推荐新手）
```bash
# 照片要求：
- 分辨率：至少512x512像素
- 格式：JPG或PNG
- 内容：正面清晰人像
- 光线：充足均匀
- 背景：纯色背景更佳
```

#### 方案B：自定义3D模型（高级）
```bash
# 模型要求：
- 格式：FBX、OBJ、GLB
- 包含：面部骨骼绑定
- 纹理：高质量贴图
- 动画：基础表情动作
```

### 第三步：配置API密钥

1. **复制环境变量文件**：
```bash
cd hotel
cp .env.example .env.local
```

2. **编辑配置文件**：
```bash
# .env.local
VUE_APP_DID_API_KEY=your_actual_api_key_here
VUE_APP_OPENAI_API_KEY=your_openai_key_here
VUE_APP_AVATAR_IMAGE_URL=https://your-domain.com/avatar.jpg
```

### 第四步：安装依赖并启动

```bash
# 安装项目依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
# 打开浏览器访问：http://localhost:5173
```

## 🔧 详细配置说明

### API平台对比

| 平台 | 优势 | 劣势 | 价格 | 推荐度 |
|------|------|------|------|--------|
| **D-ID** | 技术成熟、效果最好 | 价格较高 | $0.1-0.3/次 | ⭐⭐⭐⭐⭐ |
| **HeyGen** | 性价比高、功能丰富 | 中文支持一般 | $0.2-0.5/次 | ⭐⭐⭐⭐ |
| **腾讯智影** | 国内服务、稳定 | 定制性有限 | ¥0.5-2/次 | ⭐⭐⭐ |

### 成本预估

#### 小型项目（100次/天）
- **D-ID**：$10-30/月
- **OpenAI**：$5-15/月
- **总计**：$15-45/月

#### 中型项目（1000次/天）
- **D-ID**：$100-300/月
- **OpenAI**：$50-150/月
- **总计**：$150-450/月

#### 大型项目（10000次/天）
- **D-ID**：$1000-3000/月
- **OpenAI**：$500-1500/月
- **总计**：$1500-4500/月

## 🚀 生产环境部署

### 方案一：Vercel部署（推荐）

1. **准备代码**：
```bash
# 构建生产版本
npm run build

# 推送到GitHub
git add .
git commit -m "Add digital human feature"
git push origin main
```

2. **Vercel配置**：
```bash
# 访问 https://vercel.com/
# 连接GitHub仓库
# 添加环境变量：
VUE_APP_DID_API_KEY=your_key
VUE_APP_OPENAI_API_KEY=your_key
VUE_APP_AVATAR_IMAGE_URL=your_avatar_url
```

### 方案二：自建服务器部署

1. **服务器要求**：
```bash
# 最低配置：
- CPU: 2核
- 内存: 4GB
- 存储: 20GB SSD
- 带宽: 5Mbps

# 推荐配置：
- CPU: 4核
- 内存: 8GB
- 存储: 50GB SSD
- 带宽: 10Mbps
```

2. **部署脚本**：
```bash
#!/bin/bash
# deploy.sh

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装Nginx
sudo apt-get install -y nginx

# 克隆项目
git clone https://github.com/your-username/mushroom-garden.git
cd mushroom-garden/hotel

# 安装依赖
npm install

# 构建项目
npm run build

# 配置Nginx
sudo cp nginx.conf /etc/nginx/sites-available/mushroom-garden
sudo ln -s /etc/nginx/sites-available/mushroom-garden /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

## 🔒 安全配置

### API密钥安全
```javascript
// ❌ 错误：直接在前端暴露API密钥
const apiKey = 'sk-1234567890abcdef'

// ✅ 正确：通过后端代理
const response = await fetch('/api/digital-human/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Hello' })
})
```

### 后端代理示例
```javascript
// backend/routes/digital-human.js
const express = require('express')
const router = express.Router()

router.post('/generate', async (req, res) => {
  try {
    const { text } = req.body
    
    // 在后端调用D-ID API
    const response = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.DID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        script: { type: 'text', input: text },
        source_url: process.env.AVATAR_URL
      })
    })
    
    const result = await response.json()
    res.json(result)
    
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
```

## 📊 性能优化

### 1. 缓存策略
```javascript
// 缓存常见回复的视频
const videoCache = new Map()

async function getCachedVideo(text) {
  const cacheKey = hashText(text)
  
  if (videoCache.has(cacheKey)) {
    return videoCache.get(cacheKey)
  }
  
  const videoUrl = await generateVideo(text)
  videoCache.set(cacheKey, videoUrl)
  
  return videoUrl
}
```

### 2. 预加载优化
```javascript
// 预加载常见问题的回复视频
const commonQuestions = [
  '庄园有哪些特色民宿？',
  '如何预订蘑菇小屋？',
  '庄园有什么体验活动？'
]

async function preloadCommonResponses() {
  for (const question of commonQuestions) {
    const response = await getAIResponse(question)
    await generateVideo(response) // 预生成视频
  }
}
```

### 3. CDN加速
```javascript
// 使用CDN分发视频内容
const CDN_BASE_URL = 'https://cdn.your-domain.com'

function getCDNUrl(videoPath) {
  return `${CDN_BASE_URL}/${videoPath}`
}
```

## 🐛 常见问题解决

### 1. API调用失败
```javascript
// 添加重试机制
async function apiCallWithRetry(apiCall, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

### 2. 视频生成超时
```javascript
// 设置合理的超时时间
const GENERATION_TIMEOUT = 60000 // 60秒

async function generateVideoWithTimeout(text) {
  return Promise.race([
    generateVideo(text),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('生成超时')), GENERATION_TIMEOUT)
    )
  ])
}
```

### 3. 浏览器兼容性
```javascript
// 检查浏览器支持
function checkBrowserSupport() {
  const support = {
    mediaRecorder: !!window.MediaRecorder,
    speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    speechSynthesis: !!window.speechSynthesis
  }
  
  return support
}
```

## 📈 监控和分析

### 1. 使用统计
```javascript
// 记录使用数据
function trackDigitalHumanUsage(action, data) {
  analytics.track('Digital Human Interaction', {
    action,
    timestamp: new Date(),
    ...data
  })
}
```

### 2. 错误监控
```javascript
// 错误上报
function reportError(error, context) {
  errorReporting.captureException(error, {
    tags: { component: 'digital-human' },
    extra: context
  })
}
```

## 🎯 下一步行动计划

### 立即行动（今天）
1. ✅ 注册D-ID账号并获取API密钥
2. ✅ 准备数字人形象照片
3. ✅ 配置环境变量
4. ✅ 本地测试基本功能

### 短期目标（1周内）
1. 🔄 完善AI对话逻辑
2. 🔄 优化用户界面体验
3. 🔄 添加错误处理机制
4. 🔄 进行功能测试

### 中期目标（1个月内）
1. 📋 部署到生产环境
2. 📋 添加数据分析
3. 📋 优化性能表现
4. 📋 收集用户反馈

### 长期目标（3个月内）
1. 🎯 扩展多语言支持
2. 🎯 增加个性化功能
3. 🎯 集成更多AI能力
4. 🎯 开发移动端应用

## 📞 技术支持

如果在部署过程中遇到问题，可以：

1. **查看文档**：参考各平台官方文档
2. **社区求助**：在GitHub Issues中提问
3. **专业咨询**：联系技术顾问获得帮助

---

**祝您部署成功！🎉**

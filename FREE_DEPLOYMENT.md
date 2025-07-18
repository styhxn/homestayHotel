# 🆓 免费云服务器部署指南

## 🎯 推荐方案对比

| 平台 | 前端 | 后端 | 数据库 | 优势 | 限制 |
|------|------|------|--------|------|------|
| **Railway** | ✅ | ✅ | ✅ | 一站式，支持Docker | 500h/月，1GB RAM |
| **Vercel + Railway** | ✅ | ✅ | ✅ | 前端CDN，后端稳定 | 后端有限制 |
| **Render + PlanetScale** | ✅ | ✅ | ✅ | 数据库专业 | 后端会休眠 |
| **Heroku** | ✅ | ✅ | ❌ | 老牌平台 | 需付费数据库 |

## 🚀 方案一：Railway 一站式部署（推荐）

### 步骤1：准备Railway配置

#### 1.1 注册Railway账号
- 访问 [railway.app](https://railway.app)
- 使用GitHub账号登录

#### 1.2 创建项目
```bash
# 在项目根目录创建railway.json（已创建）
# 配置文件会自动识别Docker部署
```

### 步骤2：部署后端服务

#### 2.1 创建后端服务
1. 在Railway控制台点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择您的 `homestayHotel` 仓库
4. Railway会自动检测到Dockerfile

#### 2.2 配置环境变量
在Railway控制台设置以下环境变量：
```env
# 数据库配置（Railway会自动提供）
DATABASE_URL=postgresql://user:pass@host:port/db
SPRING_PROFILES_ACTIVE=prod

# 应用配置
SERVER_PORT=8091
SPRING_DATASOURCE_URL=${DATABASE_URL}

# AI服务配置
AI_API_URL=http://4295a4ce.r28.cpolar.top/v1/chat/completions
AI_API_KEY=app-oaUwvb7k2zbC8Bi03EO977nN
CHAT_ASSIST_URL=http://4295a4ce.r28.cpolar.top/v1
CHAT_ASSIST_AUTH=Bearer app-oaUwvb7k2zbC8Bi03EO977nN
```

#### 2.3 添加数据库
1. 在项目中点击 "Add Service"
2. 选择 "Database" → "PostgreSQL"
3. Railway会自动创建数据库并提供连接信息

### 步骤3：部署前端服务

#### 3.1 创建前端项目
1. 创建新的Railway项目
2. 选择前端仓库或同一仓库的不同路径

#### 3.2 配置构建设置
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd homestay-frontend && npm ci && npm run build",
    "startCommand": "cd homestay-frontend && npm run preview"
  }
}
```

### 步骤4：配置域名和HTTPS
1. Railway自动提供 `.railway.app` 域名
2. 支持自定义域名（免费）
3. 自动SSL证书

## 🌐 方案二：Vercel + Railway 分离部署

### 前端部署到Vercel

#### 2.1 准备Vercel配置
创建 `vercel.json`：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "homestay-frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-railway-backend.railway.app/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/homestay-frontend/$1"
    }
  ]
}
```

#### 2.2 部署步骤
1. 访问 [vercel.com](https://vercel.com)
2. 连接GitHub仓库
3. 配置构建设置：
   - Build Command: `cd homestay-frontend && npm run build`
   - Output Directory: `homestay-frontend/dist`

### 后端部署到Railway
按照方案一的后端部署步骤

## 🗄️ 方案三：免费数据库选项

### PlanetScale（推荐）
- **优势**: 10GB免费，MySQL兼容
- **注册**: [planetscale.com](https://planetscale.com)
- **配置**: 获取连接字符串

### Supabase
- **优势**: PostgreSQL，500MB免费
- **注册**: [supabase.com](https://supabase.com)
- **配置**: 获取数据库URL

### Railway PostgreSQL
- **优势**: 集成简单，5GB免费
- **配置**: 自动提供连接信息

## 📋 快速部署检查清单

### ✅ 部署前准备
- [ ] GitHub仓库已推送最新代码
- [ ] 选择部署平台（推荐Railway）
- [ ] 准备环境变量配置

### ✅ Railway部署步骤
- [ ] 注册Railway账号
- [ ] 创建后端项目
- [ ] 添加PostgreSQL数据库
- [ ] 配置环境变量
- [ ] 等待自动部署完成
- [ ] 创建前端项目（可选）

### ✅ 部署后验证
- [ ] 访问后端健康检查: `https://your-app.railway.app/actuator/health`
- [ ] 测试API接口
- [ ] 验证数据库连接
- [ ] 测试前端功能

## 💡 免费方案优化建议

### 1. 资源优化
```yaml
# 减少内存使用
JAVA_OPTS: "-Xms256m -Xmx512m"

# 启用数据库连接池
spring.datasource.hikari.maximum-pool-size: 5
```

### 2. 缓存策略
```yaml
# 启用应用缓存
spring.cache.type: simple

# 前端资源缓存
# 在nginx.conf中配置静态资源缓存
```

### 3. 监控设置
```yaml
# 简化日志输出
logging.level.root: WARN
logging.level.com.homestay: INFO
```

## 🔧 故障排除

### 常见问题

#### 1. Railway部署失败
```bash
# 检查Dockerfile路径
# 确保环境变量正确设置
# 查看部署日志
```

#### 2. 数据库连接失败
```bash
# 检查DATABASE_URL格式
# 确认数据库服务状态
# 验证网络连接
```

#### 3. 内存不足
```bash
# 调整JVM参数
# 优化应用配置
# 考虑升级套餐
```

## 📞 技术支持

### Railway支持
- 文档: [docs.railway.app](https://docs.railway.app)
- 社区: [Discord](https://discord.gg/railway)

### Vercel支持
- 文档: [vercel.com/docs](https://vercel.com/docs)
- 社区: [GitHub Discussions](https://github.com/vercel/vercel/discussions)

---

**选择Railway一站式部署，5分钟即可上线您的民宿系统！** 🚀

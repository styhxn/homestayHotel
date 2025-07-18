# 🏨 智能民宿管理系统

> 一个现代化的智能民宿管理平台，集成AI助手、VR全景、智能推荐等功能

## 🚀 项目概述

这是一个基于Vue.js + Spring Boot的全栈民宿管理系统，提供智能房间推荐、对话式预订、VR全景展示、采茶活动推荐等创新功能。

## ✨ 核心特性

### 🤖 智能AI助手
- **智能房间推荐** - 根据朝向、窗户、安静、亲子等需求智能匹配
- **对话式预订** - 自然语言交互完成完整预订流程
- **用户画像识别** - 自动识别亲子家庭、文化体验者等用户类型
- **采茶活动推荐** - 结合入住时间推荐匹配的体验活动场次

### 🏠 房间管理
- **VR全景展示** - 一键跳转沉浸式房间体验
- **实时库存管理** - 动态房间状态和可用性检查
- **多维度筛选** - 价格、楼层、房型、特色等筛选

### 📱 用户体验
- **响应式设计** - 完美适配桌面端和移动端
- **实时AI聊天** - Dify集成 + 本地AI智能降级
- **订单详情面板** - 完整的预订信息和套餐推荐

## 🛠️ 技术栈

| 类型 | 技术 | 版本 |
|------|------|------|
| **前端** | Vue.js | 3.x |
| | TypeScript | 5.x |
| | Vite | 4.x |
| | Element Plus | 2.x |
| **后端** | Spring Boot | 3.x |
| | MyBatis Plus | 3.x |
| | MySQL | 8.0+ |
| | Sa-Token | 1.x |
| **AI集成** | Dify | API |
| | 本地智能AI | 自研 |

## 📁 项目结构

```
homestayHotelPublic/
├── 📁 hotel/                    # Vue.js前端项目
│   ├── 📁 src/
│   │   ├── 📁 components/       # 可复用组件
│   │   │   ├── AIRecommendationPanel.vue    # AI推荐面板
│   │   │   ├── OrderDetailsPanel.vue        # 订单详情面板
│   │   │   └── DifyChatWidgetHybrid.vue     # AI聊天组件
│   │   ├── 📁 views/            # 页面组件
│   │   │   ├── HomeView.vue     # 首页
│   │   │   └── user/AIRoomSelectionView.vue # AI选房页面
│   │   ├── 📁 utils/            # 工具类
│   │   │   └── intelligentAI.ts # 智能AI系统
│   │   └── 📁 assets/           # 静态资源
├── 📁 homestayback/             # Spring Boot后端项目
│   ├── 📁 src/main/java/        # Java源码
│   │   └── 📁 com/homestay/     # 主要业务代码
│   ├── 📁 src/main/resources/   # 配置文件
│   ├── Dockerfile               # Docker配置
│   └── pom.xml                  # Maven依赖
└── README.md                    # 项目文档
```

## 🚀 快速开始

### 环境要求
- **Node.js** 16.0+
- **Java** 17+
- **MySQL** 8.0+
- **Git** 2.0+

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/styhxn/homestayHotelPublic.git
   cd homestayHotelPublic
   ```

2. **启动后端服务**
   ```bash
   cd homestayback
   ./mvnw spring-boot:run
   ```
   后端服务将在 http://localhost:8091 启动

3. **启动前端服务**
   ```bash
   cd hotel
   npm install
   npm run dev
   ```
   前端服务将在 http://localhost:5173 启动

4. **访问应用**
   - 🌐 前端应用：http://localhost:5173
   - 🔧 后端API：http://localhost:8091
   - 📚 API文档：http://localhost:8091/doc.html

## 🎯 功能演示

### AI智能推荐流程
```
用户输入："请帮我推荐朝南，有窗户，安静的亲子房"
    ↓
AI分析意图 → 筛选房间 → 生成推荐 → 显示VR链接
    ↓
用户选择："帮我预订202号房"
    ↓
AI引导预订 → 日期确认 → 订单生成 → 显示详情面板
```

### 采茶活动推荐
```
用户提及："想体验采茶活动"
    ↓
AI结合入住时间 → 筛选可用活动 → 推荐匹配场次
    ↓
用户选择活动 → 确认报名 → 生成活动订单
```

## 🌐 部署指南

### 云服务部署（推荐）

#### 前端部署到Vercel
1. 连接GitHub仓库到Vercel
2. 选择`hotel`目录作为根目录
3. 设置构建命令：`npm run build`
4. 设置环境变量：`VITE_API_BASE_URL`

#### 后端部署到Railway
1. 连接GitHub仓库到Railway
2. 选择`homestayback`目录
3. 添加PostgreSQL数据库
4. 设置环境变量：`DATABASE_URL`, `DB_USERNAME`, `DB_PASSWORD`

## 📝 更新日志

### v1.0.0 (2025-07-18)
- ✨ 智能AI房间推荐系统
- ✨ 对话式预订流程
- ✨ VR全景房间展示
- ✨ 采茶活动推荐
- ✨ 用户画像识别
- ✨ 订单详情管理
- 🔧 Dify AI集成
- 🔧 本地AI降级机制

## 📄 许可证

本项目采用 MIT License 开源协议

## 📞 联系方式

- **项目维护者**：styhxn
- **GitHub**：https://github.com/styhxn
- **问题反馈**：[Issues](https://github.com/styhxn/homestayHotelPublic/issues)

---

⭐ **如果这个项目对您有帮助，请给我们一个星标支持！**

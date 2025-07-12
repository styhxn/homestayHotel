# Git 设置和提交命令

## 1. 安装 Git

### 方法一：使用 winget（推荐）
```powershell
winget install Git.Git
```

### 方法二：手动下载安装
1. 访问 https://git-scm.com/download/win
2. 下载并安装 Git for Windows

### 方法三：使用 Chocolatey
```powershell
choco install git
```

## 2. 安装完成后重启终端，然后执行以下命令

### 配置 Git 用户信息（首次使用）
```bash
git config --global user.name "您的姓名"
git config --global user.email "您的邮箱@example.com"
```

### 初始化 Git 仓库
```bash
# 进入项目目录
cd "D:\homestayHotelPublic-master"

# 初始化 Git 仓库
git init

# 添加所有文件到暂存区
git add .

# 提交代码
git commit -m "feat: 添加房间选择功能和品牌统一

主要更新：
- 创建RoomsView.vue房间列表页面，支持筛选和排序
- 添加RoomCard.vue可复用房间卡片组件  
- 实现多维度房间筛选（房型、价格、人数、设施、状态）
- 支持网格和列表两种视图模式切换
- 更新导航菜单，区分传统选房和AI选房
- 统一品牌名称为'普洱蘑菇庄园民宿'
- 更新所有'智能选房'文字为'AI选房'
- 完善响应式设计，支持移动端

技术实现：
- Vue 3 Composition API
- TypeScript类型支持
- 响应式CSS设计
- 组件化架构

文件变更：
- 新增: hotel/src/views/user/RoomsView.vue
- 新增: hotel/src/components/RoomCard.vue
- 修改: hotel/src/router/index.ts
- 修改: hotel/src/components/AppNavbar.vue
- 修改: hotel/src/components/GlobalAIAssistant.vue
- 修改: hotel/src/views/user/AIRoomSelectionView.vue
- 修改: hotel/src/services/TeaCultureAIService.ts
- 修改: hotel/src/services/ProductAIService.ts
- 修改: homestayback/src/main/java/com/homestay/homestay/service/impl/ChatAssistServiceImpl.java"
```

## 3. 可选：创建远程仓库并推送

### 如果要推送到 GitHub
```bash
# 添加远程仓库（替换为您的仓库地址）
git remote add origin https://github.com/您的用户名/您的仓库名.git

# 推送到远程仓库
git push -u origin main
```

### 如果要推送到 GitLab
```bash
# 添加远程仓库（替换为您的仓库地址）
git remote add origin https://gitlab.com/您的用户名/您的仓库名.git

# 推送到远程仓库
git push -u origin main
```

## 4. 日常使用命令

### 查看状态
```bash
git status
```

### 添加文件
```bash
git add .                # 添加所有文件
git add 文件名            # 添加特定文件
```

### 提交更改
```bash
git commit -m "提交信息"
```

### 查看提交历史
```bash
git log --oneline
```

### 推送到远程仓库
```bash
git push
```

### 拉取远程更新
```bash
git pull
```

## 5. 分支管理

### 创建新分支
```bash
git checkout -b 新分支名
```

### 切换分支
```bash
git checkout 分支名
```

### 合并分支
```bash
git checkout main
git merge 分支名
```

## 注意事项

1. 确保 .gitignore 文件已正确配置，避免提交不必要的文件
2. 提交信息要清晰明了，遵循约定式提交规范
3. 定期推送到远程仓库进行备份
4. 在团队协作时，及时拉取最新代码避免冲突

## 当前项目状态

✅ 已创建 .gitignore 文件
✅ 项目代码已准备就绪
⏳ 等待 Git 安装完成
⏳ 等待执行初始化和提交命令

## 项目文件结构

```
homestayHotelPublic-master/
├── hotel/                          # 前端项目
│   ├── src/
│   │   ├── views/user/
│   │   │   ├── RoomsView.vue       # 新增：房间列表页面
│   │   │   └── AIRoomSelectionView.vue
│   │   ├── components/
│   │   │   ├── RoomCard.vue        # 新增：房间卡片组件
│   │   │   ├── AppNavbar.vue       # 修改：导航菜单
│   │   │   └── GlobalAIAssistant.vue
│   │   └── router/
│   │       └── index.ts            # 修改：路由配置
├── homestayback/                   # 后端项目
│   └── src/main/java/com/homestay/homestay/
└── .gitignore                      # Git忽略文件
```

@echo off
echo ========================================
echo Git 仓库初始化和代码提交脚本
echo ========================================
echo.

REM 检查Git是否已安装
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Git 未安装或不在 PATH 中
    echo.
    echo 请先安装 Git：
    echo 1. 运行: winget install Git.Git
    echo 2. 或访问: https://git-scm.com/download/win
    echo 3. 安装完成后重启终端并重新运行此脚本
    echo.
    pause
    exit /b 1
)

echo [信息] Git 已安装，版本信息：
git --version
echo.

REM 检查是否已经是Git仓库
if exist .git (
    echo [信息] 当前目录已经是 Git 仓库
    echo.
) else (
    echo [步骤1] 初始化 Git 仓库...
    git init
    if %errorlevel% neq 0 (
        echo [错误] Git 初始化失败
        pause
        exit /b 1
    )
    echo [成功] Git 仓库初始化完成
    echo.
)

REM 检查用户配置
echo [步骤2] 检查 Git 用户配置...
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] 未配置 Git 用户名
    set /p username="请输入您的用户名: "
    git config --global user.name "%username%"
)

git config user.email >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] 未配置 Git 邮箱
    set /p email="请输入您的邮箱: "
    git config --global user.email "%email%"
)

echo [信息] 当前 Git 配置：
echo 用户名: 
git config user.name
echo 邮箱: 
git config user.email
echo.

REM 添加文件到暂存区
echo [步骤3] 添加文件到暂存区...
git add .
if %errorlevel% neq 0 (
    echo [错误] 添加文件失败
    pause
    exit /b 1
)
echo [成功] 文件已添加到暂存区
echo.

REM 显示将要提交的文件
echo [信息] 将要提交的文件：
git status --short
echo.

REM 提交代码
echo [步骤4] 提交代码...
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
- 组件化架构"

if %errorlevel% neq 0 (
    echo [错误] 代码提交失败
    pause
    exit /b 1
)

echo [成功] 代码提交完成！
echo.

REM 显示提交历史
echo [信息] 最近的提交：
git log --oneline -5
echo.

echo ========================================
echo Git 仓库设置完成！
echo ========================================
echo.
echo 下一步您可以：
echo 1. 创建远程仓库（GitHub/GitLab等）
echo 2. 添加远程仓库：git remote add origin [仓库地址]
echo 3. 推送代码：git push -u origin main
echo.
echo 详细说明请查看 git-setup-commands.md 文件
echo.
pause

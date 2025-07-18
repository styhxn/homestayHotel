# 普洱蘑菇庄园民宿系统部署脚本 (PowerShell版本)
# 作者: Augment Agent
# 版本: 1.0

param(
    [string]$Command = "deploy"
)

# 日志函数
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# 检查依赖
function Test-Dependencies {
    Write-Info "检查系统依赖..."
    
    if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker 未安装，请先安装 Docker Desktop"
        exit 1
    }
    
    if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    }
    
    Write-Success "依赖检查完成"
}

# 创建环境配置
function Initialize-Environment {
    Write-Info "设置环境配置..."
    
    if (!(Test-Path .env)) {
        Write-Warning ".env 文件不存在，从 .env.example 复制"
        Copy-Item .env.example .env
        Write-Warning "请编辑 .env 文件配置您的环境变量"
        $editEnv = Read-Host "是否现在编辑 .env 文件? (y/n)"
        if ($editEnv -eq "y") {
            notepad .env
        }
    }
    
    Write-Success "环境配置完成"
}

# 构建镜像
function Build-Images {
    Write-Info "构建 Docker 镜像..."
    
    # 构建后端镜像
    Write-Info "构建后端镜像..."
    docker-compose build homestay-backend
    
    # 构建前端镜像
    Write-Info "构建前端镜像..."
    docker-compose build homestay-frontend
    
    Write-Success "镜像构建完成"
}

# 启动服务
function Start-Services {
    Write-Info "启动服务..."
    
    # 启动数据库和Redis
    Write-Info "启动数据库和缓存服务..."
    docker-compose up -d mysql redis
    
    # 等待数据库启动
    Write-Info "等待数据库启动..."
    Start-Sleep -Seconds 30
    
    # 启动后端服务
    Write-Info "启动后端服务..."
    docker-compose up -d homestay-backend
    
    # 等待后端启动
    Write-Info "等待后端服务启动..."
    Start-Sleep -Seconds 20
    
    # 启动前端服务
    Write-Info "启动前端服务..."
    docker-compose up -d homestay-frontend
    
    Write-Success "所有服务启动完成"
}

# 检查服务状态
function Test-Services {
    Write-Info "检查服务状态..."
    
    # 检查容器状态
    docker-compose ps
    
    # 检查服务健康状态
    Write-Info "检查服务健康状态..."
    
    # 检查后端服务
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8091/actuator/health" -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "后端服务运行正常"
        }
    }
    catch {
        Write-Warning "后端服务健康检查失败，请检查日志"
    }
    
    # 检查前端服务
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/health" -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "前端服务运行正常"
        }
    }
    catch {
        Write-Warning "前端服务健康检查失败，请检查日志"
    }
}

# 显示访问信息
function Show-AccessInfo {
    Write-Success "🎉 部署完成！"
    Write-Host ""
    Write-Host "📋 访问信息:" -ForegroundColor Cyan
    Write-Host "   🌐 前端地址: http://localhost" -ForegroundColor White
    Write-Host "   🔧 后端API: http://localhost:8091" -ForegroundColor White
    Write-Host "   👤 管理员登录: http://localhost/admin/login" -ForegroundColor White
    Write-Host "   📊 健康检查: http://localhost:8091/actuator/health" -ForegroundColor White
    Write-Host ""
    Write-Host "🔑 默认账号:" -ForegroundColor Cyan
    Write-Host "   用户名: root" -ForegroundColor White
    Write-Host "   密码: root123" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 常用命令:" -ForegroundColor Cyan
    Write-Host "   查看日志: docker-compose logs -f [service-name]" -ForegroundColor White
    Write-Host "   重启服务: docker-compose restart [service-name]" -ForegroundColor White
    Write-Host "   停止服务: docker-compose down" -ForegroundColor White
    Write-Host "   更新服务: .\deploy.ps1 update" -ForegroundColor White
    Write-Host ""
}

# 更新服务
function Update-Services {
    Write-Info "更新服务..."
    
    # 拉取最新代码
    Write-Info "拉取最新代码..."
    git pull
    
    # 重新构建镜像
    Build-Images
    
    # 重启服务
    Write-Info "重启服务..."
    docker-compose down
    Start-Services
    
    Write-Success "服务更新完成"
}

# 清理资源
function Remove-Resources {
    Write-Info "清理资源..."
    
    $confirm = Read-Host "是否要删除所有容器和数据? (y/n)"
    if ($confirm -eq "y") {
        docker-compose down -v --remove-orphans
        docker system prune -f
        Write-Success "清理完成"
    }
    else {
        Write-Info "取消清理"
    }
}

# 主函数
function Main {
    Write-Host "🚀 普洱蘑菇庄园民宿系统部署脚本" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    
    switch ($Command) {
        "deploy" {
            Test-Dependencies
            Initialize-Environment
            Build-Images
            Start-Services
            Start-Sleep -Seconds 10
            Test-Services
            Show-AccessInfo
        }
        "update" {
            Update-Services
            Test-Services
            Show-AccessInfo
        }
        "status" {
            Test-Services
        }
        "cleanup" {
            Remove-Resources
        }
        "help" {
            Write-Host "用法: .\deploy.ps1 [command]" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "命令:" -ForegroundColor Cyan
            Write-Host "  deploy   - 部署系统 (默认)" -ForegroundColor White
            Write-Host "  update   - 更新系统" -ForegroundColor White
            Write-Host "  status   - 检查状态" -ForegroundColor White
            Write-Host "  cleanup  - 清理资源" -ForegroundColor White
            Write-Host "  help     - 显示帮助" -ForegroundColor White
        }
        default {
            Write-Error "未知命令: $Command"
            Write-Host "使用 '.\deploy.ps1 help' 查看帮助" -ForegroundColor Yellow
            exit 1
        }
    }
}

# 执行主函数
Main

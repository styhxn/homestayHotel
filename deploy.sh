#!/bin/bash

# 普洱蘑菇庄园民宿系统部署脚本
# 作者: Augment Agent
# 版本: 1.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    log_info "检查系统依赖..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    
    log_success "依赖检查完成"
}

# 创建环境配置
setup_environment() {
    log_info "设置环境配置..."
    
    if [ ! -f .env ]; then
        log_warning ".env 文件不存在，从 .env.example 复制"
        cp .env.example .env
        log_warning "请编辑 .env 文件配置您的环境变量"
        read -p "是否现在编辑 .env 文件? (y/n): " edit_env
        if [ "$edit_env" = "y" ]; then
            ${EDITOR:-nano} .env
        fi
    fi
    
    log_success "环境配置完成"
}

# 构建镜像
build_images() {
    log_info "构建 Docker 镜像..."
    
    # 构建后端镜像
    log_info "构建后端镜像..."
    docker-compose build homestay-backend
    
    # 构建前端镜像
    log_info "构建前端镜像..."
    docker-compose build homestay-frontend
    
    log_success "镜像构建完成"
}

# 启动服务
start_services() {
    log_info "启动服务..."
    
    # 启动数据库和Redis
    log_info "启动数据库和缓存服务..."
    docker-compose up -d mysql redis
    
    # 等待数据库启动
    log_info "等待数据库启动..."
    sleep 30
    
    # 启动后端服务
    log_info "启动后端服务..."
    docker-compose up -d homestay-backend
    
    # 等待后端启动
    log_info "等待后端服务启动..."
    sleep 20
    
    # 启动前端服务
    log_info "启动前端服务..."
    docker-compose up -d homestay-frontend
    
    log_success "所有服务启动完成"
}

# 检查服务状态
check_services() {
    log_info "检查服务状态..."
    
    # 检查容器状态
    docker-compose ps
    
    # 检查服务健康状态
    log_info "检查服务健康状态..."
    
    # 检查数据库
    if docker-compose exec mysql mysqladmin ping -h localhost --silent; then
        log_success "MySQL 数据库运行正常"
    else
        log_error "MySQL 数据库连接失败"
    fi
    
    # 检查Redis
    if docker-compose exec redis redis-cli ping | grep -q PONG; then
        log_success "Redis 缓存运行正常"
    else
        log_error "Redis 缓存连接失败"
    fi
    
    # 检查后端服务
    if curl -f http://localhost:8091/actuator/health &> /dev/null; then
        log_success "后端服务运行正常"
    else
        log_warning "后端服务健康检查失败，请检查日志"
    fi
    
    # 检查前端服务
    if curl -f http://localhost/health &> /dev/null; then
        log_success "前端服务运行正常"
    else
        log_warning "前端服务健康检查失败，请检查日志"
    fi
}

# 显示访问信息
show_access_info() {
    log_success "🎉 部署完成！"
    echo ""
    echo "📋 访问信息:"
    echo "   🌐 前端地址: http://localhost"
    echo "   🔧 后端API: http://localhost:8091"
    echo "   👤 管理员登录: http://localhost/admin/login"
    echo "   📊 健康检查: http://localhost:8091/actuator/health"
    echo ""
    echo "🔑 默认账号:"
    echo "   用户名: root"
    echo "   密码: root123"
    echo ""
    echo "📝 常用命令:"
    echo "   查看日志: docker-compose logs -f [service-name]"
    echo "   重启服务: docker-compose restart [service-name]"
    echo "   停止服务: docker-compose down"
    echo "   更新服务: ./deploy.sh update"
    echo ""
}

# 更新服务
update_services() {
    log_info "更新服务..."
    
    # 拉取最新代码
    log_info "拉取最新代码..."
    git pull
    
    # 重新构建镜像
    build_images
    
    # 重启服务
    log_info "重启服务..."
    docker-compose down
    start_services
    
    log_success "服务更新完成"
}

# 清理资源
cleanup() {
    log_info "清理资源..."
    
    read -p "是否要删除所有容器和数据? (y/n): " confirm
    if [ "$confirm" = "y" ]; then
        docker-compose down -v --remove-orphans
        docker system prune -f
        log_success "清理完成"
    else
        log_info "取消清理"
    fi
}

# 主函数
main() {
    echo "🚀 普洱蘑菇庄园民宿系统部署脚本"
    echo "=================================="
    
    case "${1:-deploy}" in
        "deploy")
            check_dependencies
            setup_environment
            build_images
            start_services
            sleep 10
            check_services
            show_access_info
            ;;
        "update")
            update_services
            check_services
            show_access_info
            ;;
        "status")
            check_services
            ;;
        "cleanup")
            cleanup
            ;;
        "help")
            echo "用法: $0 [command]"
            echo ""
            echo "命令:"
            echo "  deploy   - 部署系统 (默认)"
            echo "  update   - 更新系统"
            echo "  status   - 检查状态"
            echo "  cleanup  - 清理资源"
            echo "  help     - 显示帮助"
            ;;
        *)
            log_error "未知命令: $1"
            echo "使用 '$0 help' 查看帮助"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"

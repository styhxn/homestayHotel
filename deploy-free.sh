#!/bin/bash

# 免费云服务器部署脚本
# 支持Railway、Vercel等免费平台

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

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

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# 显示欢迎信息
show_welcome() {
    echo -e "${GREEN}"
    echo "🆓 普洱蘑菇庄园民宿系统 - 免费部署向导"
    echo "============================================"
    echo -e "${NC}"
    echo "支持的免费平台："
    echo "1. 🚀 Railway (推荐) - 一站式部署"
    echo "2. 🌐 Vercel + Railway - 前后端分离"
    echo "3. 🔧 Render + PlanetScale - 专业数据库"
    echo ""
}

# 选择部署平台
choose_platform() {
    echo "请选择部署平台："
    echo "1) Railway (推荐 - 简单易用)"
    echo "2) Vercel + Railway (高性能)"
    echo "3) Render + PlanetScale (专业级)"
    echo "4) 查看详细对比"
    echo ""
    read -p "请输入选择 (1-4): " platform_choice
    
    case $platform_choice in
        1)
            deploy_railway
            ;;
        2)
            deploy_vercel_railway
            ;;
        3)
            deploy_render_planetscale
            ;;
        4)
            show_platform_comparison
            choose_platform
            ;;
        *)
            log_error "无效选择，请重新选择"
            choose_platform
            ;;
    esac
}

# 显示平台对比
show_platform_comparison() {
    echo ""
    echo -e "${BLUE}📊 平台详细对比${NC}"
    echo "┌─────────────────┬─────────────┬─────────────┬─────────────┐"
    echo "│ 平台            │ Railway     │ Vercel+Rail │ Render+PS   │"
    echo "├─────────────────┼─────────────┼─────────────┼─────────────┤"
    echo "│ 部署难度        │ ⭐⭐⭐⭐⭐    │ ⭐⭐⭐⭐      │ ⭐⭐⭐        │"
    echo "│ 性能            │ ⭐⭐⭐⭐      │ ⭐⭐⭐⭐⭐    │ ⭐⭐⭐⭐      │"
    echo "│ 免费额度        │ 500h/月     │ 无限制      │ 750h/月     │"
    echo "│ 数据库          │ 5GB PG      │ 5GB PG      │ 10GB MySQL  │"
    echo "│ 自定义域名      │ ✅          │ ✅          │ ✅          │"
    echo "│ HTTPS           │ 自动        │ 自动        │ 自动        │"
    echo "│ 休眠策略        │ 无          │ 无          │ 30分钟      │"
    echo "└─────────────────┴─────────────┴─────────────┴─────────────┘"
    echo ""
    echo -e "${GREEN}推荐选择：${NC}"
    echo "• 新手用户：选择 Railway (选项1)"
    echo "• 追求性能：选择 Vercel + Railway (选项2)"
    echo "• 需要MySQL：选择 Render + PlanetScale (选项3)"
    echo ""
}

# Railway部署
deploy_railway() {
    log_step "开始Railway部署流程"
    
    # 检查Git状态
    if ! git status &>/dev/null; then
        log_error "当前目录不是Git仓库"
        exit 1
    fi
    
    # 确保代码已推送
    log_info "检查Git状态..."
    if [[ $(git status --porcelain) ]]; then
        log_warning "检测到未提交的更改，正在提交..."
        git add .
        git commit -m "准备Railway部署"
        git push
    fi
    
    log_success "✅ Railway部署准备完成"
    echo ""
    echo -e "${GREEN}🚀 Railway部署步骤：${NC}"
    echo "1. 访问 https://railway.app"
    echo "2. 使用GitHub账号登录"
    echo "3. 点击 'New Project'"
    echo "4. 选择 'Deploy from GitHub repo'"
    echo "5. 选择您的仓库: $(git remote get-url origin)"
    echo "6. Railway会自动检测到配置文件并开始部署"
    echo ""
    echo -e "${BLUE}📋 需要配置的环境变量：${NC}"
    echo "SPRING_PROFILES_ACTIVE=prod"
    echo "AI_API_URL=http://4295a4ce.r28.cpolar.top/v1/chat/completions"
    echo "AI_API_KEY=app-oaUwvb7k2zbC8Bi03EO977nN"
    echo ""
    echo -e "${YELLOW}💡 提示：${NC}Railway会自动提供数据库连接信息"
    
    # 询问是否打开Railway
    read -p "是否现在打开Railway网站? (y/n): " open_railway
    if [[ $open_railway == "y" ]]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "https://railway.app"
        elif command -v open &> /dev/null; then
            open "https://railway.app"
        else
            log_info "请手动访问: https://railway.app"
        fi
    fi
}

# Vercel + Railway部署
deploy_vercel_railway() {
    log_step "开始Vercel + Railway分离部署"
    
    log_info "这种方案将前端部署到Vercel，后端部署到Railway"
    echo ""
    echo -e "${GREEN}🎯 部署优势：${NC}"
    echo "• 前端享受全球CDN加速"
    echo "• 后端稳定运行在Railway"
    echo "• 最佳性能表现"
    echo ""
    
    # 后端部署
    log_step "1. 后端部署到Railway"
    echo "按照Railway部署步骤部署后端服务"
    deploy_railway
    
    echo ""
    log_step "2. 前端部署到Vercel"
    echo -e "${GREEN}🌐 Vercel部署步骤：${NC}"
    echo "1. 访问 https://vercel.com"
    echo "2. 使用GitHub账号登录"
    echo "3. 点击 'New Project'"
    echo "4. 选择您的仓库"
    echo "5. 配置构建设置："
    echo "   - Build Command: cd homestay-frontend && npm run build"
    echo "   - Output Directory: homestay-frontend/dist"
    echo "6. 部署完成后，更新vercel.json中的后端地址"
    
    read -p "是否现在打开Vercel网站? (y/n): " open_vercel
    if [[ $open_vercel == "y" ]]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "https://vercel.com"
        elif command -v open &> /dev/null; then
            open "https://vercel.com"
        else
            log_info "请手动访问: https://vercel.com"
        fi
    fi
}

# Render + PlanetScale部署
deploy_render_planetscale() {
    log_step "开始Render + PlanetScale部署"
    
    echo -e "${GREEN}🗄️ 这种方案特点：${NC}"
    echo "• 专业级MySQL数据库"
    echo "• 10GB免费存储空间"
    echo "• 适合数据密集型应用"
    echo ""
    
    log_step "1. 数据库部署到PlanetScale"
    echo -e "${GREEN}📊 PlanetScale设置：${NC}"
    echo "1. 访问 https://planetscale.com"
    echo "2. 注册账号并创建数据库"
    echo "3. 获取连接字符串"
    echo "4. 导入数据库结构"
    
    echo ""
    log_step "2. 应用部署到Render"
    echo -e "${GREEN}🚀 Render部署：${NC}"
    echo "1. 访问 https://render.com"
    echo "2. 连接GitHub仓库"
    echo "3. 创建Web Service"
    echo "4. 配置环境变量（包括PlanetScale连接信息）"
    
    log_warning "注意：Render免费版会在30分钟无访问后休眠"
}

# 部署后验证
verify_deployment() {
    log_step "部署验证"
    
    echo "请提供您的部署URL进行验证："
    read -p "后端URL (例: https://your-app.railway.app): " backend_url
    
    if [[ -n $backend_url ]]; then
        log_info "正在验证后端服务..."
        if curl -f "$backend_url/actuator/health" &>/dev/null; then
            log_success "✅ 后端服务运行正常"
        else
            log_warning "⚠️ 后端服务可能还在启动中，请稍后再试"
        fi
    fi
    
    read -p "前端URL (例: https://your-app.vercel.app): " frontend_url
    if [[ -n $frontend_url ]]; then
        log_info "正在验证前端服务..."
        if curl -f "$frontend_url" &>/dev/null; then
            log_success "✅ 前端服务运行正常"
        else
            log_warning "⚠️ 前端服务可能还在部署中"
        fi
    fi
}

# 显示部署完成信息
show_completion() {
    log_success "🎉 免费部署配置完成！"
    echo ""
    echo -e "${GREEN}📋 接下来的步骤：${NC}"
    echo "1. 按照提示完成平台部署"
    echo "2. 配置环境变量"
    echo "3. 等待自动部署完成"
    echo "4. 测试应用功能"
    echo ""
    echo -e "${BLUE}📚 有用的资源：${NC}"
    echo "• Railway文档: https://docs.railway.app"
    echo "• Vercel文档: https://vercel.com/docs"
    echo "• 项目仓库: $(git remote get-url origin)"
    echo ""
    echo -e "${YELLOW}💡 提示：${NC}"
    echo "• 免费版本有使用限制，请合理使用"
    echo "• 建议设置监控和告警"
    echo "• 定期备份重要数据"
}

# 主函数
main() {
    show_welcome
    choose_platform
    echo ""
    verify_deployment
    show_completion
}

# 执行主函数
main "$@"

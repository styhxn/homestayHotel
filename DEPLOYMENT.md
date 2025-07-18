# 🚀 普洱蘑菇庄园民宿系统部署指南

## 📋 目录
- [系统要求](#系统要求)
- [快速部署](#快速部署)
- [详细部署步骤](#详细部署步骤)
- [云服务器部署](#云服务器部署)
- [域名和SSL配置](#域名和ssl配置)
- [监控和维护](#监控和维护)
- [故障排除](#故障排除)

## 🔧 系统要求

### 最低配置
- **CPU**: 2核心
- **内存**: 4GB RAM
- **存储**: 20GB 可用空间
- **操作系统**: Linux/Windows/macOS

### 推荐配置
- **CPU**: 4核心
- **内存**: 8GB RAM
- **存储**: 50GB SSD
- **网络**: 10Mbps 带宽

### 软件依赖
- Docker 20.10+
- Docker Compose 2.0+
- Git 2.0+

## ⚡ 快速部署

### 1. 克隆项目
```bash
git clone https://github.com/styhxn/homestayHotel.git
cd homestayHotel
```

### 2. 配置环境变量
```bash
# 复制环境配置文件
cp .env.example .env

# 编辑配置文件
nano .env  # Linux/macOS
notepad .env  # Windows
```

### 3. 一键部署
```bash
# Linux/macOS
./deploy.sh

# Windows PowerShell
.\deploy.ps1
```

### 4. 访问系统
- **前端**: http://localhost
- **后端API**: http://localhost:8091
- **管理员登录**: http://localhost/admin/login
- **默认账号**: root / root123

## 📝 详细部署步骤

### 步骤1: 环境准备

#### 安装Docker (Ubuntu/CentOS)
```bash
# Ubuntu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# CentOS
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### 安装Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 步骤2: 项目配置

#### 环境变量配置 (.env)
```env
# 数据库配置
DB_ROOT_PASSWORD=your_secure_password
DB_NAME=homestay
DB_USER=homestay
DB_PASSWORD=your_db_password

# 域名配置
BACKEND_HOST=your-domain.com
FRONTEND_HOST=your-domain.com

# AI服务配置
AI_API_URL=your_ai_service_url
AI_API_KEY=your_ai_api_key
```

### 步骤3: 构建和启动

#### 手动构建
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看状态
docker-compose ps
```

#### 查看日志
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f homestay-backend
docker-compose logs -f homestay-frontend
```

## ☁️ 云服务器部署

### 阿里云ECS部署

#### 1. 创建ECS实例
- **规格**: 2核4GB (最低配置)
- **操作系统**: Ubuntu 20.04 LTS
- **网络**: 分配公网IP
- **安全组**: 开放80, 443, 8091端口

#### 2. 连接服务器
```bash
ssh root@your_server_ip
```

#### 3. 安装依赖
```bash
# 更新系统
apt update && apt upgrade -y

# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 安装Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 安装Git
apt install -y git
```

#### 4. 部署项目
```bash
# 克隆项目
git clone https://github.com/styhxn/homestayHotel.git
cd homestayHotel

# 配置环境
cp .env.example .env
nano .env

# 部署
./deploy.sh
```

### 腾讯云CVM部署
类似阿里云ECS，选择对应的云服务器实例即可。

### AWS EC2部署
```bash
# 连接EC2实例
ssh -i your-key.pem ubuntu@your_ec2_ip

# 其他步骤与阿里云类似
```

## 🌐 域名和SSL配置

### 1. 域名解析
在域名服务商处添加A记录：
```
@ -> your_server_ip
www -> your_server_ip
api -> your_server_ip
```

### 2. SSL证书配置

#### 使用Let's Encrypt (免费)
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### 使用自定义证书
```bash
# 将证书文件放置到指定目录
mkdir -p /etc/ssl/certs
mkdir -p /etc/ssl/private

# 复制证书文件
cp your-cert.pem /etc/ssl/certs/
cp your-key.pem /etc/ssl/private/

# 更新docker-compose.yml中的证书路径
```

### 3. Nginx配置更新
更新 `homestay-frontend/nginx.conf` 添加HTTPS支持：

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/ssl/certs/your-cert.pem;
    ssl_certificate_key /etc/ssl/private/your-key.pem;
    
    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # 其他配置...
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## 📊 监控和维护

### 1. 健康检查
```bash
# 检查服务状态
docker-compose ps

# 检查健康状态
curl http://localhost:8091/actuator/health
curl http://localhost/health
```

### 2. 日志管理
```bash
# 查看实时日志
docker-compose logs -f

# 清理日志
docker system prune -f

# 设置日志轮转
# 在docker-compose.yml中添加logging配置
```

### 3. 备份策略
```bash
# 数据库备份
docker-compose exec mysql mysqldump -u root -p homestay > backup_$(date +%Y%m%d).sql

# 文件备份
tar -czf files_backup_$(date +%Y%m%d).tar.gz homestay-backend/files/
```

### 4. 更新部署
```bash
# 拉取最新代码
git pull

# 更新服务
./deploy.sh update
```

## 🔧 故障排除

### 常见问题

#### 1. 端口被占用
```bash
# 查看端口占用
netstat -tulpn | grep :80
netstat -tulpn | grep :8091

# 停止占用进程
sudo kill -9 <PID>
```

#### 2. 数据库连接失败
```bash
# 检查数据库容器状态
docker-compose logs mysql

# 重启数据库
docker-compose restart mysql
```

#### 3. 内存不足
```bash
# 查看内存使用
free -h
docker stats

# 清理Docker资源
docker system prune -a
```

#### 4. 磁盘空间不足
```bash
# 查看磁盘使用
df -h

# 清理Docker镜像
docker image prune -a

# 清理日志文件
sudo journalctl --vacuum-time=7d
```

### 日志分析
```bash
# 后端错误日志
docker-compose logs homestay-backend | grep ERROR

# 前端访问日志
docker-compose logs homestay-frontend | grep nginx

# 数据库慢查询
docker-compose exec mysql mysql -u root -p -e "SHOW PROCESSLIST;"
```

### 性能优化
```bash
# 调整JVM参数
# 在docker-compose.yml中修改JAVA_OPTS

# 调整数据库配置
# 修改MySQL配置文件

# 启用Redis缓存
# 确保Redis服务正常运行
```

## 📞 技术支持

如果遇到部署问题，请：

1. 查看详细日志：`docker-compose logs -f`
2. 检查系统资源：`docker stats`
3. 验证网络连接：`curl -I http://localhost`
4. 提交Issue到GitHub仓库

---

**部署成功后，您的普洱蘑菇庄园民宿系统就可以正常运行了！** 🎉

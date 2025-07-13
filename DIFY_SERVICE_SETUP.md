# 🚀 Dify服务启动指南

## 🎯 问题描述

当前Dify隧道地址 `http://47be5268.r28.cpolar.top` 不可用，错误信息：
```
Tunnel http://47be5268.r28.cpolar.top unavailable
Unable to initiate connection to http://localhost:9998. 
A website server must be running on port http://localhost:9998 to complete the tunnel.
```

## 📋 解决方案

### 方案1：启动本地Dify服务（推荐）

#### 1.1 使用Docker启动Dify
```bash
# 克隆Dify仓库
git clone https://github.com/langgenius/dify.git
cd dify/docker

# 启动Dify服务
docker-compose up -d

# 检查服务状态
docker-compose ps
```

#### 1.2 配置端口映射
编辑 `docker-compose.yml` 文件，确保端口映射正确：
```yaml
services:
  web:
    ports:
      - "9998:3000"  # 映射到9998端口
```

#### 1.3 验证服务启动
```bash
# 检查端口是否监听
netstat -an | grep 9998

# 或使用curl测试
curl http://localhost:9998
```

### 方案2：使用cpolar重新建立隧道

#### 2.1 安装cpolar
```bash
# Windows
# 下载并安装 https://www.cpolar.com/

# Linux/Mac
curl -L https://www.cpolar.com/static/downloads/install-release-cpolar.sh | sudo bash
```

#### 2.2 启动隧道
```bash
# 启动cpolar隧道，映射本地9998端口
cpolar http 9998

# 或指定子域名
cpolar http -subdomain=47be5268 9998
```

#### 2.3 获取新的隧道地址
cpolar会提供新的隧道地址，类似：
```
http://47be5268.r28.cpolar.top -> http://localhost:9998
```

### 方案3：使用其他隧道服务

#### 3.1 ngrok
```bash
# 安装ngrok
# 下载 https://ngrok.com/download

# 启动隧道
ngrok http 9998
```

#### 3.2 localtunnel
```bash
# 安装localtunnel
npm install -g localtunnel

# 启动隧道
lt --port 9998 --subdomain dify-chat
```

### 方案4：修改项目配置使用其他AI服务

#### 4.1 使用OpenAI API
修改项目配置，直接使用OpenAI API：
```javascript
// 在项目中配置OpenAI
const openai = new OpenAI({
  apiKey: 'your-openai-api-key'
})
```

#### 4.2 使用其他AI服务
- Claude API
- Google Gemini API
- 百度文心一言API
- 阿里通义千问API

## 🔧 项目配置更新

### 更新Dify配置
如果获得了新的隧道地址，需要更新项目中的配置：

#### 前端配置
```javascript
// 在 AIRoomSelectionView.vue 中更新
const checkDifyAvailability = async (): Promise<boolean> => {
  try {
    await fetch('http://新的隧道地址/chat/fggmGdSFt6MSQFJa', {
      method: 'HEAD',
      mode: 'no-cors',
      signal: AbortSignal.timeout(5000)
    })
    return true
  } catch (error) {
    return false
  }
}

// 更新iframe地址
iframe.src = 'http://新的隧道地址/chat/fggmGdSFt6MSQFJa'
```

#### 后端配置
```properties
# 在 application.properties 中更新
chatAssist.authorization=Bearer app-oaUwvb7k2zbC8Bi03EO977nN
chatAssist.url=http://新的隧道地址/v1
```

## 🧪 测试验证

### 1. 检查本地服务
```bash
# 检查9998端口是否被占用
netstat -an | grep 9998

# 检查进程
lsof -i :9998  # Linux/Mac
netstat -ano | findstr :9998  # Windows
```

### 2. 测试隧道连接
```bash
# 测试隧道地址是否可访问
curl -I http://47be5268.r28.cpolar.top

# 测试具体的聊天端点
curl -I http://47be5268.r28.cpolar.top/chat/fggmGdSFt6MSQFJa
```

### 3. 使用项目调试工具
在AI选房页面中：
1. 点击"测试连接"按钮
2. 查看连接测试结果
3. 根据结果判断问题所在

## 🚀 快速启动步骤

### 最简单的解决方案
1. **启动Dify服务**
   ```bash
   # 使用Docker快速启动
   git clone https://github.com/langgenius/dify.git
   cd dify/docker
   docker-compose up -d
   ```

2. **建立隧道**
   ```bash
   # 使用cpolar建立隧道
   cpolar http 9998
   ```

3. **更新项目配置**
   - 将新的隧道地址更新到项目中
   - 重启前端开发服务器

4. **测试验证**
   - 访问AI选房页面
   - 点击"测试连接"验证
   - 确认Dify聊天助手正常工作

## 📞 技术支持

### 常见问题

#### Q: Docker启动失败
A: 检查Docker是否正确安装，端口是否被占用

#### Q: 隧道连接不稳定
A: 尝试使用不同的隧道服务，或检查网络连接

#### Q: Dify服务启动慢
A: 首次启动需要下载镜像，请耐心等待

### 联系方式
如果遇到问题，可以：
1. 查看Dify官方文档：https://docs.dify.ai/
2. 检查cpolar使用指南：https://www.cpolar.com/docs
3. 使用项目内置的调试工具进行故障排除

## 🎯 推荐方案

基于当前情况，推荐按以下顺序尝试：

1. **首选**：启动本地Dify服务 + cpolar隧道
2. **备选**：使用ngrok等其他隧道服务
3. **替代**：配置使用其他AI服务API

选择最适合您环境的方案，确保AI聊天功能正常运行。

---

**文档更新时间**：2025年7月13日  
**适用版本**：当前项目版本  
**状态**：等待Dify服务启动 ⏳

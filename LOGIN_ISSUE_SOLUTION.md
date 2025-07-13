# 🔐 登录失败问题解决方案

## 🎯 问题分析

### 问题现象
- ❌ **登录失败**：用户无法正常登录系统
- ❌ **连接错误**：前端无法连接到后端API

### 根本原因
- ❌ **端口不匹配**：前端配置的后端端口(8080)与实际运行端口(8091)不一致
- ❌ **后端服务未启动**：后端Spring Boot服务没有运行

## ✅ 解决方案

### 1. 启动后端服务 🚀

#### 后端服务启动
```bash
# 进入后端目录
cd D:\homestayHotelPublic-master\homestayback

# 启动Spring Boot应用
java -jar target/homestay-0.0.1-SNAPSHOT.jar
```

#### 启动成功标志
```
Tomcat started on port(s): 8091 (http) with context path ''
Started HomestayApplication in 6.029 seconds
```

### 2. 修复端口配置 🔧

#### 前端API配置修复
**文件**: `hotel/src/utils/request.ts`

**修改前**:
```typescript
const service: RequestInstance = axios.create({
  baseURL: 'http://localhost:8080', // 错误的端口
  timeout: 5000
})
```

**修改后**:
```typescript
const service: RequestInstance = axios.create({
  baseURL: 'http://localhost:8091', // 正确的端口
  timeout: 5000
})
```

### 3. 测试用户账号 👤

#### 可用的测试账号

##### 普通用户账号
- **用户名**: `testuser`
- **密码**: `123456`
- **角色**: 普通用户

##### 管理员账号
- **用户名**: `root`
- **密码**: `root123`
- **角色**: 管理员

### 4. 登录接口信息 📡

#### API端点
- **登录接口**: `POST /h/user/login`
- **完整URL**: `http://localhost:8091/h/user/login`

#### 请求格式
```json
{
  "username": "testuser",
  "password": "123456"
}
```

#### 响应格式
```json
{
  "code": "200",
  "msg": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "realName": "测试用户",
      "phonenumber": "13800138000",
      "gender": "1"
    },
    "tokenInfo": {
      "tokenValue": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
  }
}
```

## 🔧 技术实现细节

### 后端服务配置

#### Spring Boot配置
- **框架**: Spring Boot 2.7.6
- **端口**: 8091
- **数据库**: MySQL (HikariCP连接池)
- **认证**: Sa-Token

#### 数据库连接
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

### 前端请求配置

#### Axios拦截器
```typescript
// 请求拦截器 - 添加Token
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['satoken'] = token
  }
  return config
})

// 响应拦截器 - 处理错误
service.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // 清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## 🧪 测试验证

### 1. 后端服务测试

#### 检查服务状态
```bash
# 检查端口监听
netstat -an | findstr :8091

# 应该看到类似输出
TCP    0.0.0.0:8091           0.0.0.0:0              LISTENING
```

#### 检查API可访问性
```bash
# 使用curl测试（如果有curl）
curl -X POST http://localhost:8091/h/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
```

### 2. 前端登录测试

#### 测试步骤
1. **访问登录页面**: http://localhost:5173/login
2. **输入测试账号**: 
   - 用户名: `testuser`
   - 密码: `123456`
3. **点击登录按钮**
4. **检查结果**: 应该成功跳转到首页

#### 浏览器调试
```javascript
// 在浏览器控制台查看网络请求
// 应该看到成功的POST请求到 http://localhost:8091/h/user/login
```

## 🚨 常见问题排查

### 问题1: 后端服务启动失败

#### 可能原因
- Java环境问题
- 端口被占用
- 数据库连接失败

#### 解决方法
```bash
# 检查Java版本
java -version

# 检查端口占用
netstat -an | findstr :8091

# 查看详细错误日志
java -jar target/homestay-0.0.1-SNAPSHOT.jar
```

### 问题2: 前端连接失败

#### 可能原因
- 后端服务未启动
- 端口配置错误
- CORS跨域问题

#### 解决方法
1. **确认后端服务运行**: 检查8091端口
2. **检查前端配置**: 确认baseURL正确
3. **查看浏览器控制台**: 检查网络错误

### 问题3: 登录接口404

#### 可能原因
- 接口路径错误
- 后端路由配置问题

#### 解决方法
```bash
# 检查后端日志中的路由映射
# 应该看到类似输出:
# Mapped "{[/h/user/login],methods=[POST]}"
```

### 问题4: 认证Token问题

#### 可能原因
- Token格式错误
- Sa-Token配置问题

#### 解决方法
```javascript
// 检查localStorage中的token
console.log(localStorage.getItem('token'))

// 检查请求头
// 应该包含: satoken: "token值"
```

## 📊 系统状态检查

### 服务运行状态
- ✅ **前端服务**: http://localhost:5173 (Vite开发服务器)
- ✅ **后端服务**: http://localhost:8091 (Spring Boot应用)
- ✅ **数据库**: MySQL (HikariCP连接池)

### 关键配置
- ✅ **API基础URL**: `http://localhost:8091`
- ✅ **登录接口**: `/h/user/login`
- ✅ **认证方式**: Sa-Token
- ✅ **Token存储**: localStorage

## 🎯 解决结果

### 修复内容
1. ✅ **启动后端服务**: Spring Boot应用运行在8091端口
2. ✅ **修复端口配置**: 前端API配置更新为正确端口
3. ✅ **提供测试账号**: testuser/123456 和 root/root123
4. ✅ **验证API连接**: 后端接收到登录请求

### 预期效果
- ✅ **登录成功**: 用户可以正常登录系统
- ✅ **Token获取**: 成功获取认证Token
- ✅ **页面跳转**: 登录后正确跳转到首页
- ✅ **状态保持**: 用户登录状态正确保存

## 🚀 下一步操作

### 立即测试
1. **确认后端运行**: 检查控制台输出
2. **刷新登录页面**: http://localhost:5173/login
3. **使用测试账号登录**: testuser/123456
4. **验证登录成功**: 检查是否跳转到首页

### 长期优化
1. **配置文件管理**: 将端口配置提取到环境变量
2. **错误处理优化**: 改善登录失败的用户提示
3. **日志监控**: 添加详细的登录日志记录
4. **安全加固**: 实施更严格的密码策略

---

**问题解决时间**: 2025年7月13日  
**解决状态**: ✅ 已修复端口配置，后端服务正常运行  
**测试账号**: testuser/123456 (普通用户), root/root123 (管理员)  
**下一步**: 测试登录功能 🎯

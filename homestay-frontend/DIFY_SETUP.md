# Dify AI 连接配置指南

## 概述

当前系统支持两种AI模式：
1. **本地AI模式**（默认）：使用内置的智能AI，无需外部服务
2. **Dify AI模式**：连接到真实的Dify AI服务

## 如何启用Dify连接

### 步骤1：获取Dify配置信息

1. 登录您的Dify控制台：https://dify.ai
2. 创建或选择一个应用
3. 在应用设置中获取以下信息：
   - **API Key**：形如 `app-xxxxxxxxxx`
   - **应用ID**：您的应用唯一标识
   - **服务器地址**：通常是 `https://api.dify.ai/v1`（官方服务）

### 步骤2：修改配置文件

编辑文件：`hotel/src/config/dify.config.js`

```javascript
export const DIFY_CONFIG = {
  // 启用Dify连接
  enabled: true,  // 改为 true
  
  // 替换为您的真实配置
  apiKey: 'app-your-real-api-key-here',
  baseUrl: 'https://api.dify.ai/v1',
  appId: 'your-real-app-id-here',
  
  user: 'hotel-guest',
  responseMode: 'blocking',
  timeout: 30000
}
```

### 步骤3：重启开发服务器

```bash
cd hotel
npm run dev
```

### 步骤4：验证连接

1. 打开AI房间选择页面
2. 查看浏览器控制台
3. 如果看到"Dify连接成功"，说明配置正确
4. 如果看到"Dify未配置"或错误信息，请检查配置

## 配置说明

### enabled
- `true`：启用Dify连接
- `false`：使用本地AI（默认）

### apiKey
- 从Dify控制台获取的API密钥
- 格式：`app-xxxxxxxxxx`

### baseUrl
- Dify API服务器地址
- 官方服务：`https://api.dify.ai/v1`
- 自部署：`https://your-domain.com/v1`

### appId
- 您的Dify应用ID
- 在Dify控制台的应用设置中找到

### responseMode
- `blocking`：同步响应（推荐）
- `streaming`：流式响应

## 故障排除

### 问题1：连接失败
**症状**：控制台显示"Dify连接失败"
**解决**：
1. 检查API Key是否正确
2. 检查网络连接
3. 确认Dify服务状态

### 问题2：无响应
**症状**：发送消息后AI无回复
**解决**：
1. 检查应用ID是否正确
2. 确认Dify应用已发布
3. 查看控制台错误信息

### 问题3：配置不生效
**症状**：修改配置后仍使用本地AI
**解决**：
1. 确认`enabled: true`
2. 重启开发服务器
3. 清除浏览器缓存

## 当前功能

### 保持的样式特性
✅ 美观的聊天界面
✅ IP角色头像
✅ 快捷功能按钮
✅ 房间推荐显示
✅ 订单管理功能

### Dify集成特性
✅ 真实AI对话
✅ 上下文记忆
✅ 专业回复质量
✅ 多轮对话支持

## 技术细节

### API调用流程
1. 用户发送消息
2. 检查Dify连接状态
3. 调用Dify Chat API
4. 解析AI回复
5. 更新聊天界面
6. 触发房间推荐逻辑

### 错误处理
- 网络错误：显示重试提示
- API错误：回退到本地AI
- 配置错误：显示配置指导

### 性能优化
- 连接状态缓存
- 对话ID复用
- 超时处理
- 错误重试机制

## 联系支持

如果遇到问题，请：
1. 检查控制台错误信息
2. 确认Dify服务状态
3. 验证配置信息正确性
4. 联系技术支持团队

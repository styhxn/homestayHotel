# 🎤 实时语音通话功能使用指南

## 📋 功能概述

本项目已成功集成实时语音通话功能，为普洱蘑菇庄园民宿的AI助手提供了自然的语音交互体验。用户可以通过语音与AI进行实时对话，享受更加便捷和人性化的服务。

## ✨ 主要特性

### 🎯 核心功能
- **实时语音识别**：支持中文语音实时识别，准确率高
- **智能语音合成**：AI回复采用少年音色，语音自然流畅
- **语音活动检测**：自动检测用户说话开始和结束
- **双向语音通话**：支持用户和AI的连续对话
- **音频质量优化**：回声消除、噪音抑制、自动增益控制

### 🛡️ 质量保障
- **错误自动恢复**：网络中断、设备切换等异常自动处理
- **降级模式**：在不支持的环境下自动切换到文本模式
- **性能监控**：实时监控音频质量和网络状态
- **兼容性检测**：自动检测浏览器和设备支持情况

## 🚀 快速开始

### 1. 启动语音通话

在AI助手界面中，点击**语音通话按钮**（📞图标）即可开启实时语音通话功能。

```typescript
// 程序化启动语音通话
const aiAssistant = new GlobalAIAssistant()
await aiAssistant.startVoiceCall()
```

### 2. 基本使用流程

1. **点击通话按钮**：启动语音通话功能
2. **授权麦克风**：首次使用需要允许麦克风访问权限
3. **开始对话**：直接说话，AI会自动检测并回应
4. **结束通话**：点击结束按钮或关闭界面

### 3. 界面说明

- **🎤 麦克风按钮**：切换语音输入开关
- **🔊 扬声器按钮**：切换语音输出开关
- **📞 通话按钮**：开始/结束语音通话
- **⚙️ 设置按钮**：调整语音参数和设备选择

## 🔧 技术架构

### 核心服务模块

```
语音通话系统
├── RealTimeVoiceService      # 实时语音服务核心
├── VoiceActivityDetection    # 语音活动检测
├── RealTimeAIProcessor      # AI对话处理器
├── VoiceQualityOptimizer    # 音频质量优化
└── VoiceErrorHandler        # 错误处理和恢复
```

### 技术栈
- **语音识别**：Web Speech API (webkitSpeechRecognition)
- **语音合成**：Web Speech Synthesis API
- **音频处理**：Web Audio API
- **AI服务**：Dify AI集成
- **实时通信**：WebRTC技术栈

## 📱 浏览器兼容性

### ✅ 完全支持
- **Chrome 25+**：完整功能支持
- **Edge 79+**：完整功能支持
- **Safari 14.1+**：完整功能支持

### ⚠️ 部分支持
- **Firefox 55+**：语音合成支持，语音识别有限
- **移动端Safari**：功能受限，建议使用文本模式

### ❌ 不支持
- **IE浏览器**：不支持现代Web API
- **旧版本浏览器**：自动降级到文本模式

## ⚙️ 配置选项

### 语音识别配置
```typescript
const voiceConfig = {
  language: 'zh-CN',           // 识别语言
  continuous: true,            // 连续识别
  interimResults: true,        // 中间结果
  maxAlternatives: 1           // 最大候选数
}
```

### 语音合成配置
```typescript
const speechConfig = {
  lang: 'zh-CN',              // 合成语言
  rate: 1.1,                  // 语速（少年音）
  pitch: 1.3,                 // 音调（少年音）
  volume: 0.8                 // 音量
}
```

### 音频处理配置
```typescript
const audioConfig = {
  echoCancellation: true,      // 回声消除
  noiseSuppression: true,      // 噪音抑制
  autoGainControl: true,       // 自动增益
  sampleRate: 16000,          // 采样率
  channels: 1                 // 声道数
}
```

## 🎛️ 高级功能

### 1. 语音活动检测 (VAD)
```typescript
import { VoiceActivityDetection } from '@/services/VoiceActivityDetection'

const vad = new VoiceActivityDetection({
  volumeThreshold: 0.01,       // 音量阈值
  silenceThreshold: 0.005,     // 静音阈值
  minSpeechDuration: 300,      // 最小说话时长
  maxSilenceDuration: 1500     // 最大静音时长
})
```

### 2. 音频质量优化
```typescript
import { VoiceQualityOptimizer } from '@/services/VoiceQualityOptimizer'

const optimizer = new VoiceQualityOptimizer({
  enableAdaptiveQuality: true,  // 自适应质量
  qualityCheckInterval: 1000,   // 质量检查间隔
  minQualityThreshold: 0.6      // 最小质量阈值
})
```

### 3. 错误处理和恢复
```typescript
import { VoiceErrorHandler } from '@/services/VoiceErrorHandler'

const errorHandler = new VoiceErrorHandler({
  maxRetryAttempts: 3,         // 最大重试次数
  autoRecovery: true,          // 自动恢复
  fallbackEnabled: true        // 降级模式
})
```

## 🧪 测试和调试

### 运行功能测试
```typescript
import { VoiceCallTester } from '@/utils/VoiceCallTester'

const tester = new VoiceCallTester()
const results = await tester.runFullTestSuite()
console.log(tester.generateTestReport())
```

### 性能监控
```typescript
// 获取实时性能指标
const metrics = optimizer.getCurrentMetrics()
console.log('音频质量:', metrics?.quality)
console.log('网络延迟:', metrics?.latency)
```

### 调试模式
```typescript
// 启用详细日志
localStorage.setItem('voice_debug', 'true')

// 查看错误统计
const stats = errorHandler.getErrorStatistics()
console.log('错误率:', stats.recoveryRate)
```

## 🔍 故障排除

### 常见问题

#### 1. 麦克风无法访问
**症状**：提示"无法访问麦克风"
**解决方案**：
- 检查浏览器权限设置
- 确保麦克风设备正常工作
- 尝试刷新页面重新授权

#### 2. 语音识别不准确
**症状**：识别结果错误或无响应
**解决方案**：
- 检查网络连接
- 调整麦克风音量
- 在安静环境中使用
- 清晰发音，适当停顿

#### 3. AI回复延迟
**症状**：AI响应时间过长
**解决方案**：
- 检查网络状况
- 等待AI服务恢复
- 切换到文本模式

#### 4. 音频质量差
**症状**：声音断断续续或有噪音
**解决方案**：
- 检查音频设备
- 调整音量设置
- 关闭其他音频应用
- 使用有线耳机

### 错误代码说明

| 错误代码 | 说明 | 解决方案 |
|---------|------|----------|
| `permission_denied` | 麦克风权限被拒绝 | 在浏览器设置中允许麦克风访问 |
| `network_error` | 网络连接问题 | 检查网络连接，稍后重试 |
| `audio_error` | 音频设备问题 | 检查麦克风和扬声器设置 |
| `browser_unsupported` | 浏览器不支持 | 使用Chrome、Edge或Safari |
| `ai_service_error` | AI服务异常 | 等待服务恢复或使用文本模式 |

## 📈 性能优化建议

### 1. 网络优化
- 使用稳定的网络连接
- 避免在网络高峰期使用
- 考虑使用有线网络

### 2. 设备优化
- 使用高质量的麦克风
- 选择安静的使用环境
- 关闭不必要的后台应用

### 3. 浏览器优化
- 使用最新版本的支持浏览器
- 清理浏览器缓存
- 关闭其他占用资源的标签页

## 🔮 未来规划

### 即将推出的功能
- **多语言支持**：支持英语、日语等多种语言
- **情感识别**：识别用户情感并调整AI回复风格
- **语音指纹**：个性化语音识别和合成
- **离线模式**：基本功能的离线支持

### 技术升级计划
- **WebAssembly优化**：提升音频处理性能
- **机器学习增强**：本地语音处理模型
- **5G适配**：利用5G网络的低延迟特性
- **AR/VR集成**：支持沉浸式语音交互

## 📞 技术支持

如果您在使用过程中遇到问题，请：

1. **查看控制台日志**：按F12打开开发者工具查看错误信息
2. **运行诊断测试**：使用内置的测试工具检查系统状态
3. **联系技术支持**：提供详细的错误信息和使用环境

---

**🍄 普洱蘑菇庄园民宿 - 让科技为您的住宿体验增添温暖**

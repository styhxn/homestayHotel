// Dify AI 配置文件
// 要连接真实的Dify服务，请修改以下配置

export const DIFY_CONFIG = {
  // 是否启用Dify（设置为true启用真实Dify连接）
  enabled: false,
  
  // Dify API配置
  apiKey: 'app-your-dify-api-key-here',
  baseUrl: 'https://api.dify.ai/v1',
  appId: 'your-app-id-here',
  
  // 用户标识
  user: 'hotel-guest',
  
  // 响应模式 ('blocking' | 'streaming')
  responseMode: 'blocking',
  
  // 超时设置（毫秒）
  timeout: 30000
}

// 配置说明：
// 1. enabled: false - 系统将优先使用本地AI，Dify作为备选
// 2. localMode: true - 启用本地AI模式
// 3. fallbackToLocal: true - 当Dify不可用时自动切换到本地AI
// 4. 如需启用Dify，将enabled设置为true并配置正确的API信息
//
// 自动切换逻辑：
// - 系统启动时会尝试连接Dify
// - 如果Dify连接失败，自动使用本地AI
// - 运行过程中如果Dify断开，会自动切换到本地AI
// - 用户可以手动测试和切换AI服务

export default DIFY_CONFIG

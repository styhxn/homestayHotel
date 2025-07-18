import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// 启用CORS
app.use(cors({
  origin: ['http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true
}));

// 解析JSON
app.use(express.json());

// 代理到Dify服务
app.use('/api/dify', createProxyMiddleware({
  target: 'http://4295a4ce.r28.cpolar.top',
  changeOrigin: true,
  pathRewrite: {
    '^/api/dify': '', // 移除/api/dify前缀
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('代理请求:', req.method, req.url);
    console.log('目标URL:', proxyReq.path);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('代理响应:', proxyRes.statusCode);
  },
  onError: (err, req, res) => {
    console.error('代理错误:', err);
    res.status(500).json({ error: '代理服务器错误', details: err.message });
  }
}));

// 直接API端点
app.post('/api/chat', async (req, res) => {
  try {
    console.log('收到聊天请求:', req.body);
    
    // fetch已经在顶部导入
    
    // 尝试多个API端点
    const endpoints = [
      {
        url: 'http://47be5268.r28.cpolar.top/v1/chat-messages',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer app-oaUwvb7k2zbC8Bi03EO977nN'
        },
        body: {
          inputs: {},
          query: req.body.message || req.body.query,
          response_mode: 'blocking',
          conversation_id: req.body.conversation_id || '',
          user: req.body.user || 'user-' + Date.now()
        }
      },
      {
        url: 'http://47be5268.r28.cpolar.top/chat/fggmGdSFt6MSQFJa',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          message: req.body.message || req.body.query,
          user: req.body.user || 'user-' + Date.now()
        }
      }
    ];
    
    let lastError = null;
    
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      console.log(`尝试端点 ${i + 1}:`, endpoint.url);
      
      try {
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: endpoint.headers,
          body: JSON.stringify(endpoint.body)
        });
        
        console.log(`端点 ${i + 1} 响应状态:`, response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`端点 ${i + 1} 响应数据:`, data);
          return res.json(data);
        } else {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      } catch (error) {
        console.error(`端点 ${i + 1} 失败:`, error.message);
        lastError = error;
        continue;
      }
    }
    
    throw lastError || new Error('所有端点都失败了');
    
  } catch (error) {
    console.error('聊天API错误:', error);
    res.status(500).json({
      error: 'API调用失败',
      message: error.message,
      details: '请检查Dify服务是否正常运行'
    });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dify代理服务器运行正常' });
});

app.listen(PORT, () => {
  console.log(`Dify代理服务器运行在 http://localhost:${PORT}`);
  console.log('代理目标: http://47be5268.r28.cpolar.top');
});

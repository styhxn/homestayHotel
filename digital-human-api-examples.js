// 🤖 AI数字人API集成示例代码

/**
 * D-ID平台集成示例
 * 官网：https://www.d-id.com/
 * 文档：https://docs.d-id.com/
 */
class DIDDigitalHuman {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.d-id.com';
        this.headers = {
            'Authorization': `Basic ${btoa(apiKey)}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * 创建数字人对话视频
     * @param {string} imageUrl - 数字人形象图片URL
     * @param {string} text - 要说的文字
     * @param {string} voice - 语音类型
     */
    async createTalk(imageUrl, text, voice = 'zh-CN-XiaoxiaoNeural') {
        try {
            const response = await fetch(`${this.baseURL}/talks`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    script: {
                        type: 'text',
                        input: text,
                        provider: {
                            type: 'microsoft',
                            voice_id: voice
                        }
                    },
                    source_url: imageUrl,
                    config: {
                        fluent: true,
                        pad_audio: 0.0,
                        driver_expressions: {
                            expressions: [
                                { start_frame: 0, expression: 'neutral', intensity: 1.0 }
                            ]
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('创建D-ID对话失败:', error);
            throw error;
        }
    }

    /**
     * 获取视频生成状态
     * @param {string} talkId - 对话ID
     */
    async getTalkStatus(talkId) {
        try {
            const response = await fetch(`${this.baseURL}/talks/${talkId}`, {
                headers: {
                    'Authorization': `Basic ${btoa(this.apiKey)}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('获取D-ID状态失败:', error);
            throw error;
        }
    }

    /**
     * 等待视频生成完成
     * @param {string} talkId - 对话ID
     * @param {number} maxWaitTime - 最大等待时间（毫秒）
     */
    async waitForCompletion(talkId, maxWaitTime = 60000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
            const status = await this.getTalkStatus(talkId);
            
            if (status.status === 'done') {
                return status.result_url;
            } else if (status.status === 'error') {
                throw new Error('视频生成失败: ' + status.error);
            }
            
            // 等待2秒后再次检查
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        throw new Error('视频生成超时');
    }
}

/**
 * HeyGen平台集成示例
 * 官网：https://www.heygen.com/
 */
class HeyGenDigitalHuman {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.heygen.com/v2';
        this.headers = {
            'X-API-Key': apiKey,
            'Content-Type': 'application/json'
        };
    }

    /**
     * 生成数字人视频
     * @param {string} avatarId - 数字人ID
     * @param {string} text - 要说的文字
     * @param {string} voice - 语音ID
     */
    async generateVideo(avatarId, text, voice = 'zh-CN-YunxiNeural') {
        try {
            const response = await fetch(`${this.baseURL}/video/generate`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    video_inputs: [{
                        character: {
                            type: 'avatar',
                            avatar_id: avatarId
                        },
                        voice: {
                            type: 'text',
                            input_text: text,
                            voice_id: voice
                        }
                    }],
                    dimension: {
                        width: 1280,
                        height: 720
                    },
                    aspect_ratio: '16:9'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('HeyGen视频生成失败:', error);
            throw error;
        }
    }

    /**
     * 获取视频状态
     * @param {string} videoId - 视频ID
     */
    async getVideoStatus(videoId) {
        try {
            const response = await fetch(`${this.baseURL}/video_status/?video_id=${videoId}`, {
                headers: {
                    'X-API-Key': this.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('获取HeyGen状态失败:', error);
            throw error;
        }
    }
}

/**
 * 语音识别集成示例
 */
class SpeechRecognitionService {
    constructor() {
        // 检查浏览器支持
        this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = null;
        
        if (this.SpeechRecognition) {
            this.recognition = new this.SpeechRecognition();
            this.recognition.lang = 'zh-CN';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
        }
    }

    /**
     * 开始语音识别
     */
    async startListening() {
        if (!this.recognition) {
            throw new Error('浏览器不支持语音识别');
        }

        return new Promise((resolve, reject) => {
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                resolve(transcript);
            };

            this.recognition.onerror = (event) => {
                reject(new Error(`语音识别错误: ${event.error}`));
            };

            this.recognition.start();
        });
    }

    /**
     * 停止语音识别
     */
    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}

/**
 * 百度语音识别API集成
 */
class BaiduASR {
    constructor(apiKey, secretKey) {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.accessToken = null;
    }

    /**
     * 获取访问令牌
     */
    async getAccessToken() {
        if (this.accessToken) return this.accessToken;

        try {
            const response = await fetch('https://aip.baidubce.com/oauth/2.0/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `grant_type=client_credentials&client_id=${this.apiKey}&client_secret=${this.secretKey}`
            });

            const data = await response.json();
            this.accessToken = data.access_token;
            return this.accessToken;
        } catch (error) {
            console.error('获取百度访问令牌失败:', error);
            throw error;
        }
    }

    /**
     * 识别音频
     * @param {Blob} audioBlob - 音频数据
     */
    async recognizeAudio(audioBlob) {
        try {
            const token = await this.getAccessToken();
            const base64Audio = await this.blobToBase64(audioBlob);

            const response = await fetch(`https://vop.baidu.com/server_api?access_token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    format: 'wav',
                    rate: 16000,
                    channel: 1,
                    cuid: 'web_client',
                    speech: base64Audio,
                    len: audioBlob.size
                })
            });

            const result = await response.json();
            return result.result ? result.result[0] : '';
        } catch (error) {
            console.error('百度语音识别失败:', error);
            throw error;
        }
    }

    /**
     * 将Blob转换为Base64
     */
    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
}

/**
 * AI对话服务集成
 */
class AIConversationService {
    constructor(provider, apiKey) {
        this.provider = provider;
        this.apiKey = apiKey;
        this.conversationHistory = [];
    }

    /**
     * 获取AI回复
     * @param {string} message - 用户消息
     */
    async getResponse(message) {
        this.conversationHistory.push({ role: 'user', content: message });

        try {
            let response;
            
            switch (this.provider) {
                case 'openai':
                    response = await this.getOpenAIResponse();
                    break;
                case 'baidu':
                    response = await this.getBaiduResponse();
                    break;
                case 'azure':
                    response = await this.getAzureResponse();
                    break;
                default:
                    throw new Error('不支持的AI提供商');
            }

            this.conversationHistory.push({ role: 'assistant', content: response });
            return response;
        } catch (error) {
            console.error('获取AI回复失败:', error);
            throw error;
        }
    }

    /**
     * OpenAI GPT回复
     */
    async getOpenAIResponse() {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: '你是一个友善的AI助手，请用中文简洁地回答问题。' },
                    ...this.conversationHistory
                ],
                max_tokens: 300,
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    }

    /**
     * 百度文心一言回复
     */
    async getBaiduResponse() {
        // 需要先获取access_token
        const response = await fetch(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: this.conversationHistory
            })
        });

        const data = await response.json();
        return data.result;
    }
}

/**
 * 完整的数字人对话系统
 */
class DigitalHumanChatSystem {
    constructor(config) {
        this.config = config;
        this.digitalHuman = null;
        this.speechRecognition = new SpeechRecognitionService();
        this.aiService = new AIConversationService(config.aiProvider, config.aiApiKey);
        
        // 初始化数字人服务
        if (config.digitalHumanProvider === 'did') {
            this.digitalHuman = new DIDDigitalHuman(config.digitalHumanApiKey);
        } else if (config.digitalHumanProvider === 'heygen') {
            this.digitalHuman = new HeyGenDigitalHuman(config.digitalHumanApiKey);
        }
    }

    /**
     * 处理文字对话
     * @param {string} text - 用户输入的文字
     */
    async handleTextChat(text) {
        try {
            // 1. 获取AI回复
            const aiResponse = await this.aiService.getResponse(text);
            
            // 2. 生成数字人视频
            const videoUrl = await this.generateDigitalHumanVideo(aiResponse);
            
            return {
                text: aiResponse,
                videoUrl: videoUrl
            };
        } catch (error) {
            console.error('处理文字对话失败:', error);
            throw error;
        }
    }

    /**
     * 处理语音对话
     * @param {Blob} audioBlob - 用户语音数据
     */
    async handleVoiceChat(audioBlob) {
        try {
            // 1. 语音识别
            const recognizedText = await this.speechRecognition.recognizeAudio(audioBlob);
            
            // 2. 处理文字对话
            return await this.handleTextChat(recognizedText);
        } catch (error) {
            console.error('处理语音对话失败:', error);
            throw error;
        }
    }

    /**
     * 生成数字人视频
     * @param {string} text - 要说的文字
     */
    async generateDigitalHumanVideo(text) {
        if (!this.digitalHuman) {
            throw new Error('数字人服务未初始化');
        }

        try {
            if (this.config.digitalHumanProvider === 'did') {
                const talk = await this.digitalHuman.createTalk(
                    this.config.avatarImageUrl,
                    text,
                    this.config.voiceId
                );
                
                return await this.digitalHuman.waitForCompletion(talk.id);
            } else if (this.config.digitalHumanProvider === 'heygen') {
                const video = await this.digitalHuman.generateVideo(
                    this.config.avatarId,
                    text,
                    this.config.voiceId
                );
                
                // 等待视频生成完成
                return await this.waitForHeyGenVideo(video.video_id);
            }
        } catch (error) {
            console.error('生成数字人视频失败:', error);
            throw error;
        }
    }

    /**
     * 等待HeyGen视频生成完成
     */
    async waitForHeyGenVideo(videoId) {
        const maxAttempts = 30;
        let attempts = 0;

        while (attempts < maxAttempts) {
            const status = await this.digitalHuman.getVideoStatus(videoId);
            
            if (status.status === 'completed') {
                return status.video_url;
            } else if (status.status === 'failed') {
                throw new Error('视频生成失败');
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
            attempts++;
        }

        throw new Error('视频生成超时');
    }
}

// 使用示例
const chatSystem = new DigitalHumanChatSystem({
    digitalHumanProvider: 'did', // 或 'heygen'
    digitalHumanApiKey: 'your-digital-human-api-key',
    aiProvider: 'openai', // 或 'baidu'
    aiApiKey: 'your-ai-api-key',
    avatarImageUrl: 'https://your-domain.com/avatar.jpg',
    avatarId: 'your-avatar-id', // HeyGen使用
    voiceId: 'zh-CN-XiaoxiaoNeural'
});

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DIDDigitalHuman,
        HeyGenDigitalHuman,
        SpeechRecognitionService,
        BaiduASR,
        AIConversationService,
        DigitalHumanChatSystem
    };
}

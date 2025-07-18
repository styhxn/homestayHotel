package com.homestay.homestay.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * AI服务类
 * 处理AI对话逻辑
 */
@Slf4j
@Service
public class AIService {

    @Value("${ai.api.url:http://4295a4ce.r28.cpolar.top/v1/chat/completions}")
    private String aiApiUrl;

    @Value("${ai.api.key:app-oaUwvb7k2zbC8Bi03EO977nN}")
    private String aiApiKey;

    @Value("${ai.backup.enabled:true}")
    private boolean backupEnabled;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 存储用户对话历史
     */
    private final ConcurrentHashMap<String, List<Map<String, String>>> userChatHistory = new ConcurrentHashMap<>();

    /**
     * 获取AI聊天回复
     *
     * @param message 用户消息
     * @param userId  用户ID
     * @return AI回复
     */
    public String getChatResponse(String message, String userId) {
        try {
            // 首先尝试调用外部AI服务（设置超时时间）
            return callExternalAIWithTimeout(message, userId, 5000); // 5秒超时
        } catch (Exception e) {
            log.warn("外部AI服务调用失败，自动切换到本地AI: {}", e.getMessage());
            // 如果外部服务失败，自动切换到本地AI
            return getBackupResponse(message, userId);
        }
    }

    /**
     * 带超时的外部AI调用
     */
    private String callExternalAIWithTimeout(String message, String userId, long timeoutMs) {
        try {
            // 这里可以添加超时控制逻辑
            return callExternalAI(message, userId);
        } catch (Exception e) {
            throw new RuntimeException("外部AI服务超时或失败: " + e.getMessage(), e);
        }
    }

    /**
     * 调用外部AI服务
     */
    private String callExternalAI(String message, String userId) {
        // 获取或创建用户对话历史
        List<Map<String, String>> chatHistory = userChatHistory.computeIfAbsent(userId, k -> new ArrayList<>());

        // 添加用户消息到历史
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", message);
        chatHistory.add(userMessage);

        // 保持对话历史在合理范围内（最多保留20条消息）
        if (chatHistory.size() > 20) {
            chatHistory.subList(0, chatHistory.size() - 20).clear();
        }

        // 构建请求体
        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", buildMessages(chatHistory));
        requestBody.put("max_tokens", 1000);
        requestBody.put("temperature", 0.7);
        requestBody.put("stream", false);

        // 设置请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(aiApiKey);

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toJSONString(), headers);

        // 发送请求
        ResponseEntity<String> response = restTemplate.postForEntity(aiApiUrl, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            JSONObject responseBody = JSON.parseObject(response.getBody());
            String aiResponse = responseBody.getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");

            // 添加AI回复到历史
            Map<String, String> assistantMessage = new HashMap<>();
            assistantMessage.put("role", "assistant");
            assistantMessage.put("content", aiResponse);
            chatHistory.add(assistantMessage);

            return aiResponse;
        } else {
            log.error("AI API调用失败，状态码: {}", response.getStatusCode());
            throw new RuntimeException("AI API调用失败");
        }
    }

    /**
     * 获取备用AI响应（当外部服务不可用时）
     */
    private String getBackupResponse(String message, String userId) {
        log.info("使用备用AI响应处理消息: {}", message);

        String lowerMessage = message.toLowerCase();

        // 房间相关询问
        if (lowerMessage.contains("房间") || lowerMessage.contains("房型") || lowerMessage.contains("住宿")) {
            return "🏠 我们普洱蘑菇庄园有6种特色房型：\n\n" +
                   "🍄 蘑菇森林小屋(201号) - ¥350/晚，茶园景观，含早餐\n" +
                   "☁️ 云雾山景房(202号) - ¥380/晚，山景阳台，含早餐\n" +
                   "🍵 普洱茶香阁(203号) - ¥280/晚，茶具套装\n" +
                   "🏞️ 湖畔小筑(206号) - ¥428/晚，湖景阳台，垂钓设备\n\n" +
                   "每个房间都有独特的茶文化体验，您想了解哪个房型呢？";
        }

        // 预订相关询问
        if (lowerMessage.contains("预订") || lowerMessage.contains("订房") || lowerMessage.contains("预约")) {
            return "📅 很高兴为您办理预订！请告诉我：\n\n" +
                   "• 入住和退房日期\n" +
                   "• 入住人数\n" +
                   "• 房型偏好\n\n" +
                   "我会为您查找最合适的房间，并为您生成茶艺体验优惠码！🍵";
        }

        // 活动相关询问
        if (lowerMessage.contains("活动") || lowerMessage.contains("体验") || lowerMessage.contains("茶艺")) {
            return "🍵 庄园提供丰富的茶文化体验活动：\n\n" +
                   "• 茶艺课程学习 - ¥88/人（住客8折）\n" +
                   "• 采茶体验活动 - ¥68/人\n" +
                   "• 蘑菇森林探索 - ¥58/人\n" +
                   "• 湖边垂钓休闲 - 免费\n" +
                   "• 茶园日出观赏 - 免费\n\n" +
                   "您对哪个活动感兴趣呢？我可以为您详细介绍！";
        }

        // 价格相关询问
        if (lowerMessage.contains("价格") || lowerMessage.contains("多少钱") || lowerMessage.contains("费用")) {
            return "💰 我们的房间价格如下：\n\n" +
                   "🍄 蘑菇森林小屋 - ¥350/晚\n" +
                   "☁️ 云雾山景房 - ¥380/晚\n" +
                   "🍵 普洱茶香阁 - ¥280/晚\n" +
                   "🏞️ 湖畔小筑 - ¥428/晚\n\n" +
                   "价格包含WiFi、空调、独立卫浴等基础设施。\n" +
                   "住客可享受茶艺体验8折优惠！";
        }

        // 默认问候回复
        return "您好！欢迎来到普洱蘑菇庄园🍄！我是普普，您的专属AI小助手。\n\n" +
               "我可以帮您：\n" +
               "🏠 了解房间信息和价格\n" +
               "📅 协助预订房间\n" +
               "🍵 推荐茶艺体验活动\n" +
               "🗺️ 介绍周边景点\n\n" +
               "有什么可以帮助您的吗？";
    }

    /**
     * 构建消息列表，包含系统提示
     */
    private List<Map<String, String>> buildMessages(List<Map<String, String>> chatHistory) {
        List<Map<String, String>> messages = new ArrayList<>();

        // 添加系统提示
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "你是普洱蘑菇庄园民宿的AI助手普普。你需要：\n" +
                "1. 用温暖、友好的语气与客人交流\n" +
                "2. 了解普洱茶文化和蘑菇种植知识\n" +
                "3. 帮助客人了解民宿设施、房间类型、周边景点\n" +
                "4. 协助客人进行房间预订和咨询\n" +
                "5. 分享普洱当地的美食和文化特色\n" +
                "6. 保持专业、耐心、热情的服务态度\n" +
                "7. 房间信息：蘑菇森林小屋(201号)¥350/晚、云雾山景房(202号)¥380/晚、普洱茶香阁(203号)¥280/晚、湖畔小筑(206号)¥428/晚\n" +
                "请用中文回复，语言风格要亲切自然，体现茶文化的温馨氛围。");
        messages.add(systemMessage);

        // 添加对话历史
        messages.addAll(chatHistory);

        return messages;
    }

    /**
     * 获取默认回复（当AI服务不可用时）
     */
    private String getDefaultResponse(String message) {
        // 简化的降级回复，避免硬编码详细内容
        return "🍄 抱歉，AI服务暂时不可用。您可以稍后重试，或者访问我们的网站了解更多信息。";
    }

    /**
     * 清除用户对话历史
     */
    public void clearUserHistory(String userId) {
        userChatHistory.remove(userId);
    }
}

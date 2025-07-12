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

    @Value("${ai.api.url:http://47be5268.r28.cpolar.top/v1/chat/completions}")
    private String aiApiUrl;

    @Value("${ai.api.key:app-oaUwvb7k2zbC8Bi03EO977nN}")
    private String aiApiKey;

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
                return getDefaultResponse(message);
            }

        } catch (Exception e) {
            log.error("调用AI API异常:", e);
            return getDefaultResponse(message);
        }
    }

    /**
     * 构建消息列表，包含系统提示
     */
    private List<Map<String, String>> buildMessages(List<Map<String, String>> chatHistory) {
        List<Map<String, String>> messages = new ArrayList<>();

        // 添加系统提示
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "你是普洱蘑菇庄园民宿的AI助手普普1.0。你需要：\n" +
                "1. 用温暖、友好的语气与客人交流\n" +
                "2. 了解普洱茶文化和蘑菇种植知识\n" +
                "3. 帮助客人了解民宿设施、房间类型、周边景点\n" +
                "4. 协助客人进行房间预订和咨询\n" +
                "5. 分享普洱当地的美食和文化特色\n" +
                "6. 保持专业、耐心、热情的服务态度\n" +
                "请用中文回复，语言风格要亲切自然。");
        messages.add(systemMessage);

        // 添加对话历史
        messages.addAll(chatHistory);

        return messages;
    }

    /**
     * 获取默认回复（当AI服务不可用时）
     */
    private String getDefaultResponse(String message) {
        // 简单的关键词匹配回复
        String lowerMessage = message.toLowerCase();

        if (lowerMessage.contains("房间") || lowerMessage.contains("预订")) {
            return "您好！我们民宿有多种房型可供选择，包括标准间、大床房、家庭房等。您可以通过我们的预订系统查看详细信息和价格。需要我为您介绍具体的房型吗？";
        } else if (lowerMessage.contains("普洱") || lowerMessage.contains("茶")) {
            return "普洱茶是我们这里的特色！我们民宿周围有很多茶园，您可以体验采茶、制茶的过程。我们也提供普洱茶品鉴服务，让您深入了解普洱茶文化。";
        } else if (lowerMessage.contains("蘑菇")) {
            return "我们的蘑菇庄园种植了多种优质蘑菇，包括香菇、平菇、茶树菇等。您可以参观我们的蘑菇种植基地，了解蘑菇的生长过程，还可以亲手采摘新鲜蘑菇！";
        } else if (lowerMessage.contains("景点") || lowerMessage.contains("旅游")) {
            return "普洱有很多美丽的景点！推荐您游览普洱国家公园、茶马古道、澜沧江风光等。我们可以为您安排当地的旅游路线，让您充分体验普洱的自然风光和人文魅力。";
        } else if (lowerMessage.contains("美食") || lowerMessage.contains("吃")) {
            return "普洱的美食非常丰富！推荐您尝试普洱茶宴、野生菌火锅、傣族风味菜等。我们民宿的餐厅也提供地道的云南菜，使用新鲜的当地食材烹制。";
        } else {
            return "您好！我是普普1.0，普洱蘑菇庄园民宿的AI助手。很高兴为您服务！我可以帮您了解房间信息、预订服务、当地景点、普洱茶文化等。请问有什么可以帮助您的吗？";
        }
    }

    /**
     * 清除用户对话历史
     */
    public void clearUserHistory(String userId) {
        userChatHistory.remove(userId);
    }
}

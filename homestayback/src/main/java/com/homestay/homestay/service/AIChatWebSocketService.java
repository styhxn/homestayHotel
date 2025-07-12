package com.homestay.homestay.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * AI聊天WebSocket服务
 * 提供实时AI对话功能
 */
@Slf4j
@Component
@ServerEndpoint("/websocket/ai-chat/{userId}")
public class AIChatWebSocketService {

    /**
     * 静态变量，用来记录当前在线连接数
     */
    private static final AtomicInteger onlineCount = new AtomicInteger(0);

    /**
     * concurrent包的线程安全Set，用来存放每个客户端对应的WebSocket对象
     */
    private static final ConcurrentHashMap<String, AIChatWebSocketService> webSocketMap = new ConcurrentHashMap<>();

    /**
     * 与某个客户端的连接会话，需要通过它来给客户端发送数据
     */
    private Session session;

    /**
     * 接收userId
     */
    private String userId = "";

    /**
     * AI服务，用于处理AI对话
     */
    private static AIService aiService;

    @Autowired
    public void setAiService(AIService aiService) {
        AIChatWebSocketService.aiService = aiService;
    }

    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("userId") String userId) {
        this.session = session;
        this.userId = userId;
        if (webSocketMap.containsKey(userId)) {
            webSocketMap.remove(userId);
            webSocketMap.put(userId, this);
        } else {
            webSocketMap.put(userId, this);
            addOnlineCount();
        }

        log.info("用户连接:" + userId + ",当前在线人数为:" + getOnlineCount());
        try {
            sendMessage("连接成功");
        } catch (IOException e) {
            log.error("用户:" + userId + ",网络异常!!!!!!");
        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        if (webSocketMap.containsKey(userId)) {
            webSocketMap.remove(userId);
            subOnlineCount();
        }
        log.info("用户退出:" + userId + ",当前在线人数为:" + getOnlineCount());
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     */
    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("用户消息:" + userId + ",报文:" + message);
        
        try {
            JSONObject jsonObject = JSON.parseObject(message);
            String userMessage = jsonObject.getString("message");
            String messageType = jsonObject.getString("type");
            
            if ("chat".equals(messageType)) {
                // 处理聊天消息
                handleChatMessage(userMessage);
            }
        } catch (Exception e) {
            log.error("处理消息异常:", e);
            try {
                sendMessage("消息处理失败，请重试");
            } catch (IOException ioException) {
                log.error("发送错误消息失败:", ioException);
            }
        }
    }

    /**
     * 处理聊天消息
     */
    private void handleChatMessage(String userMessage) {
        try {
            // 发送用户消息确认
            JSONObject userMsgResponse = new JSONObject();
            userMsgResponse.put("type", "user_message");
            userMsgResponse.put("message", userMessage);
            userMsgResponse.put("timestamp", System.currentTimeMillis());
            sendMessage(userMsgResponse.toJSONString());

            // 调用AI服务获取回复
            String aiResponse = aiService.getChatResponse(userMessage, userId);
            
            // 发送AI回复
            JSONObject aiMsgResponse = new JSONObject();
            aiMsgResponse.put("type", "ai_message");
            aiMsgResponse.put("message", aiResponse);
            aiMsgResponse.put("timestamp", System.currentTimeMillis());
            sendMessage(aiMsgResponse.toJSONString());
            
        } catch (Exception e) {
            log.error("处理聊天消息异常:", e);
            try {
                JSONObject errorResponse = new JSONObject();
                errorResponse.put("type", "error");
                errorResponse.put("message", "AI服务暂时不可用，请稍后重试");
                sendMessage(errorResponse.toJSONString());
            } catch (IOException ioException) {
                log.error("发送错误消息失败:", ioException);
            }
        }
    }

    /**
     * 发生错误时调用
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error("用户错误:" + this.userId + ",原因:" + error.getMessage());
        error.printStackTrace();
    }

    /**
     * 实现服务器主动推送
     */
    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    /**
     * 发送自定义消息
     */
    public static void sendInfo(String message, @PathParam("userId") String userId) throws IOException {
        log.info("发送消息到:" + userId + ",报文:" + message);
        if (userId != null && webSocketMap.containsKey(userId)) {
            webSocketMap.get(userId).sendMessage(message);
        } else {
            log.error("用户" + userId + ",不在线！");
        }
    }

    public static synchronized int getOnlineCount() {
        return onlineCount.get();
    }

    public static synchronized void addOnlineCount() {
        onlineCount.incrementAndGet();
    }

    public static synchronized void subOnlineCount() {
        onlineCount.decrementAndGet();
    }
}

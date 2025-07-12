package com.homestay.homestay.service;

import com.homestay.homestay.dto.ChatMessageDto;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * 聊天助手服务接口
 */
public interface ChatAssistService {
    
    /**
     * 聊天对话
     *
     * @param chatMessageDto 聊天消息
     * @return SSE流式响应
     */
    SseEmitter sendChatMessage(ChatMessageDto chatMessageDto);
}

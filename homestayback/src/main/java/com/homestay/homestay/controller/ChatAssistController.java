package com.homestay.homestay.controller;

import com.homestay.homestay.dto.ChatMessageDto;
import com.homestay.homestay.service.ChatAssistService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * 聊天助手控制器
 */
@RestController
@RequestMapping("/chat")
@Slf4j
public class ChatAssistController {
    
    @Autowired
    private ChatAssistService chatAssistService;

    /**
     * 聊天对话
     *
     * @param chatMessageDto 聊天消息
     * @return SSE流式响应
     */
    @PostMapping("/messages")
    public SseEmitter sendChatMessage(@RequestBody ChatMessageDto chatMessageDto) {
        log.info("收到聊天消息: {}", chatMessageDto.getQuery());
        return chatAssistService.sendChatMessage(chatMessageDto);
    }
}

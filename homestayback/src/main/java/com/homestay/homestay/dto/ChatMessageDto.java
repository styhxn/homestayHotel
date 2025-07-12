package com.homestay.homestay.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * 聊天消息DTO
 * 用于与Dify AI服务通信
 */
@Data
public class ChatMessageDto {
    
    @JsonProperty("inputs")
    private Object inputs;

    @JsonProperty("query")
    private String query;

    @JsonProperty("response_mode")
    private String responseMode;

    @JsonProperty("conversation_id")
    private String conversationId;

    @JsonProperty("user")
    private String user;
}

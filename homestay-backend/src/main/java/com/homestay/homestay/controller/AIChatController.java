package com.homestay.homestay.controller;

import com.homestay.homestay.common.Res;
import com.homestay.homestay.service.AIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AI聊天控制器
 * 提供AI对话的REST API接口
 */
@Slf4j
@RestController
@RequestMapping("/api/ai-chat")
@Tag(name = "AI聊天", description = "AI聊天相关接口")
@CrossOrigin(origins = "*")
public class AIChatController {

    @Autowired
    private AIService aiService;

    /**
     * 发送聊天消息
     */
    @PostMapping("/send")
    @Operation(summary = "发送聊天消息", description = "向AI发送消息并获取回复")
    public Res<String> sendMessage(@RequestBody Map<String, String> request) {
        try {
            String message = request.get("message");
            String userId = request.get("userId");

            if (message == null || message.trim().isEmpty()) {
                return Res.error("400", "消息不能为空");
            }

            if (userId == null || userId.trim().isEmpty()) {
                userId = "anonymous_" + System.currentTimeMillis();
            }

            String response = aiService.getChatResponse(message, userId);
            return Res.success(response);

        } catch (Exception e) {
            log.error("发送聊天消息异常:", e);
            return Res.error("500", "发送消息失败，请重试");
        }
    }

    /**
     * 清除用户对话历史
     */
    @DeleteMapping("/history/{userId}")
    @Operation(summary = "清除对话历史", description = "清除指定用户的对话历史")
    public Res<String> clearHistory(@PathVariable String userId) {
        try {
            aiService.clearUserHistory(userId);
            return Res.success("对话历史已清除");
        } catch (Exception e) {
            log.error("清除对话历史异常:", e);
            return Res.error("500", "清除历史失败");
        }
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    @Operation(summary = "健康检查", description = "检查AI服务状态")
    public Res<String> health() {
        return Res.success("AI服务正常运行");
    }
}

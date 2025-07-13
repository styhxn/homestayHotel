package com.homestay.homestay.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.homestay.homestay.config.DifyConfig;
import com.homestay.homestay.dto.ChatMessageDto;
import com.homestay.homestay.service.ChatAssistService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 聊天助手服务实现类
 */
@Service
@Slf4j
public class ChatAssistServiceImpl implements ChatAssistService {
    
    @Autowired
    private DifyConfig difyConfig;

    @Autowired
    private RestTemplate restTemplate;

    /**
     * 聊天对话
     *
     * @param chatMessageDto 聊天消息
     * @return SSE流式响应
     */
    @Override
    public SseEmitter sendChatMessage(ChatMessageDto chatMessageDto) {
        // 创建 SSE Emitter，设置超时时间（例如 5 分钟）
        SseEmitter emitter = new SseEmitter(300_000L);

        // 使用线程池处理异步任务
        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.execute(() -> {
            try {
                // 首先尝试调用Dify服务
                try {
                    // 使用最新的Dify API URL
                    String messageUrl = "http://4295a4ce.r28.cpolar.top/v1/chat-messages";

                    // 创建请求头
                    HttpHeaders headers = new HttpHeaders();
                    headers.set("Authorization", "Bearer app-oaUwvb7k2zbC8Bi03EO977nN");
                    headers.setContentType(MediaType.APPLICATION_JSON);

                    // 创建请求实体
                    HttpEntity<ChatMessageDto> requestEntity = new HttpEntity<>(chatMessageDto, headers);

                    // 发送请求并处理流式响应
                    restTemplate.execute(
                            messageUrl,
                            HttpMethod.POST,
                            request -> {
                                // 设置请求头和请求体
                                request.getHeaders().setContentType(MediaType.APPLICATION_JSON);
                                request.getHeaders().addAll(requestEntity.getHeaders());

                                // 写入请求体
                                if (requestEntity.getBody() != null) {
                                    new ObjectMapper().writeValue(request.getBody(), requestEntity.getBody());
                                }
                            },
                            response -> {
                                try (BufferedReader reader = new BufferedReader(new InputStreamReader(response.getBody()))) {
                                    String line;
                                    while ((line = reader.readLine()) != null) {
                                        log.info("line: {}", line);
                                        // 将每一行数据推送到前端
                                        emitter.send(SseEmitter.event().data(line));
                                    }
                                    // 完成推送
                                    emitter.complete();
                                }
                                return null;
                            }
                    );
                } catch (Exception difyException) {
                    log.warn("Dify服务不可用，使用本地模拟响应: {}", difyException.getMessage());

                    // 降级到本地模拟响应
                    String mockResponse = generateMockResponse(chatMessageDto.getQuery());

                    // 模拟流式响应
                    String[] chunks = mockResponse.split("(?<=。)|(?<=！)|(?<=？)");
                    for (String chunk : chunks) {
                        if (!chunk.trim().isEmpty()) {
                            emitter.send(SseEmitter.event().data(chunk.trim()));
                            Thread.sleep(200); // 模拟流式延迟
                        }
                    }
                    emitter.complete();
                }
            } catch (Exception e) {
                log.error("聊天对话异常", e);
                // 发生错误时推送错误信息
                emitter.completeWithError(e);
            } finally {
                executor.shutdown();
                log.info("对话结束...");
            }
        });
        
        log.info("对话开始...");
        return emitter;
    }

    /**
     * 生成模拟响应（当Dify服务不可用时使用）
     */
    private String generateMockResponse(String query) {
        String lowerQuery = query.toLowerCase();

        if (lowerQuery.contains("房间") || lowerQuery.contains("预订") || lowerQuery.contains("住宿")) {
            return "🍄 欢迎来到普洱蘑菇庄园民宿！我们有多种精美房型供您选择：" +
                   "豪华海景房、普洱茶香木屋、庄园豪华套房等。" +
                   "每间房都融入了普洱茶文化元素，让您在享受舒适住宿的同时，感受浓郁的茶香氛围。" +
                   "您希望了解哪种房型的详细信息呢？";
        } else if (lowerQuery.contains("价格") || lowerQuery.contains("费用") || lowerQuery.contains("多少钱")) {
            return "🍄 我们的房间价格根据房型和季节有所不同：" +
                   "普洱茶香木屋：288元/晚，庄园豪华套房：488元/晚，豪华海景房：688元/晚。" +
                   "所有房间都包含免费早餐和茶艺体验。" +
                   "如需预订或了解更多优惠信息，请告诉我您的入住日期！";
        } else if (lowerQuery.contains("茶") || lowerQuery.contains("普洱")) {
            return "🍄 普洱蘑菇庄园民宿以茶文化为特色！" +
                   "我们提供正宗的普洱茶品鉴体验，包括古树茶、熟茶、生茶等多个品种。" +
                   "庄园内还有茶艺师现场表演，您可以学习传统的普洱茶冲泡技艺。" +
                   "每位客人都可以免费参加我们的茶文化体验活动！";
        } else if (lowerQuery.contains("位置") || lowerQuery.contains("地址") || lowerQuery.contains("交通")) {
            return "🍄 普洱蘑菇庄园位于风景秀丽的普洱茶山脚下，" +
                   "距离市中心约30分钟车程，环境清幽，空气清新。" +
                   "我们提供免费接送服务，也可以自驾前往，庄园内有充足的停车位。" +
                   "具体地址和路线信息我可以为您详细介绍！";
        } else {
            return "🍄 您好！我是普洱蘑菇庄园的AI助手小蘑菇。" +
                   "我可以为您介绍房间信息、预订服务、茶文化体验等。" +
                   "请告诉我您想了解什么，我会竭诚为您服务！" +
                   "您也可以问我关于房间预订、价格、位置、茶文化等任何问题。";
        }
    }
}

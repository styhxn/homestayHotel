package com.homestay.homestay.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Dify AI聊天助手配置
 */
@Data
@Configuration
public class DifyConfig {
    
    @Value("${chatAssist.authorization}")
    private String chatAssistAuthorization;

    @Value("${chatAssist.url}")
    private String chatAssistUrl;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

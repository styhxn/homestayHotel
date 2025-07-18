package com.homestay.homestay.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("homestay-public")
                .pathsToMatch("/**")
                .build();
    }

    @Bean
    public OpenAPI homestayOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("民宿管理系统API文档")
                        .description("<h2>民宿管理系统接口文档</h2>" +
                            "<p>本系统提供民宿管理的全套API接口，包括：</p>" +
                            "<ul>" +
                            "<li>用户管理</li>" +
                            "<li>民宿管理</li>" +
                            "<li>订单管理</li>" +
                            "<li>支付管理</li>" +
                            "</ul>" +
                            "<p>如有问题请联系技术支持</p>")
                        .version("v1.0")
                        .contact(new Contact()
                                .name("技术支持")
                                .email("support@homestay.com")
                                .url("https://www.homestay.com/contact"))
                        .license(new License()
                                .name("使用条款")
                                .url("https://www.homestay.com/terms")));
    }
}
package com.homestay.homestay.config.satoken;

import cn.dev33.satoken.router.SaRouter;
import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SaTokenConfigure implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor(handler -> {
            // 放行普通用户登录、登出、注册和错误页面
            SaRouter.match("/h/user/login").stop();
            SaRouter.match("/h/user/logout").stop();
            SaRouter.match("/h/user").stop(); // 注册功能(POST)
            SaRouter.match("/h/user/registerData").stop(); // 获取注册数据
            SaRouter.match("/error").stop();

            // 放行管理员登录接口
            SaRouter.match("/sys/user/login").stop();
            SaRouter.match("/sys/user/logout").stop();

            // 放行测试接口
            SaRouter.match("/test/**").stop();

            // 放行管理员初始化接口
            SaRouter.match("/admin/init/**").stop();

            // 放行API文档相关路径
            SaRouter.match("/doc.html").stop();
            SaRouter.match("/webjars/**").stop();
            SaRouter.match("/v3/api-docs/**").stop();
            SaRouter.match("/swagger-resources/**").stop();

            // 放行文件上传和访问路径
            SaRouter.match("/files/**").stop();

            // 放行房间查看相关接口（允许未登录用户浏览房间）
            SaRouter.match("/h/room/getFreeRoom").stop(); // 获取空闲房间
            SaRouter.match("/h/room/searchPage").stop(); // 搜索房间
            SaRouter.match("/h/room/getByName").stop(); // 按名称获取房间
            SaRouter.match("/h/room/getRoomData").stop(); // 获取房间统计数据

            // 放行聊天助手接口（允许未登录用户使用AI聊天）
            SaRouter.match("/chat/**").stop(); // 聊天助手相关接口

            // 其他请求需要登录验证
            SaRouter.match("/**").check(r -> StpUtil.checkLogin());
        })).addPathPatterns("/**");
    }
}
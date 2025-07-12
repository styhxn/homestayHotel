package com.homestay.homestay.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 简单测试控制器 - 用于调试系统连接
 */
@RestController
@RequestMapping("/test")
public class TestController {

    /**
     * 测试接口 - 检查系统状态
     */
    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("message", "后端系统运行正常");
        status.put("timestamp", new Date());
        status.put("port", "8091");
        status.put("success", true);
        return status;
    }

    /**
     * 简单的Hello接口
     */
    @GetMapping("/hello")
    public String hello() {
        return "Hello! 后端系统运行正常，当前时间: " + new Date();
    }


}

package com.homestay.homestay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class HomestayApplication {

    public static void main(String[] args) {
        System.out.println("🚀 普洱蘑菇庄园民宿系统启动中...");
        System.out.println("📋 系统信息:");
        System.out.println("   - 后端端口: 8091");
        System.out.println("   - 管理员登录接口: /sys/user/login");
        System.out.println("   - 默认管理员账号: root / root123");
        System.out.println("   - AI决策支持系统: 已集成数字人'普普'助手");
        System.out.println("💡 如果管理员登录失败，请检查数据库中是否存在管理员账号");

        ConfigurableApplicationContext context = SpringApplication.run(HomestayApplication.class, args);

        System.out.println("✅ 系统启动完成!");
        System.out.println("🌐 访问地址:");
        System.out.println("   - 前端: http://localhost:5173");
        System.out.println("   - 后端: http://localhost:8091");
        System.out.println("   - 管理员登录: http://localhost:5173/admin/login");
        System.out.println("   - AI订单测试: http://localhost:5173/ai-order-test.html");

        // 初始化测试数据
        try {
            TestDataInitializer initializer = context.getBean(TestDataInitializer.class);
            initializer.initializeTestData();
        } catch (Exception e) {
            System.err.println("❌ 测试数据初始化失败: " + e.getMessage());
        }
    }

}

package com.homestay.homestay;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * 测试数据初始化器
 */
@Component
public class TestDataInitializer {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void initializeTestData() {
        System.out.println("🍄 开始初始化测试数据...");
        
        try {
            // 1. 创建测试用户
            createTestUser();
            
            // 2. 创建房间数据
            createTestRooms();
            
            // 3. 创建订单数据
            createTestOrders();
            
            System.out.println("✅ 测试数据初始化完成!");
            System.out.println("📋 测试账号信息:");
            System.out.println("   - 用户名: testuser");
            System.out.println("   - 密码: 123456");
            System.out.println("   - 订单数量: 3个");
            
        } catch (Exception e) {
            System.err.println("❌ 测试数据初始化失败: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createTestUser() {
        System.out.println("👤 创建测试用户...");

        // 创建普通用户（h_user表）
        String hUserSql = "INSERT IGNORE INTO h_user (" +
                "username, password, real_name, phone, " +
                "gender, status, login_time, create_time, update_time, remark" +
                ") VALUES (" +
                "'testuser', '123456', '测试用户', '13800138888', " +
                "'男', 0, NOW(), NOW(), NOW(), '系统测试用户'" +
                ")";

        int result = jdbcTemplate.update(hUserSql);
        System.out.println("   - 测试用户创建结果: " + (result > 0 ? "成功" : "已存在"));
    }

    private void createTestRooms() {
        System.out.println("🏠 创建测试房间...");

        // 首先更新现有房间的code字段
        String[] updateSqls = {
            "UPDATE h_room SET code = '201', name = '蘑菇森林小屋' WHERE id = 1",
            "UPDATE h_room SET code = '202', name = '云雾山景房' WHERE id = 2",
            "UPDATE h_room SET code = '203', name = '普洱茶香阁' WHERE id = 3",
            "UPDATE h_room SET code = '204', name = '竹林静舍' WHERE id = 4",
            "UPDATE h_room SET code = '205', name = '山景别墅' WHERE id = 5",
            "UPDATE h_room SET code = '206', name = '湖畔小筑' WHERE id = 6"
        };

        for (int i = 0; i < updateSqls.length; i++) {
            try {
                int result = jdbcTemplate.update(updateSqls[i]);
                System.out.println("   - 房间" + (i + 1) + "更新结果: " + (result > 0 ? "成功" : "无变化"));
            } catch (Exception e) {
                System.err.println("   - 房间" + (i + 1) + "更新失败: " + e.getMessage());
            }
        }

        String[] roomSqls = {
            "INSERT IGNORE INTO h_room (id, name, code, category, price, status, state, seat, device, address, city, banner, `describe`, end_time, create_time, update_time) " +
            "VALUES (1, '蘑菇森林小屋', '201', '大床房', 350.00, 0, '空闲', 2, 'WiFi,空调,电视,独立卫浴,茶具套装,观景窗', '普洱蘑菇庄园茶园区A栋201', '普洱市', 'room1.jpg', '坐落在蘑菇森林中的精致小屋，房间内陈设着各种普洱茶具和茶叶。您可以在房间内品茶赏景。', DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW())",

            "INSERT IGNORE INTO h_room (id, name, code, category, price, status, state, seat, device, address, city, banner, `describe`, end_time, create_time, update_time) " +
            "VALUES (2, '云雾山景房', '202', '双床房', 380.00, 0, '空闲', 2, 'WiFi,空调,电视,独立卫浴,观景阳台,迷你吧', '普洱蘑菇庄园主楼B栋202', '普洱市', 'room2.jpg', '位于山景最佳位置的房间，推窗即可看到云雾缭绕的山峦美景，享受宁静的山居时光。', DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW())",

            "INSERT IGNORE INTO h_room (id, name, code, category, price, status, state, seat, device, address, city, banner, `describe`, end_time, create_time, update_time) " +
            "VALUES (3, '普洱茶香阁', '203', '标准间', 280.00, 0, '空闲', 2, 'WiFi,空调,电视,独立卫浴,茶艺桌,品茶区', '普洱蘑菇庄园茶园区C栋203', '普洱市', 'room3.jpg', '专为茶文化爱好者设计的房间，配备专业茶艺桌和品茶区，可体验正宗的普洱茶文化。', DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW())",

            "INSERT IGNORE INTO h_room (id, name, code, category, price, status, state, seat, device, address, city, banner, `describe`, end_time, create_time, update_time) " +
            "VALUES (4, '竹林静舍', '204', '标准间', 320.00, 0, '空闲', 2, 'WiFi,空调,电视,独立卫浴,竹制家具,禅意装饰', '普洱蘑菇庄园竹林区D栋204', '普洱市', 'room4.jpg', '坐落在翠绿竹林中的雅致居所，环境清幽，空气清新，是放松身心的理想之地。', DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW())",

            "INSERT IGNORE INTO h_room (id, name, code, category, price, status, state, seat, device, address, city, banner, `describe`, end_time, create_time, update_time) " +
            "VALUES (5, '山景别墅', '205', '别墅', 888.00, 0, '空闲', 6, 'WiFi,空调,电视,独立卫浴,厨房,花园,露台,停车位', '普洱蘑菇庄园山景区E栋205', '普洱市', 'room5.jpg', '独栋山景别墅，拥有私人花园和露台，可俯瞰整个庄园美景，适合家庭度假。', DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW())",

            "INSERT IGNORE INTO h_room (id, name, code, category, price, status, state, seat, device, address, city, banner, `describe`, end_time, create_time, update_time) " +
            "VALUES (6, '湖畔小筑', '206', '豪华间', 428.00, 0, '预订', 2, 'WiFi,空调,电视,独立卫浴,湖景阳台,垂钓设备', '普洱蘑菇庄园湖畔区F栋206', '普洱市', 'room6.jpg', '紧邻人工湖的精美小筑，推窗即可看到波光粼粼的湖面，享受宁静的湖畔时光。', DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW())"
        };

        for (int i = 0; i < roomSqls.length; i++) {
            try {
                int result = jdbcTemplate.update(roomSqls[i]);
                System.out.println("   - 房间" + (i + 1) + "创建结果: " + (result > 0 ? "成功" : "已存在"));
            } catch (Exception e) {
                System.err.println("   - 房间" + (i + 1) + "创建失败: " + e.getMessage());
            }
        }

        // 创建房间图片数据
        createRoomImages();
    }

    private void createRoomImages() {
        System.out.println("🖼️ 创建房间图片...");

        String[] imageSqls = {
            // 房间1的图片
            "INSERT IGNORE INTO h_room_img (id, room_id, name, url, status, create_time) " +
            "VALUES (1, 1, '豪华海景房主图', '/src/assets/images/card/card01.jpg', 0, NOW())",

            "INSERT IGNORE INTO h_room_img (id, room_id, name, url, status, create_time) " +
            "VALUES (2, 1, '豪华海景房内景', '/src/assets/images/card/card02.jpg', 0, NOW())",

            // 房间2的图片
            "INSERT IGNORE INTO h_room_img (id, room_id, name, url, status, create_time) " +
            "VALUES (3, 2, '普洱茶香木屋主图', '/src/assets/images/card/card03.jpg', 0, NOW())",

            "INSERT IGNORE INTO h_room_img (id, room_id, name, url, status, create_time) " +
            "VALUES (4, 2, '普洱茶香木屋茶室', '/src/assets/images/card/card04.JPG', 0, NOW())",

            // 房间3的图片
            "INSERT IGNORE INTO h_room_img (id, room_id, name, url, status, create_time) " +
            "VALUES (5, 3, '庄园豪华套房主图', '/src/assets/images/card/card05.jpg', 0, NOW())",

            "INSERT IGNORE INTO h_room_img (id, room_id, name, url, status, create_time) " +
            "VALUES (6, 3, '庄园豪华套房客厅', '/src/assets/images/card/card06.png', 0, NOW())",

            // 房间4的图片
            "INSERT IGNORE INTO h_room_img (id, room_id, name, url, status, create_time) " +
            "VALUES (7, 4, '竹林雅居主图', '/src/assets/images/card/card07.jpg', 0, NOW())",

            // 房间5的图片
            "INSERT IGNORE INTO h_room_img (id, room_id, name, url, status, create_time) " +
            "VALUES (8, 5, '山景别墅主图', '/src/assets/images/card/card08.JPG', 0, NOW())",

            // 房间6的图片
            "INSERT IGNORE INTO h_room_img (id, room_id, name, url, status, create_time) " +
            "VALUES (9, 6, '湖畔小筑主图', '/src/assets/images/card/card01.jpg', 0, NOW())"
        };

        for (int i = 0; i < imageSqls.length; i++) {
            try {
                int result = jdbcTemplate.update(imageSqls[i]);
                System.out.println("   - 图片" + (i + 1) + "创建结果: " + (result > 0 ? "成功" : "已存在"));
            } catch (Exception e) {
                System.err.println("   - 图片" + (i + 1) + "创建失败: " + e.getMessage());
            }
        }
    }

    private void createTestOrders() {
        System.out.println("📝 创建测试订单...");
        
        // 获取测试用户ID
        String getUserIdSql = "SELECT id FROM h_user WHERE username = 'testuser' LIMIT 1";
        Integer userId;
        try {
            userId = jdbcTemplate.queryForObject(getUserIdSql, Integer.class);
        } catch (Exception e) {
            System.err.println("   - 获取测试用户ID失败: " + e.getMessage());
            return;
        }
        
        if (userId == null) {
            System.err.println("   - 测试用户不存在，无法创建订单");
            return;
        }
        
        String[] orderSqls = {
            // 订单1：已入住状态（不能取消）
            "INSERT IGNORE INTO h_order (" +
            "id, user_id, room_id, room_code, start_date, end_date, " +
            "days, total, phone, state, status, create_time, update_time" +
            ") VALUES (" +
            "1, " + userId + ", 1, '201', '2025-01-15', '2025-01-17', " +
            "2, '700.00', '13800138888', '入住', 0, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)" +
            ")",

            // 订单2：预订状态（可以取消）
            "INSERT IGNORE INTO h_order (" +
            "id, user_id, room_id, room_code, start_date, end_date, " +
            "days, total, phone, state, status, create_time, update_time" +
            ") VALUES (" +
            "2, " + userId + ", 2, '202', '2025-01-20', '2025-01-22', " +
            "2, '760.00', '13800138888', '预订', 0, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR)" +
            ")",

            // 订单3：预订状态（可以取消）
            "INSERT IGNORE INTO h_order (" +
            "id, user_id, room_id, room_code, start_date, end_date, " +
            "days, total, phone, state, status, create_time, update_time" +
            ") VALUES (" +
            "3, " + userId + ", 3, '203', '2025-01-25', '2025-01-27', " +
            "2, '560.00', '13800138888', '预订', 0, DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR)" +
            ")"
        };
        
        String[] orderNames = {"蘑菇森林小屋201(入住)", "云雾山景房202(预订)", "普洱茶香阁203(预订)"};
        
        for (int i = 0; i < orderSqls.length; i++) {
            try {
                int result = jdbcTemplate.update(orderSqls[i]);
                System.out.println("   - " + orderNames[i] + "创建结果: " + (result > 0 ? "成功" : "已存在"));
            } catch (Exception e) {
                System.err.println("   - " + orderNames[i] + "创建失败: " + e.getMessage());
            }
        }
        
        // 验证创建的订单
        try {
            String countSql = "SELECT COUNT(*) FROM h_order WHERE user_id = ?";
            Integer orderCount = jdbcTemplate.queryForObject(countSql, Integer.class, userId);
            System.out.println("   - 用户订单总数: " + orderCount);
        } catch (Exception e) {
            System.err.println("   - 验证订单数量失败: " + e.getMessage());
        }
    }
}

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
        
        String sql = "INSERT IGNORE INTO sys_user (" +
                "username, password, real_name, email, phonenumber, " +
                "gender, role, status, create_time, update_time, remark" +
                ") VALUES (" +
                "'testuser', '123456', '测试用户', 'test@mushroom-garden.com', '13800138888', " +
                "'男', 0, 0, NOW(), NOW(), '系统测试用户'" +
                ")";
        
        int result = jdbcTemplate.update(sql);
        System.out.println("   - 测试用户创建结果: " + (result > 0 ? "成功" : "已存在"));
    }

    private void createTestRooms() {
        System.out.println("🏠 创建测试房间...");

        String[] roomSqls = {
            "INSERT IGNORE INTO h_room (id, name, code, category, price, status, state, seat, device, address, city, banner, `describe`, end_time, create_time, update_time) " +
            "VALUES (1, '豪华海景房', 'ROOM-001', '豪华间', 9999.00, 0, '空闲', 2, '空调,电视,WiFi,独立卫浴', '亚龙湾度假区1号', '三亚', 'room1.jpg', '豪华海景房，带阳台，可欣赏无敌海景', '2022-01-01', '2025-07-03 17:42:30', NULL)",

            "INSERT IGNORE INTO h_room (id, name, code, category, price, status, state, seat, device, address, city, banner, `describe`, end_time, create_time, update_time) " +
            "VALUES (2, '普洱茶香木屋', 'MG-002', '标准间', 288.00, 0, '空闲', 2, 'WiFi,空调,电视,独立卫浴,茶具套装,观景窗', '普洱蘑菇庄园茶园区B栋', '普洱市', 'room2.jpg', '充满茶香的精致木屋，房间内陈设着各种普洱茶具和茶叶。您可以在房间内品茶赏景。', DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW())",

            "INSERT IGNORE INTO h_room (id, name, code, category, price, status, state, seat, device, address, city, banner, `describe`, end_time, create_time, update_time) " +
            "VALUES (3, '庄园豪华套房', 'MG-003', '套房', 588.00, 0, '空闲', 4, 'WiFi,空调,电视,独立卫浴,客厅,阳台,迷你吧,保险箱', '普洱蘑菇庄园主楼C栋', '普洱市', 'room3.jpg', '庄园内最豪华的套房，拥有独立客厅、卧室和观景阳台。房间装修典雅，设施齐全。', DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW())",

            "INSERT IGNORE INTO h_room (id, name, code, category, price, status, state, seat, device, address, city, banner, `describe`, end_time, create_time, update_time) " +
            "VALUES (4, '竹林雅居', 'MG-004', '标准间', 258.00, 0, '空闲', 2, 'WiFi,空调,电视,独立卫浴,竹制家具,禅意装饰', '普洱蘑菇庄园竹林区D栋', '普洱市', 'room4.jpg', '坐落在翠绿竹林中的雅致居所，环境清幽，空气清新，是放松身心的理想之地。', DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW())",

            "INSERT IGNORE INTO h_room (id, name, code, category, price, status, state, seat, device, address, city, banner, `describe`, end_time, create_time, update_time) " +
            "VALUES (5, '山景别墅', 'MG-005', '别墅', 888.00, 0, '空闲', 6, 'WiFi,空调,电视,独立卫浴,厨房,花园,露台,停车位', '普洱蘑菇庄园山景区E栋', '普洱市', 'room5.jpg', '独栋山景别墅，拥有私人花园和露台，可俯瞰整个庄园美景，适合家庭度假。', DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW())",

            "INSERT IGNORE INTO h_room (id, name, code, category, price, status, state, seat, device, address, city, banner, `describe`, end_time, create_time, update_time) " +
            "VALUES (6, '湖畔小筑', 'MG-006', '豪华间', 428.00, 0, '预订', 2, 'WiFi,空调,电视,独立卫浴,湖景阳台,垂钓设备', '普洱蘑菇庄园湖畔区F栋', '普洱市', 'room6.jpg', '紧邻人工湖的精美小筑，推窗即可看到波光粼粼的湖面，享受宁静的湖畔时光。', DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW())"
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
        String getUserIdSql = "SELECT id FROM sys_user WHERE username = 'testuser' LIMIT 1";
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
            "1, " + userId + ", 1, '豪华海景房', '2025-01-15', '2025-01-17', " +
            "2, '776.00', '13800138888', '入住', 0, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)" +
            ")",
            
            // 订单2：预订状态（可以取消）
            "INSERT IGNORE INTO h_order (" +
            "id, user_id, room_id, room_code, start_date, end_date, " +
            "days, total, phone, state, status, create_time, update_time" +
            ") VALUES (" +
            "2, " + userId + ", 2, '普洱茶香木屋', '2025-01-20', '2025-01-22', " +
            "2, '576.00', '13800138888', '预订', 0, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR)" +
            ")",
            
            // 订单3：预订状态（可以取消）
            "INSERT IGNORE INTO h_order (" +
            "id, user_id, room_id, room_code, start_date, end_date, " +
            "days, total, phone, state, status, create_time, update_time" +
            ") VALUES (" +
            "3, " + userId + ", 3, '庄园豪华套房', '2025-01-25', '2025-01-27', " +
            "2, '1176.00', '13800138888', '预订', 0, DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR)" +
            ")"
        };
        
        String[] orderNames = {"豪华海景房(入住)", "普洱茶香木屋(预订)", "庄园豪华套房(预订)"};
        
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

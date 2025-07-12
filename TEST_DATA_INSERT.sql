-- 测试数据插入脚本
-- 用于添加真实的订单和房间数据

-- 1. 创建测试用户（如果不存在）
INSERT IGNORE INTO sys_user (
    username, password, real_name, email, phonenumber, 
    gender, role, status, create_time, update_time, remark
) VALUES (
    'testuser', '123456', '测试用户', 'test@mushroom-garden.com', '13800138888',
    '男', 0, 0, NOW(), NOW(), '系统测试用户'
);

-- 2. 创建房间数据（如果不存在）
INSERT IGNORE INTO h_room (
    id, price, status, start_time, end_time, create_time, update_time
) VALUES 
(1, 388.00, 0, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW()),
(2, 288.00, 0, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW()),
(3, 588.00, 0, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW());

-- 3. 获取测试用户ID（假设为最新创建的用户）
SET @test_user_id = (SELECT id FROM sys_user WHERE username = 'testuser' LIMIT 1);

-- 4. 创建测试订单数据
INSERT IGNORE INTO h_order (
    id, user_id, room_id, room_code, start_date, end_date, 
    days, total, phone, state, status, create_time, update_time
) VALUES 
-- 订单1：已入住状态（不能取消）
(1, @test_user_id, 1, '蘑菇森林小屋', '2025-01-15', '2025-01-17', 
 2, '776.00', '13800138888', '入住', 0, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- 订单2：预订状态（可以取消）
(2, @test_user_id, 2, '普洱茶香木屋', '2025-01-20', '2025-01-22', 
 2, '576.00', '13800138888', '预订', 0, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR)),

-- 订单3：预订状态（可以取消）
(3, @test_user_id, 3, '庄园豪华套房', '2025-01-25', '2025-01-27', 
 2, '1176.00', '13800138888', '预订', 0, DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- 5. 验证数据
SELECT '=== 测试用户信息 ===' as info;
SELECT id, username, real_name, email, phonenumber FROM sys_user WHERE username = 'testuser';

SELECT '=== 房间信息 ===' as info;
SELECT id, price, status FROM h_room WHERE id IN (1, 2, 3);

SELECT '=== 订单信息 ===' as info;
SELECT id, user_id, room_id, room_code, state, status, total, create_time 
FROM h_order 
WHERE user_id = @test_user_id
ORDER BY create_time DESC;

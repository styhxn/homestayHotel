-- 插入测试数据

-- 插入角色数据
INSERT INTO `sys_role` (`id`, `status`, `name`, `code`, `remark`) VALUES
(1, 0, '超级管理员', 'admin', '系统超级管理员'),
(2, 0, '普通管理员', 'manager', '普通管理员');

-- 插入管理员用户 (密码都是 123456)
INSERT INTO `sys_user` (`id`, `role`, `status`, `username`, `password`, `real_name`, `email`, `phonenumber`) VALUES
(1, 1, 0, 'admin', '123456', '系统管理员', 'admin@hotel.com', '13800138000'),
(2, 2, 0, 'manager', '123456', '酒店经理', 'manager@hotel.com', '13900139000');

-- 插入普通用户 (密码都是 123456)
INSERT INTO `h_user` (`id`, `username`, `password`, `real_name`, `phone`, `gender`, `total`) VALUES
(1, 'user1', '123456', '张三', '13700137000', '男', 0.00),
(2, 'user2', '123456', '李四', '13600136000', '女', 1500.00),
(3, 'testuser', '123456', '测试用户', '13500135000', '男', 500.00);

-- 插入房间数据（普洱蘑菇庄园主题）
INSERT INTO `h_room` (`id`, `status`, `name`, `city`, `address`, `code`, `category`, `price`, `state`, `banner`, `seat`, `describe`, `weight`) VALUES
(1, 0, '雨林景观豪华蘑菇屋', '普洱市', '普洱蘑菇庄园2楼', '201', '大床房', 19.00, '空闲', '/src/assets/images/实地调研/房间参观/房间参观1.jpg', 2, '南向采光，带窗户，房间高度2.4米，享受雨林美景的豪华蘑菇主题房间', 100),
(2, 0, '雨林景观豪华蘑菇屋', '普洱市', '普洱蘑菇庄园2楼', '204', '单人间', 999.00, '空闲', '/src/assets/images/实地调研/房间参观/房间参观2.jpg', 1, '南向采光，带窗户，房间高度2.4米，适合单人入住的精致蘑菇屋', 90),
(3, 0, '雨林景观豪华蘑菇屋', '普洱市', '普洱蘑菇庄园1楼', '105', '单人间', 256.00, '空闲', '/src/assets/images/实地调研/房间参观/房间参观3.jpg', 1, '无窗户设计，房间高度2.4米，经济实惠的单人蘑菇屋', 70),
(4, 0, '雨林景观豪华蘑菇屋', '普洱市', '普洱蘑菇庄园3楼', '301', '亲子房', 486.00, '空闲', '/src/assets/images/环境展示/庄园内部1.jpg', 3, '无窗户设计，房间高度2.4米，适合家庭入住的温馨亲子蘑菇屋', 85),
(5, 0, '雨林景观豪华蘑菇屋', '普洱市', '普洱蘑菇庄园3楼', '303', '双人间', 388.00, '空闲', '/src/assets/images/环境展示/庄园内部2.jpg', 2, '南向采光，带窗户，房间高度2.4米，舒适的双人蘑菇屋', 80);

-- 插入菜单数据
INSERT INTO `sys_menu` (`menu_id`, `status`, `menu_name`, `menu_icon`, `parent_id`, `order_num`, `menu_url`, `component`, `menu_type`, `perms`) VALUES
(1, 0, '系统管理', 'system', 0, 1, '/system', '', 'M', ''),
(2, 0, '控制台', 'dashboard', 0, 0, '/dashboard', 'dashboard/index', 'C', 'system:dashboard:view'),
(3, 0, '房间管理', 'room', 0, 2, '/room', 'room/index', 'C', 'system:room:view'),
(4, 0, '订单管理', 'order', 0, 3, '/order', 'order/index', 'C', 'system:order:view'),
(5, 0, '用户管理', 'user', 1, 1, '/system/user', 'system/user/index', 'C', 'system:user:view');

-- 插入角色菜单关联数据
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),  -- 超级管理员拥有所有权限
(2, 2), (2, 3), (2, 4);  -- 普通管理员拥有部分权限

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

-- 插入房间数据
INSERT INTO `h_room` (`id`, `status`, `name`, `city`, `address`, `code`, `category`, `price`, `state`, `banner`, `seat`, `describe`, `weight`) VALUES
(1, 0, '豪华海景套房', '三亚', '三亚市天涯区海棠湾', 'R001', '套房', 888.00, '空闲', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a', 2, '享受无敌海景，配备豪华设施的顶级套房', 100),
(2, 0, '商务标准间', '北京', '北京市朝阳区国贸', 'R002', '标准间', 288.00, '空闲', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304', 1, '适合商务出行的舒适标准间', 80),
(3, 0, '豪华大床房', '上海', '上海市浦东新区陆家嘴', 'R003', '豪华间', 468.00, '空闲', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461', 1, '宽敞舒适的豪华大床房，适合情侣入住', 90),
(4, 0, '家庭套房', '广州', '广州市天河区珠江新城', 'R004', '套房', 688.00, '空闲', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', 4, '适合家庭出游的温馨套房', 85),
(5, 0, '经济双人间', '深圳', '深圳市南山区科技园', 'R005', '标准间', 188.00, '空闲', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', 2, '经济实惠的双人间，性价比高', 70);

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

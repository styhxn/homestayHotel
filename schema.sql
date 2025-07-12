-- 民宿用户表(先创建被引用的表)
CREATE TABLE `h_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '登录用户名',
  `password` varchar(100) NOT NULL COMMENT '登录密码',
  `avatar` varchar(200) DEFAULT NULL COMMENT '用户头像',
  `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `id_card` varchar(18) DEFAULT NULL COMMENT '身份证号码',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `gender` varchar(10) DEFAULT NULL COMMENT '性别',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `total` decimal(10,2) DEFAULT '0.00' COMMENT '总消费金额',
  `status` int DEFAULT '0' COMMENT '账号状态(0正常/1停用)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='民宿用户表';

-- 房间表(先创建被引用的表)
CREATE TABLE `h_room` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '房间ID',
  `status` int DEFAULT '0' COMMENT '房间状态(0启用,1禁用)',
  `name` varchar(100) NOT NULL COMMENT '民宿名字',
  `city` varchar(50) DEFAULT NULL COMMENT '所在城市',
  `device` varchar(500) DEFAULT NULL COMMENT '配套设施',
  `address` varchar(200) DEFAULT NULL COMMENT '详细地址',
  `code` varchar(20) NOT NULL COMMENT '房间号',
  `category` varchar(50) DEFAULT NULL COMMENT '分类',
  `price` decimal(10,2) NOT NULL COMMENT '房间价格',
  `state` varchar(20) DEFAULT NULL COMMENT '房间使用状态(空闲/预定/入住)',
  `banner` varchar(200) DEFAULT NULL COMMENT 'banner图地址',
  `seat` int DEFAULT '1' COMMENT '床位数',
  `describe` text COMMENT '描述',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `weight` int DEFAULT '0' COMMENT '权重(排序用)',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `end_time` date DEFAULT NULL COMMENT '房间服务结束日期',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房间表';

-- 系统用户表
CREATE TABLE `sys_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `role` bigint DEFAULT NULL COMMENT '权限ID',
  `status` int DEFAULT '0' COMMENT '账号状态(0正常/1停用)',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `id_card` varchar(18) DEFAULT NULL COMMENT '身份证号码',
  `gender` varchar(10) DEFAULT NULL COMMENT '性别',
  `address` varchar(200) DEFAULT NULL COMMENT '地址',
  `avatar` varchar(200) DEFAULT NULL COMMENT '用户头像',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `phonenumber` varchar(20) DEFAULT NULL COMMENT '手机号码',
  `login_date` datetime DEFAULT NULL COMMENT '最后登录时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户表';

-- 角色表
CREATE TABLE `sys_role` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `status` int DEFAULT '0' COMMENT '角色状态',
  `name` varchar(50) NOT NULL COMMENT '角色名称',
  `code` varchar(100) DEFAULT NULL COMMENT '角色权限字符串',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 菜单表
CREATE TABLE `sys_menu` (
  `menu_id` bigint NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `status` int DEFAULT '0' COMMENT '菜单状态',
  `menu_name` varchar(50) NOT NULL COMMENT '菜单名称',
  `menu_icon` varchar(50) DEFAULT NULL COMMENT '菜单图标',
  `parent_id` bigint DEFAULT '0' COMMENT '父菜单ID',
  `order_num` int DEFAULT '0' COMMENT '显示顺序',
  `menu_url` varchar(200) DEFAULT NULL COMMENT '路由地址',
  `component` varchar(200) DEFAULT NULL COMMENT '组件路径',
  `menu_type` char(1) DEFAULT NULL COMMENT '菜单类型(M目录/C菜单/F按钮)',
  `perms` varchar(100) DEFAULT NULL COMMENT '权限标识',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单表';

-- 角色菜单关联表
CREATE TABLE `sys_role_menu` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `menu_id` bigint NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_menu` (`role_id`,`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';

-- 文件表
CREATE TABLE `sys_file` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `uuid` varchar(50) NOT NULL COMMENT '文件UUID',
  `name` varchar(100) NOT NULL COMMENT '服务器存储的文件名',
  `type` varchar(50) DEFAULT NULL COMMENT '文件类型',
  `path` varchar(200) NOT NULL COMMENT '文件存储路径',
  `size` bigint DEFAULT '0' COMMENT '文件大小(字节)',
  `format_size` varchar(20) DEFAULT NULL COMMENT '格式化后的文件大小',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  `user_id` bigint DEFAULT NULL COMMENT '上传用户ID',
  `username` varchar(50) DEFAULT NULL COMMENT '上传用户名',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件表';

-- 日志表
CREATE TABLE `sys_log` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `operation` varchar(100) DEFAULT NULL COMMENT '操作描述',
  `method` varchar(100) DEFAULT NULL COMMENT '请求方法',
  `uri` varchar(200) DEFAULT NULL COMMENT '请求URI',
  `ip` varchar(50) DEFAULT NULL COMMENT '请求IP',
  `params` text COMMENT '请求参数',
  `operator_id` bigint DEFAULT NULL COMMENT '操作者ID',
  `operator_name` varchar(50) DEFAULT NULL COMMENT '操作者名称',
  `use_time` double DEFAULT NULL COMMENT '请求耗时(毫秒)',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` int DEFAULT '0' COMMENT '操作状态(0成功/1失败)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='日志表';

-- 房间图片表
CREATE TABLE `h_room_img` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `room_id` bigint NOT NULL COMMENT '所属房间ID',
  `file_id` bigint DEFAULT NULL COMMENT '文件ID',
  `name` varchar(100) DEFAULT NULL COMMENT '文件名',
  `url` varchar(200) NOT NULL COMMENT '文件路径',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  `status` int DEFAULT '0' COMMENT '状态(0启用/1禁用)',
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房间图片表';

-- 订单表
CREATE TABLE `h_order` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '订单号',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `username` varchar(50) DEFAULT NULL COMMENT '用户名',
  `id_card` varchar(18) DEFAULT NULL COMMENT '用户身份证号码',
  `phone` varchar(20) DEFAULT NULL COMMENT '用户电话号码',
  `start_date` date NOT NULL COMMENT '入住日期',
  `end_date` date NOT NULL COMMENT '离开日期',
  `amount` int DEFAULT '1' COMMENT '入住人数',
  `room_id` bigint NOT NULL COMMENT '房间ID',
  `room_code` varchar(20) DEFAULT NULL COMMENT '房间号',
  `user_info` varchar(500) DEFAULT NULL COMMENT '用户添加的备注',
  `user_remark` varchar(500) DEFAULT NULL COMMENT '用户备注',
  `state` varchar(20) DEFAULT NULL COMMENT '预定状态(预订/入住/取消/完成/删除)',
  `total` decimal(10,2) NOT NULL COMMENT '订单总价',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `pay_state` int DEFAULT '0' COMMENT '支付状态(0未支付/1已支付)',
  `status` int DEFAULT '0' COMMENT '订单状态(0正常/1完成/2关闭/3删除)',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `days` int DEFAULT '1' COMMENT '入住天数',
  `rate` int DEFAULT NULL COMMENT '评分',
  `comment` text COMMENT '评价',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `room_id` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 外键约束暂时注释掉，待所有表创建成功后再手动添加
/*
ALTER TABLE `h_room_img` ADD CONSTRAINT `fk_room_img_room` FOREIGN KEY (`room_id`) REFERENCES `h_room` (`id`);
ALTER TABLE `h_order` ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `h_user` (`id`);
ALTER TABLE `h_order` ADD CONSTRAINT `fk_order_room` FOREIGN KEY (`room_id`) REFERENCES `h_room` (`id`);
ALTER TABLE `sys_role_menu` ADD CONSTRAINT `fk_role_menu_role` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`);
ALTER TABLE `sys_role_menu` ADD CONSTRAINT `fk_role_menu_menu` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`menu_id`);
*/
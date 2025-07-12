-- 修复房间数据脚本
USE homestay;

-- 1. 更新房间图片表
UPDATE h_room_img SET name = '豪华海景房主图' WHERE id = 1 AND room_id = 1;
UPDATE h_room_img SET name = '豪华海景房内景' WHERE id = 2 AND room_id = 1;

-- 2. 更新订单表中的房间名称
UPDATE h_order SET room_code = '豪华海景房' WHERE room_id = 1;

-- 查看更新结果
SELECT '图片信息' as 类型, id, name FROM h_room_img WHERE room_id = 1;
SELECT '订单信息' as 类型, id, room_code FROM h_order WHERE room_id = 1;

-- 安全更新房间数据为普洱蘑菇庄园主题
-- 不删除现有数据，只更新现有房间信息

-- 更新现有房间为普洱蘑菇庄园主题
UPDATE h_room SET 
    name = '雨林景观豪华蘑菇屋',
    city = '普洱市',
    address = '普洱蘑菇庄园2楼',
    code = '201',
    category = '大床房',
    price = 19.00,
    state = '空闲',
    banner = '/src/assets/images/实地调研/房间参观/房间参观1.jpg',
    seat = 2,
    `describe` = '南向采光，带窗户，房间高度2.4米，享受雨林美景的豪华蘑菇主题房间',
    device = 'WiFi,空调,电视,独立卫浴,观景窗,蘑菇主题装饰',
    weight = 100
WHERE id = 1;

UPDATE h_room SET 
    name = '雨林景观豪华蘑菇屋',
    city = '普洱市',
    address = '普洱蘑菇庄园2楼',
    code = '204',
    category = '单人间',
    price = 999.00,
    state = '空闲',
    banner = '/src/assets/images/实地调研/房间参观/房间参观2.jpg',
    seat = 1,
    `describe` = '南向采光，带窗户，房间高度2.4米，适合单人入住的精致蘑菇屋',
    device = 'WiFi,空调,电视,独立卫浴,观景窗,蘑菇主题装饰,迷你吧',
    weight = 90
WHERE id = 2;

UPDATE h_room SET 
    name = '雨林景观豪华蘑菇屋',
    city = '普洱市',
    address = '普洱蘑菇庄园1楼',
    code = '105',
    category = '单人间',
    price = 256.00,
    state = '空闲',
    banner = '/src/assets/images/实地调研/房间参观/房间参观3.jpg',
    seat = 1,
    `describe` = '无窗户设计，房间高度2.4米，经济实惠的单人蘑菇屋',
    device = 'WiFi,空调,电视,独立卫浴,蘑菇主题装饰',
    weight = 70
WHERE id = 3;

UPDATE h_room SET 
    name = '雨林景观豪华蘑菇屋',
    city = '普洱市',
    address = '普洱蘑菇庄园3楼',
    code = '301',
    category = '亲子房',
    price = 486.00,
    state = '空闲',
    banner = '/src/assets/images/环境展示/庄园内部1.jpg',
    seat = 3,
    `describe` = '无窗户设计，房间高度2.4米，适合家庭入住的温馨亲子蘑菇屋',
    device = 'WiFi,空调,电视,独立卫浴,蘑菇主题装饰,儿童设施,游戏区',
    weight = 85
WHERE id = 4;

UPDATE h_room SET 
    name = '雨林景观豪华蘑菇屋',
    city = '普洱市',
    address = '普洱蘑菇庄园3楼',
    code = '303',
    category = '双人间',
    price = 388.00,
    state = '空闲',
    banner = '/src/assets/images/环境展示/庄园内部2.jpg',
    seat = 2,
    `describe` = '南向采光，带窗户，房间高度2.4米，舒适的双人蘑菇屋',
    device = 'WiFi,空调,电视,独立卫浴,观景窗,蘑菇主题装饰',
    weight = 80
WHERE id = 5;

-- 如果有第6个房间，也更新它
UPDATE h_room SET 
    name = '雨林景观豪华蘑菇屋',
    city = '普洱市',
    address = '普洱蘑菇庄园2楼',
    code = '212',
    category = '亲子房',
    price = 418.00,
    state = '空闲',
    banner = '/src/assets/images/card/card01.jpg',
    seat = 3,
    `describe` = '西向采光，带窗户，房间高度2.4米，温馨的亲子蘑菇屋',
    device = 'WiFi,空调,电视,独立卫浴,观景窗,蘑菇主题装饰,儿童设施',
    weight = 82
WHERE id = 6;

-- 验证更新结果
SELECT id, name, code, category, price, address, `describe` FROM h_room ORDER BY weight DESC;

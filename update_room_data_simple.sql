-- Update room data to Puer Mushroom Farm theme
-- Safe update without deleting existing data

UPDATE h_room SET 
    name = 'Rainforest Luxury Mushroom House',
    city = 'Puer City',
    address = 'Puer Mushroom Farm 2F',
    code = '201',
    category = 'Big Bed Room',
    price = 19.00,
    state = 'Available',
    banner = '/src/assets/images/实地调研/房间参观/房间参观1.jpg',
    seat = 2,
    `describe` = 'South-facing with windows, 2.4m height, luxury mushroom themed room with rainforest view',
    device = 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor',
    weight = 100
WHERE id = 1;

UPDATE h_room SET 
    name = 'Rainforest Luxury Mushroom House',
    city = 'Puer City',
    address = 'Puer Mushroom Farm 2F',
    code = '204',
    category = 'Single Room',
    price = 999.00,
    state = 'Available',
    banner = '/src/assets/images/实地调研/房间参观/房间参观2.jpg',
    seat = 1,
    `describe` = 'South-facing with windows, 2.4m height, delicate single mushroom house',
    device = 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor,Mini Bar',
    weight = 90
WHERE id = 2;

UPDATE h_room SET 
    name = 'Rainforest Luxury Mushroom House',
    city = 'Puer City',
    address = 'Puer Mushroom Farm 1F',
    code = '105',
    category = 'Single Room',
    price = 256.00,
    state = 'Available',
    banner = '/src/assets/images/实地调研/房间参观/房间参观3.jpg',
    seat = 1,
    `describe` = 'No windows, 2.4m height, economical single mushroom house',
    device = 'WiFi,AC,TV,Private Bath,Mushroom Theme Decor',
    weight = 70
WHERE id = 3;

UPDATE h_room SET 
    name = 'Rainforest Luxury Mushroom House',
    city = 'Puer City',
    address = 'Puer Mushroom Farm 3F',
    code = '301',
    category = 'Family Room',
    price = 486.00,
    state = 'Available',
    banner = '/src/assets/images/环境展示/庄园内部1.jpg',
    seat = 3,
    `describe` = 'No windows, 2.4m height, cozy family mushroom house',
    device = 'WiFi,AC,TV,Private Bath,Mushroom Theme Decor,Kids Facilities',
    weight = 85
WHERE id = 4;

UPDATE h_room SET 
    name = 'Rainforest Luxury Mushroom House',
    city = 'Puer City',
    address = 'Puer Mushroom Farm 3F',
    code = '303',
    category = 'Double Room',
    price = 388.00,
    state = 'Available',
    banner = '/src/assets/images/环境展示/庄园内部2.jpg',
    seat = 2,
    `describe` = 'South-facing with windows, 2.4m height, comfortable double mushroom house',
    device = 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor',
    weight = 80
WHERE id = 5;

UPDATE h_room SET 
    name = 'Rainforest Luxury Mushroom House',
    city = 'Puer City',
    address = 'Puer Mushroom Farm 2F',
    code = '212',
    category = 'Family Room',
    price = 418.00,
    state = 'Available',
    banner = '/src/assets/images/card/card01.jpg',
    seat = 3,
    `describe` = 'West-facing with windows, 2.4m height, warm family mushroom house',
    device = 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor,Kids Facilities',
    weight = 82
WHERE id = 6;

-- Verify the update
SELECT id, name, code, category, price, address FROM h_room ORDER BY weight DESC;

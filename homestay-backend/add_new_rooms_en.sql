-- Add new room data script (English version)
-- Based on Excel data, add missing rooms

-- Check current room count
SELECT COUNT(*) as current_room_count FROM h_room;

-- Add missing rooms from 1F, 2F, 3F
INSERT INTO `h_room` (`status`, `name`, `city`, `address`, `code`, `category`, `price`, `state`, `banner`, `seat`, `describe`, `device`, `weight`) VALUES

-- Exhibition Hall
(0, 'Exhibition Hall', 'Puer City', 'Puer Mushroom Farm 1F', 'HALL', 'Exhibition', 0.00, 'Open', '/src/assets/images/环境展示/庄园内部1.jpg', 0, 'Mushroom farm exhibition hall showcasing mushroom culture and ecology', 'WiFi,AC,Display Equipment,Multimedia', 50),

-- 1F Rooms
(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 1F', '104', 'Single Room', 255.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观3.jpg', 1, 'No windows, 2.4m height, comfortable single mushroom house', 'WiFi,AC,TV,Private Bath,Mushroom Theme Decor', 69),

(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 1F', '103', 'Single Room', 333.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观3.jpg', 1, 'No windows, 2.4m height, delicate single mushroom house', 'WiFi,AC,TV,Private Bath,Mushroom Theme Decor', 75),

(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 1F', '102', 'Big Bed Room', 888.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观1.jpg', 2, 'East-facing with windows, 2.4m height, luxury big bed mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor,Mini Bar', 95),

(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 1F', '106', 'Single Room', 666.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观2.jpg', 1, 'South-facing with windows, 2.4m height, premium single mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor', 88),

(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 1F', '107', 'Single Room', 456.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观2.jpg', 1, 'South-facing with windows, 2.4m height, comfortable single mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor', 80),

(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 1F', '108', 'Single Room', 156.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观2.jpg', 1, 'South-facing with windows, 2.4m height, economical single mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor', 65),

(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 1F', '101', 'Single Room', 18.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观2.jpg', 1, 'East-facing with windows, 2.4m height, super value single mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor', 100),

-- 2F Rooms
(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 2F', '210', 'Single Room', 189.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观2.jpg', 1, 'North-facing with windows, 2.4m height, economical single mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor', 68),

(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 2F', '209', 'Single Room', 418.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观2.jpg', 1, 'North-facing with windows, 2.4m height, comfortable single mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor', 81),

(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 2F', '208', 'Single Room', 18.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观2.jpg', 1, 'North-facing with windows, 2.4m height, super value single mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor', 99),

(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 2F', '207', 'Big Bed Room', 186.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观1.jpg', 2, 'East-facing with windows, 2.4m height, economical big bed mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor', 67),

(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 2F', '206', 'Double Room', 654.00, 'Available', '/src/assets/images/环境展示/庄园内部2.jpg', 2, 'West-facing with windows, 2.4m height, premium double mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor', 87),

(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 2F', '205', 'Double Room', 789.00, 'Available', '/src/assets/images/环境展示/庄园内部2.jpg', 2, 'East-facing with windows, 2.4m height, luxury double mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor,Mini Bar', 92),

(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 2F', '203', 'Single Room', 889.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观2.jpg', 1, 'South-facing with windows, 2.4m height, luxury single mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor,Mini Bar', 94),

(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 2F', '202', 'Single Room', 48.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观2.jpg', 1, 'South-facing with windows, 2.4m height, special price single mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor', 85),

-- 3F Rooms
(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 3F', '302', 'Family Room', 1088.00, 'Available', '/src/assets/images/环境展示/庄园内部1.jpg', 3, 'No windows, 2.4m height, top luxury family mushroom house', 'WiFi,AC,TV,Private Bath,Mushroom Theme Decor,Kids Facilities,Game Area,Mini Bar,Safe', 97);

-- Verify results
SELECT COUNT(*) as new_room_count FROM h_room;
SELECT code, category, price FROM h_room ORDER BY price DESC LIMIT 10;

-- Add missing room 204
INSERT INTO h_room (status, name, city, address, code, category, price, state, banner, seat, `describe`, device, weight) VALUES 
(0, 'Rainforest Luxury Mushroom House', 'Puer City', 'Puer Mushroom Farm 2F', '204', 'Single Room', 999.00, 'Available', '/src/assets/images/实地调研/房间参观/房间参观2.jpg', 1, 'South-facing with windows, 2.4m height, top luxury single mushroom house', 'WiFi,AC,TV,Private Bath,Window View,Mushroom Theme Decor,Mini Bar,Safe', 98);

-- Verify total count
SELECT COUNT(*) as total_rooms FROM h_room WHERE category != 'Exhibition';

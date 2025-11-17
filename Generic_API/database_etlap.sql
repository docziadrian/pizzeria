CREATE TABLE IF NOT EXISTS kategoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nev VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS termek (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nev VARCHAR(200) NOT NULL,
  leiras TEXT,
  ar INT NOT NULL,
  kategoriaId INT NOT NULL,
  kepURL VARCHAR(500),
  hozzavalok JSON,
  averageRating DECIMAL(2,1) DEFAULT 0.0,
  reviewCount INT DEFAULT 0,
  videoURL VARCHAR(500),
  rendelesekSzama INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kategoriaId) REFERENCES kategoria(id) ON DELETE CASCADE
);

INSERT INTO kategoria (nev) VALUES
('Pizza'),
('Hamburger'),
('Gyros'),
('Saláta'),
('Desszert'),
('Italok');

INSERT INTO termek (nev, leiras, ar, kategoriaId, kepURL, hozzavalok, averageRating, reviewCount, rendelesekSzama) VALUES
('Margherita Pizza', 'Klasszikus paradicsomos pizza mozzarella sajttal és bazsalikommal', 2500, 1, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002', '["paradicsomszósz", "mozzarella", "bazsalikom", "olívaolaj"]', 4.5, 120, 450),
('Pepperoni Pizza', 'Fűszeres pepperoni szalámi dupla sajttal', 3200, 1, 'https://images.unsplash.com/photo-1628840042765-356cda07504e', '["paradicsomszósz", "pepperoni", "mozzarella", "oregánó"]', 4.8, 230, 890),
('Quattro Formaggi', 'Négy sajt kombinációja: mozzarella, gorgonzola, parmezan, ricotta', 3500, 1, 'https://images.unsplash.com/photo-1571407970349-bc81e7e96a47', '["mozzarella", "gorgonzola", "parmezan", "ricotta"]', 4.6, 180, 340),
('BBQ Bacon Burger', 'Házi húspogácsa BBQ szósszal, bacon, cheddar sajt', 2800, 2, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', '["marhahús", "bacon", "cheddar", "BBQ szósz", "saláta", "paradicsom"]', 4.7, 150, 520),
('Classic Burger', 'Egyszerű, de finom: húspogácsa, saláta, paradicsom, hagyma', 2200, 2, 'https://images.unsplash.com/photo-1550547660-d9450f859349', '["marhahús", "saláta", "paradicsom", "hagyma", "savanyú uborka"]', 4.3, 200, 680),
('Chicken Gyros', 'Friss csirkehús pita kenyérben zöldségekkel', 1800, 3, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0', '["csirkehús", "pita", "saláta", "paradicsom", "hagyma", "tzatziki"]', 4.4, 190, 720),
('Görög Saláta', 'Friss zöldségek feta sajttal és olívabogyóval', 1500, 4, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe', '["saláta", "paradicsom", "uborka", "feta", "olívabogyó", "hagyma"]', 4.2, 80, 210),
('Tiramisu', 'Olasz kávés desszert mascarponéval', 1200, 5, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9', '["mascarpone", "kávé", "kakaó", "piskóta", "amaretto"]', 4.9, 95, 280),
('Coca Cola 0.5L', 'Üdítő ital', 500, 6, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', '["szénsavas üdítő"]', 4.0, 50, 1200);


-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Nov 11. 10:57
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `2025_pizzeria`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `pizzaID` int(11) NOT NULL,
  `datum` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `totalPrice` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `orders`
--

INSERT INTO `orders` (`id`, `userID`, `pizzaID`, `datum`, `status`, `quantity`, `totalPrice`) VALUES
(2, 4, 2, '2025-11-05', 'kész', 1, 1500),
(3, 4, 5, '2025-11-05', 'folyamatban', 1, 5000),
(4, 4, 5, '2025-11-05', 'folyamatban', 1, 5000),
(5, 4, 5, '2025-11-05', 'folyamatban', 1, 5000),
(6, 4, 2, '2025-11-05', 'folyamatban', 7, 10500),
(7, 4, 5, '2025-11-05', 'folyamatban', 6, 30000),
(8, 4, 1, '2025-11-05', 'folyamatban', 3, 3000),
(9, 4, 2, '2025-11-10', 'folyamatban', 7, 10500),
(10, 4, 2, '2025-11-10', 'folyamatban', 1, 1500),
(11, 4, 5, '2025-11-10', 'folyamatban', 1, 5000),
(12, 4, 2, '2025-11-11', 'folyamatban', 4, 6000);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pizza`
--

CREATE TABLE `pizza` (
  `id` int(11) NOT NULL,
  `nev` varchar(50) NOT NULL,
  `ar` int(11) NOT NULL,
  `kepURL` text NOT NULL,
  `hozzavalok` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `pizza`
--

INSERT INTO `pizza` (`id`, `nev`, `ar`, `kepURL`, `hozzavalok`) VALUES
(1, 'Margareta Pizza', 1000, 'https://foodmonsterbaja.hu/img/ws/prd/62eb5429330b456b953560b901ad24fc.jpg', 'sonka,sajt,paradicsomszósz'),
(2, 'Sonka Pizza', 1500, 'https://foodmonsterbaja.hu/img/ws/prd/193995095fba4beabd590406193b3a97.jpg', 'sonka (x2),sajt,paradicsomszósz'),
(5, 'Szalámis Pizza', 5000, 'https://i.ibb.co/Y7hGRLXR/pizza.jpg', 'Paradicsom, sajt, paprika');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `tableId` int(11) NOT NULL,
  `tableNumber` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `userEmail` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `seats` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 10000.00,
  `status` enum('folyamatban','sikeres','megszakitott') DEFAULT 'folyamatban',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `reservations`
--

INSERT INTO `reservations` (`id`, `tableId`, `tableNumber`, `userId`, `userName`, `userEmail`, `date`, `time`, `seats`, `price`, `status`, `createdAt`) VALUES
(1, 1, 1, 1, 'Teszt User', 'test@example.com', '2025-11-15', '18:00:00', 2, 10000.00, 'sikeres', '2025-11-11 08:32:10'),
(2, 2, 2, 1, 'Teszt User', 'test@example.com', '2025-11-16', '19:00:00', 2, 10000.00, 'folyamatban', '2025-11-11 08:32:10'),
(3, 1, 1, 4, 'agijag224356wtggb1', 'asfafsaf@gmail.com2', '2025-11-11', '18:00:00', 2, 10000.00, 'folyamatban', '2025-11-11 08:33:41'),
(4, 1, 1, 4, 'agijag224356wtggb1', 'asfafsaf@gmail.com2', '2025-11-11', '18:00:00', 2, 10000.00, 'sikeres', '2025-11-11 08:38:07'),
(5, 1, 1, 4, 'agijag224356wtggb1', 'asfafsaf@gmail.com2', '2025-11-11', '18:00:00', 2, 10000.00, 'sikeres', '2025-11-11 08:40:16'),
(6, 3, 3, 4, 'agijag224356wtggb1', 'asfafsaf@gmail.com2', '2025-11-11', '18:00:00', 2, 10000.00, 'sikeres', '2025-11-11 08:52:18'),
(7, 1, 1, 4, 'agijag224356wtggb1', 'asfafsaf@gmail.com2', '2025-11-11', '20:00:00', 2, 10000.00, 'sikeres', '2025-11-11 08:55:10'),
(8, 3, 3, 4, 'agijag224356wtggb1', 'asfafsaf@gmail.com2', '2025-11-11', '19:00:00', 2, 10000.00, 'sikeres', '2025-11-11 08:56:45'),
(9, 1, 1, 4, 'agijag224356wtggb1', 'asfafsaf@gmail.com2', '2025-11-11', '19:28:00', 2, 10000.00, 'sikeres', '2025-11-11 08:59:06'),
(10, 2, 2, 4, 'agijag224356wtggb1', 'asfafsaf@gmail.com2', '2025-11-11', '18:00:00', 2, 10000.00, 'sikeres', '2025-11-11 09:08:19'),
(11, 4, 4, 4, 'agijag224356wtggb1', 'asfafsaf@gmail.com2', '2025-11-11', '18:00:00', 2, 10000.00, 'sikeres', '2025-11-11 09:09:15');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `pizzaId` int(11) NOT NULL,
  `pizzaName` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `reviews`
--

INSERT INTO `reviews` (`id`, `userId`, `userName`, `pizzaId`, `pizzaName`, `rating`, `comment`, `createdAt`) VALUES
(1, 1, 'Teszt User', 1, 'Margherita', 5, 'Nagyon jok vagytok.', '2025-11-11 09:27:32'),
(2, 1, 'Teszt User', 2, 'Pepperoni', 4, 'Jó volt, de egy kicsit több szalámi rá nem ártott volna.', '2025-11-11 09:27:32');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(40) NOT NULL,
  `role` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Adminisztrátor', 'admin@pizza.hu123', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'admin'),
(2, 'teszt f. 1', 'teszt1@pizza.hu2', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'user'),
(4, 'agijag224356wtggb1', 'asfafsaf@gmail.com2', '4898ad7226388e533665a5bbf7a369cfd7c5c79f', 'admin'),
(5, 'nemhiszemel', 'nemhiszemhmukodik@gmail.com', 'Jelszo123', 'user'),
(6, 'Jani', 'dshhijrsh@gmail.com', 'fc58337e500736cd87055a263c2d07c69f5baa8f', 'user');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `pizza`
--
ALTER TABLE `pizza`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_status` (`status`);

--
-- A tábla indexei `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_pizzaId` (`pizzaId`),
  ADD KEY `idx_rating` (`rating`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT a táblához `pizza`
--
ALTER TABLE `pizza`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`pizzaId`) REFERENCES `pizza` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

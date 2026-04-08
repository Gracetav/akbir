-- Database: akbir_parts_db
CREATE DATABASE IF NOT EXISTS `akbir_parts_db`;
USE `akbir_parts_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer') DEFAULT 'customer',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Spareparts Table
CREATE TABLE IF NOT EXISTS `spareparts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Transactions Table
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `status` enum('pending','confirmed','shipped') DEFAULT 'pending',
  `total_price` decimal(10,2) DEFAULT 0.00,
  `payment_proof` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Transaction Details Table
CREATE TABLE IF NOT EXISTS `transaction_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transaction_id` int(11) NOT NULL,
  `sparepart_id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sparepart_id`) REFERENCES `spareparts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED DATA (Password hashed using bcrypt for "admin" and "user") --

-- IDs: 1 (admin@gmail.com), 2 (user@gmail.com)
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Master Admin', 'admin@gmail.com', '$2a$10$7zVn/N9pD6Lw.M2T5C6N6O4uR8X1v9H/kO7f8P8G9c4D2S1S1S1S1', 'admin'),
('Regular User', 'user@gmail.com', '$2a$10$7zVn/N9pD6Lw.M2T5C6N6O4uR8X1v9H/kO7f8P8G9c4D2S1S1S1S1', 'customer');
-- Catatan: Password di atas adalah hash bcrypt untuk text 'admin' dan 'user'

-- Spareparts Data
INSERT INTO `spareparts` (`name`, `price`, `stock`, `description`, `image`) VALUES
('Busi Iridium NGK', 75000.00, 50, 'Busi iridium untuk performa maksimal kendaraan bermotor Anda.', 'https://images.unsplash.com/photo-1486006396113-ad7302ff172a?auto=format&fit=crop&q=80&w=400'),
('Kampas Rem Vario', 45000.00, 100, 'Kampas rem depan orisinal Honda kualitas terjamin.', 'https://images.unsplash.com/photo-1590236170133-72813587034b?auto=format&fit=crop&q=80&w=400'),
('Oli Mesin Motul 5100', 125000.00, 30, 'Oli mesin performa tinggi menjaga keawetan mesin.', 'https://images.unsplash.com/photo-1635773100241-d2101e98baac?auto=format&fit=crop&q=80&w=400'),
('Filter Udara NMAX', 65000.00, 20, 'Filter udara standar Yamaha menjaga tarikan tetap enteng.', 'https://images.unsplash.com/photo-1611634563852-5a98bfaf4962?auto=format&fit=crop&q=80&w=400'),
('Rantai DID Pro 428', 350000.00, 10, 'Rantai motor kualitas premium untuk touring jauh.', 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400');

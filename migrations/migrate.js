const mysql = require('mysql2/promise');
require('dotenv').config();

const migrate = async () => {
    // Create connection without database first
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
    });

    console.log('--- Database Migration Started ---');

    try {
        // Create database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'akbir_parts_db'}\``);
        await connection.query(`USE \`${process.env.DB_NAME || 'akbir_parts_db'}\``);
        console.log(`Database "${process.env.DB_NAME || 'akbir_parts_db'}" ready.`);

        // Users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'customer') DEFAULT 'customer'
            )
        `);
        console.log('Users table ready.');

        // Categories table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                slug VARCHAR(100) NOT NULL
            )
        `);
        console.log('Categories table ready.');

        // Spareparts table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS spareparts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT DEFAULT NULL,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                stock INT NOT NULL DEFAULT 0,
                image VARCHAR(255) DEFAULT NULL,
                description TEXT,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            )
        `);
        console.log('Spareparts table ready.');

        // Transactions table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                status ENUM('pending', 'confirmed', 'shipped') DEFAULT 'pending',
                total_price DECIMAL(10, 2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Transactions table ready.');

        // Transaction details table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS transaction_details (
                id INT AUTO_INCREMENT PRIMARY KEY,
                transaction_id INT NOT NULL,
                sparepart_id INT NOT NULL,
                qty INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
                FOREIGN KEY (sparepart_id) REFERENCES spareparts(id) ON DELETE CASCADE
            )
        `);
        console.log('Transaction details table ready.');

        console.log('--- Migration Finished Successfully ---');
    } catch (error) {
        console.error('Migration crashed:', error);
    } finally {
        await connection.end();
        process.exit();
    }
};

migrate();

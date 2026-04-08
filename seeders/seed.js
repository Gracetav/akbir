const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        console.log('--- Seeding Started ---');

        // Check if admin exists
        const [adminExists] = await pool.query('SELECT * FROM users WHERE email = ?', ['admin@gmail.com']);
        if (adminExists.length === 0) {
            const adminPass = await bcrypt.hash('admin', 10);
            await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
            ['Master Admin', 'admin@gmail.com', adminPass, 'admin']);
            console.log('Admin user (admin@gmail.com) seeded.');
        }

        // Check if customer exists
        const [userExists] = await pool.query('SELECT * FROM users WHERE email = ?', ['user@gmail.com']);
        if (userExists.length === 0) {
            const userPass = await bcrypt.hash('user', 10);
            await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
            ['Regular User', 'user@gmail.com', userPass, 'customer']);
            console.log('Customer user (user@gmail.com) seeded.');
        }

        // Seed spareparts
        const [parts] = await pool.query('SELECT * FROM spareparts');
        if (parts.length === 0) {
            const spareparts = [
                ['Busi Iridium NGK', 75000, 50, 'Busi iridium untuk performa maksimal.', 'https://images.unsplash.com/photo-1486006396113-ad7302ff172a?auto=format&fit=crop&q=80&w=400'],
                ['Kampas Rem Depan Honda Vario', 45000, 100, 'Kampas rem depan orisinal Honda.', 'https://images.unsplash.com/photo-1590236170133-72813587034b?auto=format&fit=crop&q=80&w=400'],
                ['Oli Mesin Motul 5100', 125000, 30, 'Oli mesin performa tinggi.', 'https://images.unsplash.com/photo-1635773100241-d2101e98baac?auto=format&fit=crop&q=80&w=400'],
                ['Filter Udara Yamaha NMAX', 65000, 20, 'Filter udara standar Yamaha.', 'https://images.unsplash.com/photo-1611634563852-5a98bfaf4962?auto=format&fit=crop&q=80&w=400'],
                ['Rantai Set DID Pro 428', 350000, 10, 'Rantai motor kualitas premium.', 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400']
            ];

            for (const part of spareparts) {
                await pool.query('INSERT INTO spareparts (name, price, stock, description, image) VALUES (?, ?, ?, ?, ?)', part);
            }
            console.log('Dummy spareparts seeded.');
        } else {
            console.log('Spareparts already exists.');
        }

        console.log('--- Seeding Finished Successfully ---');
    } catch (error) {
        console.error('Seeding crashed:', error);
    } finally {
        process.exit();
    }
};

seed();

const pool = require('../config/db');

const Sparepart = {
    async getAll() {
        const [rows] = await pool.query(`
            SELECT spareparts.*, categories.name as category_name 
            FROM spareparts 
            LEFT JOIN categories ON spareparts.category_id = categories.id 
            ORDER BY spareparts.id DESC
        `);
        return rows;
    },
    async getById(id) {
        const [rows] = await pool.query(`
            SELECT spareparts.*, categories.name as category_name 
            FROM spareparts 
            LEFT JOIN categories ON spareparts.category_id = categories.id 
            WHERE spareparts.id = ?
        `, [id]);
        return rows[0];
    },
    async create(name, price, stock, description, image, category_id) {
        const [result] = await pool.query('INSERT INTO spareparts (name, price, stock, description, image, category_id) VALUES (?, ?, ?, ?, ?, ?)', 
        [name, price, stock, description, image, category_id]);
        return result.insertId;
    },
    async update(id, name, price, stock, description, image, category_id) {
        if (image) {
            await pool.query('UPDATE spareparts SET name = ?, price = ?, stock = ?, description = ?, image = ?, category_id = ? WHERE id = ?', 
            [name, price, stock, description, image, category_id, id]);
        } else {
            await pool.query('UPDATE spareparts SET name = ?, price = ?, stock = ?, description = ?, category_id = ? WHERE id = ?', 
            [name, price, stock, description, category_id, id]);
        }
    },
    async delete(id) {
        await pool.query('DELETE FROM spareparts WHERE id = ?', [id]);
    },
    async deductStock(id, qty) {
        await pool.query('UPDATE spareparts SET stock = stock - ? WHERE id = ?', [qty, id]);
    }
};

module.exports = Sparepart;

const pool = require('../config/db');

const Sparepart = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM spareparts ORDER BY id DESC');
        return rows;
    },
    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM spareparts WHERE id = ?', [id]);
        return rows[0];
    },
    async create(name, price, stock, description, image) {
        const [result] = await pool.query('INSERT INTO spareparts (name, price, stock, description, image) VALUES (?, ?, ?, ?, ?)', 
        [name, price, stock, description, image]);
        return result.insertId;
    },
    async update(id, name, price, stock, description, image) {
        if (image) {
            await pool.query('UPDATE spareparts SET name = ?, price = ?, stock = ?, description = ?, image = ? WHERE id = ?', 
            [name, price, stock, description, image, id]);
        } else {
            await pool.query('UPDATE spareparts SET name = ?, price = ?, stock = ?, description = ? WHERE id = ?', 
            [name, price, stock, description, id]);
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

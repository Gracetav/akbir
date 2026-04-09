const pool = require('../config/db');

class Category {
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(name, slug) {
        await pool.query('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug]);
    }

    static async update(id, name, slug) {
        await pool.query('UPDATE categories SET name = ?, slug = ? WHERE id = ?', [name, slug, id]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    }
}

module.exports = Category;

const pool = require('../config/db');

const Transaction = {
    async create(userId, totalPrice, items) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Insert into transactions
            const [trxResult] = await connection.query('INSERT INTO transactions (user_id, total_price, status) VALUES (?, ?, ?)', 
            [userId, totalPrice, 'pending']);
            const transactionId = trxResult.insertId;

            // 2. Insert into transaction_details & Deduct stock
            for (const item of items) {
                await connection.query('INSERT INTO transaction_details (transaction_id, sparepart_id, qty, price) VALUES (?, ?, ?, ?)', 
                [transactionId, item.sparepart_id, item.qty, item.price]);
                
                await connection.query('UPDATE spareparts SET stock = stock - ? WHERE id = ?', 
                [item.qty, item.sparepart_id]);
            }

            await connection.commit();
            return transactionId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
    async getAll() {
        // Simple JOIN to get customer name
        const [rows] = await pool.query(`
            SELECT t.*, u.name as customer_name 
            FROM transactions t 
            JOIN users u ON t.user_id = u.id 
            ORDER BY t.created_at DESC
        `);
        return rows;
    },
    async getByUserId(userId) {
        const [rows] = await pool.query('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    },
    async getDetails(transactionId) {
        const [rows] = await pool.query(`
            SELECT td.*, s.name as part_name 
            FROM transaction_details td 
            JOIN spareparts s ON td.sparepart_id = s.id 
            WHERE td.transaction_id = ?
        `, [transactionId]);
        return rows;
    },
    async updateStatus(id, status) {
        await pool.query('UPDATE transactions SET status = ? WHERE id = ?', [status, id]);
    },
    async updateProof(id, proof) {
        await pool.query('UPDATE transactions SET payment_proof = ? WHERE id = ?', [proof, id]);
    }
};

module.exports = Transaction;

const Sparepart = require('../models/Sparepart');
const Transaction = require('../models/Transaction');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const AdminController = {
    async dashboard(req, res) {
        try {
            const parts = await Sparepart.getAll();
            const transactions = await Transaction.getAll();
            
            // Stats
            const stats = {
                totalParts: parts.length,
                totalStock: parts.reduce((acc, part) => acc + part.stock, 0),
                totalTransactions: transactions.length,
                pendingTransactions: transactions.filter(t => t.status === 'pending').length
            };

            res.render('admin/dashboard', { parts, stats, user: req.session });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    // Sparepart CRUD
    async createPartPage(req, res) {
        res.render('admin/part_form', { part: null });
    },

    async createPart(req, res) {
        const { name, price, stock, description } = req.body;
        const image = req.file ? '/uploads/' + req.file.filename : null;
        try {
            await Sparepart.create(name, price, stock, description, image);
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan saat menyimpan');
        }
    },

    async editPartPage(req, res) {
        try {
            const part = await Sparepart.getById(req.params.id);
            res.render('admin/part_form', { part });
        } catch (error) {
            console.error(error);
            res.status(404).send('Not Found');
        }
    },

    async updatePart(req, res) {
        const { id } = req.params;
        const { name, price, stock, description } = req.body;
        const image = req.file ? '/uploads/' + req.file.filename : null;
        try {
            await Sparepart.update(id, name, price, stock, description, image);
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal mengupdate');
        }
    },

    async deletePart(req, res) {
        try {
            await Sparepart.delete(req.params.id);
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal menghapus');
        }
    },

    // Transactions
    async transactions(req, res) {
        try {
            const transactions = await Transaction.getAll();
            res.render('admin/transactions', { transactions });
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal mengambil data transaksi');
        }
    },

    async updateTransactionStatus(req, res) {
        const { id, status } = req.params;
        // status is either confirmed or shipped
        try {
            await Transaction.updateStatus(id, status);
            res.redirect('/admin/transactions');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal update status');
        }
    }
};

module.exports = { AdminController, upload };

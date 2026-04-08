const Sparepart = require('../models/Sparepart');
const Transaction = require('../models/Transaction');
const multer = require('multer');
const path = require('path');

// Multer Config for Payment Proof
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'PROOFS-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const CustomerController = {
    async dashboard(req, res) {
        try {
            const parts = await Sparepart.getAll();
            res.render('customer/dashboard', { parts, user: req.session });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    async history(req, res) {
        try {
            const userId = req.session.userId;
            const history = await Transaction.getByUserId(userId);
            res.render('customer/history', { history });
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal riwayat transaksi');
        }
    },

    async checkout(req, res) {
        const { id, qty } = req.body;
        const userId = req.session.userId;
        try {
            const part = await Sparepart.getById(id);
            if (!part || part.stock < qty) {
                return res.status(400).send('Stok tidak memadai atau produk tidak ada');
            }

            const totalPrice = part.price * qty;
            const items = [{
                sparepart_id: id,
                qty: qty,
                price: part.price
            }];

            await Transaction.create(userId, totalPrice, items);
            res.redirect('/customer/history');
        } catch (error) {
            console.error(error);
            res.status(500).send('Checkout gagal');
        }
    },

    async uploadProof(req, res) {
        const { id } = req.body;
        const proof = req.file ? '/uploads/' + req.file.filename : null;
        try {
            if (!proof) return res.status(400).send('Mohon pilih file bukti transfer');
            await Transaction.updateProof(id, proof);
            res.redirect('/customer/history');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal upload bukti');
        }
    }
};

module.exports = { CustomerController, upload };

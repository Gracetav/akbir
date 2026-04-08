const Sparepart = require('../models/Sparepart');
const Transaction = require('../models/Transaction');
const multer = require('multer');
const path = require('path');

// Multer Config for Payment Proof
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
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

    async addToCart(req, res) {
        const { id, qty } = req.body;
        try {
            const part = await Sparepart.getById(id);
            if (!part || part.stock < parseInt(qty)) {
                return res.status(400).send('Stok tidak memadai');
            }

            if (!req.session.cart) req.session.cart = [];
            
            const existingItem = req.session.cart.find(item => item.id === parseInt(id));
            if (existingItem) {
                existingItem.qty += parseInt(qty);
            } else {
                req.session.cart.push({
                    id: parseInt(id),
                    name: part.name,
                    price: part.price,
                    qty: parseInt(qty),
                    image: part.image
                });
            }
            res.redirect('/customer/cart');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal tambah ke keranjang');
        }
    },

    async viewCart(req, res) {
        const cart = req.session.cart || [];
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        res.render('customer/cart', { cart, total });
    },

    async removeFromCart(req, res) {
        const { id } = req.params;
        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(item => item.id !== parseInt(id));
        }
        res.redirect('/customer/cart');
    },

    async checkout(req, res) {
        const userId = req.session.userId;
        const cart = req.session.cart || [];
        
        if (cart.length === 0) return res.status(400).send('Keranjang kosong');

        try {
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
            const items = cart.map(item => ({
                sparepart_id: item.id,
                qty: item.qty,
                price: item.price
            }));

            await Transaction.create(userId, totalPrice, items);
            req.session.cart = []; // Clear cart
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

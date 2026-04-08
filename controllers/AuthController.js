const bcrypt = require('bcryptjs');
const User = require('../models/User');

const AuthController = {
    loginPage(req, res) {
        if (req.session.userId) return res.redirect('/');
        res.render('auth/login', { error: null });
    },

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findByEmail(email);
            if (!user) {
                return res.render('auth/login', { error: 'Email tidak ditemukan.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('auth/login', { error: 'Password salah.' });
            }

            // Set session
            req.session.userId = user.id;
            req.session.userName = user.name;
            req.session.role = user.role;

            if (user.role === 'admin') {
                return res.redirect('/admin');
            } else {
                return res.redirect('/customer');
            }
        } catch (error) {
            console.error(error);
            res.render('auth/login', { error: 'Terjadi kesalahan sistem.' });
        }
    },

    logout(req, res) {
        req.session.destroy();
        res.redirect('/auth/login');
    }
};

module.exports = AuthController;

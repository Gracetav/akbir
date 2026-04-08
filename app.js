const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// EJS Layouts and Template Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public & Uploads folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'akbir_secret_parts_123',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/customer', customerRoutes);

// Generic Login/Home redirect
app.get('/', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }
    if (req.session.role === 'admin') {
        return res.redirect('/admin');
    }
    return res.redirect('/customer');
});

// Error 404
app.use((req, res) => {
    res.status(404).send('404 - Halaman Tidak Ditemukan');
});

app.listen(PORT, () => {
    console.log(`Akbir Parts Server started on http://localhost:${PORT}`);
});

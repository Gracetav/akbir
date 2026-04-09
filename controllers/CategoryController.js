const Category = require('../models/Category');
const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

const CategoryController = {
    async index(req, res) {
        try {
            const categories = await Category.getAll();
            res.render('admin/categories/index', { categories });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan saat mengambil kategori');
        }
    },

    async createPage(req, res) {
        res.render('admin/categories/create');
    },

    async create(req, res) {
        const { name } = req.body;
        const slug = slugify(name);
        try {
            await Category.create(name, slug);
            res.redirect('/admin/categories');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal menambah kategori');
        }
    },

    async editPage(req, res) {
        try {
            const category = await Category.getById(req.params.id);
            if (!category) return res.status(404).send('Kategori tidak ditemukan');
            res.render('admin/categories/edit', { category });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan');
        }
    },

    async update(req, res) {
        const { id } = req.params;
        const { name } = req.body;
        const slug = slugify(name);
        try {
            await Category.update(id, name, slug);
            res.redirect('/admin/categories');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal update kategori');
        }
    },

    async delete(req, res) {
        try {
            await Category.delete(req.params.id);
            res.redirect('/admin/categories');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal menghapus kategori');
        }
    }
};

module.exports = CategoryController;

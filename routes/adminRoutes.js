const express = require('express');
const router = express.Router();
const { AdminController, upload } = require('../controllers/AdminController');
const CategoryController = require('../controllers/CategoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Apply middleware to all admin routes
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/', AdminController.dashboard);
router.get('/parts/add', AdminController.createPartPage);
router.post('/parts/add', upload.single('image'), AdminController.createPart);
router.get('/parts/edit/:id', AdminController.editPartPage);
router.post('/parts/edit/:id', upload.single('image'), AdminController.updatePart);
router.get('/parts/delete/:id', AdminController.deletePart);

// Category Routes
router.get('/categories', CategoryController.index);
router.get('/categories/add', CategoryController.createPage);
router.post('/categories/add', CategoryController.create);
router.get('/categories/edit/:id', CategoryController.editPage);
router.post('/categories/edit/:id', CategoryController.update);
router.get('/categories/delete/:id', CategoryController.delete);

router.get('/transactions', AdminController.transactions);
router.get('/transactions/update/:id/:status', AdminController.updateTransactionStatus);

module.exports = router;

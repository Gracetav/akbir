const express = require('express');
const router = express.Router();
const { CustomerController, upload } = require('../controllers/CustomerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('customer'));

router.get('/', CustomerController.dashboard);
router.get('/history', CustomerController.history);
router.get('/cart', CustomerController.viewCart);
router.post('/cart', CustomerController.addToCart);
router.get('/cart/remove/:id', CustomerController.removeFromCart);
router.post('/checkout', CustomerController.checkout);
router.post('/upload-proof', upload.single('proof'), CustomerController.uploadProof);

module.exports = router;

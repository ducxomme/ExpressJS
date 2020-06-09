const express = require('express');

const controller =  require('../controllers/cart.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/add/:bookId', controller.addToCart);
router.get('/checkout', authMiddleware.auth, controller.checkout);

module.exports = router;
const express = require('express');

const controller =  require('../controllers/cart.controller');
const apiAuthMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/add/:bookId', controller.addToCart);
// router.get('/checkout', apiAuthMiddleware, controller.checkout);
router.post('/checkout', apiAuthMiddleware, controller.postCheckout);

module.exports = router;
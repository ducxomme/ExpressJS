const db = require('../db');

module.exports.cartCount = (req, res, next) => {
    let sessionId = req.signedCookies.sessionId;
    let cartCount = 0;
    if (sessionId) {
        let cartObj = db.get('sessions').find({id: sessionId}).value().cart;
        if (cartObj) {
            cartCount = Object.keys(cartObj).length;
        }

        res.locals.cartCount = cartCount;
    }
    next();
}
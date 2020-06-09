const db = require('../db');

module.exports.cartCount = (req, res, next) => {
    let sessionId = req.signedCookies.sessionId;
    if (sessionId) {
        console.log('sessionId in CartCount: ', sessionId);
        let cartObj = db.get('sessions').find({id: sessionId}).value().cart;
        let cartCount = Object.keys(cartObj).length;

        res.locals.cartCount = cartCount;
    }
    next();
}
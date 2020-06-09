const db = require('../db');

module.exports.addToCart = (req, res, next) => {
    let bookId = req.params.bookId;
    let sessionId = req.signedCookies.sessionId;

    if (!sessionId) {
        res.redirect('/books')
        return;
    }

    let cartCountProduct = db.get('sessions')
        .find({ id: sessionId })
        .get('cart.' + bookId, 0)
        .value();
    db.get('sessions')
        .find({ id: sessionId })
        .set('cart.' + bookId, cartCountProduct + 1)
        .write();
    res.locals.cartCount = 10;
    res.redirect('/books');
};
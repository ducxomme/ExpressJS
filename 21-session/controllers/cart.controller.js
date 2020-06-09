const db = require('../db');
const shortid = require("shortid");

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

module.exports.checkout = (req, res, next) => {
    let cartCount = res.locals.cartCount;
    let bookIdList = db.get('sessions').find({id: req.signedCookies.sessionId}).value().cart;
    let bookNameList = [];
    for (let item in bookIdList) {
        let book = db.get('books').find({id: item}).value();
        bookNameList.push({
            title: book.title,
            imageUrl: book.imageUrl,
            quality: bookIdList[item]
        })
    }

    res.render('cart/checkout', {
        cartCount: cartCount,
        bookNameList: bookNameList
    })
}

module.exports.postCheckout = (req, res, next) => {

    let userId = req.signedCookies.userId;
    let bookIdList = db.get('sessions').find({id: req.signedCookies.sessionId}).value().cart;
    for (let bookId in bookIdList) {
        let transactionId = shortid.generate();
        db.get('transactions').push({
            id: transactionId,
            userId: userId,
            bookId: bookId,
            isComplete: false
        }).write();
    }
    res.locals.cartCount = 0;
    db.get('sessions').find({id: req.signedCookies.sessionId}).unset('cart').write();
    res.redirect('/books');
}
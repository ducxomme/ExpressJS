const db = require('../db');

module.exports.auth = (req, res, next) => {
   console.log('userid', req.signedCookies);
   if (!req.signedCookies.userId) {
      res.redirect('auth/login');
      return;
   }
   let user = db.get('users').find({id: req.signedCookies.userId}).value();
   if (!user) {
      res.redirect('auth/login');
      return;
   }

   res.locals.user = user;
   next();
};
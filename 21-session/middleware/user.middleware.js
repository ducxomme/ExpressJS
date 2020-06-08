module.exports.postCreate = (req, res, next) => {
   var errors = [];
   if (!req.body.name)  {
      errors.push('Name is required. ');
   }
   if (req.body.name.length > 30) {
      errors.push('Name too length. Must below 30 characters');
   }

   if (!req.body.email) {
      errors.push('Email is required. ');
   }

   if (errors.length > 0) {
      res.render('users/create', {
         errors: errors,
         values: req.body
      })
   }
   res.locals.success = true;
   next();
}
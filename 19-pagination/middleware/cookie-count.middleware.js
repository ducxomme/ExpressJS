let count = 0;
module.exports.countCookie = (req, res, next) => { 
   console.log(`${req.cookies.count}:${count++}`);
   next();
}
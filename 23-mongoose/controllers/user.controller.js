const db = require("../db");
const shortid = require("shortid");
const fs = require('fs');
const cloudinary = require('../utilities/cloudinary');
const User = require('../models/user');

module.exports.index = (req, res) => {
  let perPage = 10;
  User.find()
  .then(docs => {
    let maxPage = Math.ceil(docs.length/perPage);

    let page = parseInt(req.query.page) || 1;
  
    if (page > maxPage) {
      page = maxPage;
    } else if (page < 1) {
      page = 1;
    }
  
    let begin = (page - 1) * perPage;
    let end = begin + perPage;
    let users = docs.slice(begin, end);
    res.render("users/index", {
      users: users,
      page: page,
      first: begin,
      maxPage: maxPage
    });
  })
};

module.exports.create = (req, res) => {
  res.render("users/create");
};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  req.body.avatar = req.file.path.split('/').slice(1).join('/');

  db.get("users").push(req.body).write();
  res.redirect("/users");
};

module.exports.get = (req, res) => {
  let user = db.get("users").find({ id: req.params.id }).value();
  if (user) {
    res.render("users/view", {
      user: user,
    });
  }
};

module.exports.updateAvatar = (req, res) => {
  let user = db.get('users').find({id: req.signedCookies.userId}).value();
  if(user) {
    res.render("users/avatar", {
      user: user
    })
  }
}

module.exports.postUpdateAvatar = (req, res) => {
  var img = req.file.path;//.split('/').slice(1).join('/');

  console.log('req file ', req.file);
  cloudinary
    .upload(img)
    .then(url => {
      db.get('users').find({id: req.body.id}).assign({avatarUrl: url}).write();
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log('err fs: ', err);
        }
        console.log('file was deleted');
      });
      res.redirect('/');
    })
    .catch(err => {
      console.log('err', err);
    });
}


module.exports.update = (req, res) => {
  res.render("users/update", {
    user: db.get("users").find({ id: req.params.id }).value(),
  });
};

module.exports.postUpdate = (req, res) => {
  console.log(res.locals);
  db.get("users")
    .find({ id: req.body.id })
    .assign({ name: req.body.name })
    .write();
  res.redirect("/users");
};

module.exports.delete = (req, res) => {
  db.get("users").remove({ id: req.params.id }).write();
  res.redirect("/users");
};

const db = require("../db");
const mongoose = require("mongoose");
const shortid = require("shortid");
const bcrypt = require('bcrypt');
const fs = require('fs');
const cloudinary = require('../utilities/cloudinary');
const User = require('../models/user');

const saltRounds = 10;

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

  bcrypt.hash(req.body.password, saltRounds, (err, hashPass) => {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      isAdmin: false,
      name: req.body.name,
      email: req.body.email,
      password: hashPass,
      wrongLoginCount: 0,
      avatarUrl: ''
    });
    user.save()
    .then(result => {
      console.log('Save user', result);
      res.redirect("/users");
    })
  })
  .catch(err => {
    console.log('error in postCreate user, ', err);
  })
};

module.exports.get = (req, res) => {
  User.findOne({
    _id: req.params.id
  })
  .then(user => {
    res.render("users/view", {
      user: user,
    });
  })
};

module.exports.updateAvatar = (req, res) => {
  User.findOne({
    _id: req.signedCookies.userId
  })
  .then(user => {
    res.render("users/avatar", {
      user: user
    })
  })
  .catch(e => {
    console.log(e);
  })
}

module.exports.postUpdateAvatar = (req, res) => {
  var img = req.file.path;//.split('/').slice(1).join('/');

  console.log('req file ', req.file);
  cloudinary
    .upload(img)
    .then(url => {
      User.updateOne({
        _id: req.body.id
      }, {
        $set: {
          'avatarUrl': url 
        }
      })
      .then(result => {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.log('err fs: ', err);
          }
          console.log('file was deleted');
        });
        res.redirect('/');
      })
    })
    .catch(err => {
      console.log('err', err);
    });
}


module.exports.update = (req, res) => {
  User.findOne({
    _id: req.params.id
  })
  .then(user => {
    res.render("users/update", {
      user: user
    })
  })
  .catch(e => {
    console.log(e);
  })
};

module.exports.postUpdate = (req, res) => {
  User.updateOne({
    _id: req.body.id
  }, {
    $set: {
      'name': req.body.name
    }
  })
  .then(user => {
    User.find()
    .then(users => {
      res.render('users', {
        users: users
      })
    })
  })
  .catch(e => {
    console.log(e);
  })
};

module.exports.delete = (req, res) => {
  db.get("users").remove({ id: req.params.id }).write();
  res.redirect("/users");
};

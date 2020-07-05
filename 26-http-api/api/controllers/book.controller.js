const cloudinary = require("../../utilities/cloudinary");
const mongoose = require("mongoose");
const fs = require("fs");

const Book = require("../../models/book");

module.exports.index = (req, res) => {
  Book.find()
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

module.exports.postCreate = (req, res) => {
  cloudinary
    .upload(req.file.path)
    .then((url) => {
      const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        imageUrl: url,
      });
      book
        .save()
        .then((result) => {
          console.log("Saved book: ", result);
          res.status(200).json({
            message: "Create book successfully",
            book: result,
          });
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.log("err fs: ", err);
            }
            console.log("file was deleted");
          });
        })
        .catch((err) => {
          res.status(404).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
      });
    });
};

module.exports.update = (req, res) => {
  Book.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        title: req.body.title,
      },
    }
  )
    .then((result) => {
      res.status(200).json({
        message: "Update successfully",
        book: result,
      });
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
      });
    });
};

module.exports.delete = (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).json({
        message: "Delete successfully",
        book: result,
      });
    })
    .catch((e) => {
      res.status(404).json({
        error: e,
      });
    });
};

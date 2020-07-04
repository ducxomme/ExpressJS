const express = require("express");
const multer = require('multer');
const router = express.Router();

const controller = require('../controllers/user.controller');
const middleware = require('../middleware/user.middleware');

const upload = multer({ dest: './public/uploads/'});

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", 
  upload.single('avatar'), 
  middleware.postCreate, 
  controller.postCreate
);
router.get("/:id/update", controller.update);

router.get('/profile/avatar', controller.updateAvatar);

router.post('/profile/avatar', upload.single('avatarUrl'), controller.postUpdateAvatar);

router.post("/update", controller.postUpdate);

router.get('/:id/delete', controller.delete)

module.exports = router;

const { Router } = require("express");
const multer = require ("multer");
const uploadConfig = require("../configs/upload");

const AvatarContoller = require ("../controllers/AvatarContoller");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const avatarRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const avatarContoller = new AvatarContoller();

//avatarRoutes.put("/", ensureAuthenticated, usersController.update)
avatarRoutes.patch("/", upload.single("avatar"), avatarContoller.update);

module.exports = avatarRoutes;
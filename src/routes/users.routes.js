const { Router } = require("express");
//const multer = require ("multer");
//const uploadConfig = require("../configs/upload");

const UsersController = require ("../controllers/UsersController");
//const UserAvatarContoller = require ("../controllers/UserAvatarContoller");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersRoutes = Router();
//const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();
//const userAvatarContoller = new UserAvatarContoller();

usersRoutes.post("/", usersController.create);
usersRoutes.get("/", usersController.index);
usersRoutes.get("/:id", usersController.show);
usersRoutes.put("/:id", usersController.update);

//usersRoutes.put("/", ensureAuthenticated, usersController.update)
//usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarContoller.update)

module.exports = usersRoutes;
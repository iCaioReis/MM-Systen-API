const { Router } = require("express");
//const multer = require ("multer");
//const uploadConfig = require("../configs/upload");

const HorsesController = require ("../controllers/HorsesController");
//const HorseAvatarContoller = require ("../controllers/HorseAvatarContoller");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const horsesRoutes = Router();
//const upload = multer(uploadConfig.MULTER);

const horsesController = new HorsesController();
//const horseAvatarContoller = new HorseAvatarContoller();

horsesRoutes.post("/", horsesController.create);
horsesRoutes.get("/", horsesController.index);
horsesRoutes.get("/:id", horsesController.show);
horsesRoutes.put("/:id", horsesController.update);
horsesRoutes.delete("/:id", horsesController.delete);

//horsesRoutes.put("/", ensureAuthenticated, horsesController.update)
//horsesRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), horseAvatarContoller.update)

module.exports = horsesRoutes;
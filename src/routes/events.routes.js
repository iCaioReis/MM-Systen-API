const { Router } = require("express");
//const multer = require ("multer");
//const uploadConfig = require("../configs/upload");

const EventsController = require ("../controllers/EventsController");
//const EventAvatarContoller = require ("../controllers/EventAvatarContoller");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const eventsRoutes = Router();
//const upload = multer(uploadConfig.MULTER);

const eventsController = new EventsController();
//const eventAvatarContoller = new EventAvatarContoller();

eventsRoutes.post("/", eventsController.create);
eventsRoutes.get("/", eventsController.index);
eventsRoutes.get("/:id", eventsController.show);
eventsRoutes.put("/:id", eventsController.update);

//eventsRoutes.put("/", ensureAuthenticated, eventsController.update)
//eventsRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), eventAvatarContoller.update)

module.exports = eventsRoutes;
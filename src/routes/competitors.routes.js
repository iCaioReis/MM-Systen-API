const { Router } = require("express");
//const multer = require ("multer");
//const uploadConfig = require("../configs/upload");

const CompetitorsController = require ("../controllers/CompetitorsController");
//const CompetitorAvatarContoller = require ("../controllers/CompetitorAvatarContoller");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const competitorsRoutes = Router();
//const upload = multer(uploadConfig.MULTER);

const competitorsController = new CompetitorsController();
//const competitorAvatarContoller = new CompetitorAvatarContoller();

competitorsRoutes.post("/", competitorsController.create);
competitorsRoutes.get("/", competitorsController.index);
competitorsRoutes.get("/:id", competitorsController.show);
competitorsRoutes.put("/:id", competitorsController.update);
competitorsRoutes.delete("/:id", competitorsController.delete);

//competitorsRoutes.put("/", ensureAuthenticated, competitorsController.update)
//competitorsRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), competitorAvatarContoller.update)

module.exports = competitorsRoutes;
module.exports = competitorsRoutes;
const { Router } = require("express");

const CategoryRegistersController = require ("../controllers/CategoryRegistersController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const categoryRegistersRoutes = Router();

const categoryRegistersController = new CategoryRegistersController();

categoryRegistersRoutes.post("/", categoryRegistersController.create);
//categoryRegistersRoutes.get("/", categoryRegistersController.index);
categoryRegistersRoutes.get("/:id", categoryRegistersController.show);
categoryRegistersRoutes.delete("/:id", categoryRegistersController.delete);
categoryRegistersRoutes.put("/:id", categoryRegistersController.update);

module.exports = categoryRegistersRoutes;
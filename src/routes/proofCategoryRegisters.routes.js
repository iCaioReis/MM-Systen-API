const { Router } = require("express");

const AllProofsCategoryRegistersController = require ("../controllers/AllProofsCategoryRegistersController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const allCategoryRegistersRoutes = Router();

const allCategoryRegistersController = new AllProofsCategoryRegistersController();

allCategoryRegistersRoutes.post("/", allCategoryRegistersController.create);

module.exports = allCategoryRegistersRoutes;
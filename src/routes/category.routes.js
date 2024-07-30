const { Router } = require("express");

const CategoryController = require ("../controllers/CategoryController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const categoryRoutes = Router();

const categoryController = new CategoryController();

categoryRoutes.put("/:id", categoryController.update);

module.exports = categoryRoutes;
const { Router } = require("express");

const SortCategoryRegistersController = require ("../controllers/SortCategoryRegistersController");

const SortCategoryRegistersRoutes = Router();

const sortCategoryRegistersController = new SortCategoryRegistersController();

SortCategoryRegistersRoutes.put("/", sortCategoryRegistersController.update);

module.exports = SortCategoryRegistersRoutes;
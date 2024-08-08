const { Router } = require("express");

const ResultsController = require ("../controllers/ResultsController");

const ResultsRoutes = Router();

const resultsController = new ResultsController();

ResultsRoutes.get("/:id", resultsController.show);

module.exports = ResultsRoutes;
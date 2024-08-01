const { Router } = require("express");

const CompetitionController = require ("../controllers/CompetitionController");

const competitionRoutes = Router();

const competitionController = new CompetitionController();

competitionRoutes.get("/", competitionController.index);
competitionRoutes.get("/:id", competitionController.show);

module.exports = competitionRoutes;
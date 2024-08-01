const { Router } = require("express");

const FoulController = require ("../controllers/FoulsController");

const foulRoutes = Router();

const foulController = new FoulController();

foulRoutes.post("/", foulController.create);
foulRoutes.get("/:id", foulController.show);
foulRoutes.delete("/:id", foulController.delete);

module.exports = foulRoutes;
const { Router } = require("express");

const RegistersJudgeController = require ("../controllers/RegistersJudgeController");

const RegistersJudgeRoutes = Router();

const registersJudgeController = new RegistersJudgeController();

RegistersJudgeRoutes.put("/:id", registersJudgeController.update);

module.exports = RegistersJudgeRoutes;
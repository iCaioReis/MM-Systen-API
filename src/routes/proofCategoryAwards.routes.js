const { Router } = require("express");

const AwardsCategoryRegisterController = require ("../controllers/AllProofsCategoryAwardsController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const allCategoryAwardsRoutes = Router();

const allProofsCategoryAwardsController = new AwardsCategoryRegisterController();

allCategoryAwardsRoutes.put("/:id", allProofsCategoryAwardsController.update);

module.exports = allCategoryAwardsRoutes;
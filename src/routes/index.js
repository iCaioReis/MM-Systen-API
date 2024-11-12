const { Router } = require("express");

const sessionsRouter = require("./sessions.routes");

const usersRouter = require("./users.routes");
const avatarRouter = require("./avatar.routes");
const horsesRouter = require("./horses.routes");
const eventsRouter = require("./events.routes");
const resultsRouter = require("./results.routes");
const categoryRouter = require("./category.routes");
const competitorsRouter = require("./competitors.routes");
const competitionRouter = require("./competition.routes");
const registersJudgeRouter = require("./RegistersJudge.routes");
const categoryRegistersRouter = require("./categoryRegisters.routes");
const allCategoryRegistersRouter = require("./proofCategoryRegisters.routes");
const sortCategoryRegistersRouter = require("./sortCategoryRegisters.routes");
const allCategoryAwardsRouter = require("./proofCategoryAwards.routes");


const routes = Router();

routes.use("/sessions", sessionsRouter);

routes.use('/users', usersRouter);
routes.use('/avatar', avatarRouter);
routes.use('/horses', horsesRouter);
routes.use('/events', eventsRouter);
routes.use('/results', resultsRouter);
routes.use('/categories', categoryRouter);
routes.use('/competitors', competitorsRouter);
routes.use('/competition', competitionRouter);
routes.use('/registersJudge', registersJudgeRouter);
routes.use('/categoryRegisters', categoryRegistersRouter);
routes.use('/allCategoryRegisters', allCategoryRegistersRouter);
routes.use('/sortCategoryRegisters', sortCategoryRegistersRouter);
routes.use('/allCategoryAwards', allCategoryAwardsRouter);

module.exports = routes;
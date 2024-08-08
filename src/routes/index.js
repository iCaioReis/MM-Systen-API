const { Router } = require("express");

const foulRouter = require("./fouls.routes");
const usersRouter = require("./users.routes");
const horsesRouter = require("./horses.routes");
const eventsRouter = require("./events.routes");
const resultsRouter = require("./results.routes");
const categoryRouter = require("./category.routes");
const competitorsRouter = require("./competitors.routes");
const competitionRouter = require("./competition.routes");
const registersJudgeRouter = require("./RegistersJudge.routes");
const categoryRegistersRouter = require("./categoryRegisters.routes");

const routes = Router();

routes.use('/fouls', foulRouter);
routes.use('/users', usersRouter);
routes.use('/horses', horsesRouter);
routes.use('/events', eventsRouter);
routes.use('/results', resultsRouter);
routes.use('/categories', categoryRouter);
routes.use('/competitors', competitorsRouter);
routes.use('/competition', competitionRouter);
routes.use('/registersJudge', registersJudgeRouter);
routes.use('/categoryRegisters', categoryRegistersRouter);

module.exports = routes;
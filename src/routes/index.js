const { Router } = require("express");

const usersRouter = require("./users.routes");
const horsesRouter = require("./horses.routes");
const competitorsRouter = require("./competitors.routes");

const routes = Router();

routes.use('/users', usersRouter)
routes.use('/horses', horsesRouter)
routes.use('/competitors', competitorsRouter)

module.exports = routes;
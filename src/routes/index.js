const { Router } = require("express");

const usersRouter = require("./users.routes");
const horsesRouter = require("./horses.routes");
const competitorsRouter = require("./competitors.routes");
const eventsRouter = require("./events.routes");
const categoryRegistersRouter = require("./categoryRegisters.routes");

const routes = Router();

routes.use('/users', usersRouter)
routes.use('/horses', horsesRouter)
routes.use('/competitors', competitorsRouter)
routes.use('/events', eventsRouter)
routes.use('/categoryRegisters', categoryRegistersRouter)

module.exports = routes;
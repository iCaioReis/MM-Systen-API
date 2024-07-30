const { Router } = require("express");

const usersRouter = require("./users.routes");
const horsesRouter = require("./horses.routes");
const eventsRouter = require("./events.routes");
const categoryRouter = require("./category.routes");
const competitorsRouter = require("./competitors.routes");
const categoryRegistersRouter = require("./categoryRegisters.routes");

const routes = Router();


routes.use('/users', usersRouter)
routes.use('/horses', horsesRouter)
routes.use('/events', eventsRouter)
routes.use('/categories', categoryRouter)
routes.use('/competitors', competitorsRouter)
routes.use('/categoryRegisters', categoryRegistersRouter)

module.exports = routes;
const { Router } = require("express");

const usersRouter = require("./users.routes");
const horsesRouter = require("./horses.routes");

const routes = Router();

routes.use('/users', usersRouter)
routes.use('/horses', horsesRouter)

module.exports = routes;
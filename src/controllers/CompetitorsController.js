const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class CompetitorsController {
    async create(request, response) {
        const competitor = request.body;

        if (!competitor.surname) {
            throw new AppError("O campo Apelido é obrigatório.", 400);
        }

        if (!competitor.name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }

        if (!competitor.CPF) {
            throw new AppError("O campo CPF é obrigatório.", 400);
        }

        if (!competitor.born) {
            throw new AppError("O campo Nascimento é obrigatório.", 400);
        }

        const [competitorId] = await knex("competitors").insert(competitor).returning('id');

        return response.status(201).json({ id: competitorId });
    }

    async show(request, response) {
        const { id } = request.params;

        const competitor = await knex("competitors").where({ id }).first();

        return response.json({competitor})
    }

    async index(request, response) {
        const { name } = request.query;

        const competitors = await knex("competitors")
        .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
        .orderBy("name");

        return response.json({competitors})
    }

    async update(request, response) {
        const competitorUpdated = request.body;

        if (!competitorUpdated.surname) {
            throw new AppError("O campo Apelido é obrigatório.", 400);
        }

        if (!competitorUpdated.name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }

        if (!competitorUpdated.CPF) {
            throw new AppError("O campo CPF é obrigatório.", 400);
        }

        if (!competitorUpdated.born) {
            throw new AppError("O campo Nascimento é obrigatório.", 400);
        }

        const { id } = request.params;

        const competitor = await knex("competitors").where({ id }).first();

        if (!competitor) {
            throw new AppError("Competidor não encontrado!");
        }

        await knex("competitors").update(competitorUpdated).where({ id: id });

        return response.json(competitorUpdated);
    }
}

module.exports = CompetitorsController;
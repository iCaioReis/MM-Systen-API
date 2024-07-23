const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class HorsesController {
    async create(request, response) {
        const { state, surname, name,  gender, record, born, owner, march } = request.body;

        if (!surname) {
            throw new AppError("O campo Apelido é obrigatório.", 400);
        }
        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }
        if (!gender) {
            throw new AppError("O campo Sexo é obrigatório.", 400);
        }
        if (!born) {
            throw new AppError("O campo Nascimento é obrigatório.", 400);
        }
        if (!march) {
            throw new AppError("O campo Marcha é obrigatório.", 400);
        }

        const [horseId] = await knex("horses").insert({ state, surname, name,  gender, record, born, owner, march }).returning('id');

        return response.status(201).json({ id: horseId });
    }

    async show(request, response) {
        const { id } = request.params;

        const horse = await knex("horses").where({ id }).first();

        return response.json({horse})
    }

    async index(request, response) {
        const { name } = request.query;

        const horses = await knex("horses")
        .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
        .orderBy("name");

        return response.json({horses})
    }

    async update(request, response) {
        const { state, surname, name,  gender, record, born, owner, march } = request.body;

        if (!surname) {
            throw new AppError("O campo Apelido é obrigatório.", 400);
        }
        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }
        if (!gender) {
            throw new AppError("O campo Sexo é obrigatório.", 400);
        }
        if (!born) {
            throw new AppError("O campo Nascimento é obrigatório.", 400);
        }
        if (!march) {
            throw new AppError("O campo Marcha é obrigatório.", 400);
        }

        const horseUpdated = { state, surname, name,  gender, record, born, owner, march };
        const { id } = request.params;

        const horse = await knex("horses").where({ id }).first();

        if (!horse) {
            throw new AppError("Cavalo não encontrado!");
        }

        await knex("horses").update(horseUpdated).where({ id: id });

        return response.json(horseUpdated);
    }
}

module.exports = HorsesController;
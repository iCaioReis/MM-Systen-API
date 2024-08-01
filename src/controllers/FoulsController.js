const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class FoulsController {
    async create(request, response) {
        const { register_id, name, amount, observation} = request.body;

        if (!amount || !name || !register_id) {
            throw new AppError("Ocorreu um problema ao tentar registrar a falta, por favor entre em contato com o suporte", 400);
        }

        await knex("fouls").insert({ register_id, name, amount}).returning('id');

        return response.status(201).json();
    }

    async show(request, response) {
        const { id } = request.params;

        const fouls = await knex("fouls").where({ register_id: id });

        return response.json({fouls})
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("fouls").where({id}).delete();

        return response.json();
    }
}

module.exports = FoulsController;
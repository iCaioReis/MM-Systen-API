const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class RegistersJudgeController {

    async update(request, response) {
        const { id } = request.params;
        const { time, state } = request.body;

        if (!state) {
            throw new AppError("Erro ao salvar", 400);
        }

        const register = await knex("competitor-horse-categorie").where({ id }).first();

        if (!register) {
            throw new AppError("Erro ao salvar", 400);
        }

        await knex.transaction(async trx => {
            await trx("competitor-horse-categorie")
                .where({ id })
                .update({
                    time,
                    state,
                    updated_at: knex.fn.now()
                });

            if (state == "finished") {
                await trx("categories")
                    .where({ id: register.categorie_id })
                    .increment('last_competitor', 1)
                    .update({
                        updated_at: knex.fn.now()
                    });
            }
        });

        return response.status(200).json();
    }
}

module.exports = RegistersJudgeController;
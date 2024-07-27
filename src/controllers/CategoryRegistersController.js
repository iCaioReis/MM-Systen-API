const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class HorsesController {
    async create(request, response) {
        const { competitor_id, horse_id, categorie_id } = request.body;

        if (!competitor_id) {
            throw new AppError("O campo Competidor é obrigatório.", 400);
        }
        if (!horse_id) {
            throw new AppError("O campo Cavalo é obrigatório.", 400);
        }
        if (!categorie_id) {
            throw new AppError("Erro ao tentar registrar", 400);
        }

        const [horseId] = await knex("competitor-horse-categorie").insert({ competitor_id, horse_id, categorie_id }).returning('id');

        return response.status(201).json({ id: horseId });
    }

    async show(request, response) {
        const { id } = request.params;

        const competitorHorses = await knex("competitor-horse-categorie").where({ categorie_id: id });

        return response.json({competitorHorses})
    }
}

module.exports = HorsesController;
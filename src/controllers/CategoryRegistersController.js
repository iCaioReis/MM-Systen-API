const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class CategoryRegisterController {
    async create(request, response) {
        const { competitor_id, horse_id, categorie_id, competitor_order } = request.body;

        if (!competitor_id) {
            throw new AppError("O campo Competidor é obrigatório.", 400);
        }
        if (!horse_id) {
            throw new AppError("O campo Cavalo é obrigatório.", 400);
        }
        if (!categorie_id) {
            throw new AppError("Erro ao tentar registrar", 400);
        }

        const recordAlreadyExists = await knex("competitor-horse-categorie")
        .where({
            competitor_id,
            horse_id,
            categorie_id
          })
        .first();

        const recordHorses = await knex("competitor-horse-categorie")
        .where({
            horse_id,
            categorie_id
          })
        if(recordHorses.length >= 2) {
            throw new AppError("Este cavalo já está registrado em outros dois competidores nesta categoria!", 400);
        }

        if (recordAlreadyExists) {
            throw new AppError("Já existe um registro com este competidor e cavalo nesta categoria!", 500);
        }

        const [horseId] = await knex("competitor-horse-categorie").insert({ competitor_id, horse_id, categorie_id, competitor_order }).returning('id');

        return response.status(201).json({ id: horseId });
    }

    async show(request, response) {
        const { id } = request.params;
        try {
            // Realiza a consulta para obter os dados da categoria e da prova
            const category = await knex("categories")
                .join("proofs", "categories.proof_id", "proofs.id")
                .where("categories.id", id)
                .select(
                    "categories.name as categorie_name", // Nome da categoria
                    "categories.state as categorie_state", // Estado da categoria
                    "categories.first_place_award as categorie_first_place_award", // Premiação primeiro lugar da categoria
                    "categories.second_place_award as categorie_second_place_award", // Premiação segundo lugar da categoria
                    "categories.third_place_award as categorie_third_place_award", // Premiação terceiro lugar da categoria
                    "categories.last_competitor", // Último competidor
                    "proofs.name as proof_name" // Nome da prova
                )
                .first(); // Esperamos apenas um resultado
    
            // Realiza a consulta para obter os dados dos competidores e cavalos
            const competitorHorses = await knex("competitor-horse-categorie")
                .join("competitors", "competitor-horse-categorie.competitor_id", "competitors.id")
                .join("horses", "competitor-horse-categorie.horse_id", "horses.id")
                .where("competitor-horse-categorie.categorie_id", id)
                .select(
                    "competitor-horse-categorie.*",
                    "competitors.name as competitor_name",
                    "competitors.surname as competitor_surname",
                    "horses.name as horse_name",
                    "horses.surname as horse_surname"
                )
                .orderBy("competitor_order");
    
            return response.json({ status: category, competitorHorses });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal Server Error" });
        }
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("competitor-horse-categorie").where({id}).delete();

        return response.json();
    }

    async update(request, response) {
        const { id } = request.params;
        const { competitor_id, horse_id, categorie_id } = request.body;

        const register = await knex("competitor-horse-categorie").where({ id }).first();

        if (!competitor_id){
            throw new AppError("Não foi possível atualizar registro!");
        }

        if (!horse_id){
            throw new AppError("Não foi possível atualizar registro!");
        }

        if (!register) {
            throw new AppError("Não foi possível atualizar registro!");
        }

        const recordAlreadyExists = await knex("competitor-horse-categorie")
        .where({
            competitor_id,
            horse_id,
            categorie_id: register.categorie_id
          })
        .first();

        const recordHorses = await knex("competitor-horse-categorie")
        .where({
            horse_id,
            categorie_id
          })
        if(recordHorses.length >= 2) {
            throw new AppError("Este cavalo já está registrado em outros dois competidores nesta categoria!", 400);
        }

        if (recordAlreadyExists && recordAlreadyExists.id != id) {
            throw new AppError("Já existe um registro com este competidor e cavalo nesta categoria!", 500);
        }

        await knex("competitor-horse-categorie").update(
            { competitor_id, horse_id }
        ).where({ id: id }).returning('*');

        return response.json(register);
    }
}

module.exports = CategoryRegisterController;
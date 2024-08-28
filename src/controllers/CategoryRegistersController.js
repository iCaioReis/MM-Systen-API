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
                    "competitor-horse-categorie.*", // Dados da tabela principal
                    "competitors.name as competitor_name", // Dados dos competidores
                    "horses.name as horse_name" // Dados dos cavalos
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
        const { competitor_id, horse_id } = request.body;

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

        await knex("competitor-horse-categorie").update(
            { competitor_id, horse_id }
        ).where({ id: id });

        return response.json(register);
    }
}

module.exports = CategoryRegisterController;
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class CategoryRegisterController {
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
    
        try {
            // Realiza a consulta usando joins para incluir os dados dos competidores e cavalos
            const competitorHorses = await knex("competitor-horse-categorie")
                .join("competitors", "competitor-horse-categorie.competitor_id", "competitors.id")
                .join("horses", "competitor-horse-categorie.horse_id", "horses.id")
                .where("competitor-horse-categorie.categorie_id", id)
                .select(
                    "competitor-horse-categorie.*", // Dados da tabela principal
                    "competitors.name as competitor_name", // Dados dos competidores
                    "horses.name as horse_name" // Dados dos cavalos
                );
    
            return response.json({ competitorHorses });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal Server Error" });
        }
    }

    async delete(req, res){
        const { id } = req.params;

        await knex("competitor-horse-categorie").where({id}).delete();

        return res.json();
    }
    
}

module.exports = CategoryRegisterController;
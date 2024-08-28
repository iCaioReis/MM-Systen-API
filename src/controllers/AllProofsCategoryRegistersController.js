const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class CategoryRegisterController {
    async create(request, response) {
        const { competitor_id, horse_id, categoryName, event_id } = request.body;

        if (!competitor_id) {
            throw new AppError("O campo Competidor é obrigatório.", 400);
        }
        if (!horse_id) {
            throw new AppError("O campo Cavalo é obrigatório.", 400);
        }
        if (!event_id) {
            throw new AppError("Erro ao tentar registrar.", 400);
        }

        // Consultar a tabela "proofs" para obter os registros com o event_id fornecido
        const proofs = await knex("proofs")
            .where({ event_id })
            .limit(3);  // Limitar a 3 registros

        if (proofs.length === 0) {
            throw new AppError("Erro ao tentar registrar.", 404);
        }

        // Extrair os ids das provas
        const proofIds = proofs.map(proof => proof.id);

        // Consultar a tabela "categories" para obter os registros com os proof_ids e o categoryName fornecido
        const categories = await knex("categories")
            .whereIn("proof_id", proofIds)
            .andWhere({ name: categoryName });

        if (categories.length === 0) {
            throw new AppError("Erro ao tentar registrar, verifique o campo de categoria!", 404);
        };

        // Inserir na tabela "competitor-horse-categorie" para cada categoria encontrada
        const insertedIds = [];
        for (const category of categories) {
            const [id] = await knex("competitor-horse-categorie")
                .insert({ competitor_id, horse_id, categorie_id: category.id })
                .returning('id');

            insertedIds.push(id);
        }

        return response.status(201).json();
    }
}

module.exports = CategoryRegisterController;

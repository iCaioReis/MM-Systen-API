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
        }

        // Validar se já existe algum registro na tabela "competitor-horse-categorie"
        for (const category of categories) {
            const existingEntry = await knex("competitor-horse-categorie")
                .where({ competitor_id, horse_id, categorie_id: category.id })
                .first();

            if (existingEntry) {
                throw new AppError("Registro já existente para o competidor, cavalo e categoria informados.", 409);
            }
            if (category.state != "active") {
                throw new AppError('A categoria precisa estar com status "Ativo" em todas as provas para adicionar o novo registro! ')
            }

            const recordHorses = await knex("competitor-horse-categorie")
                .where({
                    horse_id,
                    categorie_id: category.id
                })
            if (recordHorses.length >= 2) {
                throw new AppError("Este cavalo já está registrado em outros dois competidores nesta categoria!", 400);
            }
        }

        // Inserir na tabela "competitor-horse-categorie" para cada categoria encontrada
        const insertedIds = [];

        for (const category of categories) {
            // Contar quantos registros já existem para a mesma categoria
            const currentOrderCount = await knex("competitor-horse-categorie")
                .where({ categorie_id: category.id })
                .count("* as count")
                .first();

            const competitorOrder = currentOrderCount.count + 1; // Incrementar o valor da ordem

            // Inserir o registro com o campo competitor_order
            const [id] = await knex("competitor-horse-categorie")
                .insert({
                    competitor_id,
                    horse_id,
                    categorie_id: category.id,
                    competitor_order: competitorOrder // Adicionar o order
                })
                .returning('id');

            insertedIds.push(id);
        }

        return response.status(201).json({ insertedIds });
    }
}

module.exports = CategoryRegisterController;
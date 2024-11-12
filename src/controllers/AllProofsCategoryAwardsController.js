const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class AwardsCategoryRegisterController {
    async update(req, res) {
        const { id } = req.params;

        const {first_place_award, second_place_award, third_place_award} = req.body;

        if (!id) {
            throw new AppError("Erro ao tentar registrar.", 400);
        }

        // Consultar a tabela "proofs" para obter os registros com o event_id fornecido
        const proofs = await knex("proofs")
            .where({ event_id: id })
            .limit(3);  // Limitar a 3 registros

        if (proofs.length === 0) {
            throw new AppError("Erro ao tentar registrar.", 404);
        }

        // Extrair os ids das provas
        const proofIds = proofs.map(proof => proof.id);

        // Consultar a tabela "categories" para obter os registros com os proof_ids e o categoryName fornecido
        const categories = await knex("categories")
            .whereIn("proof_id", proofIds)

        if (categories.length === 0) {
            throw new AppError("Erro ao tentar registrar.", 404);
        }

        await knex("categories")
        .whereIn("proof_id", proofIds)
        .update({first_place_award, second_place_award, third_place_award});

        return res.status(201).json({ });
    }
}
module.exports = AwardsCategoryRegisterController;
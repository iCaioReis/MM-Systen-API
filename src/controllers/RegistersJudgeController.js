const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class RegistersJudgeController {
    async show(request, response) {
        const { id } = request.params;
    
        try {
            // Realiza a consulta com joins para obter os dados das tabelas relacionadas
            const result = await knex("competitor-horse-categorie")
                .select(
                    "competitor-horse-categorie.*",
                    "categories.name as category_name",
                    "categories.proof_id",
                    "proofs.name as proof_name",
                    "events.name as event_name",
                    "competitors.name as competitor_name",
                    "competitors.surname as competitor_surname",
                    "competitors.picture as competitor_picture",
                    "horses.name as horse_name",
                    "horses.surname as horse_surname",
                    "horses.picture as horse_picture"
                )
                .leftJoin("categories", "competitor-horse-categorie.categorie_id", "categories.id")
                .leftJoin("proofs", "categories.proof_id", "proofs.id")
                .leftJoin("events", "proofs.event_id", "events.id")
                .leftJoin("competitors", "competitor-horse-categorie.competitor_id", "competitors.id")
                .leftJoin("horses", "competitor-horse-categorie.horse_id", "horses.id")
                .where({ "competitor-horse-categorie.id": id })
                .first();
    
            if (!result) {
                return response.status(404).json({ message: "Register not found" });
            }
    
            return response.json({ register: result });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Internal server error" });
        }
    }

    async update(request, response) {
        const { id } = request.params;
        const { state, time, fouls, NCP, SAT } = request.body;  // Incluindo os outros campos
    
        if (!state) {
            throw new AppError("Erro ao salvar", 400);
        }
    
        const register = await knex("competitor-horse-categorie").where({ id }).first();
    
        if (!register) {
            throw new AppError("Erro ao salvar", 400);
        }
    
        await knex.transaction(async trx => {
            // Objeto com os campos que serão atualizados
            const updateData = {
                state,
                updated_at: knex.fn.now()  // Sempre atualiza o campo 'updated_at'
            };
    
            // Atualizando os campos fornecidos
            if (time !== undefined) updateData.time = time;
            if (fouls !== undefined) updateData.fouls = fouls;
            if (NCP !== undefined) updateData.NCP = NCP;
            if (SAT !== undefined) updateData.SAT = SAT;
    
            // Atualiza o registro na tabela 'competitor-horse-categorie'
            await trx("competitor-horse-categorie")
                .where({ id })
                .update(updateData);
    
            // Se o estado for 'finished', atualiza a tabela 'categories'
            if (state === "finished") {
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
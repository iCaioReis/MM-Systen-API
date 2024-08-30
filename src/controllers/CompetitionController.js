const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class CompetitionController {
    async show(request, response) {
        const { id } = request.params;

        try {
            const event = await knex("events").where({ id }).first();

            if (!event) {
                throw new AppError("Evento não encontrado.", 404);
            }

            const proofs = await knex("proofs").where({ event_id: id });
            const proofsWithCategories = await Promise.all(
                proofs.map(async (proof) => {
                    const categories = await knex("categories").where({ proof_id: proof.id });

                    const categoriesWithCompetitorCount = await Promise.all(
                        categories.map(async (category) => {
                            const competitorCount = await knex("competitor-horse-categorie")
                                .where({ categorie_id: category.id })
                                .count("id as count")
                                .first();

                            return { ...category, competitorCount: competitorCount.count };
                        })
                    );

                    const activeCategories = categoriesWithCompetitorCount.filter(category => category.state !== 'inative');

                    return { ...proof, categories: activeCategories };
                })
            );

            event.proofs = proofsWithCategories;

            return response.json(event);
        } catch (error) {
            console.error(error);
            throw new AppError("Erro ao buscar o evento.", 500);
        }
    }

    async index(request, response) {
        const { name } = request.query;

        const events = await knex("events")
            .whereNotIn("state", ["making_registrations", "active", "inative"]) 
            .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
            .orderBy("name");

        return response.json({ events })
    }
}

module.exports = CompetitionController;
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class ResultsController {
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

                    const categoriesWithCompetitorDetails = await Promise.all(
                        categories.map(async (category) => {
                            const competitorDetailsRaw = await knex("competitor-horse-categorie as chc")
                                .where({ "chc.categorie_id": category.id })
                                .leftJoin("fouls as f", "f.register_id", "chc.id")
                                .leftJoin("competitors as c", "c.id", "chc.competitor_id")
                                .leftJoin("horses as h", "h.id", "chc.horse_id")
                                .select(
                                    "chc.id as competitor_id",
                                    "c.name as competitor_name",
                                    "h.name as horse_name",
                                    "f.name as foul_name",
                                    "f.amount as foul_amount",
                                    "chc.time"
                                );


                            const competitorDetails = competitorDetailsRaw.reduce((acc, row) => {
                                const competitorId = row.competitor_id;

                                if (!acc[competitorId]) {
                                    acc[competitorId] = {
                                        id: competitorId,
                                        competitor_name: row.competitor_name,
                                        horse_name: row.horse_name,
                                        time: row.time, // Adiciona o campo 'time' ao objeto
                                        fouls: [],
                                    };
                                }

                                if (row.foul_name) {
                                    acc[competitorId].fouls.push({
                                        name: row.foul_name,
                                        amount: row.foul_amount,
                                    });
                                }

                                return acc;
                            }, {});


                            Object.values(competitorDetails).forEach(competitor => {
                                competitor.fouls.sort((a, b) => a.name.localeCompare(b.name));
                            });

                            return { ...category, competitors: Object.values(competitorDetails) };
                        })
                    );

                    return { ...proof, categories: categoriesWithCompetitorDetails };
                })
            );

            event.proofs = proofsWithCategories;

            return response.json(event);
        } catch (error) {
            console.error(error);
            throw new AppError("Erro ao buscar o evento.", 500);
        }
    }
}

module.exports = ResultsController;

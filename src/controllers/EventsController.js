const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class EventsController {
    async create(request, response) {
        const { state, name, start_date, end_date } = request.body;

        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }
        if (!start_date) {
            throw new AppError("O campo Data Início é obrigatório.", 400);
        }
        if (!end_date) {
            throw new AppError("O campo Data Fim é obrigatório.", 400);
        }

        // Inicia uma transação
        const trx = await knex.transaction();

        try {
            // Cria o registro na tabela events e obtém o ID do evento criado
            const [event] = await trx("events").insert({ state, name, start_date, end_date }).returning('*');
            const eventId = event.id;

            // Cria os registros na tabela proofs e obtém os IDs das provas criadas
            const proofs = [
                { state: 'active', name: 'seis_balizas', event_id: eventId },
                { state: 'active', name: 'tres_tambores', event_id: eventId },
                { state: 'active', name: 'maneabilidade', event_id: eventId }
            ];

            const createdProofs = await trx("proofs").insert(proofs).returning('*');

            const categoryNames = ["kids", "little", "juvenile", "beginner", "female", "adult", "master", "open"];

            // Cria os registros na tabela categories para cada proof
            for (const proof of createdProofs) {
                const categories = categoryNames.map(name => ({
                    state: 'active',
                    name,
                    last_competitor: 0,
                    proof_id: proof.id
                }));

                await trx("categories").insert(categories);
            }

            // Confirma a transação
            await trx.commit();
            return response.status(201).json({ id: eventId });
        } catch (error) {
            // Desfaz a transação em caso de erro
            await trx.rollback();
            throw new AppError("Erro ao criar o evento, as provas e as categorias.", 500);
        }
    }

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

                    return { ...proof, categories: categoriesWithCompetitorCount };
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
            .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
            .orderBy("name");

        return response.json({ events })
    }

    async update(request, response) {
        const { state, name, start_date, end_date } = request.body;
        const { id } = request.params;

        if (state == "finished_inscriptions") {

            const event = await knex("events").where({ id }).first();

            if (!event) {
                throw new AppError("Evento não encontrado.", 404);
            }

            const proofs = await knex("proofs").where({ event_id: id });
            const proofsWithCategories = await Promise.all(
                proofs.map(async (proof) => {
                    const categories = await knex("categories").where({ proof_id: proof.id });

                    return { categories };
                })
            );

            event.proofs = proofsWithCategories;

            event.proofs.map((categorie) => {
                categorie.categories.map((proof) => {
                    if (proof.state == "active" || proof.state == "making_registrations") {
                        throw new AppError(`Inative ou finalize as incrições de todas as pronvas antes de finalizar as inscrições gerais do evento`, 400);
                    }
                })
            })
        }

        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }
        if (!start_date) {
            throw new AppError("O campo Data Início é obrigatório.", 400);
        }
        if (!end_date) {
            throw new AppError("O campo Data Fim é obrigatório.", 400);
        }

        const eventUpdated = { state, name, start_date, end_date };

        const event = await knex("events").where({ id }).first();

        if (!event) {
            throw new AppError("Evento não encontrado!");
        }

        await knex("events").update(eventUpdated).where({ id: id });

        return response.json(eventUpdated);
    }
}

module.exports = EventsController;
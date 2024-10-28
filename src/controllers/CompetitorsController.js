const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class CompetitorsController {
    async create(request, response) {
        const {
            state,
            surname,
            name,
            gender,
        
            CPF,
            born,
            category,
            category_date,
        
            phone,
            email,
        
            address,
            address_number,
            address_neighborhood,
            address_city,
            address_uf,
            address_country,
        
            pix,
            favored,
        
            bank,
            agency,
            account
        } = request.body;

        if (!surname) {
            throw new AppError("O campo Apelido é obrigatório.", 400);
        }

        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }

        if (!CPF || CPF == "___.___.___-__" || CPF === "_ _ _ ._ _ _ ._ _ _ -_ _ ") {
            throw new AppError("O campo CPF é obrigatório.", 400);
        }

        if (!born) {
            throw new AppError("O campo Nascimento é obrigatório.", 400);
        }

        const checkCompetitorExists = await knex("competitors").where({ CPF: CPF });

        if (checkCompetitorExists.length > 0) {
            throw new AppError("Este CPF já está cadastrado!", 422);
        }

        const [competitorId] = await knex("competitors").insert({
            state,
            surname,
            name,
            gender,
        
            CPF,
            born,
            category,
            category_date,
        
            phone,
            email,
        
            address,
            address_number,
            address_neighborhood,
            address_city,
            address_uf,
            address_country,
        
            pix,
            favored,
        
            bank,
            agency,
            account
        }).returning('id');

        return response.status(201).json({ id: competitorId });
    }

    async show(request, response) {
        const { id } = request.params;

        const competitor = await knex("competitors").where({ id }).first();

        return response.json({competitor})
    }

    async index(request, response) {
        const { name } = request.query;

        const competitors = await knex("competitors")
        .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
        .orderBy("name");

        return response.json({competitors})
    }

    async update(request, response) {
        const {
            state,
            surname,
            name,
            gender,
        
            CPF,
            born,
            category,
            category_date,
        
            phone,
            email,
        
            address,
            address_number,
            address_neighborhood,
            address_city,
            address_uf,
            address_country,
        
            pix,
            favored,
        
            bank,
            agency,
            account
        } = request.body;

        if (!surname) {
            throw new AppError("O campo Apelido é obrigatório.", 400);
        }
        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }
        if (!CPF || CPF === "_ _ _ ._ _ _ ._ _ _ -_ _ ") {
            throw new AppError("O campo CPF é obrigatório.", 400);
        }
        if (!born) {
            throw new AppError("O campo Nascimento é obrigatório.", 400);
        }

        const { id } = request.params;

        const competitor = await knex("competitors").where({ id }).first();

        if (!competitor) {
            throw new AppError("Competidor não encontrado!");
        }

        const checkCompetitorExists = await knex("competitors").where({ CPF: CPF }).first();

        console.log(id)
        console.log(checkCompetitorExists)

        if (checkCompetitorExists && checkCompetitorExists.id != competitor.id) {
            throw new AppError("Este CPF já está cadastrado!", 422);
        }

        await knex("competitors").update({
            state,
            surname,
            name,
            gender,
        
            CPF,
            born,
            category,
            category_date,
        
            phone,
            email,
        
            address,
            address_number,
            address_neighborhood,
            address_city,
            address_uf,
            address_country,
        
            pix,
            favored,
        
            bank,
            agency,
            account
        }).where({ id: id });

        return response.json(competitor);
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("competitors").where({id}).delete();

        response.json();
    }
}

module.exports = CompetitorsController;
const knex = require("../database/knex");
const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UsersController {
    async create(request, response) {
        const { state, login, password, privilege, name, phone, gender, CPF, born, email, pix, favored, bank, agency, account } = request.body;

        if (!login) {
            throw new AppError("O campo Login é obrigatório.", 400);
        }
        if (!password) {
            throw new AppError("O campo Senha é obrigatório.", 400);
        }
        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }
        if (!phone) {
            throw new AppError("O campo Telefone é obrigatório.", 400);
        }
    
        const checkUserExists = await knex("users").where({ login: login });

        if (checkUserExists.length > 0) {
            throw new AppError("Este Login já está em uso.");
        }

        const hashedPassword = await hash(password, 8);

        const [userId] = await knex("users").insert({ state, login, password: hashedPassword, privilege, name, phone, gender, CPF, born, email, pix, favored, bank, agency, account }).returning('id');

        return response.status(201).json({ id: userId });
    }

    async show(request, response) {
        const { id } = request.params;

        const user = await knex("users").where({ id }).first();
        const User = {...user.password = null, ...user }

        return response.json({User})
    }

    async index(request, response) {
        const { name } = request.query;

        const users = await knex("users")
        .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
        .orderBy("name");

        const Users = users.map(user => {
            const userWithoutPassword = user;

            userWithoutPassword.password = null;

            return(userWithoutPassword)
        })

        return response.json({Users})
    }

    async update(request, response) {
        const { state, login, password, privilege, name, phone, gender, CPF, born, email, pix, favored, bank, agency, account } = request.body;

        if (!login) {
            throw new AppError("O campo Login é obrigatório.", 400);
        }
        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }
        if (!phone) {
            throw new AppError("O campo Telefone é obrigatório.", 400);
        }
    
        const userUpdated = { state, login, password, privilege, name, phone, gender, CPF, born, email, pix, favored, bank, agency, account };
        const { id } = request.params;

        const user = await knex("users").where({ id }).first();

        if (!password){
            userUpdated.password = user.password;
        } else {
            userUpdated.password = await hash(password, 8);
        }

        if (!user) {
            throw new AppError("Usuário não encontrado!");
        }

        const checkLoginExists = await knex("users").where({ login }).first();

        if (checkLoginExists && checkLoginExists.id !== user.id) {
            throw new AppError("Login já cadastrado!");
        }

        await knex("users").update(userUpdated).where({ id: id });

        return response.json(userUpdated);
    }
}

module.exports = UsersController;
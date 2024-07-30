const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class CategoriesController {
    
    async update(req, res){
        const { id } = req.params;
        const { state } = req.body;

        await knex("categories").update({state}).where({ id: id });

        return res.json();
    }
}

module.exports = CategoriesController;
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class CategoriesController {
    
    async update(req, res){
        const { id } = req.params;
        const { state,  first_place_award, second_place_award, third_place_award} = req.body;

        await knex("categories").update({state, first_place_award, second_place_award, third_place_award}).where({ id: id });

        return res.json();
    }
}

module.exports = CategoriesController;
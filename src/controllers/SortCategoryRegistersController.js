const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class SortCategoryRegistersController {
  async update(request, response) {
    const data = request.body;
    
    try {
      const updatePromises = data.map((item) => {
        return knex('competitor-horse-categorie')
          .where({ id: item.id })
          .update({ competitor_order: item.competitor_order });
      });

      // Aguarda todas as operações de atualização concluírem
      await Promise.all(updatePromises);

      return response.status(200).json({ message: 'Registros atualizados com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar registros:', error);
      return response.status(500).json({ error: 'Erro ao atualizar registros' });
    }
  }
}

module.exports = SortCategoryRegistersController;

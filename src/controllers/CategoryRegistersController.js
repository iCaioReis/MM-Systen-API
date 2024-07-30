const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class CategoryRegisterController {
    async create(request, response) {
        const { competitor_id, horse_id, categorie_id } = request.body;

        if (!competitor_id) {
            throw new AppError("O campo Competidor é obrigatório.", 400);
        }
        if (!horse_id) {
            throw new AppError("O campo Cavalo é obrigatório.", 400);
        }
        if (!categorie_id) {
            throw new AppError("Erro ao tentar registrar", 400);
        }

        const [horseId] = await knex("competitor-horse-categorie").insert({ competitor_id, horse_id, categorie_id }).returning('id');

        return response.status(201).json({ id: horseId });
    }

    async show(request, response) {
        const { id } = request.params;
        try {
            // Realiza a consulta para obter os dados da categoria e da prova
            const category = await knex("categories")
                .join("proofs", "categories.proof_id", "proofs.id")
                .where("categories.id", id)
                .select(
                    "categories.name as categorie_name", // Nome da categoria
                    "categories.state as categorie_state", // Estado da categoria
                    "proofs.name as proof_name" // Nome da prova
                )
                .first(); // Esperamos apenas um resultado
    
            // Realiza a consulta para obter os dados dos competidores e cavalos
            const competitorHorses = await knex("competitor-horse-categorie")
                .join("competitors", "competitor-horse-categorie.competitor_id", "competitors.id")
                .join("horses", "competitor-horse-categorie.horse_id", "horses.id")
                .where("competitor-horse-categorie.categorie_id", id)
                .select(
                    "competitor-horse-categorie.*", // Dados da tabela principal
                    "competitors.name as competitor_name", // Dados dos competidores
                    "horses.name as horse_name" // Dados dos cavalos
                )
                .orderBy("competitor_order");
    
            return response.json({ status: category, competitorHorses });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal Server Error" });
        }
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("competitor-horse-categorie").where({id}).delete();

        return response.json();
    }

    async update(request, response) {
        const { id } = request.params;
    
        try {
            // Obtenha os registros do banco de dados
            let records = await knex('competitor-horse-categorie')
                .where('categorie_id', id)
                .orderBy('competitor_order');
    
            // Função de embaralhamento de Fisher-Yates
            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
    
            // Embaralhe os registros inicialmente
            records = shuffle(records);
    
            // Função para garantir o intervalo de dois participantes para competidores e cavalos
            function rearrangeWithInterval(array, interval, key1, key2) {
                const result = [];
                const map1 = new Map(); // Para o primeiro critério (ex: competidores)
                const map2 = new Map(); // Para o segundo critério (ex: cavalos)
    
                array.forEach(item => {
                    if (!map1.has(item[key1])) {
                        map1.set(item[key1], []);
                    }
                    if (!map2.has(item[key2])) {
                        map2.set(item[key2], []);
                    }
                    map1.get(item[key1]).push(item);
                    map2.get(item[key2]).push(item);
                });
    
                while (map1.size > 0 || map2.size > 0) {
                    // Adiciona elementos garantindo o intervalo para o primeiro critério
                    for (let [key, group] of map1) {
                        if (group.length > 0) {
                            const item = group.shift();
                            result.push(item);
                            if (group.length === 0) {
                                map1.delete(key);
                            } else {
                                map1.set(key, group);
                            }
                        }
                    }
    
                    // Adiciona elementos garantindo o intervalo para o segundo critério
                    for (let [key, group] of map2) {
                        if (group.length > 0) {
                            const item = group.shift();
                            result.push(item);
                            if (group.length === 0) {
                                map2.delete(key);
                            } else {
                                map2.set(key, group);
                            }
                        }
                    }
    
                    // Insere intervalos
                    for (let i = 0; i < interval; i++) {
                        if (map1.size > 0) {
                            const [key, group] = map1.entries().next().value;
                            const item = group.shift();
                            result.push(item);
    
                            if (group.length === 0) {
                                map1.delete(key);
                            } else {
                                map1.set(key, group);
                            }
                        }
                        
                        if (map2.size > 0) {
                            const [key, group] = map2.entries().next().value;
                            const item = group.shift();
                            result.push(item);
    
                            if (group.length === 0) {
                                map2.delete(key);
                            } else {
                                map2.set(key, group);
                            }
                        }
                    }
                }
    
                return result;
            }
    
            // Reordene os registros para garantir o intervalo
            records = rearrangeWithInterval(records, 2, 'competitor_id', 'horse_id');
    
            // Atualize o campo competitor_order com a nova ordem e crie um array de promessas para atualizar no banco
            const updatePromises = records.map((record, index) => {
                return knex('competitor-horse-categorie')
                    .where('id', record.id)
                    .update({ competitor_order: index + 1 });
            });
    
            // Aguarde todas as promessas de atualização serem concluídas
            await Promise.all(updatePromises);
    
            // Obtenha os registros atualizados para retornar na resposta
            const updatedRecords = await knex('competitor-horse-categorie')
                .where('categorie_id', id)
                .orderBy('competitor_order');
    
            // Retorne os registros atualizados
            return response.json(updatedRecords);
        } catch (error) {
            console.error('Erro ao atualizar registros:', error);
            return response.status(500).json({ error: 'Erro ao atualizar registros' });
        }
    }
}

module.exports = CategoryRegisterController;